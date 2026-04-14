(function () {
  "use strict";

  var script = document.currentScript;
  var API_KEY = script && script.getAttribute("data-key");
  var API_URL = (script && script.getAttribute("data-endpoint")) || script.src.replace("/t/vigil.js", "") + "/api/ingest";

  if (!API_KEY) {
    console.warn("[vigil] Missing data-key attribute on script tag");
    return;
  }

  var SESSION_ID =
    sessionStorage.getItem("vigil_sid") ||
    "s_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  sessionStorage.setItem("vigil_sid", SESSION_ID);

  function send(payload) {
    payload.sessionId = SESSION_ID;
    payload.url = location.href;
    payload.timestamp = Date.now();

    var xhr = new XMLHttpRequest();
    xhr.open("POST", API_URL, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("x-api-key", API_KEY);
    xhr.send(JSON.stringify(payload));
  }

  function label(el) {
    if (el.tagName === "BUTTON") return '<button> "' + (el.textContent || "").trim().slice(0, 30) + '"';
    if (el.tagName === "A") return '<a> "' + (el.textContent || "").trim().slice(0, 30) + '"';
    if (el.tagName === "INPUT") return "<input type=" + (el.type || "text") + ">";
    var cls = el.className ? "." + String(el.className).split(" ")[0] : "";
    return "<" + el.tagName.toLowerCase() + cls + ">";
  }

  var clicks = [];
  var lastSignal = { type: "", t: 0 };

  function checkRageClick(x, y, target) {
    var now = Date.now();
    clicks.push({ x: x, y: y, t: now, target: target });

    while (clicks.length > 0 && now - clicks[0].t > 2000) clicks.shift();

    var nearby = clicks.filter(function (c) {
      return Math.abs(c.x - x) < 50 && Math.abs(c.y - y) < 50 && c.target === target;
    });

    if (nearby.length >= 3) {
      if (lastSignal.type === "rage_click" && now - lastSignal.t < 3000) return;
      lastSignal = { type: "rage_click", t: now };

      send({
        type: "rage_click",
        label: "Rage click",
        detail: nearby.length + " rapid clicks on " + target + " in " + ((now - nearby[0].t) / 1000).toFixed(1) + "s",
        element: target,
        x: x,
        y: y,
      });
    }
  }

  function checkDeadClick(el, x, y) {
    var disabled = el.disabled || el.getAttribute("aria-disabled") === "true" || el.classList.contains("disabled");
    if (disabled) {
      send({
        type: "dead_click",
        label: "Dead click",
        detail: "User clicked disabled element: " + label(el),
        element: label(el),
        x: x,
        y: y,
      });
    }
  }

  var mousePos = [];

  function checkThrashing(x, y) {
    var now = Date.now();
    mousePos.push({ x: x, y: y, t: now });

    while (mousePos.length > 0 && now - mousePos[0].t > 1000) mousePos.shift();
    if (mousePos.length < 15) return;

    var totalDist = 0;
    var dirChanges = 0;
    for (var i = 1; i < mousePos.length; i++) {
      var dx = mousePos[i].x - mousePos[i - 1].x;
      var dy = mousePos[i].y - mousePos[i - 1].y;
      totalDist += Math.sqrt(dx * dx + dy * dy);

      if (i >= 2) {
        var pdx = mousePos[i - 1].x - mousePos[i - 2].x;
        var pdy = mousePos[i - 1].y - mousePos[i - 2].y;
        if ((dx > 0 && pdx < 0) || (dx < 0 && pdx > 0) || (dy > 0 && pdy < 0) || (dy < 0 && pdy > 0)) {
          dirChanges++;
        }
      }
    }

    if (totalDist > 2000 && dirChanges > 8) {
      if (lastSignal.type === "thrashing" && now - lastSignal.t < 4000) return;
      lastSignal = { type: "thrashing", t: now };

      send({
        type: "thrashing",
        label: "Thrashing",
        detail: "Erratic mouse movement — " + dirChanges + " direction changes in 1s",
        element: "viewport",
        x: x,
        y: y,
      });
      mousePos = [];
    }
  }

  document.addEventListener(
    "click",
    function (e) {
      var el = e.target;
      var lbl = label(el);
      checkRageClick(e.clientX, e.clientY, lbl);
      checkDeadClick(el, e.clientX, e.clientY);
    },
    true
  );

  document.addEventListener(
    "mousemove",
    function (e) {
      checkThrashing(e.clientX, e.clientY);
    },
    { passive: true }
  );
})();
