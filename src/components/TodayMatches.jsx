import { GROUP_MATCHES, KO } from "../data/tournament";
import { GroupCard, KoCard, fDay, matchDayMadrid, todayMadrid } from "./cards";

export default function TodayMatches({ model, onEdit, onPick }) {
  const today = todayMadrid();
  const groupToday = GROUP_MATCHES.filter((m) => matchDayMadrid(m.kick) === today);
  const koToday = KO.filter((m) => m.d === today);

  const empty = groupToday.length === 0 && koToday.length === 0;

  return (
    <div className="view">
      <h3 className="dayh">{fDay(new Date().toISOString())}</h3>
      {empty && (
        <div className="emptyBox">
          <div className="emptyIco">🌙</div>
          <p>Hoy no hay partidos del Mundial.</p>
          <p className="muted">Entra en “Partidos del Mundial” para ver el calendario completo.</p>
        </div>
      )}
      {groupToday.map((m) => <GroupCard key={m.id} m={m} r={model.results[m.id]} onEdit={onEdit} />)}
      {koToday.map((m) => <KoCard key={m.id} m={m} r={model.koRes[m.id]} onPick={onPick} />)}
    </div>
  );
}
