/* ============================================================
   Lógica del torneo: tablas de grupos, mejores terceros,
   resolución del cuadro. Combina resultados EN VIVO (byPair)
   con predicciones manuales del usuario.
   ============================================================ */
import { GROUPS, GL, GROUP_MATCHES, KO, THIRD_SLOTS, pairKey, name } from "../data/tournament";

/* Devuelve el resultado de un partido priorizando lo EN VIVO sobre lo manual.
   byPair: { "ARG|FRA": { home, away, hg, ag, status } }  status: 'NS'|'LIVE'|'FT' */
function resultFor(homeId, awayId, manualScores, byPair, manualId) {
  if (homeId && awayId && byPair) {
    const p = byPair[pairKey(homeId, awayId)];
    if (p && p.status !== "NS") {
      const h = p.home === homeId ? p.hg : p.ag;
      const a = p.home === homeId ? p.ag : p.hg;
      return { h, a, status: p.status, live: true };
    }
  }
  const m = manualId != null ? manualScores[manualId] : null;
  if (m && m.h != null && m.a != null) return { h: m.h, a: m.a, status: "FT", live: false };
  return null;
}

export function standings(g, manualScores, byPair) {
  const rows = GROUPS[g].map((id) => ({ id, PJ:0,G:0,E:0,P:0,GF:0,GC:0,DG:0,Pts:0 }));
  const byId = Object.fromEntries(rows.map((r) => [r.id, r]));
  GROUP_MATCHES.filter((m) => m.g === g).forEach((m) => {
    const r = resultFor(m.h, m.a, manualScores, byPair, m.id);
    if (!r) return;
    const H = byId[m.h], A = byId[m.a];
    H.PJ++; A.PJ++; H.GF += r.h; H.GC += r.a; A.GF += r.a; A.GC += r.h;
    if (r.h > r.a) { H.G++; A.P++; H.Pts += 3; }
    else if (r.h < r.a) { A.G++; H.P++; A.Pts += 3; }
    else { H.E++; A.E++; H.Pts++; A.Pts++; }
  });
  rows.forEach((r) => (r.DG = r.GF - r.GC));
  rows.sort((a, b) => b.Pts - a.Pts || b.DG - a.DG || b.GF - a.GF || name(a.id).localeCompare(name(b.id)));
  return rows;
}

const groupDone = (g, manualScores, byPair) =>
  GROUP_MATCHES.filter((m) => m.g === g)
    .every((m) => resultFor(m.h, m.a, manualScores, byPair, m.id) != null);

function assignThirds(qual) {
  const slots = Object.keys(THIRD_SLOTS).map((s) => ({ s:+s, groups: THIRD_SLOTS[s] }));
  slots.sort((a, b) =>
    a.groups.filter((g) => qual.some((q) => q.group === g)).length -
    b.groups.filter((g) => qual.some((q) => q.group === g)).length);
  const res = {}, used = new Set();
  const bt = (i) => {
    if (i === slots.length) return true;
    for (const q of qual) {
      if (used.has(q.group) || !slots[i].groups.includes(q.group)) continue;
      used.add(q.group); res[slots[i].s] = q;
      if (bt(i + 1)) return true;
      used.delete(q.group); delete res[slots[i].s];
    }
    return false;
  };
  return bt(0) ? res : null;
}

/* Construye el modelo completo de la app */
export function buildModel(manualScores, picks, byPair) {
  const tables = {}, seed = { W:{}, R:{}, third:{} };
  GL.forEach((g) => {
    tables[g] = standings(g, manualScores, byPair);
    if (groupDone(g, manualScores, byPair)) {
      seed.W[g] = tables[g][0].id; seed.R[g] = tables[g][1].id; seed.third[g] = tables[g][2];
    }
  });
  const allDone = GL.every((g) => groupDone(g, manualScores, byPair));
  let thirdAssign = null; const qualifiedGroups = new Set();
  if (allDone) {
    const thirds = GL.map((g) => ({ group: g, row: tables[g][2] }));
    thirds.sort((a, b) => b.row.Pts - a.row.Pts || b.row.DG - a.row.DG || b.row.GF - a.row.GF);
    const top8 = thirds.slice(0, 8);
    top8.forEach((q) => qualifiedGroups.add(q.group));
    thirdAssign = assignThirds(top8);
  }

  const koRes = {}, results = {};
  GROUP_MATCHES.forEach((m) => { results[m.id] = resultFor(m.h, m.a, manualScores, byPair, m.id); });

  const resolveRef = (ref) => {
    if (ref.k === "W") return { team: seed.W[ref.g] || null, label: `1.º ${ref.g}` };
    if (ref.k === "R") return { team: seed.R[ref.g] || null, label: `2.º ${ref.g}` };
    if (ref.k === "T") { const a = thirdAssign && thirdAssign[ref.s]; return { team: a ? a.row.id : null, label: `3.º (${THIRD_SLOTS[ref.s].join("/")})` }; }
    if (ref.k === "M") return { team: koRes[ref.m]?.winner || null, label: `Ganador ${ref.m}` };
    if (ref.k === "L") return { team: koRes[ref.m]?.loser || null, label: `Perdedor ${ref.m}` };
    return { team: null, label: "—" };
  };

  KO.forEach((m) => {
    const home = resolveRef(m.h), away = resolveRef(m.a);
    let winner = null, loser = null, live = false, side = picks[m.id] || null, res = null;
    if (home.team && away.team) {
      const r = resultFor(home.team, away.team, manualScores, byPair, null);
      if (r) {
        res = r;
        if (r.status === "FT") {
          live = true;
          if (r.h > r.a) { winner = home.team; loser = away.team; }
          else if (r.h < r.a) { winner = away.team; loser = home.team; }
          else if (side) { winner = side === "h" ? home.team : away.team; loser = side === "h" ? away.team : home.team; }
        }
      }
      if (!winner && side) { winner = side === "h" ? home.team : away.team; loser = side === "h" ? away.team : home.team; }
    }
    koRes[m.id] = { home, away, winner, loser, side, live, res };
    results[m.id] = res;
  });

  return { tables, seed, allDone, qualifiedGroups, koRes, results };
}
