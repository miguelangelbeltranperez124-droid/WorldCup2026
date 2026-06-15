import { useState } from "react";
import { KO, ROUND_LABEL, ROUND_ORDER, name, flag } from "../data/tournament";
import { KoCard } from "./cards";

export default function Bracket({ model, onPick }) {
  const [rd, setRd] = useState("R32");
  const champion = model.koRes[104]?.winner;
  const matches = KO.filter((m) => m.rd === rd);
  return (
    <div className="view">
      {champion && (
        <div className="champ">
          <div className="tro">🏆</div>
          <div className="cl">Campeón del Mundo</div>
          <div className="cn">{flag(champion)} {name(champion)}</div>
        </div>
      )}
      <div className="rsel">
        {ROUND_ORDER.map((k) => (
          <button key={k} className={"rbtn" + (rd === k ? " on" : "")} onClick={() => setRd(k)}>{ROUND_LABEL[k]}</button>
        ))}
      </div>
      <p className="hint">Cada hueco se completa solo con la seleccion que pasa. Toca un equipo para predecir si aun no se ha jugado.</p>
      {matches.map((m) => <KoCard key={m.id} m={m} r={model.koRes[m.id]} onPick={onPick} />)}
    </div>
  );
}
