# Session summary — Portfolio rebuild

This file exists because the working session that did all of this got long. If
you're picking this up cold (new session, or a future me), read this first —
it covers what the project *is now*, how it got here, and what's still open.
For day-to-day commands/architecture, see [README.md](../README.md) and
[CLAUDE.md](../CLAUDE.md) (gitignored, local-only).

## What this project is

Victor Chukwuma's personal CS/internship portfolio. Static site, built with
**Eleventy (11ty)**, deployed manually via **FileZilla/SFTP** to
`sinners.be` (a Thomas More university host) — there is no CI/CD, pushing to
GitHub does not publish anything. The GitHub repo is `v1qtor/portfolio`,
public.

## How we got here (roughly chronological)

1. **Started as a plain static site** (no build step), pre-existing before
   this session began. Migrated it to Eleventy: templates in `src/`, shared
   layout in `src/_includes/layouts/base.njk`, per-page CSS/JS under
   `src/assets/`. Set up `git init` + pushed to a new GitHub repo.
2. **Deployment target changed from Netlify to sinners.be** — replaced
   `_redirects`/`netlify.toml` with an Apache `.htaccess` (404 page + legacy
   URL redirects).
3. **Design overhaul via Claude Design** — the user iterated on a
   claude.ai/design project ("Portfolio recreation request",
   `3dc58154-3292-4fe0-95b5-de109f9bccb1`) and had me pull content/structure
   from it repeatedly via the `DesignSync` tool, each time re-implemented
   using the *site's own* existing Syne/Work Sans/gold-accent styling rather
   than the design tool's literal fonts/colors (the user was explicit about
   this every time). This produced, over many iterations:
   - A new **Skills → "Experience & Skills"** page (`src/skills.html`),
     split out of About Me, later given real job-history content (Deerfield
     Property Holdings, Enduring Steps NGO, NoonPrep).
   - **About Me** trimmed to Biography / Professional Ambition / Hobbies
     (interactive carousel, placeholder photos) / Resume.
   - **Resume display** went through two iterations: first a plain
     `<iframe src="cv.pdf">`, which showed the browser's native PDF
     toolbar/scrollbar no matter what — fixed for real by rendering the PDF
     onto a `<canvas>` client-side with **pdf.js** (`src/assets/js/aboutme.js`,
     `initResumePreview`), which has zero native chrome to fight.
   - **Projects page** rebuilt twice: first as a numbered list, then
     redone as the current **split-pane** layout (`src/projects.html` +
     `src/assets/js/projects.js` + `src/assets/css/projects.css`) — a sticky
     nav list of all projects on the left, a JS-rendered detail pane on the
     right (gallery with prev/next + thumbnails + kind-legend, a
     Problem/Approach/Outcome/Highlights grid, GitHub/Live links). Data lives
     in `src/_data/projects.json`.
   - **Achievements page** rebuilt around a custom lightweight modal
     (replacing GLightbox), each achievement keeping its full photo set and
     Context/What-It-Represents text. Data lives in
     `src/_data/achievements.json`.
   - **Contact** got a short intro paragraph added.
   - **Nav moved from a left sidebar to a top navbar** (most recent big
     change) — see below.
4. **Real content additions**: Dentsu "Blended Internship Program" achievement
   (QuestSpace project), and a **"Pro Cycling WorldTour Stage Analytics"**
   project pulled from the user's own GitHub repo
   `v1qtor/bike-racing-web-scraping` — I fetched the real chart PNGs directly
   from that repo via `gh api` and wired up the real GitHub link.

## Current architecture (the important bits)

- **Nav is a single top header now**, not a sidebar. `src/_includes/layouts/base.njk`
  has one `<header class="site-header">` used at every screen width: logo,
  inline nav links + social icons on wide screens, collapsing to the
  pre-existing hamburger (`#menuToggle` / `#mobileNav`, JS unchanged in
  `src/assets/js/scripts.js`) below **1180px**. `--header-height: 80px` in
  `style.css` drives the fixed-header clearance (`.page { padding-top: var(--header-height) }`),
  applied on **every** page now, not just mobile like before.
- **Projects and Achievements are JS/JSON-driven**, not hand-written HTML
  per item. To add a project: edit `src/_data/projects.json` (schema:
  `slug, type, title, year, summary, tags[], problem, approach, outcome,
  highlights[], images[{file, kind, caption}], githubUrl, liveUrl`), then
  drop numbered image files (`1.jpg`, `2.jpg`, ...) into
  `src/assets/images/projects/<slug>/` matching the `images` array. Each
  project folder that doesn't have real images yet has a `notes.txt` listing
  exactly what filenames are expected. Missing images fall back to a clean
  placeholder box (no broken-image icons) via an `onerror` handler in
  `projects.js`.
