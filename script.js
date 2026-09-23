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
  navAnchors.forEach(function (a) { a
.style.color = a.getAttribute("href") === "#" + activeId ? "var(--green)" : ""; });
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
  document.querySelectorAll(".project, .quote, .photo-frame").forEach(function (el) {
    el.classList.add("tilt");
    el.addEventListener("mousemove", function (e) {
      var r = el.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.he
ight - 0.5;
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
    bookingStatus.textContent = "⚠ net
work error — please email me directly.";
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
