/* ============================================================
   Hook central: carga predicciones guardadas, hace polling de
   resultados en vivo (vía /api/results) y expone el modelo ya
   calculado + acciones. Persiste todo en el dispositivo.
   ============================================================ */
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { buildModel } from "../lib/standings";
import { createProvider } from "../lib/api";
import { storage } from "../lib/storage";

const POLL_MS = 60000; // refresco cada 60 s

export function useTournament() {
  const [manualScores, setManualScores] = useState(() => storage.get("manual", {}));
  const [picks, setPicks] = useState(() => storage.get("picks", {}));
  const [byPair, setByPair] = useState(() => storage.get("liveCache", {}));
  const [status, setStatus] = useState("loading"); // loading | live | offline | error
  const [updatedAt, setUpdatedAt] = useState(null);
  const provider = useRef(null);
  const timer = useRef(null);

  if (!provider.current) provider.current = createProvider();

  const stopPolling = () => { if (timer.current) { clearInterval(timer.current); timer.current = null; } };

  const refresh = useCallback(async () => {
    setStatus((s) => (s === "live" ? "live" : "loading"));
    try {
      const data = await provider.current.fetchResults();
      setByPair(data);
      setUpdatedAt(new Date());
      setStatus("live");
    } catch (e) {
      if (e.code === "NOKEY") { setStatus("offline"); stopPolling(); }  // modo manual
      else setStatus("error");                                          // usa caché
      console.warn("Resultados en vivo:", e.message);
    }
  }, []);

  useEffect(() => {
    refresh();
    timer.current = setInterval(refresh, POLL_MS);
    return stopPolling;
  }, [refresh]);

  useEffect(() => storage.set("manual", manualScores), [manualScores]);
  useEffect(() => storage.set("picks", picks), [picks]);

  const model = useMemo(() => buildModel(manualScores, picks, byPair), [manualScores, picks, byPair]);

  const setScore = useCallback((id, h, a) => setManualScores((s) => ({ ...s, [id]: { h, a } })), []);
  const clearScore = useCallback((id) => setManualScores((s) => { const n = { ...s }; delete n[id]; return n; }), []);
  const pick = useCallback((id, side) => setPicks((p) => ({ ...p, [id]: side })), []);
  const reset = useCallback(() => {
    setManualScores({}); setPicks({});
    storage.remove("manual"); storage.remove("picks");
  }, []);

  return { model, byPair, status, updatedAt, manualScores, refresh,
           setScore, clearScore, pick, reset };
}