- **Achievements** work the same way via `achievements.json` + `achievements.js`
  (custom modal, not GLightbox).
- Typography/color consistency was fixed multiple times this session — the
  rule of thumb the user cares about: **reuse the site's existing tokens**
  (`var(--accent)`, `var(--muted)`, Syne for headings/body-copy-that-matters,
  Work Sans for small meta tags) rather than introducing new fonts/colors,
  *even when a reference screenshot/design uses different ones*. This came up
  repeatedly and is probably the single most important standing preference.

## Bugs found and fixed along the way (worth knowing about)

- **Flexbox "automatic minimum size" trap**: a flex item with
  `flex: 0 0 200px` was rendering at ~334px on mobile because a child had
  `white-space: nowrap`, and flex items don't shrink below their content's
  min-content size unless you set `min-width: 0` on the item. Fixed in the
  mobile nav-item rule in `projects.css`.
- **`hidden` attribute silently defeated by an author `display` rule**: any
  element that both uses the native `hidden` attribute *and* has its own
  CSS `display` declaration needs an explicit `[hidden] { display: none }`
  override, because equal-specificity + later-in-cascade means your own
  `display` wins over the browser's default `[hidden]{display:none}`. This
  bit `.projects-gallery-placeholder`, `.projects-thumb-placeholder`, and
  (proactively fixed before it ever misfired) `.resume-canvas`.
- **Hero overflow after the navbar change**: `.hero` on Home had its own
  independent `min-height: 100vh`; once the new universal header added
  `padding-top` to `.page`, that stacked to ~80px of page overflow on every
  load. Fixed to `calc(100vh - var(--header-height))`.
- Whenever real images/content replace a placeholder, **actually load the
  page and look** — several of the above were invisible in earlier
  "it built successfully" checks and only surfaced once verified in a real
  (headless) browser.

## How I've been verifying changes (no project test suite exists)

There's no test suite. The pattern I've used all session: `npm run dev` (or
a one-off `npx eleventy --serve --port <N>`), then temporarily
`npm install --no-save playwright` (never committed, always
`rm -rf node_modules/playwright*` + `npm prune` afterward — check
`git status --short` shows a clean diff before committing), drive a headless
Chromium through the actual interaction (click nav items, resize viewport,
check `naturalWidth`/`scrollHeight` on real elements, screenshot and *look
at the screenshot*), and check console/network for errors. This caught every
bug listed above — a "clean build" alone did not.

## Known open items / not-yet-done

- **Résumé PDF is still the placeholder `cv.pdf`** — user said they'll swap
  in an updated one later (there's an updated one visible in the Claude
  Design project's `uploads/` folder, not yet pulled in — don't assume it's
  the same content).
- **Most projects still have placeholder images** — only `cycling` (project
  02, real images pulled from GitHub) and the achievements have real photos.
  The other project folders (`schedule`, `rail`, `airbnb`, `rose`, `expense`,
  `flight`, `job`) each have a `notes.txt` telling the user exactly what
  filenames to drop in.
- **Project GitHub/Live links are still mostly `"#"` placeholders** — only
  `cycling`'s GitHub link is real.
- **Hobby carousel photos** (About Me) are all placeholders —
  `src/assets/images/hobbies/<hiking|football|travel|horseriding|gym>.jpg`,
  none uploaded yet.
- **`src/internship.html` exists but isn't in the nav** — orphaned page with
  generic placeholder content, was never part of the redesign work. Unclear
  if the user still wants it.
- Nothing has been deployed to sinners.be during this session — every change
  described here is committed to `main` and pushed to GitHub, but the user
  deploys manually via FileZilla whenever they choose to. **Don't assume the
  live site matches `main`.**

## Working conventions this user has reinforced repeatedly

- Confirm structural/cross-cutting changes with a short plan before touching
  many files (used `EnterPlanMode` for both the original full redesign and
  the sidebar→navbar migration); small/contained fixes are fine to just do.
- Don't add scope beyond what's asked, but do flag (briefly, at the end)
  anything adjacent worth knowing — e.g. a stray bug, a hardcoded color that
  should be a token, an orphaned file.
- After any visual/interactive change, actually verify it in a real browser
  before saying it's done, not just "the build succeeded."
