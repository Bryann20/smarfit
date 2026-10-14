/* ==========================================================
   SmartFit - Lógica de la aplicación (JavaScript ES6)
   Cada página declara <body data-page="..."> y se inicializa
   con la función correspondiente.
   ========================================================== */
"use strict";

const { GIMNASIOS, MUSCULOS, ESPACIOS, EJERCICIOS, EQUIPOS, PROMO } = window.DATA;

/* ---------- Utilidades ---------- */
const $ = (selector, ctx = document) => ctx.querySelector(selector);
const $$ = (selector, ctx = document) => [...ctx.querySelectorAll(selector)];

const esc = (texto) =>
  String(texto).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* Estado persistente (localStorage con try/catch por si está bloqueado) */
const KEY = "smartfit_estado";
const Estado = {
  leer() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || {};
    } catch {
      return {};
    }
  },
  guardar(parcial) {
    try {
      localStorage.setItem(KEY, JSON.stringify({ ...this.leer(), ...parcial }));
    } catch {
      /* sin almacenamiento: la app sigue funcionando por query params */
    }
  }
};

const param = (nombre) => new URLSearchParams(location.search).get(nombre);

const musculoActual = () => {
  const id = param("musculo") || Estado.leer().musculo || "gluteos";
  return MUSCULOS.find((m) => m.id === id) || MUSCULOS[0];
};

/* ---------- Validadores ---------- */
const validarCorreo = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
const validarPassword = (v) => v.length >= 8 && /[A-Za-z]/.test(v) && /\d/.test(v);
const enRango = (v, min, max) => v !== "" && Number.isFinite(+v) && +v >= min && +v <= max;

function marcarCampo(input, esValido, mensaje, errorEl) {
  input.setAttribute("aria-invalid", String(!esValido));
  input.classList.toggle("valido", esValido);
  if (errorEl) errorEl.textContent = esValido ? "" : mensaje;
  return esValido;
}

/* ---------- Navegación (común a todas las páginas) ---------- */
function iniciarNavegacion() {
  const boton = $(".nav-toggle");
  const nav = $("#nav-principal");
  if (boton && nav) {
    boton.addEventListener("click", () => {
      const abierto = nav.classList.toggle("abierto");
      boton.setAttribute("aria-expanded", String(abierto));
    });
  }
  const anio = $("#anio");
  if (anio) anio.textContent = new Date().getFullYear();
}

/* ---------- Registro ---------- */
function iniciarRegistro() {
  const form = $("#form-registro");
  const correo = $("#correo");
  const pass = $("#password");
  const errCorreo = $("#error-correo");
  const errPass = $("#error-password");
  const estado = $("#estado-registro");

  const checkCorreo = () =>
    marcarCampo(correo, validarCorreo(correo.value), "Ingresa un correo válido, por ejemplo nombre@dominio.com.", errCorreo);
  const checkPass = () =>
    marcarCampo(pass, validarPassword(pass.value), "Mínimo 8 caracteres, con al menos una letra y un número.", errPass);

  correo.addEventListener("blur", checkCorreo);
  pass.addEventListener("blur", checkPass);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const okCorreo = checkCorreo();
    const okPass = checkPass();
    if (!okCorreo || !okPass) {
      (okCorreo ? pass : correo).focus();
      return;
    }
    /* Nunca guardamos la contraseña en el navegador */
    Estado.guardar({ correo: correo.value.trim().toLowerCase() });
    estado.textContent = "¡Registro exitoso! Redirigiendo a tus datos…";
    estado.classList.add("visible");
    setTimeout(() => (location.href = "datos.html"), 900);
  });

  $("#btn-olvido").addEventListener("click", () => {
    if (!validarCorreo(correo.value)) {
      checkCorreo();
      correo.focus();
      estado.textContent = "Escribe tu correo primero y te enviaremos el enlace para recuperar tu contraseña.";
    } else {
      estado.textContent = `Si ${correo.value.trim()} está registrado, recibirás un enlace para restablecer tu contraseña.`;
    }
    estado.classList.add("visible");
  });
}

/* ---------- Datos personales ---------- */
function iniciarDatos() {
  const form = $("#form-datos");
  const lista = $("#errores-datos");
  const reglas = [
    { id: "nombre", etiqueta: "Nombre", ok: (v) => v.trim().length >= 2 && /^[\p{L}\s'.-]+$/u.test(v.trim()), msg: "Escribe tu nombre (solo letras, mínimo 2)." },
    { id: "peso", etiqueta: "Peso", ok: (v) => enRango(v, 30, 300), msg: "El peso debe estar entre 30 y 300 kg." },
    { id: "altura", etiqueta: "Altura", ok: (v) => enRango(v, 100, 250), msg: "La altura debe estar entre 100 y 250 cm." },
    { id: "edad", etiqueta: "Edad", ok: (v) => enRango(v, 14, 99) && Number.isInteger(+v), msg: "La edad debe ser un número entero entre 14 y 99." }
  ];

  /* Rellenar con datos previos si existen */
  const previo = Estado.leer().perfil;
  if (previo) reglas.forEach(({ id }) => { if (previo[id] !== undefined) $("#" + id).value = previo[id]; });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    lista.innerHTML = "";
    const perfil = {};
    let primerError = null;

    reglas.forEach(({ id, ok, msg }) => {
      const input = $("#" + id);
      const valido = ok(input.value);
      input.setAttribute("aria-invalid", String(!valido));
      if (valido) {
        perfil[id] = id === "nombre" ? input.value.trim() : +input.value;
      } else {
        lista.insertAdjacentHTML("beforeend", `<li>${esc(msg)}</li>`);
        primerError = primerError || input;
      }
    });

    if (primerError) return primerError.focus();

    Estado.guardar({ perfil });
    location.href = "gimnasios.html";
  });
}

