# Victor Chukwuma — Portfolio

Personal internship portfolio for Applied Computer Science at Thomas More. Built as a static site with [Eleventy (11ty)](https://www.11ty.dev/) and Nunjucks templates, hosted on the university server (sinners.be).

## Development

```bash
npm install       # once
npm run dev       # dev server with live reload at http://localhost:8080
npm run build     # build the site into _site/
```

## Deployment

Deployment is manual over SFTP (FileZilla) — there is no CI/CD, pushing to GitHub does not publish anything:

1. `npm run build`
2. Upload the **contents of `_site/`** — not the project folder — to the web root on the server.
3. Make sure the hidden `.htaccess` file is included (FileZilla: *Server → Force showing hidden files*). It provides the custom 404 page and 301 redirects from old URLs.

The site assumes it is served from the domain root (all asset paths are root-absolute, `/assets/...`).

## Project structure

```
src/
  _data/
    nav.json              top-of-header nav items (key, label, url)
    projects.json          Projects page content (see below)
    achievements.json      Achievements page content (see below)
  _includes/layouts/
    base.njk               shared chrome: head, header/nav, mobile nav, scripts
  index.html                pages: HTML with YAML front matter, rendered as Nunjucks
  aboutme.html
  skills.html
  projects.html
  achievements.html
  contact.html
  internship.html           orphaned page, not currently linked in nav.json
  404.html                  standalone page (own design, no layout)
  assets/
    css/                    one stylesheet per page + shared style.css
    js/                     one script per interactive page + shared scripts.js
    images/                 project/achievement/hobby photos, icons, favicon
    files/                  cv.pdf (rendered via pdf.js on About Me)
  .htaccess                 Apache: 404 page + legacy URL redirects
eleventy.config.js
```

### How pages work

Each page declares its metadata in front matter, and the layout does the rest:

```yaml
---
title: Projects            # browser tab title
activeNav: projects        # which nav item is highlighted (matches a key in nav.json)
pageCdnCss:                 # optional: extra CDN stylesheets (after style.css)
  - https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css
pageCss:                   # page-specific stylesheets (after style.css)
  - /assets/css/projects.css
pageScripts:               # page-specific scripts, in order (after js/scripts.js)
  - /assets/js/projects.js
layout: layouts/base.njk
---
```

### Styling

`src/assets/css/style.css` holds the design tokens (CSS custom properties — `--accent` gold, spacing, header height) and the shared layout; each page adds its own stylesheet. Typography is Syne (headings/body) and Work Sans (small meta/tags). Visual design follows the "Kioto" WordPress theme.

Third-party dependencies load from CDN, no npm packages beyond Eleventy itself:
- **Bootstrap Icons** — icons across the site
- **pdf.js** — renders `cv.pdf` onto a `<canvas>` on About Me (avoids the browser's native PDF viewer chrome)

There is no jQuery, GLightbox, or Swiper — the Projects gallery and Achievements modal are both hand-rolled (see below).

### Projects page (data-driven)

`src/projects.html` renders a sticky left-hand list of project numbers next to a JS-rendered detail pane (`src/assets/js/projects.js`), reading from `src/_data/projects.json`. Each entry:

```json
{
  "slug": "andersons",
  "type": "Full-Stack Web Development",     // breadcrumb eyebrow
  "title": "Andersons Household Management App",
  "year": "2026",
  "summary": "...",                          // one-line subtitle
  "tags": ["Laravel", "Livewire", "..."],
  "problem": "...", "approach": "...", "outcome": "...",   // HTML strings, <strong> for emphasis
  "highlights": ["...", "..."],              // HTML strings
  "images": [
    { "file": "1.jpg", "kind": "screenshot", "caption": "..." }
  ],
  "githubUrl": "https://github.com/...",     // or "#" / null
  "liveUrl": "https://..."                   // or null
}
```

**To add a project**: append an entry to `projects.json`, then drop numbered image files (`1.jpg`, `2.jpg`, ...) into `src/assets/images/projects/<slug>/` matching the `images` array. A project without real images yet gets a `notes.txt` in its folder listing the exact filenames expected — missing files fall back to a clean placeholder box (no broken-image icons), so the page never looks broken while photos are pending. GitHub/Live links render beside the image thumbnail strip.

### Achievements page (data-driven)

`src/achievements.html` renders a vertical list of certificate rows (thumbnail = the *second* image in each entry, not the certificate scan itself) reading from `src/_data/achievements.json`. Clicking a row opens a large custom modal (`src/assets/js/achievements.js`) with:
- a photo carousel for that certificate (prev/next arrows + pagination dots, no autoplay)
- large edge arrows to swap to the *previous/next certificate entirely* without closing the modal (wraps around)
- the modal is always a fixed near-fullscreen size (`height: 94vh`), regardless of how much content a given certificate has

Each entry:

```json
{
  "id": "dentsu",
  "issuer": "Dentsu — Blended Internship Program",
  "title": "Blended Internship Program",
  "subtitle": "Champions — Reimagining Third Spaces",
  "images": [
    { "src": "/assets/images/achievements/dentsu/certificate.jpg", "alt": "..." }
  ],
  "summary": "...",                    // HTML string
  "context": "<p>...</p>",             // HTML string, shown under "Context"
  "representation": "<p>...</p>"       // HTML string, shown under "What It Represents"
}
```

**To add an achievement**: append an entry to `achievements.json` (put the certificate scan first in `images`, then real photos — the second image becomes the row thumbnail), then drop the image files into `src/assets/images/achievements/<id>/`.

### Adding content

- **New page**: create `src/<name>.html` with the front matter above; add it to `src/_data/nav.json` if it belongs in the navigation.
- **New project**: see "Projects page" above.
- **New achievement**: see "Achievements page" above.
- **Hobby carousel** (About Me): panels live directly in `src/aboutme.html` (`.hobby-panel` + matching `.hobby-dot`); photos go in `src/assets/images/hobbies/<name>.jpg`.

## Known open items

- `src/internship.html` exists but isn't linked in `nav.json` — unclear if still wanted.
- Some project entries in `projects.json` still have placeholder images (check for a `notes.txt` in the project's image folder).
