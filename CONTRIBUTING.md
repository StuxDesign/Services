<p align="center">
  <img src="https://global.media.stux.design/logo.png" height="80" alt="Stux.Design Logo">
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
- **Icons are self-hosted** in `assets/img/services/`, resized to 128 × 128. Take them from the
  service's own `global.media.<domain>/icon.png` or its repo.
- **Only two things load from elsewhere**: live status from
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

## Seasonal overlays

`main.js` asks SeasonalOverlaysLibrary for today's preset from its calendar. It plays once per
browser session (a `sessionStorage` flag), never on its own for people with
`prefers-reduced-motion`, and the hero button (labelled with today's preset) replays it. If the
library can't load, the button stays hidden and nothing else changes.

## Legal pages

All six live under `legal/` (`privacy`, `terms`, `cookies`, `imprint`, `disclaimer`, `opt-out`),
each its own folder with an `index.html`, linked from the **Boring Legal Stuff** hub at
`legal/index.html`. Keep them in sync with what the site actually does.

## Versioning and changelog

- The version lives in `VERSION.md` (a bare version string); bump it on every release
- Every release gets a `CHANGELOG.md` entry using `###` subsections in this order: Added,
  Changed, Fixed, Removed, Security, Deprecated. Never a bare bullet list under a version
- `commit.sh` (bash) and `commit.bat` (Windows) read `VERSION.md` and handle the commit and
  `git tag`; the release workflow publishes a GitHub Release when the tag is pushed

## Before committing

- Open changed pages via `./dev-server.sh` and click through: CI checks files and local links,
  but a live look is the only real check of how it renders
- Check both the dev-mode banner (default) and `--no-dev-mode` if you touched `dev-server.js` or
  `assets/js/dev-mode.js`
- Only link a repository if it is public: no "Repository" link on a card for a private or missing repo. Run `scripts/check-repo-links.sh` (needs `gh`) to list linked repos that are not public
