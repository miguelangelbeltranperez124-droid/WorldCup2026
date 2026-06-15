/* ============================================================
   Almacenamiento. Usa localStorage (persiste en el WebView de
   Capacitor en iOS/Android y en el navegador). Si prefieres el
   plugin nativo @capacitor/preferences, cambia get/set aquí.
   ============================================================ */
const PREFIX = "wc2026:";

export const storage = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch {}
  },
  remove(key) {
    try { localStorage.removeItem(PREFIX + key); } catch {}
  },
};
