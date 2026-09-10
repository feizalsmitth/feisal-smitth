// Interactive Terminal Commands
const commands = {
  'help': 'Available commands: <span style="color:var(--amber)">help, about, projects, skills, experience, contact, clear, echo [text], secret, coffee, barista</span>',
  'about': 'I am <strong>Feisal Onyango</strong>, a frontend developer, barista, and coffee roaster based in Nairobi, Kenya. I build fast, accessible interfaces and pull great shots of coffee.',
  'projects': 'Check out my work in the "<a href="#work" style="color:var(--amber)">Selected work</a>" section. I have built projects using Next.js, React, Node.js, and more.',
  'skills': 'My skills include JavaScript, React, Next.js, Node.js, and coffee roasting. See the "<a href="#skills" style="color:var(--amber)">Skills</a>" section for more details.',
  'experience': 'I have worked as a Freelance Frontend Developer, Junior Developer at Local Studio, and Junior Coffee Roaster at Kenyan Barisa.',
  'contact': 'You can reach me via email at <a href="mailto:feizalsmitth@icloud.com" style="color:var(--amber)">feizalsmitth@icloud.com</a> or phone at <a href="tel:+254702478201" style="color:var(--amber)">+254 702 478 201</a>.',
  'clear': () => {
    terminalOutput.innerHTML = '';
    return '';
  },
  'echo': (args) => args.join(' '),
  'secret': '🤫 You found a hidden command! Try "<span style="color:var(--amber)">coffee</span>" or "<span style="color:var(--amber)">barista</span>".',
  'coffee': '☕ My favorite! I roast my own beans and love experimenting with brew methods. Try my <a href="#booking" style="color:var(--amber)">on-site barista service</a>!',
  'barista': '🔥 I offer on-site barista services for events in Nairobi. Book me for your next pop-up or product launch!'
};

// Terminal Elements
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');

// Handle terminal input
terminalInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const command = terminalInput.value.trim();
    terminalInput.value = '';

    // Display the command in the terminal
    const commandEl = document.createElement('div');
    commandEl.innerHTML = `<span style="color:var(--ink-bright)">&gt; ${command}</span>`;
    terminalOutput.appendChild(commandEl);

    // Process the command
    const [cmd, ...args] = command.split(' ');
    let response = 'Command not found. Type <span style="color:var(--amber)">help</span> for available commands.';

    if (cmd in commands) {
      response = typeof commands[cmd] === 'function' ? commands[cmd](args) : commands[cmd];
    }

    // Display the response
    const responseEl = document.createElement('div');
    responseEl.innerHTML = response;
    terminalOutput.appendChild(responseEl);

    // Scroll to the bottom
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }
});

// Auto-focus the terminal on page load
window.addEventListener('load', () => {
  terminalInput.focus();
});

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
const sunPath = document.getElementById('sunPath');
const moonPath = document.getElementById('moonPath');

// Sync theme icon with current theme
let isDark = !document.documentElement.classList.contains('light-mode');
sunPath.style.display = isDark ? 'block' : 'none';
moonPath.style.display = isDark ? 'none' : 'block';

themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  document.documentElement.classList.toggle('light-mode', !isDark);
  sunPath.style.display = isDark ? 'block' : 'none';
  moonPath.style.display = isDark ? 'none' : 'block';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

/* ---- Booking form ---- */
const bookingForm = document.getElementById('bookingForm');
const bookingStatus = document.getElementById('bookingStatus');

bookingForm.addEventListener('submit', async (e) => {
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

  // Check if the form has an action attribute (Formspree or other endpoint)
  if (bookingForm.action) {
    // Submit the form directly to Formspree or other endpoint
    bookingStatus.textContent = 'Sending your request...';
    bookingStatus.classList.add('show');
    
    try {
      const response = await fetch(bookingForm.action, {
        method: 'POST',
        body: new FormData(bookingForm),
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        bookingStatus.textContent = 'Request sent successfully! I will get back to you soon.';
        bookingForm.reset();
      } else {
        bookingStatus.textContent = 'There was an issue sending your request. Please try again or email me directly.';
      }
    } catch (error) {
      bookingStatus.textContent = 'There was an issue sending your request. Please try again or email me directly.';
    }
  } else {
    // Fallback to mailto if no action is set
    const mailtoLink = `mailto:feizalsmitth@icloud.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    bookingStatus.textContent = 'Opening your email client to send this request...';
    bookingStatus.classList.add('show');
    window.location.href = mailtoLink;
  }
});

/* ---- Project Card Animations ---- */
const projectObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      projectObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

projectCards.forEach(card => {
  projectObserver.observe(card);
});

/* ---- Mobile Menu Toggle ---- */
const mobileMenuToggle = document.createElement('button');
mobileMenuToggle.className = 'mobile-menu-toggle';
mobileMenuToggle.innerHTML = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M3 12h18M3 6h18M3 18h18"/>
  </svg>
`;
mobileMenuToggle.setAttribute('aria-label', 'Toggle menu');

const sideNav = document.querySelector('.side-nav');
const socialsDiv = document.querySelector('.socials');
if (socialsDiv) {
  socialsDiv.prepend(mobileMenuToggle);
}

mobileMenuToggle.addEventListener('click', () => {
  const navUl = document.querySelector('.side-nav ul');
  navUl.classList.toggle('active');
});

/* ---- Close Mobile Menu on Link Click ---- */
document.querySelectorAll('.side-nav a').forEach(link => {
  link.addEventListener('click', () => {
    const navUl = document.querySelector('.side-nav ul');
    if (window.innerWidth <= 980) {
      navUl.classList.remove('active');
    }
  });
});

/* ---- Close Mobile Menu on Outside Click ---- */
document.addEventListener('click', (e) => {
  const navUl = document.querySelector('.side-nav ul');
  if (window.innerWidth <= 980 && !e.target.closest('.side-nav') && !e.target.closest('.mobile-menu-toggle')) {
    navUl.classList.remove('active');
  }
});

/* ---- Floating Navigation ---- */
const floatingNav = document.getElementById('floatingNav');

window.addEventListener('scroll', () => {
  if (window.innerWidth <= 980 && window.pageYOffset > 100) {
    floatingNav.style.display = 'block';
  } else {
    floatingNav.style.display = 'none';
  }
});

/* ---- Back to Top Button ---- */
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    backToTopButton.style.display = 'block';
  } else {
    backToTopButton.style.display = 'none';
  }
});

backToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

/* ---- Copy Email Button ---- */
const copyEmailButton = document.getElementById('copyEmail');
const copyStatus = document.getElementById('copyStatus');

copyEmailButton.addEventListener('click', () => {
  navigator.clipboard.writeText('feizalsmitth@icloud.com').then(() => {
    copyStatus.style.display = 'inline';
    setTimeout(() => {
      copyStatus.style.display = 'none';
    }, 2000);
  });
});

/* ---- Loading Spinner ---- */
window.addEventListener('load', () => {
  const loadingSpinner = document.getElementById('loadingSpinner');
  setTimeout(() => {
    loadingSpinner.style.opacity = '0';
    setTimeout(() => {
      loadingSpinner.style.display = 'none';
    }, 500);
  }, 500);
});
