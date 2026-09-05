# Feisal Onyango — Portfolio Site

A single-file, static HTML portfolio/landing page for Feisal Onyango, a frontend developer based in Nairobi, Kenya. No build step, no dependencies to install — just open the file in a browser.

## Overview

- **File:** `index.html` (fully self-contained: HTML, CSS, and JS all in one file)
- **Type:** Static one-pager, dark-themed developer portfolio
- **Fonts:** Google Fonts — Space Grotesk (headings), Inter (body), JetBrains Mono (code/labels), loaded via CDN `<link>` tags
- **Dependencies:** None (no npm, no framework, no build tools)

## Layout & sections

The page uses a two-column layout: a sticky left sidebar and a scrollable right content column. On screens narrower than 980px it collapses to a single stacked column.

**Sidebar**
- Name, role, and short blurb
- A fake terminal widget with a typewriter effect that cycles through phrases (`Frontend Developer`, `React & TypeScript`, `Nairobi, Kenya`, `Available October`)
- In-page nav links (with scroll-spy highlighting of the active section)
- Social links (GitHub, LinkedIn, email)

**Main content** (8 numbered sections)
1. **About** — short bio and current availability note
2. **Services** — 5 service offerings (Build, Convert, Tune, Care, Brew)
3. **Skills** — categorized skills (Languages, Frameworks & Libraries, Tools & Platforms, Other)
4. **Selected work** — 6 project cards (studio site, dashboard, storefront, nonprofit rebuild, weather app, marketplace), each with year, description, and tech tags
5. **Experience** — timeline of professional experience
6. **Process** — a 5-step engagement process (Brief → Draft → Build → Proof → Ship), plus 2 client testimonial quotes
7. **Booking** — form to book projects or barista services
8. **Contact** — email and phone call-to-action buttons

**Footer** — name/location and a "back to top" link.

## Functionality (JavaScript)

Four vanilla-JS behaviors, no external libraries:

1. **Typewriter effect** — types and deletes each phrase in the terminal widget on a loop.
2. **Scroll-spy navigation** — listens for scroll events and highlights the sidebar nav link corresponding to the section currently in view.
3. **Project filtering** — dynamically filters projects by technology tags.
4. **Theme toggle** — switches between dark and light modes, with preference saved in localStorage.

## Customizing

All content lives directly in the HTML — to update it, edit the markup in the relevant `<section>`:

| To change...                 | Edit...                                                                               |
| ---------------------------- | ------------------------------------------------------------------------------------- |
| Name, role, bio              | `<aside class="side">` and `#about`                                                   |
| Terminal phrases             | the `phrases` array in `script.js`                                                    |
| Services                     | `.service` blocks in `#services`                                                      |
| Skills                       | `.skill-category` blocks in `#skills`                                                 |
| Projects                     | `.project` blocks in `#work`                                                          |
| Experience                   | `.timeline-item` blocks in `#experience`                                             |
| Process steps / testimonials | `.step` and `.quote` blocks in `#process`                                             |
| Contact info                 | `#contact` and the `mailto:` / `tel:` links                                           |
| Colors / theme               | CSS custom properties at the top of `styles.css` (`:root { --bg, --ink, --amber, ... }`) |
| Social links                 | `.socials` block in the sidebar                                                       |

## Accessibility & performance notes

- Respects `prefers-reduced-motion` (disables smooth scroll and animations)
- Visible focus outlines (`:focus-visible`) for keyboard navigation
- Semantic landmarks (`<aside>`, `<main>`, `<footer>`, `<nav>`) and `aria-label`s on icon-only links
- No render-blocking scripts beyond the Google Fonts stylesheet; everything else is inline

## Running it

No server or build step required — just open the HTML file directly in a browser, or serve the folder with any static file server (e.g. `python3 -m http.server`) if you prefer.

## About

Frontend developer portfolio for Feisal Onyango — responsive, single-page site showcasing projects and skills.

https://feizalsmitth.github.io/feisal-smitth/
