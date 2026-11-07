<p align="center">
  <picture><source media="(prefers-color-scheme: dark)" srcset="https://global.media.stux.design/logo-light.png"><source media="(prefers-color-scheme: light)" srcset="https://global.media.stux.design/logo-dark.png"><img src="https://global.media.stux.design/logo-dark.png" height="80" alt="Stux.Design Logo"></picture>
</p>

# Contributing to Stux.Design Services

Stux.Design Services is a Stux.Design project, part of the Stux.Group Brand of Companies. The repository isn't open to public pull requests,
and per the [License](README.md#license) section it isn't licensed for redistribution or reuse.
This document exists for anyone with write access working on it consistently.

Questions: [hello@stux.design](mailto:hello@stux.design).

## Local setup

```
git clone https://github.com/StuxDesign/Services.git
cd Services
./dev-server.sh
```

No install step: there's no `package.json`, no dependencies, nothing to build. `dev-server.js` is
a single dependency-free Node script; the only requirement is having Node itself installed. Pass
`--no-dev-mode` to test the site as it behaves in production (no dev banner).

## Project conventions

- **Plain HTML/CSS/JS, no framework, no build step.** Every page is a real `.html` file: no
  templating engine, no client-side router. The layout follows
  [StuxieDev Projects](https://github.com/StuxieDev/Projects), recoloured in Stux.Design magenta
  (`#e71081`, with a `#ff6fbd` tint for text on dark). The Stux.Design twist (the hero's artboard
  grid, rulers, selection box and swatch strip, and the cards' crop marks) is the "Artboard"
  block at the end of `style.css`; keep it to the hero and cards.
- The sitemap (`sitemap.xml`, `sitemap/index.html`, `robots.txt`) is generated: after adding or removing a page, edit the `PAGES` list in `scripts/build-sitemap.py` and run `python scripts/build-sitemap.py`, then commit the result. Add new root files to the copy step in `.github/workflows/pages.yml`.
- Clean URLs use a folder-per-page layout (`legal/privacy/index.html` → `/legal/privacy/`).
- Shared styles live in `assets/css/style.css`; shared behaviour in `assets/js/main.js`. Copy the
  existing header/footer block when adding a page rather than introducing a templating system.
- `assets/js/dev-mode.js` is the production default (`DEV_MODE = false`), committed as-is.
  `dev-server.js` intercepts that one path locally and serves a generated version instead.
- **Icons are self-hosted** in `assets/img/services/`. A service with a logo of its own uses it,
  resized to 128 × 128, from its `global.media.<domain>/icon.png` or its repo. One without gets a
  256 × 256 badge icon from `scripts/badge-icons.py` (see Before committing).
- **Only three things load from elsewhere**: the favicons and footer logo from Stux.Design's own
  media CDN (`global.media.stux.design`), live status from
  `raw.githubusercontent.com/StuxDesign/Status` (Stux.Design's own) and SeasonalOverlaysLibrary
  from `seasonaloverlayslibrary.stuxapis.net` (StuxAPIs). If you add another, update the Privacy Policy.

## Adding or retiring a service card

The services list has three sections, in this order: **Featured**, **Studio** and
**Templates** (add **Discontinued** after them if anything is ever retired). Studio cards are the
services the studio offers: they have no badge and link to an email enquiry. A placeholder-page
template goes under Templates with `data-state="template"`, and an archived or replaced
repository goes under Discontinued.

1. Add/update the entry in the README's services table
2. Add/update the matching `<article class="project-card">` block in `index.html`. For a service
   that belongs to another brand, add `<div class="owner">Brand</div>` above the name
3. **One badge per card**, above the description (`<span class="badge-status ...">` before
   `<p class="desc">`). Declare the state on the `<article>` with `data-state="discontinued"`,
   `"template"`, `"maintenance"` or `"soon"` and render the matching badge in the HTML (e.g.
   `<span class="badge-status soon"><i class="badge-ico" aria-hidden="true"></i>Coming soon</span>`;
   Maintenance uses the `maintenance` class and the same icon element). If several states are
   listed, the first that applies wins: Discontinued, Template, Maintenance, Coming soon
4. **Live status:** with no `data-state`, a card with `data-monitor="<slug>"` (`stuxdesign:<slug>`, a slug monitored by
   `StuxDesign/Status`; the bare form defaults to the `stuxdesign` source) gets one live badge from `main.js`: Online, Degraded or Offline. Add
   `<span class="badge-status live" hidden></span>` above the description; don't hard-code a
   "Live" badge, because it can't be kept accurate. No monitor, or status unavailable: no badge
5. When a service is discontinued, move its card into "Discontinued", add the `discontinued`
   class and `data-state="discontinued"`, drop any dead Website link, and add a one-line `<p class="discontinued-note">` saying why
6. Update the hero's counts if they changed
7. To add a brand colour the studio has drawn, add a `.swatch` to the hero's swatch strip

## Hero eyebrow (live status)

The pill above the hero headline is a link to status.stux.design marked `data-status-eyebrow="stuxdesign:*"` (the
whole status page; `<source>:<slug>` would follow one monitor). `main.js` fills it from the same `summary.json` fetch
as the card badges, so there's no second request: it takes a status badge's colour (green, amber for degraded or
partial, red) and dot (pulsing when up, still with `prefers-reduced-motion`), hides `.eyebrow-brand`, and shows only
the state in `.eyebrow-state`: All operational, Degraded, Partial outage or Major outage (Online, Degraded or Offline
for one monitor). It keeps the eyebrow's size and shape. If the status can't load, nothing changes and it reads
Stux.Design as before. Keep both spans.

## Seasonal overlays

`main.js` asks SeasonalOverlaysLibrary for today's preset from its calendar. It plays once per
browser session (a `sessionStorage` flag), never on its own for people with
`prefers-reduced-motion`, and the hero button (labelled with today's preset) replays it. If the
library can't load, the button stays hidden and nothing else changes.

## Legal pages

All six live under `legal/` (`privacy`, `terms`, `cookies`, `imprint`, `disclaimer`, `opt-out`),
each its own folder with an `index.html`, linked from the **Boring Legal Stuff** hub at
`legal/index.html`. Keep them in sync with what the site actually does.

## Branches

- Work on `test`, or on a feature branch off it. Never push to `main`
- Changes reach `main` only through a pull request from `test` into `main`, which needs CI to pass and is reviewed and merged by Leo
- Merging into `main` deploys the site to GitHub Pages; release commits and tags are made on `test` (`git push origin test --tags`) and go live when the pull request is merged

## Versioning

This project uses [Date Versioning](https://datevers.ing). To release:

1. Add a `## vYY.MM.DD` entry at the top of `CHANGELOG.md`, with its sections in this order: Added, Changed, Fixed, Removed, Security, Deprecated.
2. Set `VERSION.md` to the same bare version (no `v`): today's **UTC** date as `YY.MM.DD`, or `YY.MM.DD-1`, `-2`… for later releases the same UTC day. Never a future date. Use UTC, not local time: just after midnight in the UK it is still the previous day in UTC.
3. Run `bash tests/version.sh`.
4. Run `./commit.sh` (or `commit.bat` on Windows). It checks the version, commits and tags `vYY.MM.DD`, and never pushes.

## Page head block

The favicon tags and Discord embed in every page's `<head>` sit between `head:begin` and `head:end` comments and are generated: after adding or retitling a page, run `python scripts/build-head.py`, then `python tests/head.py` and `node tests/changelog.js`. Add new root files to the copy step in `.github/workflows/pages.yml`.

## Before committing

- Open changed pages via `./dev-server.sh` and click through: CI checks files and local links,
  but a live look is the only real check of how it renders
- Check both the dev-mode banner (default) and `--no-dev-mode` if you touched `dev-server.js` or
  `assets/js/dev-mode.js`
- Only link a repository if it is public: no "Repository" link on a card for a private or missing repo. Run `scripts/check-repo-links.sh` (needs `gh`) to list linked repos that are not public
- Give every card its full name, in its heading and its icon's alt text ("Stux.Design Status", not "Status"), and its own icon, never a shared or generic one. A service without a logo of its own gets a badge-style icon (the Stux.Design mark on a round avatar, with a badge saying what the service is) from `python -I scripts/badge-icons.py stux-design <icon-light.png> assets/img/services`, using https://global.media.stux.design/icon-light.png; add a glyph and file name there for a new one
