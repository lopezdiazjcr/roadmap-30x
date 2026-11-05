/*
 * La landing: el carrusel de matrices y el formulario de 5 pantallas del original
 * (nombre → correo → teléfono → ubicación → calificación). Solo la pregunta de empleados decide la etapa.
 */
(function (root) {
  var C = root.RM_CONFIG, E = root.RM_ETAPAS, UI = root.RM_UI, L = root.RM_LEAD, esc = L.esc;

  // ---------- Carrusel ----------
  var car = document.getElementById("carousel"), dots = document.getElementById("dots");
  var active = 4, timer;
  function renderCarousel() {
    car.innerHTML = E.map(function (e) { return UI.matrix(e); }).join("") +
      '<button class="nav prev" type="button" aria-label="Etapa anterior">‹</button><button class="nav next" type="button" aria-label="Etapa siguiente">›</button>';
    dots.innerHTML = E.map(function (e, i) { return '<button type="button" aria-label="Etapa ' + i + '" data-i="' + i + '"></button>'; }).join("");
    place();
  }
  function fit() {
    var s = Math.min(1, (car.clientWidth - 24) / 720);
    car.style.setProperty("--s", s.toFixed(4));
    var a = car.querySelector('.matrix[data-etapa="' + active + '"]');
    if (a) car.style.height = Math.round(a.offsetHeight * s + 32) + "px";
  }
  function place() {
    fit();
    car.querySelectorAll(".matrix").forEach(function (m, i) {
      var d = i - active; if (d > 2) d = 2; if (d < -2) d = -2;
      m.setAttribute("data-pos", String(d));
      m.setAttribute("aria-hidden", d === 0 ? "false" : "true");
    });
    dots.querySelectorAll("button").forEach(function (b, i) { b.setAttribute("aria-current", i === active ? "true" : "false"); });
  }
  function goTo(i) { active = (i + E.length) % E.length; place(); restart(); }
  function restart() { clearInterval(timer); timer = setInterval(function () { goTo(active + 1); }, 4500); }
  car.addEventListener("click", function (ev) {
    var m = ev.target.closest(".matrix"); if (m) { goTo(+m.getAttribute("data-etapa")); return; }
    if (ev.target.closest(".prev")) goTo(active - 1);
    if (ev.target.closest(".next")) goTo(active + 1);
  });
  dots.addEventListener("click", function (ev) { var b = ev.target.closest("button"); if (b) goTo(+b.getAttribute("data-i")); });
  // Deslizar con el dedo en móvil.
  var tx = null;
  car.addEventListener("touchstart", function (ev) { tx = ev.touches[0].clientX; clearInterval(timer); }, { passive: true });
  car.addEventListener("touchend", function (ev) { if (tx == null) return; var dx = ev.changedTouches[0].clientX - tx; tx = null; if (Math.abs(dx) > 40) goTo(active + (dx < 0 ? 1 : -1)); else restart(); });
  car.addEventListener("mouseenter", function () { clearInterval(timer); });
  car.addEventListener("mouseleave", restart);
  renderCarousel(); restart();
  root.addEventListener("resize", fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

  // ---------- Formulario ----------
  // Los valores internos son los del formulario original, para que el lead sea compatible con las mismas propiedades de CRM.
  var OPTS = {
    of_full_time_employees: E.map(function (e) { return [e.valorEmpleados, e.personas]; }),
    annual_business_revenue: [["Under $100k", "Menos de US$100 mil"], ["$100k to $250k", "US$100 mil a 250 mil"], ["$250K to $500k", "US$250 mil a 500 mil"], ["$500k to $1M", "US$500 mil a 1 millón"], ["$1M to $3M", "US$1 a 3 millones"], ["$3M to $10M", "US$3 a 10 millones"], ["$10M to $30M", "US$10 a 30 millones"], ["$30 Million +", "Más de US$30 millones"]],
    net_margin: [["<10% or unknown", "Menos de 10 % o no lo sé"], ["10-14%", "10 a 14 %"], ["15-19%", "15 a 19 %"], ["20-40%", "20 a 40 %"], ["41%+", "41 % o más"]],
    owner: [["majority owner (>51%)", "Dueño mayoritario (más del 51 %)"], ["50/50 partner", "Socio 50/50"], ["minority owner (<50%)", "Socio minoritario (menos del 50 %)"], ["employee", "Empleado"]],
    heard: [["Just Discovered", "Acabo de descubrirlos"], ["< 6 Months", "Menos de 6 meses"], ["6 Months - 1 Year", "Entre 6 meses y 1 año"], ["1 - 2 Years", "Entre 1 y 2 años"], ["2 Years +", "Más de 2 años"]],
    industry: [["Real Estate", "Bienes raíces"], ["Tech", "Tecnología"], ["Finance", "Finanzas"], ["Healthcare", "Salud"], ["Manufacturing", "Manufactura"], ["Professional Services", "Servicios profesionales"], ["Home/Local Services", "Servicios locales y del hogar"], ["Retail", "Comercio"], ["Education", "Educación"], ["Other", "Otra"]]
  };

  function input(id, label, ph, type, extra) {
    return '<div class="field"><label class="sr" for="' + id + '">' + esc(label) + '</label><input id="' + id + '" name="' + id + '" type="' + (type || "text") + '" placeholder="' + esc(ph) + '" ' + (extra || "") + ' required></div>';
  }
  function select(id, label, key) {
    return '<div class="field"><label for="' + id + '">' + esc(label) + '</label><select id="' + id + '" name="' + id + '" class="empty" required><option value="" disabled selected>Elige una opción</option>' +
      OPTS[key].map(function (o) { return '<option value="' + esc(o[0]) + '">' + esc(o[1]) + '</option>'; }).join("") + '</select></div>';
  }

  var STEPS = [
    { title: "¿Cómo te <b>llamas?</b>", button: "Empezar", fields: '<div class="two">' + input("firstname", "Nombre", "Nombre", "text", 'autocomplete="given-name"') + input("lastname", "Apellido", "Apellido", "text", 'autocomplete="family-name"') + '</div>', micro: "Gratis. Toma unos 30 segundos." },
    { title: "¿A qué correo te lo <b>mandamos?</b>", button: "Continuar", fields: input("email", "Correo de trabajo", "Correo de trabajo", "email", 'autocomplete="email" inputmode="email"'), micro: "Ahí te llega el PDF de tu etapa." },
    { title: "¿Cuál es tu <b>WhatsApp?</b>", button: "Continuar", fields: input("phone", "WhatsApp", "+57 300 123 4567", "tel", 'autocomplete="tel" inputmode="tel"'), micro: "Con indicativo de país." },
    { title: "¿Dónde está tu <b>empresa?</b>", button: "Continuar", fields: '<div class="two">' + input("city", "Ciudad", "Ciudad", "text", 'autocomplete="address-level2"') + input("country", "País", "País", "text", 'autocomplete="country-name"') + '</div>', micro: "" },
    { title: "¿En qué punto está tu <b>negocio?</b>", button: "Quiero mi roadmap", fields:
        select("of_full_time_employees", "Personas a tiempo completo", "of_full_time_employees") +
        select("annual_business_revenue", "Facturación anual", "annual_business_revenue") +
        select("net_margin", "Margen neto (opcional)", "net_margin").replace(" required", "") +
        select("owner", "¿Eres dueño único o tienes socios?", "owner") +
        select("heard", "¿Hace cuánto conoces a 30X?", "heard") +
        select("industry", "Industria", "industry"), micro: "Tu etapa la decide la primera respuesta." }
  ];

  var form = document.getElementById("rmform"), step = 0, data = {};
  function render() {
    var s = STEPS[step];
    form.innerHTML = '<p class="step">Paso ' + (step + 1) + ' de ' + STEPS.length + '</p><h2 class="qtitle">' + s.title + '</h2>' +
      '<div class="fields">' + s.fields + '</div><p class="ferr" id="ferr" aria-live="polite"></p>' +
      '<div class="fact"><button class="btn btn-x btn-lg" type="submit">' + esc(s.button) + '</button>' +
      (s.micro ? '<p class="micro">' + esc(s.micro) + '</p>' : "") +
      (step > 0 ? '<button class="back" type="button" data-back>Volver</button>' : "") + '</div>';
    Object.keys(data).forEach(function (k) { var el = form.elements[k]; if (el) { el.value = data[k]; if (el.tagName === "SELECT" && el.value) el.classList.remove("empty"); } });
    var first = form.querySelector("input, select"); if (first && step > 0) first.focus();
  }
  form.addEventListener("change", function (ev) { if (ev.target.tagName === "SELECT") ev.target.classList.toggle("empty", !ev.target.value); });
  form.addEventListener("click", function (ev) { if (ev.target.closest("[data-back]")) { collect(); step--; render(); } });
  function collect() { Array.prototype.forEach.call(form.querySelectorAll("input, select"), function (el) { data[el.name] = el.value.trim ? el.value.trim() : el.value; }); }
  function validate() {
    var bad = null;
    Array.prototype.forEach.call(form.querySelectorAll("input, select"), function (el) {
      var ok = el.checkValidity() && (!el.required || el.value.trim() !== "");
      el.closest(".field").classList.toggle("err", !ok);
      if (!ok && !bad) bad = el;
    });
    document.getElementById("ferr").textContent = bad ? (bad.type === "email" ? "Revisa el correo." : "Falta este dato.") : "";
    if (bad) bad.focus();
    return !bad;
  }
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (!validate()) return;
    collect();
    if (step < STEPS.length - 1) { step++; render(); form.scrollIntoView({ block: "start", behavior: "smooth" }); return; }
    finish();
  });

  function finish() {
    var e = UI.stageFor(data.of_full_time_employees);
    var utm = {}; try { new URLSearchParams(location.search).forEach(function (v, k) { if (/^utm_/.test(k)) utm[k] = v; }); } catch (err) {}
    var lead = Object.assign({ id: L.newId(), at: new Date().toISOString(), source: "roadmap-30x", stage: e.etapa, stageName: e.nombre, pdf: e.pdf, page: location.href }, data, utm);
    L.save(lead);
    location.href = "gracias.html?etapa=" + e.etapa;
  }

  // ?start=N abre el formulario en la pantalla N (para la demo) y hace scroll hasta él.
  var start = +(L.param("start") || 0);
  render();
  if (start) setTimeout(function () { form.scrollIntoView({ block: "center" }); }, 50);
  root.RM_FORM = { steps: STEPS, get step() { return step; }, data: data };
})(window);
