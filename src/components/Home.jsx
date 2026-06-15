const ITEMS = [
  { key:"hoy", icon:"📅", title:"Partidos de hoy", sub:"Lo que se juega hoy" },
  { key:"mundial", icon:"⚽", title:"Partidos del Mundial", sub:"Fase de grupos y eliminatorias" },
  { key:"grupos", icon:"▦", title:"Tabla de grupos", sub:"Puntos y clasificación" },
  { key:"cuadro", icon:"🏆", title:"Tabla de eliminatorias", sub:"Del cuadro hasta el campeón" },
];

export default function Home({ onGo }) {
  return (
    <div className="view">
      <div className="hero">
        <img className="heroLogo" src="/logo.png" alt="Mundial 2026" />
        <div className="heroTitle">MUNDIAL 2026</div>
        <div className="heroSub">EE. UU. · México · Canadá</div>
      </div>
      <div className="menu">
        {ITEMS.map((it) => (
          <button key={it.key} className="mitem" onClick={() => onGo(it.key)}>
            <span className="mico">{it.icon}</span>
            <span className="mtext">
              <span className="mtitle">{it.title}</span>
              <span className="msub">{it.sub}</span>
            </span>
            <span className="marrow">›</span>
          </button>
        ))}
      </div>
    </div>
  );
}
