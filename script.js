const phrases = ['Frontend Developer', 'React & TypeScript', 'Also a Barista', 'Nairobi, Kenya', 'Available October'];
const typedEl = document.getElementById('typed');
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function tick() {
  const current = phrases[phraseIndex];

  if (!deleting) {
    charIndex++;
    if (charIndex > current.length) {
      deleting = true;
      setTimeout(tick, 1400);
      return;
    }
  } else {
    charIndex--;
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }

  typedEl.innerHTML = `<span style="color:var(--ink-bright)">&gt; ${current.slice(0, charIndex)}</span><span class="cursor"></span>`;
  setTimeout(tick, deleting ? 40 : 80);
}
tick();

/* ---- Side-nav scroll spy ---- */
const links = [...document.querySelectorAll('.side-nav a')];
const sections = links.map(a => document.querySelector(a.getAttribute('href')));

function onScroll() {
  const pos = window.scrollY + 120;
  let activeIndex = 0;
  sections.forEach((sec, i) => {
    if (sec?.offsetTop <= pos) activeIndex = i;
  });
  links.forEach((a, i) => a.classList.toggle('active', i === activeIndex));
}

let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      onScroll();
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });
onScroll();

/* ---- Selected work: expand/collapse ---- */
const projectCards = [...document.querySelectorAll('.project')];

function toggleProject(card) {
  const isOpen = card.classList.contains('expanded');
  card.classList.toggle('expanded', !isOpen);
  card.setAttribute('aria-expanded', String(!isOpen));
}

projectCards.forEach(card => {
  card.addEventListener('click', () => toggleProject(card));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleProject(card);
    }
  });
});

/* ---- Selected work: tag filtering ---- */
const filterBar = document.getElementById('filterBar');
const allTags = new Set();
projectCards.forEach(card => {
  card.dataset.tags.split(',').forEach(t => allTags.add(t.trim()));
});

function makeFilterBtn(label, value, active) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `filter-btn${active ? ' active' : ''}`;
  btn.textContent = label;
  btn.dataset.filter = value;
  return btn;
}

filterBar.appendChild(makeFilterBtn('All', 'all', true));
[...allTags].sort().forEach(tag => {
  filterBar.appendChild(makeFilterBtn(tag, tag, false));
});

filterBar.addEventListener('click', e => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;

  [...filterBar.children].forEach(b => b.classList.toggle('active', b === btn));

  const { filter } = btn.dataset;
  projectCards.forEach(card => {
    const tags = card.dataset.tags.split(',').map(t => t.trim());
    const show = filter === 'all' || tags.includes(filter);
    card.classList.toggle('is-hidden', !show);
    if (!show && card.classList.contains('expanded')) {
      card.classList.remove('expanded');
      card.setAttribute('aria-expanded', 'false');
    }
  });
});

/* ---- Theme toggle ---- */
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

const SUN_PATH = '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>';
const MOON_PATH = '<path d="M12 18a6 6 0 0 0-9-9 9 9 0 1 0 9 9Z"/>';

// Sync theme icon with current theme
let isDark = !document.documentElement.classList.contains('light-mode');
themeIcon.innerHTML = isDark ? SUN_PATH : MOON_PATH;

themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  document.documentElement.classList.toggle('light-mode', !isDark);
  themeIcon.innerHTML = isDark ? SUN_PATH : MOON_PATH;
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

/* ---- Booking form ---- */
const bookingForm = document.getElementById('bookingForm');
const bookingStatus = document.getElementById('bookingStatus');

bookingForm.addEventListener('submit', e => {
  e.preventDefault();

  const name = document.getElementById('bk-name').value.trim();
  const email = document.getElementById('bk-email').value.trim();
  const type = document.getElementById('bk-type').value;
  const budget = document.getElementById('bk-budget').value;
  const date = document.getElementById('bk-date').value;
  const timeline = document.getElementById('bk-timeline').value.trim();
  const details = document.getElementById('bk-details').value.trim();

  const subject = `Booking inquiry: ${type} - ${name}`;
  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Inquiry type: ${type}`,
    `Budget range: ${budget}`,
    `Preferred start / event date: ${date}`,
    `Rough deadline: ${timeline || '-'}`,
    '',
    'Project details:',
    details
  ].join('\n');

  const mailtoLink = `mailto:feizalsmitth@icloud.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  bookingStatus.textContent = 'Opening your email client to send this request...';
  bookingStatus.classList.add('show');

  window.location.href = mailtoLink;
});
