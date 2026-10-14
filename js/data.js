/* ==========================================================
   SmartFit - Datos de la aplicación (se exponen en window.DATA)
   Los gimnasios salen del prototipo; ejercicios y espacios
   son contenido de ejemplo que puedes ajustar.
   ========================================================== */

/* Todo va dentro de una función para no chocar con los nombres de app.js */
(() => {
"use strict";

const GIMNASIOS = [
  { id: "real-plaza-huancayo", nombre: "Real Plaza Huancayo", zona: "Huancayo",
    direccion: "Av. Ferrocarril Nro. S/N Sector 14 (Ferrocarril 1035), Huancayo - Junín" },
  { id: "mall-plaza-huancayo", nombre: "Mall Plaza Huancayo", zona: "Huancayo",
    direccion: "Av. Ferrocarril 146, Huancayo - Junín" },
  { id: "qhatu-santa-clara", nombre: "Qhatu Plaza Santa Clara", zona: "Lima",
    direccion: "Av. La Estrella N° 286, Ate - Lima" },
  { id: "real-plaza-puruchuco", nombre: "Real Plaza Puruchuco", zona: "Lima",
    direccion: "Av. Nicolás Ayllón 4770, Ate - Lima" },
  { id: "estacion-bayovar", nombre: "Estación Bayóvar", zona: "Lima",
    direccion: "Esquina Av. Próceres de la Independencia con Av. Héroes del Cenepa, Mz K15, Lote 16 - Bayóvar, Lima" },
  { id: "parque-la-molina", nombre: "Parque La Molina", zona: "Lima",
    direccion: "Av. la Universidad 22, La Molina - Lima" },
  { id: "park-office-la-molina", nombre: "Park Office La Molina", zona: "Lima",
    direccion: "Av. Javier Prado Este 6210, La Molina - Lima" },
  { id: "la-fontana", nombre: "La Fontana", zona: "Lima",
    direccion: "Av. La Molina 1120, Distrito de La Molina - Lima" }
];

/* Una imagen por sede: img/gym-1.svg ... img/gym-8.svg (cámbialas por fotos reales si quieres) */
GIMNASIOS.forEach((g, i) => {
  g.imagen = `img/gym-${i + 1}.svg`;
});

const PROMO = "Haz que septiembre sea el comienzo de algo grande.";

const MUSCULOS = [
  { id: "gluteos", nombre: "Glúteos", grupo: "inferior" },
  { id: "cuadriceps", nombre: "Cuádriceps", grupo: "inferior" },
  { id: "abductores", nombre: "Abductores", grupo: "inferior" },
  { id: "aductores", nombre: "Aductores", grupo: "inferior" },
  { id: "femoral", nombre: "Femoral", grupo: "inferior" },
  { id: "pantorrilla", nombre: "Pantorrilla", grupo: "inferior" },
  { id: "espalda", nombre: "Espalda", grupo: "superior" },
  { id: "biceps", nombre: "Bíceps", grupo: "superior" },
  { id: "triceps", nombre: "Tríceps", grupo: "superior" },
  { id: "hombro", nombre: "Hombro", grupo: "superior" },
  { id: "pecho", nombre: "Pecho", grupo: "superior" }
];

const ESPACIOS = [
  { id: "mancuernas", nombre: "Zona de mancuernas", detalle: "Peso libre y bancos",
    color: "linear-gradient(135deg,#4a4a4a,#151515)" },
  { id: "cardio", nombre: "Zona de cardio", detalle: "Caminadoras y bicicletas",
    color: "linear-gradient(135deg,#1d3557,#0b132b)" },
  { id: "funcional", nombre: "Zona funcional", detalle: "Colchonetas y peso corporal",
    color: "linear-gradient(135deg,#6b4e16,#1a1405)" },
  { id: "cross", nombre: "Zona cross training", detalle: "Cuerdas, anillas y TRX",
    color: "linear-gradient(135deg,#7a1f1a,#1a0504)" },
  { id: "clases", nombre: "Sala de clases", detalle: "Clases grupales guiadas",
    color: "linear-gradient(135deg,#a67c00,#2b2100)" }
];

/* Equipos: mancuernas | barra | maquina | corporal */
const EJERCICIOS = {
  gluteos: [
    { id: "peso-muerto", nombre: "Peso muerto", equipo: "barra", series: "4 x 10",
      pasos: ["Pies al ancho de caderas y barra cerca de las piernas.", "Baja con la espalda recta empujando la cadera hacia atrás.", "Sube apretando los glúteos hasta quedar de pie."] },
    { id: "hip-thrust", nombre: "Hip thrust con mancuerna", equipo: "mancuernas", series: "4 x 12",
      pasos: ["Apoya la espalda alta en un banco con la mancuerna sobre la cadera.", "Empuja con los talones hasta alinear rodillas, cadera y hombros.", "Aprieta arriba un segundo y baja con control."] },
    { id: "sentadilla-bulgara", nombre: "Sentadilla búlgara", equipo: "mancuernas", series: "3 x 10 por pierna",
      pasos: ["Apoya el pie de atrás en un banco.", "Baja hasta que el muslo delantero quede paralelo al piso.", "Sube empujando con el talón de la pierna delantera."] },
    { id: "patada-gluteo", nombre: "Patada de glúteo en polea", equipo: "maquina", series: "3 x 15 por pierna",
      pasos: ["Coloca la tobillera y sujétate de la máquina.", "Lleva la pierna hacia atrás sin arquear la espalda.", "Regresa lento sin soltar la tensión."] }
  ],
  cuadriceps: [
    { id: "sentadilla-copa", nombre: "Sentadilla goblet", equipo: "mancuernas", series: "4 x 12",
      pasos: ["Sostén la mancuerna pegada al pecho.", "Baja con el torso erguido y rodillas alineadas con los pies.", "Sube empujando el piso."] },
    { id: "prensa", nombre: "Prensa de piernas", equipo: "maquina", series: "4 x 12",
      pasos: ["Ajusta el asiento y apoya los pies al ancho de hombros.", "Baja hasta unos 90° de rodilla.", "Empuja sin bloquear las rodillas arriba."] },
    { id: "extension", nombre: "Extensión de cuádriceps", equipo: "maquina", series: "3 x 15",
      pasos: ["Siéntate con la espalda apoyada.", "Extiende las piernas hasta casi estirarlas.", "Baja lento controlando el peso."] }
  ],
  abductores: [
    { id: "abduccion-maquina", nombre: "Abducción en máquina", equipo: "maquina", series: "4 x 15",
      pasos: ["Siéntate con la espalda pegada al respaldo.", "Abre las piernas empujando contra las almohadillas.", "Cierra despacio sin dejar caer el peso."] },
    { id: "paso-lateral", nombre: "Caminata lateral con banda", equipo: "corporal", series: "3 x 12 pasos por lado",
      pasos: ["Coloca la banda sobre las rodillas y flexiona ligeramente.", "Da pasos laterales manteniendo la tensión.", "Evita inclinar el torso."] },
    { id: "elevacion-lateral-pierna", nombre: "Elevación lateral de pierna", equipo: "corporal", series: "3 x 15 por lado",
      pasos: ["Acuéstate de lado con el cuerpo alineado.", "Sube la pierna de arriba sin rotar la cadera.", "Baja controlando."] }
  ],
  aductores: [
    { id: "aduccion-maquina", nombre: "Aducción en máquina", equipo: "maquina", series: "4 x 15",
      pasos: ["Siéntate y coloca las piernas abiertas en las almohadillas.", "Junta las piernas de forma controlada.", "Regresa lento a la posición inicial."] },
    { id: "sentadilla-sumo", nombre: "Sentadilla sumo", equipo: "mancuernas", series: "4 x 12",
      pasos: ["Separa los pies más que los hombros con puntas hacia afuera.", "Baja con la mancuerna colgando al centro.", "Sube apretando la cara interna de los muslos."] },
    { id: "plancha-lateral-rodilla", nombre: "Elevación de pierna inferior", equipo: "corporal", series: "3 x 12 por lado",
      pasos: ["Acuéstate de lado y cruza la pierna de arriba por delante.", "Sube la pierna de abajo.", "Baja sin tocar el piso."] }
  ],
  femoral: [
    { id: "peso-muerto-rumano", nombre: "Peso muerto rumano", equipo: "barra", series: "4 x 10",
      pasos: ["Rodillas ligeramente flexionadas y barra pegada a las piernas.", "Lleva la cadera atrás hasta sentir el estiramiento.", "Vuelve a subir con la espalda neutra."] },
    { id: "curl-femoral", nombre: "Curl femoral tumbado", equipo: "maquina", series: "3 x 12",
      pasos: ["Acuéstate boca abajo y ajusta el rodillo en los tobillos.", "Lleva los talones hacia los glúteos.", "Baja lento."] },
    { id: "buenos-dias", nombre: "Buenos días con mancuerna", equipo: "mancuernas", series: "3 x 12",
      pasos: ["Sostén la mancuerna sobre el pecho.", "Inclina el torso llevando la cadera atrás.", "Regresa apretando femorales y glúteos."] }
  ],
  pantorrilla: [
    { id: "elevacion-talones-pie", nombre: "Elevación de talones de pie", equipo: "maquina", series: "4 x 15",
      pasos: ["Apoya la punta de los pies en la plataforma.", "Sube lo más alto posible.", "Baja estirando por completo."] },
    { id: "elevacion-talones-mancuerna", nombre: "Elevación con mancuernas", equipo: "mancuernas", series: "4 x 20",
      pasos: ["De pie con una mancuerna en cada mano.", "Sube de puntillas.", "Baja lento."] },
    { id: "salto-cuerda", nombre: "Salto de cuerda", equipo: "corporal", series: "4 x 1 min",
      pasos: ["Salta con las puntas de los pies.", "Mantén los codos pegados al cuerpo.", "Descansa 30 segundos entre series."] }
  ],
  espalda: [
    { id: "remo-mancuerna", nombre: "Remo con mancuerna", equipo: "mancuernas", series: "4 x 10 por lado",
      pasos: ["Apoya una mano y una rodilla en el banco.", "Tira de la mancuerna hacia la cadera.", "Baja estirando por completo."] },
    { id: "jalon-pecho", nombre: "Jalón al pecho", equipo: "maquina", series: "4 x 12",
      pasos: ["Agarra la barra más ancha que los hombros.", "Tira hacia la parte alta del pecho.", "Sube controlando."] },
    { id: "dominadas-asistidas", nombre: "Dominadas asistidas", equipo: "maquina", series: "3 x 8",
      pasos: ["Ajusta la asistencia y agarra la barra.", "Sube hasta pasar la barbilla.", "Baja lento."] }
  ],
  biceps: [
    { id: "curl-mancuernas", nombre: "Curl con mancuernas", equipo: "mancuernas", series: "4 x 12",
      pasos: ["De pie con los codos pegados al torso.", "Sube las mancuernas girando la palma hacia arriba.", "Baja sin balancear."] },
    { id: "curl-martillo", nombre: "Curl martillo", equipo: "mancuernas", series: "3 x 12",
      pasos: ["Agarre neutro, palmas enfrentadas.", "Sube sin mover los codos.", "Baja lento."] },
    { id: "curl-barra", nombre: "Curl con barra", equipo: "barra", series: "3 x 10",
      pasos: ["Agarre al ancho de hombros.", "Sube la barra sin impulso.", "Baja controlando."] }
  ],
  triceps: [
    { id: "extension-tras-nuca", nombre: "Extensión sobre la cabeza", equipo: "mancuernas", series: "3 x 12",
      pasos: ["Sostén una mancuerna con ambas manos sobre la cabeza.", "Baja detrás de la nuca doblando los codos.", "Extiende sin abrir los codos."] },
    { id: "fondos-banco", nombre: "Fondos en banco", equipo: "corporal", series: "3 x 12",
      pasos: ["Apoya las manos en el banco detrás de ti.", "Baja doblando los codos a 90°.", "Sube empujando con los brazos."] },
    { id: "polea-triceps", nombre: "Extensión en polea", equipo: "maquina", series: "4 x 12",
      pasos: ["Agarra la cuerda con los codos pegados.", "Extiende los brazos hacia abajo.", "Sube despacio."] }
  ],
  hombro: [
    { id: "press-militar", nombre: "Press de hombro con mancuernas", equipo: "mancuernas", series: "4 x 10",
      pasos: ["Sentado con las mancuernas a la altura de las orejas.", "Empuja hacia arriba sin bloquear los codos.", "Baja con control."] },
    { id: "elevaciones-laterales", nombre: "Elevaciones laterales", equipo: "mancuernas", series: "3 x 15",
      pasos: ["Brazos a los lados, ligera flexión de codos.", "Sube hasta la altura de los hombros.", "Baja lento."] },
    { id: "face-pull", nombre: "Face pull", equipo: "maquina", series: "3 x 15",
      pasos: ["Ajusta la polea a la altura del rostro.", "Tira de la cuerda hacia la cara abriendo codos.", "Regresa controlando."] }
  ],
  pecho: [
    { id: "press-banca", nombre: "Press de banca con mancuernas", equipo: "mancuernas", series: "4 x 10",
      pasos: ["Acuéstate en el banco con las mancuernas a la altura del pecho.", "Empuja hasta estirar los brazos.", "Baja lento hasta sentir el estiramiento."] },
    { id: "aperturas", nombre: "Aperturas en máquina", equipo: "maquina", series: "3 x 12",
      pasos: ["Espalda pegada al respaldo.", "Junta los brazos al frente.", "Abre lento."] },
    { id: "flexiones", nombre: "Flexiones", equipo: "corporal", series: "4 x 12",
      pasos: ["Manos un poco más anchas que los hombros.", "Baja el pecho cerca del piso con el cuerpo alineado.", "Empuja hasta estirar los brazos."] }
  ]
};

const EQUIPOS = {
  todos: "Todos",
  mancuernas: "Mancuernas",
  barra: "Barra",
  maquina: "Máquina",
  corporal: "Peso corporal"
};

window.DATA = { GIMNASIOS, MUSCULOS, ESPACIOS, EJERCICIOS, EQUIPOS, PROMO };
})();
