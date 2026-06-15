import { useState } from "react";
import { useTournament } from "./hooks/useTournament";
import Home from "./components/Home";
import TodayMatches from "./components/TodayMatches";
import WorldCupMatches from "./components/WorldCupMatches";
import GroupTables from "./components/GroupTables";
import Bracket from "./components/Bracket";
import ScoreSheet from "./components/ScoreSheet";

const fUpd = (d) => d ? d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Madrid" }) : "";
const TITLES = {
  hoy: "Partidos de hoy",
  mundial: "Partidos del Mundial",
  grupos: "Tabla de grupos",
  cuadro: "Tabla de eliminatorias",
};

export default function App() {
  const t = useTournament();
  const [view, setView] = useState("home");
  const [editing, setEditing] = useState(null);

  const statusLabel = {
    loading: "Actualizando…", live: `En vivo · ${fUpd(t.updatedAt)}`,
    offline: "Modo manual", error: "Sin conexión", idle: "",
  }[t.status];

  const onHome = view === "home";

  return (
    <div className="wc">
      <div className="frame">
        <header className="hd">
          <div className="brand">
            {onHome ? (
              <div className="logoRow">
                <img className="logoImg" src="/logo.png" alt="" />
                <div>
                  <div className="mark">MUNDIAL<b>26</b></div>
                  <div className="sub">EE. UU. · México · Canadá</div>
                </div>
              </div>
            ) : (
              <button className="back" onClick={() => setView("home")}>
                <span className="bArrow">‹</span> {TITLES[view]}
              </button>
            )}
          </div>
          <div className="hright">
            <button className="live" onClick={t.refresh} title="Actualizar resultados">
              <span className={"dot " + t.status} />{statusLabel}
            </button>
            <button className="reset" onClick={t.reset} title="Reiniciar predicciones">↺</button>
          </div>
        </header>

        <main className="content">
          {view === "home" && <Home onGo={setView} />}
          {view === "hoy" && <TodayMatches model={t.model} onEdit={setEditing} onPick={t.pick} />}
          {view === "mundial" && <WorldCupMatches model={t.model} onEdit={setEditing} onPick={t.pick} />}
          {view === "grupos" && <GroupTables model={t.model} />}
          {view === "cuadro" && <Bracket model={t.model} onPick={t.pick} />}
        </main>
      </div>

      {editing != null && (
        <ScoreSheet
          id={editing}
          score={t.manualScores[editing]}
          live={t.model.results[editing]?.live}
          onSave={(h, a) => { t.setScore(editing, h, a); setEditing(null); }}
          onClear={() => { t.clearScore(editing); setEditing(null); }}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
