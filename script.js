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
function onScroll() {
  var pos = window.scrollY + window.innerHeight / 3;
  var activeId = "";
  sections.forEach(function (sec) { if (sec.offsetTop <= pos) activeId = sec.id; });
  navAnchors.forEach(function (a) { a.style.color = a.getAttribute("href") === "#" + activeId ? "var(--green)" : ""; });
}
var ticking = false;
window.addEventListener("scroll", function () {
  if (!ticking) { requestAnimationFrame(function () { onScroll(); ticking = false; }); ticking = true; }
}, { passive: true });
onScroll();

// Booking form via Formspree
var bookingForm = document.getElementById("bookingForm");
var bookingStatus = document.getElementById("bookingStatus");
bookingForm.addEventListener("submit", async function (e) {
  e.preventDefault();
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
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();