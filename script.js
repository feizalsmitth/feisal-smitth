var phrases = ["Frontend Developer", "React & TypeScript", "Also a Barista", "Nairobi, Kenya", "Available October"];
var typedEl = document.getElementById('typed');
var pi = 0, ci = 0, deleting = false;

function tick(){
  var current = phrases[pi];
  if(!deleting){
    ci++;
    if(ci > current.length){ deleting = true; setTimeout(tick, 1400); return; }
  } else {
    ci--;
    if(ci === 0){ deleting = false; pi = (pi + 1) % phrases.length; }
  }
  typedEl.innerHTML = '<span style="color:var(--ink-bright)">&gt; ' + current.slice(0, ci) + '</span><span class="cursor"></span>';
  setTimeout(tick, deleting ? 40 : 80);
}
tick();

var links = document.querySelectorAll('.side-nav a');
var sections = Array.from(links).map(function(a){ return document.querySelector(a.getAttribute('href')); });
function onScroll(){
  var pos = window.scrollY + 120;
  var activeIndex = 0;
  sections.forEach(function(sec, i){ if(sec && sec.offsetTop <= pos) activeIndex = i; });
  links.forEach(function(a, i){ a.classList.toggle('active', i === activeIndex); });
}
if('IntersectionObserver' in window){
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
}

/* ---- Selected work: expand/collapse ---- */
var projectCards = Array.from(document.querySelectorAll('.project'));

function toggleProject(card){
  var isOpen = card.classList.contains('expanded');
  card.classList.toggle('expanded', !isOpen);
  card.setAttribute('aria-expanded', String(!isOpen));
}

projectCards.forEach(function(card){
  card.addEventListener('click', function(){ toggleProject(card); });
  card.addEventListener('keydown', function(e){
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      toggleProject(card);
    }
  });
});

/* ---- Selected work: tag filtering ---- */
var filterBar = document.getElementById('filterBar');
var allTags = new Set();
projectCards.forEach(function(card){
  card.dataset.tags.split(',').forEach(function(t){ allTags.add(t.trim()); });
});

function makeFilterBtn(label, value, active){
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'filter-btn' + (active ? ' active' : '');
  btn.textContent = label;
  btn.dataset.filter = value;
  return btn;
}

filterBar.appendChild(makeFilterBtn('All', 'all', true));
Array.from(allTags).sort().forEach(function(tag){
  filterBar.appendChild(makeFilterBtn(tag, tag, false));
});

filterBar.addEventListener('click', function(e){
  var btn = e.target.closest('.filter-btn');
  if(!btn) return;

  Array.from(filterBar.children).forEach(function(b){ b.classList.toggle('active', b === btn); });

  var filter = btn.dataset.filter;
  projectCards.forEach(function(card){
    var tags = card.dataset.tags.split(',').map(function(t){ return t.trim(); });
    var show = filter === 'all' || tags.indexOf(filter) !== -1;
    card.classList.toggle('is-hidden', !show);
    if(!show && card.classList.contains('expanded')){
      card.classList.remove('expanded');
      card.setAttribute('aria-expanded', 'false');
    }
  });
});

/* ---- Theme Toggle ---- */
var themeToggle = document.getElementById('themeToggle');
var themeIcon = document.getElementById('themeIcon');
var isDark = true;

themeToggle.addEventListener('click', function() {
  isDark = !isDark;
  document.documentElement.classList.toggle('light-mode', !isDark);
  themeIcon.innerHTML = isDark
    ? '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>'
    : '<path d="M12 18a6 6 0 0 0-9-9 9 9 0 1 0 9 9Z"/>';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Load saved theme
if (localStorage.getItem('theme') === 'light') {
  document.documentElement.classList.add('light-mode');
  isDark = false;
  themeIcon.innerHTML = '<path d="M12 18a6 6 0 0 0-9-9 9 9 0 1 0 9 9Z"/>';
}

/* ---- Booking form ---- */
var bookingForm = document.getElementById('bookingForm');
var bookingStatus = document.getElementById('bookingStatus');

bookingForm.addEventListener('submit', function(e){
  e.preventDefault();

  var name = document.getElementById('bk-name').value.trim();
  var email = document.getElementById('bk-email').value.trim();
  var type = document.getElementById('bk-type').value;
  var budget = document.getElementById('bk-budget').value;
  var date = document.getElementById('bk-date').value;
  var timeline = document.getElementById('bk-timeline').value.trim();
  var details = document.getElementById('bk-details').value.trim();

  var subject = 'Booking inquiry: ' + type + ' - ' + name;
  var bodyLines = [
    'Name: ' + name,
    'Email: ' + email,
    'Inquiry type: ' + type,
    'Budget range: ' + budget,
    'Preferred start / event date: ' + date,
    'Rough deadline: ' + (timeline || '-'),
    '',
    'Project details:',
    details
  ];
  var body = bodyLines.join('\n');

  var mailtoLink = 'mailto:feizalsmitth@icloud.com'
    + '?subject=' + encodeURIComponent(subject)
    + '&body=' + encodeURIComponent(body);

  bookingStatus.textContent = 'Opening your email client to send this request...';
  bookingStatus.classList.add('show');

  window.location.href = mailtoLink;
});