/* ---------- Catálogo de gimnasios (dinámico + filtro) ---------- */
function iniciarGimnasios() {
  const contenedor = $("#lista-gimnasios");
  const filtros = $("#filtros-zona");
  const zonas = ["Todos", ...new Set(GIMNASIOS.map((g) => g.zona))];
  const elegido = Estado.leer().gimnasio;
  let zonaActiva = "Todos";

  const pintar = () => {
    const visibles = GIMNASIOS.filter((g) => zonaActiva === "Todos" || g.zona === zonaActiva);
    contenedor.innerHTML = visibles.length
      ? visibles.map((g) => `
        <article class="card ${g.id === elegido ? "seleccionada" : ""}">
          <img class="card-foto" src="${esc(g.imagen)}" alt="Interior del gimnasio ${esc(g.nombre)}" loading="lazy" width="600" height="300">
          <div class="card-cuerpo">
            <h3>${esc(g.nombre)}</h3>
            <p>${esc(g.direccion)}</p>
            <a href="rutina.html" data-gimnasio="${esc(g.id)}">Ver gimnasio</a>
            <div class="etiqueta-promo">${esc(PROMO)}</div>
          </div>
        </article>`).join("")
      : `<p class="sin-resultados">No hay gimnasios en esta zona.</p>`;
  };

  filtros.innerHTML = zonas
    .map((z) => `<button type="button" class="chip" aria-pressed="${z === zonaActiva}" data-zona="${esc(z)}">${esc(z)}</button>`)
    .join("");

  filtros.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    zonaActiva = chip.dataset.zona;
    $$(".chip", filtros).forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
    pintar();
  });

  /* Guardar el gimnasio elegido antes de navegar */
  contenedor.addEventListener("click", (e) => {
    const enlace = e.target.closest("[data-gimnasio]");
    if (enlace) Estado.guardar({ gimnasio: enlace.dataset.gimnasio });
  });

  pintar();
}

/* ---------- Elegir tren inferior / superior ---------- */
function iniciarRutina() {
  const { perfil } = Estado.leer();
  const saludo = $("#saludo");
  if (saludo && perfil && perfil.nombre) saludo.textContent = `Hola, ${perfil.nombre}`;

  $$("[data-grupo]").forEach((enlace) =>
    enlace.addEventListener("click", () => Estado.guardar({ grupo: enlace.dataset.grupo }))
  );
}

/* ---------- Selección de rutina (simulación: solo botones) ---------- */
/* Orden igual al del prototipo, fila por fila */
const ORDEN_RUTINAS = [
  "gluteos", "espalda", "biceps",
  "cuadriceps", "hombro", "pecho",
  "abductores", "triceps", "aductores",
  "femoral", "pantorrilla"
];

function iniciarMusculos() {
  const contenedor = $("#grid-musculos");
  const estado = $("#estado-rutina");
  const continuar = $("#btn-continuar");

  contenedor.innerHTML = ORDEN_RUTINAS
    .map((id) => MUSCULOS.find((m) => m.id === id))
    .map((m) => `<button type="button" class="btn-musculo" aria-pressed="false" data-musculo="${esc(m.id)}">Rutina de ${esc(m.nombre.toLowerCase())}</button>`)
    .join("");

  /* Al tocar un botón solo se resalta; no cambia de pantalla */
  contenedor.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-musculo]");
    if (!btn) return;
    $$(".btn-musculo", contenedor).forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    const musculo = MUSCULOS.find((m) => m.id === btn.dataset.musculo);
    Estado.guardar({ musculo: musculo.id });
    estado.textContent = `Rutina seleccionada: ${musculo.nombre}`;
    continuar.href = `espacios.html?musculo=${encodeURIComponent(musculo.id)}`;
    continuar.hidden = false;
  });
}

/* ---------- Espacios del gimnasio ---------- */
function iniciarEspacios() {
  const musculo = musculoActual();
  $("#titulo-musculo").textContent = `Rutina de ${musculo.nombre.toLowerCase()}`;
  $("#texto-espacios").textContent = `Escoge uno de estos espacios para realizar una rutina de ${musculo.nombre.toLowerCase()} eficiente:`;

  const contenedor = $("#grid-espacios");
  contenedor.innerHTML = ESPACIOS.map((e) => `
    <button type="button" class="espacio" data-espacio="${esc(e.id)}" aria-label="${esc(e.nombre)}">
      <span class="espacio-fondo" style="background:${e.color}"></span>
      <span class="espacio-titulo"><strong>${esc(e.nombre)}</strong><span>${esc(e.detalle)}</span></span>
    </button>`).join("");

  contenedor.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-espacio]");
    if (!btn) return;
    Estado.guardar({ musculo: musculo.id, espacio: btn.dataset.espacio });
    location.href = `ubicate.html?musculo=${encodeURIComponent(musculo.id)}`;
  });
}

