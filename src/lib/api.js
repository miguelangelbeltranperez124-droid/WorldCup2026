/* ============================================================
   Capa de datos de resultados EN VIVO (versión PWA).

   En el navegador no podemos llamar directamente a la API de
   fútbol (la bloquea CORS y expondría la clave). Por eso la
   app llama a /api/results, un pequeño proxy que corre en
   Vercel: él habla con API-Football usando una clave secreta
   guardada en el servidor y nos devuelve los partidos.

   Si el proxy no está configurado (sin clave), la app entra en
   MODO MANUAL: introduces tú los resultados y todo sigue
   funcionando, también sin conexión.
   ============================================================ */
import { pairKey } from "../data/tournament";
import { storage } from "./storage";

/* ---- Normalización de nombres de selección -> nuestro ID ---- */
const norm = (s) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const ALIASES = {
  mexico:"MEX", "south africa":"RSA", "south korea":"KOR", "korea republic":"KOR", korea:"KOR",
  czechia:"CZE", "czech republic":"CZE", canada:"CAN", switzerland:"SUI", qatar:"QAT",
  "bosnia and herzegovina":"BIH", bosnia:"BIH", brazil:"BRA", morocco:"MAR", scotland:"SCO", haiti:"HAI",
  usa:"USA", "united states":"USA", "united states of america":"USA", australia:"AUS", paraguay:"PAR",
  turkey:"TUR", turkiye:"TUR", germany:"GER", ecuador:"ECU", "ivory coast":"CIV", "cote divoire":"CIV",
  curacao:"CUW", netherlands:"NED", holland:"NED", japan:"JPN", tunisia:"TUN", sweden:"SWE",
  belgium:"BEL", iran:"IRN", "iran islamic republic":"IRN", egypt:"EGY", "new zealand":"NZL",
  spain:"ESP", uruguay:"URU", "saudi arabia":"KSA", "cape verde":"CPV", "cabo verde":"CPV",
  "cape verde islands":"CPV", france:"FRA", senegal:"SEN", norway:"NOR", iraq:"IRQ",
  argentina:"ARG", austria:"AUT", algeria:"ALG", jordan:"JOR", portugal:"POR", colombia:"COL",
  uzbekistan:"UZB", "dr congo":"COD", "congo dr":"COD", "democratic republic of the congo":"COD",
  "congo democratic republic":"COD", england:"ENG", croatia:"CRO", panama:"PAN", ghana:"GHA",
};
export const toTeamId = (apiName) => ALIASES[norm(apiName)] || null;

const mapStatus = (short) => {
  if (["FT", "AET", "PEN"].includes(short)) return "FT";
  if (["1H", "2H", "HT", "ET", "BT", "P", "LIVE", "INT"].includes(short)) return "LIVE";
  return "NS";
};

/* Convierte la respuesta de API-Football en nuestro formato byPair */
function toByPair(apiResponse) {
  const byPair = {};
  for (const fx of apiResponse || []) {
    const homeId = toTeamId(fx.teams?.home?.name);
    const awayId = toTeamId(fx.teams?.away?.name);
    if (!homeId || !awayId) continue;
    byPair[pairKey(homeId, awayId)] = {
      home: homeId, away: awayId,
      hg: fx.goals?.home ?? 0, ag: fx.goals?.away ?? 0,
      status: mapStatus(fx.fixture?.status?.short),
    };
  }
  return byPair;
}

export function createProvider() {
  return {
    async fetchResults() {
      const res = await fetch("/api/results");
      if (res.status === 501) { const e = new Error("NOKEY"); e.code = "NOKEY"; throw e; }
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      const byPair = toByPair(data.response);
      storage.set("liveCache", byPair); // caché para uso offline
      return byPair;
    },
  };
}
