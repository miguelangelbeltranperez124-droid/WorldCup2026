# Mundial 2026 — App instalable (PWA)

App de seguimiento del Mundial 2026: partidos, tablas de grupos y cuadro hasta el
campeón. Se instala en el iPhone desde Safari (sin App Store, sin Mac, gratis) y
funciona a pantalla completa, con icono propio y offline. Tus predicciones se guardan
en el dispositivo. Si configuras una API, los resultados se actualizan solos en vivo.

## Resumen de qué va en cada sitio

| App / servicio        | Para qué                              | Qué subes / haces                          |
|-----------------------|---------------------------------------|--------------------------------------------|
| **api-sports.io**     | Clave para resultados en vivo (opc.)  | Te registras y copias tu API key           |
| **GitHub**            | Guardar el código                     | Subes TODO este proyecto a un repositorio  |
| **Vercel**            | Publicar la web + el proxy de la API  | Importas el repo y pegas la API key        |
| **Tu iPhone (Safari)**| Instalar la app                       | Abres la URL → Añadir a pantalla de inicio |

> Es UN solo despliegue (Vercel). No se reparte entre varias apps: GitHub guarda el
> código, Vercel lo publica, y tu iPhone solo abre la URL para instalarla.

## Opción rápida (sin resultados en vivo, en 2 min)

Si solo la quieres en tu móvil y te vale meter los resultados a mano:

1. Entra en https://app.netlify.com/drop
2. Arrastra **la carpeta `dist`** (ya incluida en el zip) a esa página.
3. Te da una URL. Ábrela en Safari en el iPhone → Compartir → **Añadir a pantalla de inicio**.

Listo: icono, pantalla completa y offline. (No tendrá resultados en vivo porque ahí no
corre el proxy; usas el modo manual.)

## Opción completa con resultados EN VIVO (Vercel)

### 1. Clave de la API (gratis)
- Regístrate en https://www.api-sports.io/ y copia tu **API key**.

### 2. Sube el código a GitHub
- Crea un repositorio nuevo y sube el contenido de este proyecto.
  (Si usas la web de GitHub: "Add file → Upload files" y arrastra todo menos `node_modules` y `dist`.)

### 3. Despliega en Vercel
1. Entra en https://vercel.com con tu cuenta de GitHub y pulsa **Add New → Project**.
2. Elige tu repositorio. Vercel detecta Vite solo (build `vite build`, salida `dist`).
3. En **Environment Variables** añade:
   - `API_FOOTBALL_KEY` = tu clave de api-sports
   - (opcionales) `WC_LEAGUE_ID` = `1`, `WC_SEASON` = `2026`
4. **Deploy**. Al terminar te da una URL tipo `https://mundial2026-xxx.vercel.app`.

### 4. Instálala en el iPhone
1. Abre esa URL en **Safari** (importante: Safari, no Chrome).
2. Botón **Compartir** → **Añadir a pantalla de inicio**.
3. Aparece el icono "Mundial 26". Ábrela: pantalla completa, como una app.

La cabecera mostrará el punto verde "En vivo" cuando el proxy esté funcionando.

## Desarrollo local

```bash
npm install
npm run dev       # http://localhost:5173 (modo manual)
npm run build     # genera dist/
```
Para probar el proxy en local necesitas el CLI de Vercel: `npm i -g vercel` y luego
`vercel dev` (lee la clave de un archivo `.env`, copia `.env.example`).

## Estructura

```
api/results.js            Proxy serverless (oculta la clave, evita CORS)
public/                   Iconos de la app (icono, apple-touch, maskable)
src/
  data/tournament.js      Datos: equipos, grupos, calendario, cuadro
  lib/standings.js        Tablas, mejores terceros, resolución del cuadro
  lib/api.js              Cliente del proxy + mapeo de nombres
  lib/storage.js          Persistencia (localStorage)
  hooks/useTournament.js  Polling en vivo + predicciones + modelo
  components/             MatchList, GroupTables, Bracket, ScoreSheet
  App.jsx                 Cabecera, pestañas, modales
vite.config.js            PWA: manifest + service worker (offline)
```

## Notas
- Datos del torneo: grupos y calendario oficiales del sorteo FIFA 2026.
- `WC_LEAGUE_ID=1` es la Copa del Mundo en API-Football; confírmalo en tu panel por si
  cambian los identificadores. Para usar otra API, reescribe solo `api/results.js`.
- ¿Cómo actualizar la app ya instalada? Vuelves a desplegar en Vercel y, al abrirla, el
  service worker se actualiza solo (registerType autoUpdate).
