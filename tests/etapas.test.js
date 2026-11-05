// Pruebas sin navegador: la asignación de etapa, los datos de las 10 etapas y lo que no debe aparecer en la página.
// Uso: node tests/etapas.test.js
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..");
global.window = { matchMedia() { return { matches: false }; }, addEventListener() {} };
global.document = { readyState: "complete", addEventListener() {}, querySelector() { return null; }, querySelectorAll() { return []; }, getElementById() { return null; } };
require(path.join(ROOT, "assets/js/config.js")); require(path.join(ROOT, "assets/js/data.js")); require(path.join(ROOT, "assets/js/lead.js")); require(path.join(ROOT, "assets/js/ui.js"));
const { RM_ETAPAS: E, RM_UI: UI, RM_CONFIG: C } = window;
let fails = 0; const ok = (c, m) => { console.log((c ? "ok   " : "FALLA") + " " + m); if (!c) fails++; };

ok(E.length === 10 && E.every((e, i) => e.etapa === i), "hay 10 etapas numeradas 0–9");
ok(new Set(E.map((e) => e.nombre)).size === 10 && E.every((e) => /a$/.test(e.nombre)), "10 nombres distintos, todos imperativos en -a");
const ORIG = ["Just me, no revenue", "Just me, some revenue", "Me and vendors", "2 to 4", "5 to 9", "10 to 19", "20 to 49", "50 to 99", "100 to 249", "250 to 500"];
ORIG.forEach((v, i) => ok(UI.stageFor(v) && UI.stageFor(v).etapa === i, `"${v}" → etapa ${i} (${UI.stageFor(v) && UI.stageFor(v).nombre})`));
ok(UI.stageFor("otra cosa") === null, "un valor desconocido no asigna etapa");
E.forEach((e) => {
  ok(fs.existsSync(path.join(ROOT, e.pdf)) && fs.statSync(path.join(ROOT, e.pdf)).size > 100000, `etapa ${e.etapa}: existe el PDF ${e.pdf}`);
  ok(fs.existsSync(path.join(ROOT, e.portada)), `etapa ${e.etapa}: existe la portada`);
  ok(e.areas.length === 6 && e.areas.every((a) => a.tapon && a.salida), `etapa ${e.etapa}: 6 áreas con tapón y salida`);
  ok(e.rol && e.problema && e.gradua && e.regla && e.personas, `etapa ${e.etapa}: rol, problema, graduación, regla y personas`);
});
ok(E.slice(0, 3).every((e) => e.cierre === "seguir") && E.slice(3).every((e) => e.cierre === "inmersivo"), "cierre: seguir en 0–2, Inmersivo en 3–9");
const u = UI.inmersivoUrl(E[4]);
ok(u.startsWith(C.inmersivo.formUrl + "?") && /utm_source=roadmap/.test(u) && /utm_content=etapa-4-prioriza/.test(u), "el enlace al Inmersivo lleva las UTM y la etapa");
const html = UI.matrix(E[7], true);
ok(/7:<\/b> Categoriza/.test(html) && (html.match(/<tr>/g) || []).length >= 10, "la matriz de una etapa se arma con todas sus filas");

// Lo que no debe aparecer en la superficie: cifras y marcas del original que no son nuestras.
const surface = ["index.html", "gracias.html", "correo.html", "assets/js/config.js", "assets/js/data.js", "assets/js/form.js", "assets/js/pages.js", "assets/js/ui.js"]
  .map((f) => fs.readFileSync(path.join(ROOT, f), "utf8")).join("\n");
["$100M", "250,000", "250.000", "Hormozi", "Acquisition.com", "Skool", "Workshop"].forEach((w) => {
  const allowed = (w === "Hormozi" || w === "Acquisition.com"); // solo en el crédito del pie
  const count = (surface.match(new RegExp(w.replace(/[.$]/g, "\\$&"), "g")) || []).length;
  ok(allowed ? count === 1 : count === 0, allowed ? `"${w}" aparece solo una vez (crédito del pie)` : `"${w}" no aparece en la página`);
});
console.log(fails ? `\n${fails} prueba(s) fallaron.` : "\nTodo pasó.");
process.exit(fails ? 1 : 0);
