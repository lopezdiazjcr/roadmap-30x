/*
 * Piezas compartidas por todas las páginas: barra de anuncio, encabezado con menú, pie con acordeones,
 * y el componente de matriz de etapa (el cuadro que el original muestra como imagen).
 */
(function (root) {
  var C = root.RM_CONFIG, E = root.RM_ETAPAS, esc = root.RM_LEAD.esc;

  function announce() {
    var a = C.announcement; if (!a) return "";
    return '<div class="announce"><div class="wrap"><span class="tag">' + esc(a.tag) + '</span><span><b>' + esc(a.text) + '</b> <a href="' + esc(a.url) + '" target="_blank" rel="noopener">' + esc(a.link) + ' →</a></span></div></div>';
  }

  function topbar() {
    return '<header class="topbar"><div class="wrap"><a class="logo" href="index.html" aria-label="30X"><img src="' + esc(C.brand.logoOnDark) + '" alt="30X"></a>' +
      '<button class="menu-btn" type="button" aria-label="Abrir menú" data-menu><span></span></button></div></header>' +
      '<div class="drawer" id="drawer" hidden><div class="panel">' +
      '<button class="close" type="button" aria-label="Cerrar menú" data-menu-close>×</button>' +
      C.footer.columns.map(function (col) {
        return '<div><h4>' + esc(col.title) + '</h4><ul>' + col.links.map(function (l) { return '<li><a href="' + esc(l[1]) + '" target="_blank" rel="noopener">' + esc(l[0]) + '</a></li>'; }).join("") + '</ul></div>';
      }).join("") + '</div></div>';
  }

  function footer() {
    return '<footer class="site"><div class="wrap">' +
      '<a class="logo" href="' + esc(C.brand.site) + '"><img src="' + esc(C.brand.logoOnDark) + '" alt="30X"></a>' +
      '<div class="acc">' + C.footer.columns.map(function (col) {
        return '<details><summary>' + esc(col.title) + '</summary><ul>' + col.links.map(function (l) { return '<li><a href="' + esc(l[1]) + '" target="_blank" rel="noopener">' + esc(l[0]) + '</a></li>'; }).join("") + '</ul></details>';
      }).join("") + '</div>' +
      '<div class="legal"><a href="' + esc(C.brand.privacyUrl) + '" target="_blank" rel="noopener">Política de privacidad</a><a href="' + esc(C.brand.site) + '" target="_blank" rel="noopener">30x.com</a><a href="' + esc(C.brand.instagram) + '" target="_blank" rel="noopener">@crece30x</a></div>' +
      '<p class="disclaimer">Los resultados de los mentores de 30X y de las empresas que fundaron no son típicos ni garantizan los tuyos: dependen de tu experiencia, tu esfuerzo, tu mercado y tu contexto. Este roadmap y las guías que lo acompañan son material educativo. No son asesoría financiera, legal, tributaria ni de inversión, y nada de lo que contienen es una promesa de ingresos. Todas las marcas mencionadas pertenecen a sus dueños.</p>' +
      '<p class="credit">' + esc(C.footer.credit) + ' © 2026 30X.</p>' +
      '</div></footer>';
  }

  // La matriz de una etapa. "full" la agranda para la página de gracias.
  function matrix(e, full) {
    var rows = e.areas.map(function (a) {
      return '<tr><th>' + esc(a.nombre) + '</th><td class="col">' + esc(a.tapon) + '</td><td class="col">' + esc(a.salida) + '</td></tr>';
    }).join("");
    return '<div class="matrix' + (full ? " full" : "") + '" data-etapa="' + e.etapa + '">' +
      '<div class="mhead"><b>' + e.etapa + ':</b> ' + esc(e.nombre) + '</div>' +
      '<table><tbody>' +
      '<tr><th>Personas</th><td colspan="2">' + esc(e.personas) + '</td></tr>' +
      '<tr><th>Tu rol</th><td colspan="2">' + esc(e.rol) + '</td></tr>' +
      '<tr><th>Problema central</th><td colspan="2">' + esc(e.problema) + '</td></tr>' +
      '<tr><th>Te gradúas cuando</th><td colspan="2">' + esc(e.gradua) + '</td></tr>' +
      '<tr class="cols"><th>·</th><th>El tapón</th><th>La salida</th></tr>' +
      rows +
      '<tr class="sum"><th>En resumen</th><td colspan="2">' + esc(e.regla) + '</td></tr>' +
      '</tbody></table></div>';
  }

  function mount() {
    var a = document.querySelector("[data-announce]"); if (a) a.outerHTML = announce();
    var t = document.querySelector("[data-topbar]"); if (t) t.outerHTML = topbar();
    var f = document.querySelector("[data-footer]"); if (f) f.outerHTML = footer();
    var drawer = document.getElementById("drawer");
    document.addEventListener("click", function (ev) {
      if (ev.target.closest("[data-menu]")) { drawer.hidden = false; }
      if (ev.target.closest("[data-menu-close]") || ev.target === drawer) { drawer.hidden = true; }
    });
    document.addEventListener("keydown", function (ev) { if (ev.key === "Escape" && drawer) drawer.hidden = true; });
    // En escritorio el pie muestra las cuatro columnas abiertas; en móvil son acordeones.
    var mq = root.matchMedia("(min-width: 900px)");
    function cols() { document.querySelectorAll(".acc details").forEach(function (d) { d.open = mq.matches; }); }
    cols(); if (mq.addEventListener) mq.addEventListener("change", cols);
  }

  // Etapa a partir del valor del desplegable de empleados (la única pregunta que decide).
  function stageFor(valorEmpleados) {
    for (var i = 0; i < E.length; i++) if (E[i].valorEmpleados === valorEmpleados) return E[i];
    return null;
  }

  function inmersivoUrl(e) {
    var p = new URLSearchParams(C.inmersivo.utm); p.set("utm_content", "etapa-" + e.etapa + "-" + e.slug);
    return C.inmersivo.formUrl + "?" + p.toString();
  }

  root.RM_UI = { mount: mount, matrix: matrix, stageFor: stageFor, inmersivoUrl: inmersivoUrl };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})(window);
