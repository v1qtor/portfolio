# Victor Chukwuma — Portfolio

Personal internship portfolio for Applied Computer Science at Thomas More. Built as a static site with [Eleventy (11ty)](https://www.11ty.dev/) and Nunjucks templates, hosted on the university server (sinners.be).

## Development

```bash
npm install       # once
npm run dev       # dev server with live reload at http://localhost:8080
npm run build     # build the site into _site/
```

## Deployment

Deployment is manual over SFTP (FileZilla):

1. `npm run build`
2. Upload the **contents of `_site/`** — not the project folder — to the web root on the server.
3. Make sure the hidden `.htaccess` file is included (FileZilla: *Server → Force showing hidden files*). It provides the custom 404 page and 301 redirects from the old `.html` URLs.

The site assumes it is served from the domain root (all asset paths are root-absolute, `/assets/...`).

## Project structure

```
src/
  _data/nav.json            navigation items (key, label, url)
  _includes/layouts/
    base.njk                shared chrome: head, sidebar, mobile nav, scripts
    achievement-detail.njk  thin layout for achievement detail pages (Swiper slider)
  index.html                pages: HTML with YAML front matter, rendered as Nunjucks
  aboutme.html
  projects.html
  achievements.html
  internship.html
  contact.html
  404.html                  standalone page (own design, no layout)
  achievements/             achievement detail pages (opened in a lightbox)
  assets/                   css / js / images / files, copied through to /assets/
  .htaccess                 Apache: 404 page + legacy URL redirects
eleventy.config.js
```

### How pages work

Each page declares its metadata in front matter, and the layout does the rest:

```yaml
---
title: Projects            # browser tab title
activeNav: projects        # which nav item is highlighted (matches a key in nav.json)
pageCss:                   # page-specific stylesheets (after style.css)
  - /assets/css/projects.css
pageScripts:               # page-specific scripts (after js/scripts.js, in order)
  - /assets/js/projects.js
layout: layouts/base.njk
---
```

Achievement detail pages use `layouts/achievement-detail.njk` instead and declare their slider images as a `slides` list in front matter.

### Styling

`src/assets/css/style.css` holds the design tokens (CSS custom properties for colors, sidebar width) and the shared layout; each page adds its own stylesheet. Typography is Syne (headings) and Work Sans (body). Third-party libraries (Bootstrap Icons, jQuery + jquery.ripples, GLightbox, Swiper) load from CDNs; the only npm dependency is Eleventy.

### Adding content

- **New page**: create `src/<name>.html` with the front matter above; add it to `src/_data/nav.json` if it belongs in the navigation.
- **New achievement**: add a card in `src/achievements.html` and a detail page in `src/achievements/` using the `achievement-detail.njk` layout.