/* ---------- Ubícate ---------- */
function iniciarUbicate() {
  const musculo = musculoActual();
  const estado = Estado.leer();
  const espacio = ESPACIOS.find((e) => e.id === estado.espacio) || ESPACIOS[0];
  const gimnasio = GIMNASIOS.find((g) => g.id === estado.gimnasio);

  $("#titulo-musculo").textContent = `Rutina de ${musculo.nombre.toLowerCase()}`;
  $("#nombre-espacio").textContent = espacio.nombre;
  $("#detalle-espacio").textContent = gimnasio
    ? `${espacio.detalle} · ${gimnasio.nombre}`
    : espacio.detalle;
  $(".plano").style.backgroundColor = "#1b1b1b";
  $("#btn-empezar").href = `ejercicios.html?musculo=${encodeURIComponent(musculo.id)}`;
}

/* ---------- Ejercicios ---------- */
function iniciarEjercicios() {
  const musculo = musculoActual();
  const todos = EJERCICIOS[musculo.id] || [];
  const hechos = new Set(Estado.leer().hechos || []);
  let filtro = "todos";
  let seleccionado = null;

  $("#titulo-musculo").textContent = `Ejercicios de ${musculo.nombre.toLowerCase()}`;

  const lista = $("#lista-ejercicios");
  const detalle = $("#detalle-ejercicio");
  const filtros = $("#filtros-equipo");

  /* Chips solo para los equipos que existen en esta rutina */
  const disponibles = ["todos", ...new Set(todos.map((x) => x.equipo))];
  filtros.innerHTML = disponibles
    .map((id) => `<button type="button" class="chip" aria-pressed="${id === filtro}" data-equipo="${id}">${EQUIPOS[id]}</button>`)
    .join("");

  const pintarLista = () => {
    const visibles = todos.filter((x) => filtro === "todos" || x.equipo === filtro);
    lista.innerHTML = visibles.map((x) => `
      <li>
        <button type="button" class="ejercicio-item" data-id="${esc(x.id)}" aria-pressed="${x.id === seleccionado}">
          <span>${hechos.has(x.id) ? "✓ " : ""}${esc(x.nombre)}</span>
          <small>${esc(x.series)}</small>
        </button>
      </li>`).join("");
  };

  const pintarDetalle = () => {
    const ej = todos.find((x) => x.id === seleccionado);
    if (!ej) {
      detalle.innerHTML = `<h2>Elige un ejercicio</h2><p>Toca uno de la lista para ver cómo se hace paso a paso.</p>`;
      return;
    }
    const hecho = hechos.has(ej.id);
    detalle.innerHTML = `
      <h2>${esc(ej.nombre)}</h2>
      <ul class="meta-ejercicio">
        <li>${esc(EQUIPOS[ej.equipo])}</li>
        <li>${esc(ej.series)}</li>
      </ul>
      <ol>${ej.pasos.map((p) => `<li>${esc(p)}</li>`).join("")}</ol>
      <button type="button" class="btn ${hecho ? "btn-gris" : ""}" id="btn-hecho">${hecho ? "Desmarcar como hecho" : "Marcar como hecho"}</button>`;
  };

  filtros.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    filtro = chip.dataset.equipo;
    $$(".chip", filtros).forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
    pintarLista();
  });

  lista.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-id]");
    if (!btn) return;
    seleccionado = btn.dataset.id;
    pintarLista();
    pintarDetalle();
  });

  detalle.addEventListener("click", (e) => {
    if (!e.target.closest("#btn-hecho")) return;
    hechos.has(seleccionado) ? hechos.delete(seleccionado) : hechos.add(seleccionado);
    Estado.guardar({ hechos: [...hechos] });
    pintarLista();
    pintarDetalle();
  });

  /* Diálogo de ayuda */
  const dialogo = $("#dialogo-ayuda");
  $("#btn-ayuda").addEventListener("click", () => dialogo.showModal());
  $("#cerrar-ayuda").addEventListener("click", () => dialogo.close());

  pintarLista();
  pintarDetalle();
}

/* ---------- Arranque ---------- */
const paginas = {
  registro: iniciarRegistro,
  datos: iniciarDatos,
  gimnasios: iniciarGimnasios,
  rutina: iniciarRutina,
  musculos: iniciarMusculos,
  espacios: iniciarEspacios,
  ubicate: iniciarUbicate,
  ejercicios: iniciarEjercicios
};

document.addEventListener("DOMContentLoaded", () => {
  iniciarNavegacion();
  const init = paginas[document.body.dataset.page];
  if (init) init();
});
