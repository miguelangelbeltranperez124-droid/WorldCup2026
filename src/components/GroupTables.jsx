import { GL, name, flag } from "../data/tournament";

export default function GroupTables({ model }) {
  return (
    <div className="view">
      <p className="hint">Pasan los dos primeros y los <b style={{ color: "var(--gold)" }}>8 mejores terceros</b>. Las tablas se actualizan solas con los resultados en vivo.</p>
      <div className="ggrid">
        {GL.map((g) => {
          const rows = model.tables[g];
          return (
            <div key={g} className="gcard">
              <div className="gh">Grupo {g}</div>
              <div className="ghead"><span>Equipo</span><span className="num">PJ</span><span className="num">DG</span><span className="num pts">Pts</span></div>
              {rows.map((r, i) => {
                const qualThird = model.allDone && i === 2 && model.qualifiedGroups.has(g);
                const cls = i < 2 ? "q1" : (i === 2 ? (qualThird ? "q3 ok" : "q3") : "");
                return (
                  <div key={r.id} className={"grow " + cls}>
                    <span className="gnm"><span className="fl">{flag(r.id)}</span>{name(r.id)}{qualThird && <span className="tick">✓</span>}</span>
                    <span className="num">{r.PJ}</span>
                    <span className="num">{r.DG > 0 ? "+" : ""}{r.DG}</span>
                    <span className="num pts">{r.Pts}</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
