<p align="center">
  <img src="https://global.media.stux.design/logo.png" height="100" alt="Stux.Design Logo">
</p>

# Stux.Design Services

### *Every Stux.Design service, in one place.*

[Stux.Design Services](https://services.stux.design) is a small, static, no-build-step website that
indexes what the Stux.Design studio offers (brand identities, logos and icons, colour and type
systems, brand assets) and the template pages behind its sites, each linking out to its own
repository or a way to get in touch. It's built the same way as the other Stux.Group listing sites,
in Stux.Design magenta (`#e71081`), with the hero drawn as a designer's artboard: layout grid, ruler
ticks, a selection box and a strip of the brand colours the studio has drawn.

- Plain HTML, CSS and JavaScript: no framework, no bundler, no dependencies to install
- **Live status** on each card, read from [status.stux.design](https://status.stux.design)
  (`StuxDesign/Status`, powered by [GitHup](https://githup.stux.group))
- **Seasonal overlays** from [SeasonalOverlaysLibrary](https://seasonaloverlayslibrary.stuxapis.net)
  (StuxAPIs): today's preset plays once per visit (never with reduced motion), and the hero button
  replays it
- Deployed to [GitHub Pages](https://pages.github.com/) by `.github/workflows/pages.yml`
- No accounts, no ads, no cookies, no tracking scripts

---

## Services listed here

| Service | What it is | Site | Repo |
|---|---|---|---|
| Stux.Design | The design studio itself | [stux.design](https://stux.design) | private |
| Stux.Design Status | Live status and uptime history of every Stux.Design site | [status.stux.design](https://status.stux.design) | [StuxDesign/Status](https://github.com/StuxDesign/Status) |
| Brand identities | A brand's whole look: mark, colours, type and the rules for using them | [hello@stux.design](mailto:hello@stux.design) | — |
| Logos & icons | Logos, wordmarks and app icons, with light and dark variants | [hello@stux.design](mailto:hello@stux.design) | — |
| Colour & type systems | Accent colours and typefaces that work on light and dark | [hello@stux.design](mailto:hello@stux.design) | — |
| Brand assets & badges | Badges, social images, favicons and exported brand files | [hello@stux.design](mailto:hello@stux.design) | — |
| Soonpage | "Coming soon" page template | [soonpage.stux.design](https://soonpage.stux.design) | [StuxDesign/soonpage](https://github.com/StuxDesign/soonpage) |
| Maintenancepage | Maintenance page template | [maintenancepage.stux.design](https://maintenancepage.stux.design) | [StuxDesign/maintenancepage](https://github.com/StuxDesign/maintenancepage) |
| Servicepage | Placeholder for services not yet set up | [servicepage.stux.design](https://servicepage.stux.design) | [StuxDesign/servicepage](https://github.com/StuxDesign/servicepage) |

This table (and the matching cards on the site) is the source of truth for what's listed. Update
both together when a service is added, retired or renamed. Each card shows one badge above its
description: Discontinued, Template, Maintenance or Coming soon (from `data-state`, in that order of
precedence), otherwise a live Online / Degraded / Offline badge when it has a `data-monitor`
(`stuxdesign:<slug>`) matching a monitor slug in `StuxDesign/Status`'s `.githup.yml`. Studio
services have no badge: they're work the studio takes on, not sites to monitor.

## Local development

```
./dev-server.sh          # http://127.0.0.1:8080, DEV_MODE forced on
./dev-server.sh 3000 --no-dev-mode
```

On Windows, use `dev-server.bat` instead. No `npm install` needed: the dev server is a single
dependency-free Node script (`dev-server.js`); Node just needs to be installed. See
[CONTRIBUTING.md](CONTRIBUTING.md) for more.

## Releasing

1. Update `CHANGELOG.md`
2. Bump `VERSION.md`
3. Update this README if relevant
4. Run `./commit.sh` (or `commit.bat`): it reads `VERSION.md`, commits, and tags `vX.Y.Z`
5. `git push origin main --tags`; the release workflow then publishes a GitHub Release from the
   matching `CHANGELOG.md` section

## License

&copy; 2026 Stux.Group. All rights reserved. This repository is not licensed for reuse or
redistribution. Lato and Poppins (`assets/fonts/`) are under the SIL Open Font License.

---

*Designed with purpose. | Part of the Stux.Group Brand of Companies.*

Stux.Design is operated by **Stux Group Ltd**, a company registered in England and Wales (company no. 13160574), registered office 82a James Carter Road, Mildenhall, England, IP28 7DE.
