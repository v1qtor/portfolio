# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A static HTML/CSS/JS internship portfolio site (no build system, no package manager, no framework). There are no build, lint, or test commands — pages are edited directly and previewed by opening the HTML files or serving the folder with any static server (e.g. `python -m http.server`). The `_redirects` file indicates deployment to Netlify (404 handling via `404.html`).

Note: absolute paths like `/images/...` are used in some pages (e.g. favicons, hero image in `index.html`), so previewing via a local server from the repo root matches production better than opening files directly.

## Architecture

- **Pages**: top-level HTML files (`index.html`, `aboutme.html`, `projects.html`, `achievements.html`, `internship.html`, `contact.html`, `404.html`) plus per-certificate detail pages under `achievement-details/`.
- **CSS**: `css/style.css` is the shared base — design tokens (`:root` custom properties for colors, `--sidebar-width`), typography (Syne for headings, Work Sans for body), and the sidebar/mobile-nav layout shared by every page. Each page additionally loads its own stylesheet (`css/index.css`, `css/aboutme.css`, `css/achievements.css`, etc.).
- **JS**: `js/scripts.js` is loaded on every page and handles the mobile nav toggle. `js/achievements.js` (filter tabs + GLightbox lifecycle) and `js/achievement-details.js` (Swiper slider) are page-specific. `index.html` has inline scripts for the role-word typing animation and the jquery.ripples hero effect.
- **Shared layout is duplicated per page**: the sidebar, mobile topbar, and mobile nav markup are copy-pasted into every HTML file. Changing navigation or the sidebar means updating every page, including the ones in `achievement-details/` (which use `../`-relative paths).
- **Third-party libraries** come from CDNs only (no local vendored copies): Bootstrap Icons everywhere; jQuery + jquery.ripples on the home page; GLightbox and Swiper on achievements/achievement-details pages. Google Fonts loads Syne and Work Sans.

## Design reference (Kioto theme)

The visual design follows the "Kioto" WordPress theme. `docs/kioto-services-reference.md` records the observed card metrics (padding, borders, font sizes) used for the About Me skills cards; `kioto_about_source.html`, `kioto_post37.css`, and `docs/kioto-services-source.html` are saved source snapshots of the theme for reference, and `docs/extract-kioto.js` is the Playwright script used to extract those metrics. These files are reference material, not part of the site — don't link to them from pages.

## Conventions

- Indentation is tabs in HTML/CSS/JS.
- Colors and spacing come from the CSS custom properties in `css/style.css` (`--accent`, `--panel`, `--card`, etc.) — use these tokens rather than hardcoding new colors.
- Nav links mark the current page with `class="active"` in both the sidebar and mobile nav.
- Interactive markup carries aria attributes (`aria-label`, `aria-expanded`, `aria-selected`) — keep this up when adding UI.
