/* ============================================================
   Proxy de resultados (Vercel Serverless Function).
   Vive en /api/results. Usa football-data.org, cuyo plan
   GRATIS incluye el Mundial. Pon tu token en Vercel (Settings
   -> Environment Variables) como FOOTBALL_DATA_TOKEN para que
   nunca viaje al navegador.

   Devuelve el mismo formato que ya entiende la app, así que no
   hay que tocar nada más.
   ============================================================ */
export default async function handler(req, res) {
  const token = process.env.FOOTBALL_DATA_TOKEN;
  if (!token) return res.status(501).json({ error: "Sin FOOTBALL_DATA_TOKEN: modo manual" });

  const comp = process.env.WC_COMPETITION || "WC"; // WC = Copa del Mundo

  // Pequeños arreglos de nombres para que casen con la app
  const fixName = { "IR Iran": "Iran", "Korea Republic": "South Korea", "Türkiye": "Turkey" };
  const mapStatus = (s) =>
    ["FINISHED", "AWARDED"].includes(s) ? "FT" :
    ["IN_PLAY", "PAUSED"].includes(s) ? "LIVE" : "NS";

  try {
    const r = await fetch(`https://api.football-data.org/v4/competitions/${comp}/matches`, {
      headers: { "X-Auth-Token": token },
    });
    if (!r.ok) return res.status(502).json({ error: "football-data " + r.status });
    const data = await r.json();

    const response = (data.matches || []).map((m) => ({
      teams: {
        home: { name: fixName[m.homeTeam?.name] || m.homeTeam?.name },
        away: { name: fixName[m.awayTeam?.name] || m.awayTeam?.name },
      },
      goals: { home: m.score?.fullTime?.home, away: m.score?.fullTime?.away },
      fixture: { status: { short: mapStatus(m.status) } },
    }));

    res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
    return res.status(200).json({ response });
  } catch (e) {
    return res.status(502).json({ error: "No se pudo contactar con la API", detail: String(e) });
  }
}
