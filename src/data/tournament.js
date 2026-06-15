/* ============================================================
   Datos estáticos del Mundial 2026 (sorteo + calendario FIFA).
   Las horas se guardan en ISO (zona horaria del Este, EDT -04:00)
   y se formatean a la hora de España en la interfaz.
   ============================================================ */

export const TEAMS = {
  MEX:["México","🇲🇽"], RSA:["Sudáfrica","🇿🇦"], KOR:["Corea del Sur","🇰🇷"], CZE:["Chequia","🇨🇿"],
  CAN:["Canadá","🇨🇦"], SUI:["Suiza","🇨🇭"], QAT:["Catar","🇶🇦"], BIH:["Bosnia y H.","🇧🇦"],
  BRA:["Brasil","🇧🇷"], MAR:["Marruecos","🇲🇦"], SCO:["Escocia","🏴󠁧󠁢󠁳󠁣󠁴󠁿"], HAI:["Haití","🇭🇹"],
  USA:["EE. UU.","🇺🇸"], AUS:["Australia","🇦🇺"], PAR:["Paraguay","🇵🇾"], TUR:["Turquía","🇹🇷"],
  GER:["Alemania","🇩🇪"], ECU:["Ecuador","🇪🇨"], CIV:["Costa de Marfil","🇨🇮"], CUW:["Curazao","🇨🇼"],
  NED:["Países Bajos","🇳🇱"], JPN:["Japón","🇯🇵"], TUN:["Túnez","🇹🇳"], SWE:["Suecia","🇸🇪"],
  BEL:["Bélgica","🇧🇪"], IRN:["Irán","🇮🇷"], EGY:["Egipto","🇪🇬"], NZL:["Nueva Zelanda","🇳🇿"],
  ESP:["España","🇪🇸"], URU:["Uruguay","🇺🇾"], KSA:["Arabia Saudí","🇸🇦"], CPV:["Cabo Verde","🇨🇻"],
  FRA:["Francia","🇫🇷"], SEN:["Senegal","🇸🇳"], NOR:["Noruega","🇳🇴"], IRQ:["Irak","🇮🇶"],
  ARG:["Argentina","🇦🇷"], AUT:["Austria","🇦🇹"], ALG:["Argelia","🇩🇿"], JOR:["Jordania","🇯🇴"],
  POR:["Portugal","🇵🇹"], COL:["Colombia","🇨🇴"], UZB:["Uzbekistán","🇺🇿"], COD:["RD Congo","🇨🇩"],
  ENG:["Inglaterra","🏴󠁧󠁢󠁥󠁮󠁧󠁿"], CRO:["Croacia","🇭🇷"], PAN:["Panamá","🇵🇦"], GHA:["Ghana","🇬🇭"],
};
export const name = (id) => (TEAMS[id] ? TEAMS[id][0] : id);
export const flag = (id) => (TEAMS[id] ? TEAMS[id][1] : "🏳️");

export const GROUPS = {
  A:["MEX","RSA","KOR","CZE"], B:["CAN","SUI","QAT","BIH"], C:["BRA","MAR","SCO","HAI"],
  D:["USA","AUS","PAR","TUR"], E:["GER","ECU","CIV","CUW"], F:["NED","JPN","TUN","SWE"],
  G:["BEL","IRN","EGY","NZL"], H:["ESP","URU","KSA","CPV"], I:["FRA","SEN","NOR","IRQ"],
  J:["ARG","AUT","ALG","JOR"], K:["POR","COL","UZB","COD"], L:["ENG","CRO","PAN","GHA"],
};
export const GL = Object.keys(GROUPS);

