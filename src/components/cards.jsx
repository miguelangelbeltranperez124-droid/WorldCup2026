import { name, flag, ROUND_LABEL } from "../data/tournament";

export const fDay = (iso) => new Date(iso).toLocaleDateString("es-ES",
  { weekday:"long", day:"numeric", month:"long", timeZone:"Europe/Madrid" });
export const fTime = (iso) => new Date(iso).toLocaleTimeString("es-ES",
  { hour:"2-digit", minute:"2-digit", timeZone:"Europe/Madrid" });
export const todayMadrid = () =>
  new Date().toLocaleDateString("en-CA", { timeZone:"Europe/Madrid" }); // YYYY-MM-DD
export const matchDayMadrid = (iso) =>
  new Date(iso).toLocaleDateString("en-CA", { timeZone:"Europe/Madrid" });

function Row({ id, score, win }) {
  return (
    <div className={"trow" + (win ? " win" : "")}>
      <span className="fl">{flag(id)}</span>
      <span className="nm">{name(id)}</span>
      <span className="sc">{score == null ? "" : score}</span>
    </div>
  );
}

export function GroupCard({ m, r, onEdit }) {
  const played = r && r.h != null;
  const ts = new Date(m.kick).getTime();
  const now = Date.now();
  let badge;
  if (r && r.status === "LIVE") badge = <span className="st live">● EN VIVO</span>;
  else if (played) badge = <span className="st fin">FINAL</span>;
  else if (ts + 2 * 3600e3 < now) badge = <span className="st jugar">Añadir resultado</span>;
  else badge = <span className="st prox">{fTime(m.kick)}</span>;
  return (
    <button className="mcard" onClick={() => onEdit(m.id)}>
      <div className="mtop"><span className="grp">Grupo {m.g}</span>{badge}</div>
      <Row id={m.h} score={played ? r.h : null} win={played && r.h > r.a} />
      <Row id={m.a} score={played ? r.a : null} win={played && r.a > r.h} />
      <div className="venue">📍 {m.v}</div>
    </button>
  );
}

export function KoCard({ m, r, onPick }) {
  const Side = ({ side }) => {
    const p = side === "h" ? r.home : r.away;
    const isWinner = r.winner && r.winner === p.team;
    const chosen = (r.side === side && !r.live) || (isWinner && r.live);
    return (
      <button className={"koside" + (chosen ? " sel" : "") + (p.team ? "" : " tbd")}
        disabled={!p.team || r.live} onClick={() => p.team && onPick(m.id, side)}>
        <span className="fl">{p.team ? flag(p.team) : "·"}</span>
        <span className="nm">{p.team ? name(p.team) : p.label}</span>
        {r.res && r.res.live && p.team && <span className="kscore">{side === "h" ? r.res.h : r.res.a}</span>}
        {chosen && !r.res && <span className="adv">▶</span>}
      </button>
    );
  };
  return (
    <div className="kocard">
      <div className="kometa">
        <span className="kid">#{m.id} · {ROUND_LABEL[m.rd]}{r.live && <span className="livetag"> · EN VIVO</span>}</span>
        <span className="kv">{m.dl} · {m.v}</span>
      </div>
      <Side side="h" /><Side side="a" />
    </div>
  );
}
