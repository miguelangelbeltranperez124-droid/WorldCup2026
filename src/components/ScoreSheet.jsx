import { useState } from "react";
import { GROUP_MATCHES, name, flag } from "../data/tournament";

export default function ScoreSheet({ id, score, live, onSave, onClear, onClose }) {
  const m = GROUP_MATCHES.find((x) => x.id === id);
  const [h, setH] = useState(score?.h ?? "");
  const [a, setA] = useState(score?.a ?? "");
  const clamp = (v) => (v === "" ? "" : Math.max(0, Math.min(99, parseInt(v) || 0)));
  return (
    <div className="ov" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sh">Grupo {m.g} · 📍 {m.v}</div>
        {live && <div className="livenote">Este partido tiene resultado en vivo; tu edición manual se ignora mientras dure.</div>}
        <div className="ed">
          <div className="ec">
            <div className="ef">{flag(m.h)}</div>
            <div className="en">{name(m.h)}</div>
            <input className="ein" inputMode="numeric" value={h} onChange={(e) => setH(clamp(e.target.value))} />
          </div>
          <span className="dash">–</span>
          <div className="ec">
            <div className="ef">{flag(m.a)}</div>
            <div className="en">{name(m.a)}</div>
            <input className="ein" inputMode="numeric" value={a} onChange={(e) => setA(clamp(e.target.value))} />
          </div>
        </div>
        <div className="acts">
          <button className="bsec" onClick={onClear}>Borrar</button>
          <button className="bpri" disabled={h === "" || a === ""}
            onClick={() => onSave(parseInt(h), parseInt(a))}>Guardar</button>
        </div>
      </div>
    </div>
  );
}
