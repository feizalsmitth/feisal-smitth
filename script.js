// Mobile nav
var navBurger = document.getElementById("navBurger");
var navLinks = document.getElementById("navLinks");
navBurger.addEventListener("click", function () {
  var open = navLinks.classList.toggle("open");
  navBurger.setAttribute("aria-expanded", String(open));
});
navLinks.addEventListener("click", function (e) {
  if (e.target.tagName === "A") { navLinks.classList.remove("open"); navBurger.setAttribute("aria-expanded", "false"); }
});

// Theme toggle (dark default, light optional, saved in localStorage)
var themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", function () {
  var root = document.documentElement;
  root.classList.add("theme-transition");
  root.classList.toggle("light");
  try {
    localStorage.setItem("theme", root.classList.contains("light") ? "light" : "dark");
  } catch (e) {}
  setTimeout(function () { root.classList.remove("theme-transition"); }, 350);
});

// Reveal on scroll
var revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.1 });
  revealEls.forEach(function (el) { io.observe(el); });
} else {
  revealEls.forEach(function (el) { el.classList.add("in"); });
}

// Scroll-spy for nav highlight
var sections = ["about","experience","work","blog","contact"].map(function (id) { return document.getElementById(id); }).filter(Boolean);
var navAnchors = Array.prototype.slice.call(document.querySelectorAll(".nav-links a[href^='#']"));
var progressEl = document.getElementById("scrollProgress");
var backToTop = document.getElementById("backToTop");
function onScroll() {
  var pos = window.scrollY + window.innerHeight / 3;
  var activeId = "";
  sections.forEach(function (sec) { if (sec.offsetTop <= pos) activeId = sec.id; });
  navAnchors.forEach(function (a) { a.style.color = a.getAttribute("href") === "#" + activeId ? "var(--green)" : ""; });
  // scroll progress bar
  var max = document.documentElement.scrollHeight - window.innerHeight;
  var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  if (progressEl) progressEl.style.width = pct + "%";
  // back-to-top visibility
  if (backToTop) backToTop.classList.toggle("show", window.scrollY > 600);
}
var ticking = false;
window.addEventListener("scroll", function () {
  if (!ticking) { requestAnimationFrame(function () { onScroll(); ticking = false; }); ticking = true; }
}, { passive: true });
onScroll();
if (backToTop) backToTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

// Typing effect in hero
var typedEl = document.getElementById("typed");
var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (typedEl && !reduceMotion) {
  var phrases = ["websites that feel effortless.", "accessible interfaces.", "fast, pixel-perfect UIs.", "things for the web."];
  var pi = 0, ci = 0, deleting = false;
  (function type() {
    var phrase = phrases[pi];
    typedEl.textContent = phrase.slice(0, ci);
    var delay;
    if (!deleting) {
      ci++;
      delay = 60;
      if (ci > phrase.length) { deleting = true; delay = 2200; }
    } else {
      ci--;
      delay = 28;
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 500; }
    }
    setTimeout(type, delay);
  })();
} else if (typedEl) {
  typedEl.textContent = "things for the web.";
}

// 3D tilt on cards (desktop pointers only)
var finePointer = window.matchMedia("(pointer: fine)").matches;
if (finePointer && !reduceMotion) {
  document.querySelectorAll(".project, .quote").forEach(function (el) {
    el.classList.add("tilt");
    el.addEventListener("mousemove", function (e) {
      var r = el.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = "perspective(700px) rotateX(" + (-y * 6).toFixed(2) + "deg) rotateY(" + (x * 6).toFixed(2) + "deg) translateY(-4px)";
    });
    el.addEventListener("mouseleave", function () { el.style.transform = ""; });
  });

  // Magnetic buttons
  document.querySelectorAll(".btn, .nav-cta, .theme-toggle").forEach(function (el) {
    el.addEventListener("mousemove", function (e) {
      var r = el.getBoundingClientRect();
      var x = e.clientX - r.left - r.width / 2;
      var y = e.clientY - r.top - r.height / 2;
      el.style.transform = "translate(" + (x * 0.18).toFixed(1) + "px," + (y * 0.18).toFixed(1) + "px)";
    });
    el.addEventListener("mouseleave", function () { el.style.transform = ""; });
  });
}

