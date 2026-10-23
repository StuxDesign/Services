# Changelog

All notable changes to Stux.Design Services (services.stux.design) are documented here. This
project adheres to [Date Versioning](https://datevers.ing) since v26.10.23 (`YY.MM.DD`, the UTC release date, with `-1`, `-2`… for later releases the same day); earlier releases used [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## v26.10.23

### Added

- A full favicon set at the site root: `favicon.ico` (16, 32 and 48px), `apple-touch-icon.png` (180px), and `site.webmanifest` with 192px, 512px and maskable 512px icons, linked from every page
- A Discord link preview (a component embed) on every page except the 404 page and the old `/changelog/` redirect: the home page says what the site is and links to the main services; other pages show their name, description and an Open button. Open Graph tags are unchanged
- `scripts/build-head.py`, which writes the favicon tags and the Discord embed into each page's `<head>`, and `tests/head.py` and `tests/changelog.js`, which check them and the changelog renderer
- `tests/version.sh`, which checks that `VERSION.md` is a valid Date Version, a real calendar date not in the future, and the same as the newest entry in this changelog

### Changed

- Switched from Semantic Versioning to [Date Versioning](https://datevers.ing): releases are numbered by their UTC release date as `YY.MM.DD`, with `-1`, `-2`… for later releases the same day. This release follows v1.2.0
- `commit.sh` and `commit.bat` refuse a `VERSION.md` that isn't a valid Date Version or is dated in the future (UTC), and warn when it's dated before today
- `README.md` and `CONTRIBUTING.md` describe Date Versioning and the release steps
- The CI version check and the changelog page's version badge accept Date Versions (`YY.MM.DD` and `YY.MM.DD-N`), and the dev server serves `.webmanifest` correctly
- `scripts/build-sitemap.py` keeps each generated page's head block in step

## v1.2.0

### Added

- A light/dark toggle at the end of the header on every page, like the brand pages': it shows the theme it switches to (a sun on dark, a moon on light). Until it's used the site follows the system theme; after that the choice is remembered in this browser, and a picked brand colour re-adapts to the new theme

## v1.1.2

### Changed

- The favicon follows the browser's light or dark theme: the deep icon (`icon-dark.png`) on light and the bright one (`icon-light.png`) on dark, straight from the brand's media host instead of a local copy, so a brand colour change is just a new file there
- The logos and icons in the Markdown docs (README and the like) follow GitHub's light or dark theme, using each brand's `logo-light`/`logo-dark` and `icon-light`/`icon-dark` files

### Fixed

- The changelog page's section badges switch to their deeper light-theme colours when the light theme comes from the system preference, not only when it's set explicitly

## v1.1.1

### Changed

- The favicon follows the browser's light or dark theme: the deep icon (`icon-dark.png`) on light and the bright one (`icon-light.png`) on dark, straight from the brand's media host instead of a local copy, so a brand colour change is just a new file there
- The logos and icons in the Markdown docs (README and the like) follow GitHub's light or dark theme, using each brand's `logo-light`/`logo-dark` and `icon-light`/`icon-dark` files

### Fixed

- The changelog page's section badges switch to their deeper light-theme colours when the light theme comes from the system preference, not only when it's set explicitly

## v1.1.0

### Added

- A light theme, following the system preference: a soft pink-white page with Stux.Design magenta deepened to `#c20c6c` so text and links stay readable (5.5:1 or better). The dark theme is unchanged, and the site banner now follows the theme too
- The brand swatches in the hero are buttons: click one to see the whole site in that brand's colour, with a lighter tint for text on dark, a deeper shade on light, and dark or white button text, whichever reads better. The pick is remembered in this browser across pages, and "Back to Stux.Design magenta" (or the magenta swatch) resets it
- Stux.Design itself is listed first under Featured, ahead of Status, with a live status badge and links to stux.design and a way to start a project

## v1.0.1

### Fixed

- The footer's copyright line names Stux.Design instead of Stux.Group ("© 2026 Stux.Design. All rights reserved."), matching the brand the site belongs to. The legal pages' statement that the names and logos belong to Stux.Group is unchanged

## v1.0.0

### Added

- The Stux.Design services site: Status, the studio's four services (brand identities, logos & icons, colour & type systems, brand assets & badges) and the soonpage, maintenancepage and servicepage templates, built like the other Stux.Group listing sites in Stux.Design magenta (`#e71081`)
- The Stux.Design artboard: the hero sits on a layout grid with ruler ticks, the highlighted words get a selection box with handles, a swatch strip shows the brand colours the studio has drawn, and cards show crop marks on hover
- Live status on cards from [status.stux.design](https://status.stux.design), and seasonal overlays from SeasonalOverlaysLibrary (StuxAPIs)
- The Boring Legal Stuff hub with its six pages, a changelog page, sitemap, 404 page and `dev-server.sh`/`.bat` with DEV_MODE on by default (`--no-dev-mode` to opt out)
