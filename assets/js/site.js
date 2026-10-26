(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var systemDark = window.matchMedia("(prefers-color-scheme: dark)");

  /* Appearance: Auto follows the system; Light and Dark pin it. The head script
     applied the saved choice before first paint, this keeps the button in step. */
  var modes = ["auto", "light", "dark"];
  var labels = { auto: "Auto", light: "Light", dark: "Dark" };
  var button = document.getElementById("mode");
  var label = document.getElementById("mode-label");
  var mode = root.getAttribute("data-mode") || "auto";

  function applyMode() {
    if (mode === "auto") root.removeAttribute("data-mode");
    else root.setAttribute("data-mode", mode);
    label.textContent = labels[mode];
    button.setAttribute("aria-label", "Appearance: " + labels[mode]);
    readGlows();
  }
  button.addEventListener("click", function () {
    mode = modes[(modes.indexOf(mode) + 1) % modes.length];
    try {
      if (mode === "auto") localStorage.removeItem("joooe-mode");
      else localStorage.setItem("joooe-mode", mode);
    } catch (e) {}
    applyMode();
  });
  if (systemDark.addEventListener) systemDark.addEventListener("change", readGlows);

  /* Wallpaper conveyor: one copy of the row so the loop is seamless. */
  var track = document.getElementById("track");
  Array.prototype.slice.call(track.children).forEach(function (figure) {
    var copy = figure.cloneNode(true);
    copy.setAttribute("aria-hidden", "true");
    track.appendChild(copy);
  });

  /* Panels below the fold wait, then rise in as soon as they arrive;
     anything already on screen stays put. */
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });
    document.querySelectorAll(".reveal").forEach(function (panel) {
      if (panel.getBoundingClientRect().top > window.innerHeight) {
        panel.classList.add("armed");
        io.observe(panel);
      }
    });
  }

  /* Three-phone panels keep their side phones folded behind the centre one
     until the panel's middle scrolls up to just below mid-screen, then open. */
  if (!reduce) {
    var line = function () { return window.innerHeight * 0.55; };
    var middle = function (el) { var r = el.getBoundingClientRect(); return r.top + r.height / 2; };
    var folded = [];
    document.querySelectorAll(".panel").forEach(function (panel) {
      if (panel.querySelector(".trio") && middle(panel) > line()) {
        panel.classList.add("folded");
        folded.push(panel);
      }
    });
    var ticking = false;
    var unfold = function () {
      ticking = false;
      folded = folded.filter(function (panel) {
        if (middle(panel) > line()) return true;
        panel.classList.add("open");
        return false;
      });
      if (!folded.length) window.removeEventListener("scroll", onScroll);
    };
    var onScroll = function () {
      if (!ticking) { ticking = true; requestAnimationFrame(unfold); }
    };
    if (folded.length) window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Hero aura: four soft colour fields drifting, Sfumato's mesh in miniature.
     Drawn at a quarter size and blurred by CSS; pauses while off screen. */
  var canvas = document.getElementById("aura");
  var ctx = canvas.getContext("2d");
  var glows = [];
  var running = true;

  function readGlows() {
    var style = getComputedStyle(root);
    var a = style.getPropertyValue("--glow-a").trim();
    glows = [a, style.getPropertyValue("--glow-b").trim(), style.getPropertyValue("--glow-c").trim(), a];
    if (reduce) draw(0);
  }
  function size() {
    var r = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(r.width / 4));
    canvas.height = Math.max(1, Math.round(r.height / 4));
  }
  function draw(t) {
    var w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < 4; i++) {
      var a = t / 9000 + i * 1.7;
      var x = w * (0.5 + 0.34 * Math.cos(a * (0.7 + i * 0.13)));
      var y = h * (0.45 + 0.28 * Math.sin(a * (0.9 + i * 0.11)));
      var r = Math.max(w, h) * (0.32 + 0.06 * i);
      var g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, glows[i]);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }
  }
  function loop(t) {
    if (!running) return;
    draw(t);
    requestAnimationFrame(loop);
  }

  size();
  window.addEventListener("resize", function () { size(); if (reduce) draw(0); });
  applyMode();
  if (reduce) {
    draw(0);
  } else {
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        var visible = entries[0].isIntersecting;
        if (visible && !running) { running = true; requestAnimationFrame(loop); }
        else if (!visible) running = false;
      }).observe(canvas);
    }
    requestAnimationFrame(loop);
  }
})();