/* Calendario de fase de grupos: [id, grupo, fecha, horaET, local, visit, sede, nocheSig?] */
const RAW = [
  [1,"A","2026-06-11","15:00","MEX","RSA","Ciudad de México"],
  [2,"A","2026-06-11","22:00","KOR","CZE","Guadalajara"],
  [3,"B","2026-06-12","15:00","CAN","BIH","Toronto"],
  [4,"D","2026-06-12","21:00","USA","PAR","Los Ángeles"],
  [5,"B","2026-06-13","15:00","QAT","SUI","San Francisco"],
  [6,"C","2026-06-13","18:00","BRA","MAR","Nueva York"],
  [7,"C","2026-06-13","21:00","HAI","SCO","Boston"],
  [8,"D","2026-06-13","00:00","AUS","TUR","Vancouver",true],
  [9,"E","2026-06-14","13:00","GER","CUW","Houston"],
  [10,"F","2026-06-14","16:00","NED","JPN","Dallas"],
  [11,"E","2026-06-14","19:00","CIV","ECU","Filadelfia"],
  [12,"F","2026-06-14","22:00","SWE","TUN","Monterrey"],
  [13,"H","2026-06-15","12:00","ESP","CPV","Atlanta"],
  [14,"G","2026-06-15","15:00","BEL","EGY","Seattle"],
  [15,"H","2026-06-15","18:00","KSA","URU","Miami"],
  [16,"G","2026-06-15","21:00","IRN","NZL","Los Ángeles"],
  [17,"I","2026-06-16","15:00","FRA","SEN","Nueva York"],
  [18,"I","2026-06-16","18:00","IRQ","NOR","Boston"],
  [19,"J","2026-06-16","21:00","ARG","ALG","Kansas City"],
  [20,"J","2026-06-16","00:00","AUT","JOR","San Francisco",true],
  [21,"K","2026-06-17","13:00","POR","COD","Houston"],
  [22,"L","2026-06-17","16:00","ENG","CRO","Dallas"],
  [23,"L","2026-06-17","19:00","GHA","PAN","Toronto"],
  [24,"K","2026-06-17","22:00","UZB","COL","Ciudad de México"],
  [25,"A","2026-06-18","12:00","CZE","RSA","Atlanta"],
  [26,"B","2026-06-18","15:00","SUI","BIH","Los Ángeles"],
  [27,"B","2026-06-18","18:00","CAN","QAT","Vancouver"],
  [28,"A","2026-06-18","21:00","MEX","KOR","Guadalajara"],
  [29,"D","2026-06-19","15:00","USA","AUS","Seattle"],
  [30,"C","2026-06-19","18:00","SCO","MAR","Boston"],
  [31,"C","2026-06-19","21:00","BRA","HAI","Filadelfia"],
  [32,"D","2026-06-19","00:00","TUR","PAR","San Francisco",true],
  [33,"F","2026-06-20","13:00","NED","SWE","Houston"],
  [34,"E","2026-06-20","16:00","GER","CIV","Toronto"],
  [35,"E","2026-06-20","20:00","ECU","CUW","Kansas City"],
  [36,"F","2026-06-20","00:00","TUN","JPN","Monterrey",true],
  [37,"H","2026-06-21","12:00","ESP","KSA","Atlanta"],
  [38,"G","2026-06-21","15:00","BEL","IRN","Los Ángeles"],
  [39,"H","2026-06-21","18:00","URU","CPV","Miami"],
  [40,"G","2026-06-21","21:00","NZL","EGY","Vancouver"],
  [41,"J","2026-06-22","13:00","ARG","AUT","Dallas"],
  [42,"I","2026-06-22","17:00","FRA","IRQ","Filadelfia"],
  [43,"I","2026-06-22","20:00","NOR","SEN","Nueva York"],
  [44,"J","2026-06-22","23:00","JOR","ALG","San Francisco"],
  [45,"K","2026-06-23","13:00","POR","UZB","Houston"],
  [46,"L","2026-06-23","16:00","ENG","GHA","Boston"],
  [47,"L","2026-06-23","19:00","PAN","CRO","Toronto"],
  [48,"K","2026-06-23","22:00","COL","COD","Guadalajara"],
  [49,"B","2026-06-24","15:00","SUI","CAN","Vancouver"],
  [50,"B","2026-06-24","15:00","BIH","QAT","Seattle"],
  [51,"C","2026-06-24","18:00","SCO","BRA","Miami"],
  [52,"C","2026-06-24","18:00","MAR","HAI","Atlanta"],
  [53,"A","2026-06-24","21:00","CZE","MEX","Ciudad de México"],
  [54,"A","2026-06-24","21:00","RSA","KOR","Monterrey"],
  [55,"E","2026-06-25","16:00","ECU","GER","Nueva York"],
  [56,"E","2026-06-25","16:00","CUW","CIV","Filadelfia"],
  [57,"F","2026-06-25","19:00","TUN","NED","Kansas City"],
  [58,"F","2026-06-25","19:00","JPN","SWE","Dallas"],
  [59,"D","2026-06-25","22:00","TUR","USA","Los Ángeles"],
  [60,"D","2026-06-25","22:00","PAR","AUS","San Francisco"],
  [61,"I","2026-06-26","15:00","NOR","FRA","Boston"],
  [62,"I","2026-06-26","15:00","SEN","IRQ","Toronto"],
  [63,"H","2026-06-26","20:00","URU","ESP","Guadalajara"],
  [64,"H","2026-06-26","20:00","CPV","KSA","Houston"],
  [65,"G","2026-06-26","23:00","NZL","BEL","Vancouver"],
  [66,"G","2026-06-26","23:00","EGY","IRN","Seattle"],
  [67,"L","2026-06-27","17:00","PAN","ENG","Nueva York"],
  [68,"L","2026-06-27","17:00","CRO","GHA","Filadelfia"],
  [69,"K","2026-06-27","19:30","COL","POR","Miami"],
  [70,"K","2026-06-27","19:30","COD","UZB","Atlanta"],
  [71,"J","2026-06-27","22:00","JOR","ARG","Dallas"],
  [72,"J","2026-06-27","22:00","ALG","AUT","Kansas City"],
];
export const GROUP_MATCHES = RAW.map(([id,g,d,t,h,a,v,nd]) => {
  let date = d;
  if (nd) { const x = new Date(`${d}T12:00:00-04:00`); x.setDate(x.getDate()+1); date = x.toISOString().slice(0,10); }
  return { id, g, kick:`${date}T${t}:00-04:00`, h, a, v };
});