// Easter egg: type "feisal" anywhere
var buffer = "";
document.addEventListener("keydown", function (e) {
  if (e.key && e.key.length === 1) {
    buffer = (buffer + e.key.toLowerCase()).slice(-6);
    if (buffer === "feisal") {
      document.body.classList.add("party");
      setTimeout(function () { document.body.classList.remove("party"); }, 8000);
      buffer = "";
    }
  }
});

// Booking form via Formspree
var bookingForm = document.getElementById("bookingForm");
var bookingStatus = document.getElementById("bookingStatus");
bookingForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  var btn = bookingForm.querySelector("button[type='submit']");
  if (btn) { btn.disabled = true; btn.textContent = "sending…"; }
  bookingStatus.textContent = "sending your request…";
  try {
    var res = await fetch(bookingForm.action, { method: "POST", body: new FormData(bookingForm), headers: { Accept: "application/json" } });
    if (res.ok) {
      bookingStatus.textContent = "✓ got it! I’ll reply within one business day.";
      bookingForm.reset();
    } else {
      bookingStatus.textContent = "⚠ something went wrong — please email me directly.";
    }
  } catch (err) {
    bookingStatus.textContent = "⚠ network error — please email me directly.";
  }
  if (btn) { btn.disabled = false; btn.textContent = "send booking request →"; }
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();


// ---- interactivity round 2 ----
var reduceMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Nairobi local time
var timeEl = document.getElementById("nairobiTime");
function updateTime() {
  if (!timeEl) return;
  try {
    timeEl.textContent = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Nairobi" }).format(new Date());
  } catch (e) { timeEl.textContent = "Nairobi"; }
}
updateTime();
setInterval(updateTime, 30000);

// Project filtering by tag
var filterBar = document.getElementById("filterBar");
var projects = Array.prototype.slice.call(document.querySelectorAll("#work .project"));
var tagCount = {};
projects.forEach(function (p) {
  p.querySelectorAll(".tags li").forEach(function (li) {
    var t = li.textContent.trim().toLowerCase();
    if (t) tagCount[t] = (tagCount[t] || 0) + 1;
  });
});
var allChip = document.createElement("button");
allChip.className = "chip active";
allChip.textContent = "all (" + projects.length + ")";
allChip.setAttribute("aria-pressed", "true");
filterBar.appendChild(allChip);
Object.keys(tagCount).sort().forEach(function (t) {
  var b = document.createElement("button");
  b.className = "chip";
  b.textContent = t + " (" + tagCount[t] + ")";
  b.setAttribute("aria-pressed", "false");
  b.dataset.tag = t;
  filterBar.appendChild(b);
});
filterBar.addEventListener("click", function (e) {
  var chip = e.target.closest(".chip");
  if (!chip) return;
  filterBar.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("active"); c.setAttribute("aria-pressed", "false"); });
  chip.classList.add("active");
  chip.setAttribute("aria-pressed", "true");
  var tag = chip.dataset.tag;
  projects.forEach(function (p) {
    var match = !tag || p.querySelectorAll(".tags li").some(function (li) { return li.textContent.trim().toLowerCase() === tag; });
    p.classList.toggle("hidden-tag", !match);
  });
});

// Spotlight glow follows cursor on cards
if (typeof finePointer !== "undefined" && finePointer) {
  document.querySelectorAll(".project, .quote").forEach(function (el) {
    el.addEventListener("mousemove", function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
      el.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
    });
  });
}

// Ripple on buttons/chips
if (!reduceMotion2) {
  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".btn, .chip, .copy-btn");
    if (!btn) return;
    var r = btn.getBoundingClientRect();
    var span = document.createElement("span");
    span.className = "ripple-ink";
    var size = Math.max(r.width, r.height);
    span.style.width = span.style.height = size + "px";
    span.style.left = (e.clientX - r.left - size / 2) + "px";
    span.style.top = (e.clientY - r.top - size / 2) + "px";
    btn.appendChild(span);
    setTimeout(function () { span.remove(); }, 550);
  });
}

