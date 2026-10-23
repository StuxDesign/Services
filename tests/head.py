#!/usr/bin/env python3
"""Checks every page's <head>: the favicon set and the Discord component embed.

Run with: python tests/head.py
"""
import importlib.util
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("build_head", ROOT / "scripts" / "build-head.py")
bh = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bh)

ALLOWED = {1, 2, 9, 10, 11, 12, 14, 17}
BUTTON_KEYS = {"id", "type", "url", "style", "label", "emoji", "disabled"}
SCRIPT = re.compile(r'<script id="discord:component-embed" type="application/json">(.*?)</script>', re.S)


def walk(components):
    for c in components:
        yield c
        yield from walk(c.get("components", []))


class HeadTest(unittest.TestCase):
    def pages(self):
        return list(bh.pages())

    def test_every_page_has_the_favicon_tags(self):
        for p, rel in self.pages():
            src = p.read_text(encoding="utf-8")
            for tag in bh.FAVICON_TAGS:
                self.assertIn(tag, src, rel)

    def test_pages_are_up_to_date(self):
        for p, rel in self.pages():
            src = p.read_text(encoding="utf-8")
            self.assertEqual(bh.apply(src, rel), src, rel + " is stale: run scripts/build-head.py")

    def test_embed_rules(self):
        for p, rel in self.pages():
            src = p.read_text(encoding="utf-8")
            m = SCRIPT.search(src)
            if rel in bh.NO_EMBED:
                self.assertIsNone(m, rel + " must not have an embed")
                continue
            self.assertIsNotNone(m, rel)
            self.assertLess(len(m.group(1).encode("utf-8")), 3000, rel)
            root = json.loads(m.group(1))["component"]
            self.assertEqual(root["type"], 17, rel)
            comps = list(walk(root["components"]))
            self.assertLessEqual(len(comps) + 1, 40, rel)
            for c in comps:
                self.assertIn(c["type"], ALLOWED, rel)
                if c["type"] == 2:
                    self.assertEqual(c["style"], 5)
                    self.assertLessEqual(set(c), BUTTON_KEYS)
                    self.assertRegex(c["url"], r"^https?://")
            self.assertNotIn("$1", m.group(1), rel)

    def test_markdown_is_escaped_and_script_cannot_close(self):
        self.assertEqual(bh.discord_md(r"a*b_c [x] `y` \ ~|"), r"a\*b\_c \[x\] \`y\` \\ \~\|")
        self.assertEqual(bh.discord_md("# h\n> q\n- l"), "\\# h\n\\> q\n\\- l")
        tag = bh.embed([bh.text("</script><b>")])
        self.assertEqual(tag.count("</script>"), 1)

    def test_oversized_embed_is_left_out(self):
        self.assertTrue(bh.embed([bh.text("x" * 3100)]).startswith("<!-- discord:component-embed left out"))

    def test_manifest_and_icons(self):
        man = json.loads((ROOT / "site.webmanifest").read_text(encoding="utf-8"))
        self.assertEqual(man["start_url"], "/")
        self.assertEqual(man["display"], "browser")
        self.assertTrue(any(i.get("purpose") == "maskable" and i["sizes"] == "512x512" for i in man["icons"]))
        for i in man["icons"]:
            self.assertTrue((ROOT / i["src"].lstrip("/")).is_file(), i["src"])
        ico = (ROOT / "favicon.ico").read_bytes()
        self.assertEqual(ico[:4], b"\x00\x00\x01\x00")
        self.assertEqual(ico[4], 3)


if __name__ == "__main__":
    unittest.main()
