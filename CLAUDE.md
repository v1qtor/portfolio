# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

An internship portfolio site built with Eleventy (11ty) using Nunjucks templates, deployed to Netlify (`netlify.toml`: build `npm run build`, publish `_site/`).

## Commands

- `npm run dev` — dev server with live reload (`eleventy --serve`)
- `npm run build` — build to `_site/` (gitignored)

There are no tests or linters.

## Architecture

- **`src/_includes/layouts/base.njk`** — the shared chrome (head, mobile topbar, mobile nav, sidebar, footer, scripts) for all main pages. Nav items come from `src/_data/nav.json`; the current page is highlighted via the `activeNav` front-matter key matching a nav item's `key`.
- **`src/_includes/layouts/achievement-detail.njk`** — thin layout for achievement detail pages (no sidebar — these render inside GLightbox iframes from the achievements page). Slider images are declared as a `slides` list in the page's front matter; the layout renders the Swiper markup.
- **Pages** are `.html` files in `src/` with YAML front matter, processed as Nunjucks (`htmlTemplateEngine: "njk"`). Front-matter keys used by `base.njk`: `title`, `activeNav`, `pageCss` (local stylesheets), `pageCdnCss` (CDN stylesheets, loaded before `style.css`), `pageScripts` (loaded after `js/scripts.js` at the end of body, in order — order matters, e.g. jQuery before `home.js`).
- **`src/404.html`** is standalone (its own full HTML document, `permalink: /404.html`, no layout) — it deliberately has a different design.
- **URLs are clean** (`/aboutme/`, `/achievements/dentsu-blended-internship/`). Old `.html` URLs are 301-redirected in `src/_redirects` (Netlify format), which also has the 404 fallback.
- **Assets** live in `src/assets/{css,js,images,files}` and are passthrough-copied to `/assets/...`. Pages reference them root-absolute (`/assets/...`); CSS files reference images relatively (`../images/...`), which works because css and images move together.
- **CSS**: `src/assets/css/style.css` is the shared base — design tokens (`:root` custom properties: `--accent`, `--panel`, `--card`, etc.), typography (Syne headings, Work Sans body), sidebar/mobile-nav layout. Per-page styles in their own files (`index.css`, `aboutme.css`, `projects.css`, `achievements.css`, `internship.css`), loaded via `pageCss`.
- **JS**: `scripts.js` (mobile nav toggle, loaded on every base-layout page); page-specific: `home.js` (typing animation + jquery.ripples hero), `projects.js` (tab switcher), `achievements.js` (filter chips + GLightbox lifecycle), `achievement-details.js` (Swiper init).
- **Third-party libraries are CDN-only** (Bootstrap Icons, jQuery + jquery.ripples, GLightbox, Boxicons, Swiper); nothing is vendored. The only npm dependency is Eleventy.

## Design reference (Kioto theme)

The visual design follows the "Kioto" WordPress theme. `docs/`, `kioto_about_source.html`, and `kioto_post37.css` are saved reference material — gitignored, not part of the build. `docs/kioto-services-reference.md` records the card metrics used for the About Me skills cards.

## Conventions

- Indentation is tabs in HTML/CSS/JS templates.
- Colors and spacing come from the CSS custom properties in `style.css` — use those tokens rather than hardcoding new colors.
- Interactive markup carries aria attributes (`aria-label`, `aria-expanded`, `aria-selected`) — keep this up when adding UI.
- Adding a page: create `src/<name>.html` with front matter (`layout: layouts/base.njk`, `title`, `activeNav`, optional `pageCss`/`pageScripts`); add to `src/_data/nav.json` if it belongs in the nav. Adding an achievement: card in `src/achievements.html` + detail page in `src/achievements/` using the `achievement-detail.njk` layout with `slides` front matter.