// Copy email with toast
var copyBtn = document.getElementById("copyEmail");
var toast = document.createElement("div");
toast.className = "toast";
toast.setAttribute("role", "status");
document.body.appendChild(toast);
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(function () { toast.classList.remove("show"); }, 2200);
}
if (copyBtn) copyBtn.addEventListener("click", function () {
  var email = "feizalsmitth@icloud.com";
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(email).then(function () { showToast("✓ email copied to clipboard"); }, function () { showToast(email); });
  } else { showToast(email); }
});

// Text scramble on section headings when revealed
if (!reduceMotion2 && "IntersectionObserver" in window) {
  var scrambleChars = "abcdefghijklmnopqrstuvwxyz0123456789#$%&";
  var scrambleIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      scrambleIO.unobserve(en.target);
      var h2 = en.target.querySelector("h2");
      if (!h2) return;
      var text = h2.textContent;
      var frame = 0;
      var total = Math.max(14, Math.round(text.length * 1.5));
      (function step() {
        var out = "";
        for (var i = 0; i < text.length; i++) {
          if (i < (frame / total) * text.length || text[i] === " ") out += text[i];
          else out += scrambleChars.charAt(Math.floor(Math.random() * scrambleChars.length));
        }
        h2.textContent = out;
        frame++;
        if (frame <= total) requestAnimationFrame(step);
        else h2.textContent = text;
      })();
    });
  }, { threshold: 0.5 });
  document.querySelectorAll(".section-head").forEach(function (el) { scrambleIO.observe(el); });
}


// ---- interactivity round 3: command palette, cursor glow, confetti ----
var reduceMotion3 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Command palette (Ctrl/Cmd+K)
(function () {
  var palette = document.createElement("div");
  palette.className = "palette";
  palette.setAttribute("role", "dialog");
  palette.setAttribute("aria-modal", "true");
  palette.setAttribute("aria-label", "Command palette");
  palette.hidden = true;
  palette.innerHTML =
    '<div class="palette-backdrop" data-close="1"></div>' +
    '<div class="palette-panel">' +
    '<input class="palette-input mono" type="text" placeholder="type a command or search…" aria-label="Search commands">' +
    '<ul class="palette-list" role="listbox"></ul>' +
    '<p class="palette-hint mono">↑↓ navigate · enter run · esc close</p>' +
    "</div>";
  document.body.appendChild(palette);
  var pInput = palette.querySelector(".palette-input");
  var pList = palette.querySelector(".palette-list");
  var selected = 0;

  function go(sel) {
    var t = document.querySelector(sel);
    if (t) t.scrollIntoView({ behavior: reduceMotion3 ? "auto" : "smooth" });
  }
  function copyEmailAction() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText("feizalsmitth@icloud.com").then(function () { showToast("✓ email copied to clipboard"); });
    } else { showToast("feizalsmitth@icloud.com"); }
  }
  var actions = [
    { label: "go to: about", tag: "section", run: function () { go("#about"); } },
    { label: "go to: experience", tag: "section", run: function () { go("#experience"); } },
    { label: "go to: work", tag: "section", run: function () { go("#work"); } },
    { label: "go to: kind words", tag: "section", run: function () { go("#testimonials"); } },
    { label: "go to: writing", tag: "section", run: function () { go("#blog"); } },
    { label: "book a project", tag: "action", run: function () { go("#booking"); } },
    { label: "get in touch", tag: "action", run: function () { go("#contact"); } },
    { label: "toggle theme", tag: "action", run: function () { themeToggle.click(); } },
    { label: "copy my email", tag: "action", run: copyEmailAction },
    { label: "open github", tag: "link", run: function () { window.open("https://github.com/feizalsmitth", "_blank", "noopener"); } },
    { label: "open linkedin", tag: "link", run: function () { window.open("https://www.linkedin.com/in/feizal-onyango-443553373/", "_blank", "noopener"); } },
    { label: "view résumé", tag: "link", run: function () { window.open("assets/Feisal-Onyango-CV.pdf", "_blank", "noopener"); } },
    { label: "back to top", tag: "action", run: function () { window.scrollTo({ top: 0, behavior: reduceMotion3 ? "auto" : "smooth" }); } }
  ];
  var filtered = actions.slice();

  function render() {
    pList.innerHTML = "";
    filtered.forEach(function (a, i) {
      var li = document.createElement("li");
      li.setAttribute("role", "option");
      li.innerHTML = "<span>" + a.label + '</span><span class="palette-tag mono">' + a.tag + "</span>";
      if (i === selected) li.classList.add("selected");
      li.addEventListener("click", function () { run(i); });
      li.addEventListener("mousemove", function () { if (selected !== i) { selected = i; render(); } });
      pList.appendChild(li);
    });
  }
  function run(i) {
    var a = filtered[i];
    close();
    if (a) a.run();
  }
  function open() {
    palette.hidden = false;
    pInput.value = "";
    filtered = actions.slice();
    selected = 0;
    render();
    setTimeout(function () { pInput.focus(); }, 20);
  }
  function close() {
    palette.hidden = true;
    pInput.value = "";
  }
  pInput.addEventListener("input", function () {
    var q = pInput.value.trim().toLowerCase();
    filtered = actions.filter(function (a) { return a.label.toLowerCase().indexOf(q) !== -1 || a.tag.indexOf(q) !== -1; });
    selected = 0;
    render();
  });
  palette.addEventListener("click", function (e) {
    var tgt = e.target; if (tgt && tgt.closest && tgt.closest("[data-close]")) close();
  });
  pInput.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); selected = Math.min(selected + 1, filtered.length - 1); render(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); selected = Math.max(selected - 1, 0); render(); }
    else if (e.key === "Enter") { e.preventDefault(); run(selected); }
    else if (e.key === "Escape") { close(); }
  });
  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
      e.preventDefault();
      if (palette.hidden) open(); else close();
    } else if (e.key === "Escape" && !palette.hidden) {
      close();
    }
  });

  // Visible trigger button in the nav
  var navEnd = document.querySelector(".nav-end");
  if (navEnd) {
    var kBtn = document.createElement("button");
    kBtn.className = "palette-open mono";
    kBtn.textContent = "⌘K";
    kBtn.setAttribute("aria-label", "Open command palette");
    kBtn.addEventListener("click", open);
    navEnd.insertBefore(kBtn, navEnd.firstChild);
  }

  // First-visit hint
  try {
    if (!localStorage.getItem("paletteHintSeen")) {
      setTimeout(function () {
        if (palette.hidden) showToast("tip: hit ctrl + k (or ⌘K) for quick nav");
        try { localStorage.setItem("paletteHintSeen", "1"); } catch (err) {}
      }, 6000);
    }
  } catch (err) {}
})();

