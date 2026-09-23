// Mobile nav
const navBurger = document.getElementById("navBurger");
const navLinks = document.getElementById("navLinks");
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
  }, { threshold: 0.12 });
  revealEls.forEach(function (el) { io.observe(el); });
} else {
  revealEls.forEach(function (el) { el.classList.add("in"); });
}

// Booking form via Formspree
var bookingForm = document.getElementById("bookingForm");
var bookingStatus = document.getElementById("bookingStatus");
bookingForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  bookingStatus.textContent = "Sending your request…";
  try {
    var res = await fetch(bookingForm.action, { method: "POST", body: new FormData(bookingForm), headers: { Accept: "application/json" } });
    if (res.ok) {
      bookingStatus.textContent = "✅ Got it! I’ll reply within one business day.";
      bookingForm.reset();
    } else {
      bookingStatus.textContent = "⚠ Something went wrong — please email me directly.";
    }
  } catch (err) {
    bookingStatus.textContent = "⚠ Network error — please email me directly.";
  }
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();