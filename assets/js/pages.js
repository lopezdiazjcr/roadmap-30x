/*
 * Páginas de resultado: gracias.html (la entrega) y correo.html (vista previa del correo de la etapa).
 * La etapa viene en ?etapa=N o, si no, del último lead guardado.
 */
(function (root) {
  var C = root.RM_CONFIG, E = root.RM_ETAPAS, UI = root.RM_UI, L = root.RM_LEAD, esc = L.esc;
  var lead = L.last() || {};
  var n = L.param("etapa"); n = n == null ? lead.stage : +n;
  if (!(n >= 0 && n <= 9)) n = 4;
  var e = E[n], next = E[n + 1], first = lead.firstname || "";
  function cap(t) { return t.charAt(0).toUpperCase() + t.slice(1); }

  function ctaBlock(where) {
    if (e.cierre === "inmersivo") {
      var I = C.inmersivo;
      return '<section class="cta dark"><div class="wrap"><p class="eyebrow">' + (where === "mail" ? "P. D." : "El siguiente paso") + '</p>' +
        '<h2>' + esc(ctaTitle()) + '</h2><p class="sub">' + esc(I.pitch) + '</p>' +
        '<div class="cities">' + I.cities.map(function (c) { return "<span>" + esc(c) + "</span>"; }).join("") + '</div>' +
        '<div class="actions"><a class="btn btn-x btn-lg" href="' + esc(UI.inmersivoUrl(e)) + '" target="_blank" rel="noopener">Aplicar al Inmersivo</a>' +
        '<a class="btn btn-ghost btn-lg" href="' + esc(I.infoUrl) + '" target="_blank" rel="noopener">Ver el programa</a></div></div></section>';
    }
    var F = C.follow;
    return '<section class="cta dark"><div class="wrap"><p class="eyebrow">' + (where === "mail" ? "P. D." : "El siguiente paso") + '</p>' +
      '<h2>' + esc(ctaTitle()) + '</h2><p class="sub">En esta etapa lo que más te sirve es gratis: el podcast de Andrés con fundadores que ya pasaron por aquí, y las clases y guías que publicamos cada semana.</p>' +
      '<div class="actions"><a class="btn btn-x btn-lg" href="' + esc(F.instagram) + '" target="_blank" rel="noopener">Seguir a @crece30x</a>' +
      '<a class="btn btn-ghost btn-lg" href="' + esc(F.youtube) + '" target="_blank" rel="noopener">Ver el podcast</a></div></div></section>';
  }
  function ctaTitle() {
    var t = {
      0: "Primero que alguien lo pruebe. Después hablamos de crecer.",
      1: "Tu primera venta vale más que cualquier plan.",
      2: "Ya vendes. Ahora que te vean todos los días.",
      3: "Deja de ser el cuello de botella de tu propio negocio.",
      4: "Elegir a tu mejor cliente es la decisión que destapa todo lo demás.",
      5: "Tu cliente ya confía en ti. Véndele algo más grande.",
      6: "Crecer haciendo mejor, no más: eso se aprende con quien ya lo hizo.",
      7: "Ordenar el caos es un trabajo de dirección, no de más esfuerzo.",
      8: "Especializar equipos exige dejar de saberlo todo tú.",
      9: "La siguiente gran apuesta se decide con otros que ya apostaron."
    };
    return t[e.etapa];
  }

  function gracias() {
    var root_ = document.getElementById("app");
    var areas = e.areas.slice(0, 3).map(function (a) {
      return '<div class="card"><p class="k">' + esc(a.nombre) + ' · pág. ' + a.pagina + '</p><h3>' + esc(a.titulo.replace(/^[^:]+:\s*/, "")) + '</h3><p><b>El tapón.</b> ' + esc(a.tapon) + '</p><p><b>La salida.</b> ' + esc(a.salida) + '</p></div>';
    }).join("");
    root_.innerHTML =
      '<section class="thanks dark"><div class="wrap"><div class="grid"><div>' +
        '<p class="eyebrow">Tu Roadmap 30X está listo</p>' +
        '<h1>' + (first ? esc(first) + ", estás" : "Estás") + ' en la <b>Etapa ' + e.etapa + ': ' + esc(e.nombre) + '</b>.</h1>' +
        '<p class="lead">' + esc(e.para) + '. ' + esc(e.bajada) + '</p>' +
        '<div class="actions"><a class="btn btn-x btn-lg" href="' + esc(e.pdf) + '" target="_blank" rel="noopener" download>Descargar mi roadmap (PDF)</a>' +
        '<a class="btn btn-ghost" href="correo.html?etapa=' + e.etapa + '">Ver el correo</a></div>' +
        '<p class="meta">' + (lead.email ? "También te lo mandamos a <b>" + esc(lead.email) + "</b>. " : "") + 'Si no lo ves en unos minutos, revisa promociones o spam.</p>' +
      '</div><img class="cover" src="' + esc(e.portada) + '" alt="Portada de la guía: ' + esc(e.titulo) + '" width="320" height="414"></div></div></section>' +

      '<section class="band"><div class="wrap"><p class="eyebrow">Estás aquí</p><h2>Las 10 etapas del Roadmap 30X</h2><p class="sub">Cada etapa tiene un problema central distinto y una sola cosa que lograr para graduarte. La tuya está marcada.</p>' +
        '<ol class="stages">' + E.map(function (s) { return '<li class="' + (s.etapa === e.etapa ? "here" : "") + '"><b>' + s.etapa + '</b><span>' + esc(s.nombre) + '<small>' + esc(s.personas) + '</small></span></li>'; }).join("") + '</ol></div></section>' +

      '<section class="band alt"><div class="wrap"><p class="eyebrow">La matriz de tu etapa</p><h2>Qué te frena y qué tienes que lograr, área por área</h2><p class="sub">Es la misma matriz que abre tu guía. Cada fila es un capítulo del PDF.</p>' +
        '<div style="margin-top:24px">' + UI.matrix(e, true) + '</div></div></section>' +

      '<section class="band"><div class="wrap"><p class="eyebrow">Por dónde empezar</p><h2>Las tres primeras áreas de tu guía</h2>' +
        '<div class="two-col" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">' + areas + '</div>' +
        '<p class="sub" style="margin-top:18px">Regla de la etapa: <b>' + esc(e.regla) + '</b></p></div></section>' +

      (next ? '<section class="band alt"><div class="wrap"><p class="eyebrow">Lo que viene después</p><h2>Etapa ' + next.etapa + ': ' + esc(next.nombre) + '</h2><p class="sub">' + esc(next.para) + '. Tu rol pasa de <b>' + esc(e.rol.toLowerCase()) + '</b> a <b>' + esc(next.rol.toLowerCase()) + '</b>. El problema central cambia: ' + esc(next.problema.charAt(0).toLowerCase() + next.problema.slice(1)) + ' Te gradúas cuando ' + esc(next.gradua.charAt(0).toLowerCase() + next.gradua.slice(1)) + '</p></div></section>' : "") +

      ctaBlock("page");
    document.title = "Etapa " + e.etapa + ": " + e.nombre + " · Roadmap 30X";
  }

  function correo() {
    var root_ = document.getElementById("app");
    var S = C.sender;
    var sw = '<div class="switch">' + E.map(function (s) { return '<a href="correo.html?etapa=' + s.etapa + '" aria-current="' + (s.etapa === e.etapa) + '">' + s.etapa + ' · ' + esc(s.nombre) + '</a>'; }).join("") + '</div>';
    var ps = e.cierre === "inmersivo"
      ? 'P. D. ' + esc(ctaTitle()) + ' Si tu empresa ya tiene equipo y quieres trabajar esto en persona con nosotros, <a href="' + esc(UI.inmersivoUrl(e)) + '" target="_blank" rel="noopener">mira si calificas para el Inmersivo 30X</a>.'
      : 'P. D. ' + esc(ctaTitle()) + ' Mientras tanto, sigue a <a href="' + esc(C.follow.instagram) + '" target="_blank" rel="noopener">@crece30x</a> y escucha <a href="' + esc(C.follow.youtube) + '" target="_blank" rel="noopener">el podcast</a>: ahí está lo que más te sirve en esta etapa, gratis.';
    root_.innerHTML = '<div class="mailwrap">' + sw +
      '<div class="mail"><div class="mh"><span><b>De:</b> ' + esc(S.name) + ' &lt;' + esc(S.email) + '&gt;</span><span><b>Para:</b> ' + esc(lead.email || "tú@empresa.com") + '</span><span><b>Asunto:</b> Aquí está tu Roadmap 30X (Etapa ' + e.etapa + ')</span></div>' +
      '<div class="mb">' +
        '<p>' + (first ? "Hola, " + esc(first) + "." : "Hola.") + '</p>' +
        '<p>Aquí tienes tu Roadmap 30X personalizado para la <b>Etapa ' + e.etapa + ': ' + esc(e.nombre) + '</b>.</p>' +
        '<a class="btn btn-x big" href="' + esc(e.pdf) + '" target="_blank" rel="noopener">Abrir mi roadmap (PDF)</a>' +
        '<p>Adentro vas a encontrar:</p><ul><li>Qué es tu etapa y el tapón de cada área: producto, marketing, ventas, servicio, equipo y finanzas.</li><li>La salida de cada tapón y un checklist para esta semana.</li><li>Qué tienes que lograr para pasar a la Etapa ' + (next ? next.etapa : e.etapa) + '.</li></ul>' +
        '<p>' + esc(e.para) + '. Tu trabajo en esta etapa es ser <b>' + esc(e.rol.toLowerCase()) + '</b>' + (n > 0 ? ', ya no ' + esc(E[n - 1].rol.toLowerCase()) : "") + '. El problema central es uno: ' + esc(e.problema.charAt(0).toLowerCase() + e.problema.slice(1)) + '</p>' +
        '<p>Te gradúas cuando ' + esc(e.gradua.charAt(0).toLowerCase() + e.gradua.slice(1)) + ' La regla de la etapa: <b>' + esc(e.regla) + '</b></p>' +
        '<p>Un abrazo,<br>' + esc(S.name) + '</p>' +
        '<p class="ps">' + ps + '</p>' +
      '</div></div></div>';
    document.title = "Correo · Etapa " + e.etapa + " · Roadmap 30X";
  }

  root.RM_PAGES = { gracias: gracias, correo: correo, stage: e };
})(window);