// Cursor glow trail (fine pointers, motion-safe only)
if (typeof finePointer !== "undefined" && finePointer && !reduceMotion3) {
  var glow = document.createElement("div");
  glow.className = "cursor-glow";
  glow.setAttribute("aria-hidden", "true");
  document.body.appendChild(glow);
  var gx = 0, gy = 0, gtx = 0, gty = 0, glowOn = false;
  document.addEventListener("mousemove", function (e) {
    gtx = e.clientX; gty = e.clientY;
    if (!glowOn) { glowOn = true; glow.classList.add("on"); (function follow() { gx += (gtx - gx) * 0.14; gy += (gty - gy) * 0.14; glow.style.transform = "translate(" + (gx - 130) + "px," + (gy - 130) + "px)"; requestAnimationFrame(follow); })(); }
  });
}

// Confetti burst for the "feisal" party easter egg
function confettiBurst() {
  if (reduceMotion3) return;
  var colors = ["#64ffda", "#ffd166", "#ef476f", "#7bdcb5", "#c792ea"];
  var host = document.createElement("div");
  host.className = "confetti-host";
  host.setAttribute("aria-hidden", "true");
  document.body.appendChild(host);
  for (var i = 0; i < 90; i++) {
    var p = document.createElement("span");
    p.style.left = (Math.random() * 100) + "vw";
    p.style.background = colors[i % colors.length];
    p.style.animationDelay = (Math.random() * 0.5) + "s";
    p.style.animationDuration = (1.8 + Math.random() * 1.8) + "s";
    p.style.setProperty("--drift", (Math.random() * 160 - 80) + "px");
    host.appendChild(p);
  }
  setTimeout(function () { host.remove(); }, 4600);
}
if ("MutationObserver" in window) {
  var partyObserver = new MutationObserver(function () {
    if (document.body.classList.contains("party")) confettiBurst();
  });
  partyObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });
}
