import { useState } from "react";
import { GROUP_MATCHES, KO, GL, ROUND_LABEL, ROUND_ORDER } from "../data/tournament";
import { GroupCard, KoCard, fDay } from "./cards";

function GroupStage({ model, onEdit }) {
  const [g, setG] = useState("all");
  const list = GROUP_MATCHES.filter((m) => g === "all" || m.g === g);
  const days = {};
  list.forEach((m) => { const k = fDay(m.kick); (days[k] = days[k] || []).push(m); });
  return (
    <>
      <div className="chips">
        <button className={"chip" + (g === "all" ? " on" : "")} onClick={() => setG("all")}>Todos</button>
        {GL.map((x) => (
          <button key={x} className={"chip" + (g === x ? " on" : "")} onClick={() => setG(x)}>{x}</button>
        ))}
      </div>
      {Object.entries(days).map(([day, ms]) => (
        <section key={day}>
          <h3 className="dayh">{day}</h3>
          {ms.map((m) => <GroupCard key={m.id} m={m} r={model.results[m.id]} onEdit={onEdit} />)}
        </section>
      ))}
    </>
  );
}

function Knockout({ model, onPick }) {
  return (
    <>
      <p className="hint">Los huecos se rellenan solos con las selecciones que van pasando.</p>
      {ROUND_ORDER.map((rd) => (
        <section key={rd}>
          <h3 className="dayh">{ROUND_LABEL[rd]}</h3>
          {KO.filter((m) => m.rd === rd).map((m) => (
            <KoCard key={m.id} m={m} r={model.koRes[m.id]} onPick={onPick} />
          ))}
        </section>
      ))}
    </>
  );
}

export default function WorldCupMatches({ model, onEdit, onPick }) {
  const [tab, setTab] = useState("grupos");
  return (
    <div className="view">
      <div className="seg">
        <button className={"segb" + (tab === "grupos" ? " on" : "")} onClick={() => setTab("grupos")}>Partidos de clasificación</button>
        <button className={"segb" + (tab === "elim" ? " on" : "")} onClick={() => setTab("elim")}>Eliminatorias</button>
      </div>
      {tab === "grupos" ? <GroupStage model={model} onEdit={onEdit} /> : <Knockout model={model} onPick={onPick} />}
    </div>
  );
}
