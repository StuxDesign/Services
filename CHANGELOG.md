# Changelog

All notable changes to Stux.Design Services (services.stux.design) are documented here. This
project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
