/*
 * Guarda el lead y comparte utilidades entre páginas.
 * Sin backend: el último lead queda en localStorage (hace el papel de los tokens de personalización de HubSpot)
 * y, si config.webhookUrl tiene valor, se envía por POST en JSON.
 */
(function (root) {
  var KEY_LAST = "rm30.lead";
  var KEY_ALL = "rm30.leads";

  function read(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  function save(lead) {
    write(KEY_LAST, lead);
    var all = read(KEY_ALL, []);
    all.unshift(lead);
    write(KEY_ALL, all.slice(0, 200));
    var url = root.RM_CONFIG && root.RM_CONFIG.webhookUrl;
    if (url) {
      try {
        fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lead), keepalive: true, mode: "cors" }).catch(function () {});
      } catch (e) {}
    }
  }

  function param(name) {
    try { return new URLSearchParams(location.search).get(name); } catch (e) { return null; }
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function youtube(id, title) {
    if (!id) return '<div class="video-ph">Video pendiente</div>';
    return '<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/' + esc(id) +
      '?rel=0&modestbranding=1" title="' + esc(title || "Video") +
      '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>';
  }

  function newId() {
    return "rm-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
  }

  root.RM_LEAD = {
    save: save,
    last: function () { return read(KEY_LAST, null); },
    all: function () { return read(KEY_ALL, []); },
    clear: function () { write(KEY_ALL, []); try { localStorage.removeItem(KEY_LAST); } catch (e) {} },
    param: param, esc: esc, youtube: youtube, newId: newId
  };
})(window);
