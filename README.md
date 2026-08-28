[README.md](https://github.com/user-attachments/files/31547467/README.md)
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

**Main content** (5 numbered sections)
1. **About** — short bio and current availability note
2. **Services** — 4 service offerings (Build, Convert, Tune, Care)
3. **Selected work** — 4 project cards (studio site, dashboard, storefront, nonprofit rebuild), each with year, description, and tech tags
4. **Process** — a 5-step engagement process (Brief → Draft → Build → Proof → Ship), plus 2 client testimonial quotes
5. **Contact** — email and phone call-to-action buttons

**Footer** — name/location and a "back to top" link.

## Functionality (JavaScript)

Two small vanilla-JS behaviors, no external libraries:

1. **Typewriter effect** — types and deletes each phrase in the terminal widget on a loop.
2. **Scroll-spy navigation** — listens for scroll events and highlights the sidebar nav link corresponding to the section currently in view.

## Customizing

All content lives directly in the HTML — to update it, edit the markup in the relevant `<section>`:

| To change... | Edit... |
|---|---|
| Name, role, bio | `<aside class="side">` and `#about` |
| Terminal phrases | the `phrases` array near the bottom `<script>` |
| Services | `.service` blocks in `#services` |
| Projects | `.project` blocks in `#work` |
| Process steps / testimonials | `.step` and `.quote` blocks in `#process` |
| Contact info | `#contact` and the `mailto:` / `tel:` links |
| Colors / theme | CSS custom properties at the top of `<style>` (`:root { --bg, --ink, --amber, ... }`) |
| Social links | `.socials` block in the sidebar |

## Accessibility & performance notes

- Respects `prefers-reduced-motion` (disables smooth scroll and animations)
- Visible focus outlines (`:focus-visible`) for keyboard navigation
- Semantic landmarks (`<aside>`, `<main>`, `<footer>`, `<nav>`) and `aria-label`s on icon-only links
- No render-blocking scripts beyond the Google Fonts stylesheet; everything else is inline

## Running it

No server or build step required — just open the HTML file directly in a browser, or serve the folder with any static file server (e.g. `python3 -m http.server`) if you prefer.