/* Cuadro eliminatorio (73–104). Referencias: W=1.º, R=2.º, T=tercero, M=ganador, L=perdedor */
export const THIRD_SLOTS = {
  74:["A","B","C","D","F"], 77:["C","D","F","G","H"], 79:["C","E","F","H","I"], 80:["E","H","I","J","K"],
  81:["B","E","F","I","J"], 82:["A","E","H","I","J"], 85:["E","F","G","I","J"], 87:["D","E","I","J","L"],
};
const W=(g)=>({k:"W",g}), R=(g)=>({k:"R",g}), TH=(s)=>({k:"T",s}), MW=(m)=>({k:"M",m}), ML=(m)=>({k:"L",m});

export const KO = [
  {id:73,rd:"R32",v:"Los Ángeles",dl:"28 jun – 3 jul",h:R("A"),a:R("B")},
  {id:74,rd:"R32",v:"Boston",dl:"28 jun – 3 jul",h:W("E"),a:TH(74)},
  {id:75,rd:"R32",v:"Monterrey",dl:"28 jun – 3 jul",h:W("F"),a:R("C")},
  {id:76,rd:"R32",v:"Houston",dl:"28 jun – 3 jul",h:W("C"),a:R("F")},
  {id:77,rd:"R32",v:"Nueva York",dl:"28 jun – 3 jul",h:W("I"),a:TH(77)},
  {id:78,rd:"R32",v:"Dallas",dl:"28 jun – 3 jul",h:R("E"),a:R("I")},
  {id:79,rd:"R32",v:"Ciudad de México",dl:"28 jun – 3 jul",h:W("A"),a:TH(79)},
  {id:80,rd:"R32",v:"Atlanta",dl:"28 jun – 3 jul",h:W("L"),a:TH(80)},
  {id:81,rd:"R32",v:"San Francisco",dl:"28 jun – 3 jul",h:W("D"),a:TH(81)},
  {id:82,rd:"R32",v:"Seattle",dl:"28 jun – 3 jul",h:W("G"),a:TH(82)},
  {id:83,rd:"R32",v:"Toronto",dl:"28 jun – 3 jul",h:R("K"),a:R("L")},
  {id:84,rd:"R32",v:"Los Ángeles",dl:"28 jun – 3 jul",h:W("H"),a:R("J")},
  {id:85,rd:"R32",v:"Vancouver",dl:"28 jun – 3 jul",h:W("B"),a:TH(85)},
  {id:86,rd:"R32",v:"Miami",dl:"28 jun – 3 jul",h:W("J"),a:R("H")},
  {id:87,rd:"R32",v:"Kansas City",dl:"28 jun – 3 jul",h:W("K"),a:TH(87)},
  {id:88,rd:"R32",v:"Dallas",dl:"28 jun – 3 jul",h:R("D"),a:R("G")},
  {id:89,rd:"R16",v:"Filadelfia",dl:"4 – 7 jul",h:MW(74),a:MW(77)},
  {id:90,rd:"R16",v:"Houston",dl:"4 – 7 jul",h:MW(73),a:MW(75)},
  {id:91,rd:"R16",v:"Nueva York",dl:"4 – 7 jul",h:MW(76),a:MW(78)},
  {id:92,rd:"R16",v:"Ciudad de México",dl:"4 – 7 jul",h:MW(79),a:MW(80)},
  {id:93,rd:"R16",v:"Dallas",dl:"4 – 7 jul",h:MW(83),a:MW(84)},
  {id:94,rd:"R16",v:"Seattle",dl:"4 – 7 jul",h:MW(81),a:MW(82)},
  {id:95,rd:"R16",v:"Atlanta",dl:"4 – 7 jul",h:MW(86),a:MW(88)},
  {id:96,rd:"R16",v:"Vancouver",dl:"4 – 7 jul",h:MW(85),a:MW(87)},
  {id:97,rd:"QF",v:"Boston",dl:"9 – 11 jul",h:MW(89),a:MW(90)},
  {id:98,rd:"QF",v:"Los Ángeles",dl:"9 – 11 jul",h:MW(93),a:MW(94)},
  {id:99,rd:"QF",v:"Miami",dl:"9 – 11 jul",h:MW(91),a:MW(92)},
  {id:100,rd:"QF",v:"Kansas City",dl:"9 – 11 jul",h:MW(95),a:MW(96)},
  {id:101,rd:"SF",v:"Dallas",dl:"14 jul",h:MW(97),a:MW(98)},
  {id:102,rd:"SF",v:"Atlanta",dl:"15 jul",h:MW(99),a:MW(100)},
  {id:103,rd:"TP",v:"Miami",dl:"18 jul",h:ML(101),a:ML(102)},
  {id:104,rd:"FI",v:"Nueva York / Nueva Jersey",dl:"19 jul",h:MW(101),a:MW(102)},
];
/* Fecha (aprox.) de cada partido de eliminatorias, para el filtro "hoy" */
const KO_DATE = {
  73:"2026-06-28",74:"2026-06-28",75:"2026-06-28",76:"2026-06-29",77:"2026-06-29",78:"2026-06-29",
  79:"2026-06-30",80:"2026-06-30",81:"2026-06-30",82:"2026-07-01",83:"2026-07-01",84:"2026-07-01",
  85:"2026-07-02",86:"2026-07-02",87:"2026-07-03",88:"2026-07-03",
  89:"2026-07-04",90:"2026-07-04",91:"2026-07-05",92:"2026-07-05",93:"2026-07-06",94:"2026-07-06",
  95:"2026-07-07",96:"2026-07-07",97:"2026-07-09",98:"2026-07-09",99:"2026-07-10",100:"2026-07-11",
  101:"2026-07-14",102:"2026-07-15",103:"2026-07-18",104:"2026-07-19",
};
KO.forEach((m) => { m.d = KO_DATE[m.id]; });

export const ROUND_LABEL = {R32:"Dieciseisavos",R16:"Octavos",QF:"Cuartos",SF:"Semifinales",TP:"Tercer puesto",FI:"Final"};
export const ROUND_ORDER = ["R32","R16","QF","SF","TP","FI"];

/* Clave de emparejamiento por pareja de selecciones (sin orden) para cruzar resultados en vivo */
export const pairKey = (x, y) => [x, y].sort().join("|");
