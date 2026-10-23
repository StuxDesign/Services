#!/usr/bin/env python3
"""Write the shared <head> block into every page: the favicon set and the Discord component embed.

Run from anywhere: python scripts/build-head.py   (add --check to only report pages that are stale)
Each page gets one block between the BEGIN/END markers below; re-running rewrites it in place.
The Discord embed (https://docs.discord.com/developers/link-previews/component-embeds) is left out
of the 404 page and the /changelog/ redirect stub, and is replaced by a comment if it would be
over Discord's 3,000-byte limit. The tests in tests/head.py check every page.

Copyright (c) 2026 Stux.Group. All Rights Reserved.
"""
import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE_URL = "https://" + (ROOT / "CNAME").read_text(encoding="utf-8").strip()
SITE = "Stux.Design Services"
COLOUR = "#e71081"          # the brand magenta (--accent)
MAX_BYTES = 3000
BEGIN, END = "<!-- head:begin (scripts/build-head.py) -->", "<!-- head:end -->"
NO_EMBED = {"404.html", "changelog/index.html"}
ICON = BASE_URL + "/assets/img/icon.png"

FAVICON_TAGS = [
    '<link rel="icon" href="/favicon.ico" sizes="48x48">',
    '<link rel="icon" type="image/png" sizes="512x512" href="/assets/img/icon-512.png">',
    '<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
    '<link rel="manifest" href="/site.webmanifest">',
]


def discord_md(s):
    """Escape Discord markdown so data shows as plain text."""
    s = re.sub(r"([\\*_~`|\[\]])", r"\\\1", s)
    return re.sub(r"(?m)^([#>-])", r"\\\1", s)


def text(c):
    return {"type": 10, "content": c}


def buttons(links):
    return {"type": 1, "components": [
        {"type": 2, "style": 5, "label": label[:80], "url": url} for label, url in links]}


def section(md):
    return {"type": 9, "components": [text(md)], "accessory": {"type": 11, "media": {"url": ICON}}}


def payload(components):
    data = {"component": {"type": 17, "accent_color": int(COLOUR[1:], 16), "components": components}}
    js = json.dumps(data, separators=(",", ":"), ensure_ascii=False).replace("</", "<\/")
    return None if len(js.encode("utf-8")) > MAX_BYTES else js


def embed(components):
    js = payload(components)
    if js is None:
        return "<!-- discord:component-embed left out: over %d bytes -->" % MAX_BYTES
    return '<script id="discord:component-embed" type="application/json">%s</script>' % js


def label():
    return "-# [%s](%s/)\n" % (discord_md(SITE), BASE_URL)


def components_for(path, title, desc):
    url = BASE_URL + path
    if path == "/":
        return [
            section("# [Stux.Design Services](%s/)\n**Every Stux.Design service in one place.**\n"
                    "Brand identities, logos and icons, colour and type systems, brand assets and badges, "
                    "plus the Soonpage, Maintenancepage and Servicepage templates." % BASE_URL),
            {"type": 14},
            text("### Services\n[Stux.Design](https://stux.design) · [Status](https://status.stux.design) · "
                 "[Soonpage](https://soonpage.stux.design)"),
            buttons([("Browse services", BASE_URL + "/"), ("Live status", "https://status.stux.design"),
                     ("Stux.Design", "https://stux.design")]),
        ]
    return [
        section(label() + "## [%s](%s)\n%s" % (discord_md(title), url, discord_md(desc))),
        buttons([("Open", url), ("All services", BASE_URL + "/")]),
    ]


def pages():
    for p in sorted(ROOT.rglob("*.html")):
        rel = p.relative_to(ROOT).as_posix()
        if rel.split("/")[0] in {"node_modules", ".git", "_site"}:
            continue
        yield p, rel


def url_path(rel):
    if rel == "index.html":
        return "/"
    if rel.endswith("/index.html"):
        return "/" + rel[: -len("index.html")]
    return "/" + rel


def build_block(rel, src):
    title = re.search(r"<title>(.*?)</title>", src, re.S)
    title = html.unescape(title.group(1)).strip() if title else SITE
    desc = re.search(r'<meta name="description" content="([^"]*)"', src)
    desc = html.unescape(desc.group(1)) if desc else ""
    short = title.split(" — ")[0] if rel != "index.html" else SITE
    lines = [BEGIN] + FAVICON_TAGS
    if rel not in NO_EMBED:
        lines.append(embed(components_for(url_path(rel), short, desc)))
    lines.append(END)
    return lines


def apply(src, rel):
    m = re.search(r"^([ \t]*)<head>[ \t]*\n", src, re.M)
    if not m:
        raise SystemExit("no <head> in " + rel)
    src = re.sub(r"[ \t]*" + re.escape(BEGIN) + r".*?" + re.escape(END) + r"[ \t]*\n", "", src, flags=re.S)
    indent = re.search(r"^([ \t]*)<meta charset", src, re.M)
    indent = indent.group(1) if indent else ""
    block = "".join(indent + l + "\n" for l in build_block(rel, src))
    # right after the viewport meta, so the icons sit with the other head metadata
    vp = re.search(r"^[ \t]*<meta name=\"viewport\"[^\n]*\n", src, re.M)
    pos = vp.end() if vp else re.search(r"^[ \t]*<head>[ \t]*\n", src, re.M).end()
    return src[:pos] + block + src[pos:]


def main():
    check = "--check" in sys.argv
    stale = 0
    for p, rel in pages():
        src = p.read_text(encoding="utf-8")
        new = apply(src, rel)
        if new != src:
            stale += 1
            if check:
                print("stale:", rel)
            else:
                p.write_text(new, encoding="utf-8", newline="\n")
                print("wrote", rel)
    sys.exit(1 if check and stale else 0)


if __name__ == "__main__":
    main()
