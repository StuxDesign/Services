(function () {
  // Dev-only banners in the shared site-banner component (dev-server.js forces DEV_MODE on);
  // ?banner=soon,maintenance,site previews the other styles.
  if (window.DEV_MODE) {
    var copy = {
      maintenance: ["Maintenance", "Stux.Design Services is being updated and will be back shortly."],
      soon: ["Coming soon", "Stux.Design Services is launching soon."],
      dev: ["Dev mode", "Local preview of Stux.Design Services. Run <code>dev-server.sh --no-dev-mode</code> to see it as production does."],
      site: ["Notice", "A site notice for Stux.Design Services appears here."]
    };
    var want = (new URLSearchParams(location.search).get("banner") || "").split(",");
    var box = document.createElement("div");
    box.className = "site-banners";
    box.setAttribute("data-site-banners", "");
    ["maintenance", "soon", "dev", "site"].forEach(function (v) {
      if (v !== "dev" && want.indexOf(v) < 0) return;
      var d = document.createElement("div");
      d.className = "site-banner site-banner--" + v;
      d.setAttribute("role", "note");
      d.innerHTML = '<span class="site-banner-label"></span><span class="site-banner-text">' + copy[v][1] + "</span>";
      d.firstChild.textContent = copy[v][0];
      box.appendChild(d);
    });
    document.body.insertBefore(box, document.body.firstChild);
    document.documentElement.classList.add("has-site-banner");
    var bs = document.createElement("script");
    bs.src = "/assets/js/site-banner.js";
    document.body.appendChild(bs);
  }

  var yearEls = document.querySelectorAll("[data-year]");
  var year = new Date().getFullYear();
  // Copyright ranges: data-year-start is the year of the repo's first commit,
  // rendered as "start–current", or just the year while they're the same.
  yearEls.forEach(function (el) {
    var start = parseInt(el.getAttribute("data-year-start"), 10);
    el.textContent = start && start < year ? start + "–" + year : year;
  });

  // One badge per card, above the description. data-state holds the card's
  // declared state(s); the first that applies wins (discontinued, template,
  // maintenance, soon). The HTML already renders it, so this only re-resolves
  // a card with several states. With no state, the live status from
  // the status pages named by data-monitor="<slug>" or "<source>:<slug>" fill the badge,
  // and nothing is shown if it can't load.
  var STATES = [
    ["discontinued", "archived", "Discontinued"], ["template", "template", "Template"],
    ["maintenance", "maintenance", "Maintenance"], ["soon", "soon", "Coming soon"]
  ];
  function stateOf(card) {
    var have = (card.getAttribute("data-state") || "").split(/\s+/);
    for (var i = 0; i < STATES.length; i++) if (have.indexOf(STATES[i][0]) !== -1) return STATES[i];
    return null;
  }
  function badgeOf(card) {
    var badge = card.querySelector(":scope > .badge-status");
    if (!badge) {
      badge = document.createElement("span");
      badge.hidden = true;
      var desc = card.querySelector(".desc");
      card.insertBefore(badge, desc);
    }
    return badge;
  }
  document.querySelectorAll(".project-card").forEach(function (card) {
    var st = stateOf(card);
    if (!st) return;
    var badge = badgeOf(card);
    badge.className = "badge-status " + st[1];
    badge.textContent = "";
    var ico = document.createElement("i");
    ico.className = "badge-ico";
    ico.setAttribute("aria-hidden", "true");
    badge.appendChild(ico);
    badge.appendChild(document.createTextNode(st[2]));
    badge.hidden = false;
  });
  // Live status sources: data-monitor="<slug>" reads the Stux.Design Status page,
  // data-monitor="<source>:<slug>" reads another status page's summary.json.
  var RAW = "https://raw.githubusercontent.com/";
  var SOURCES = {
    "stuxdesign": { url: RAW + "StuxDesign/Status/main/data/summary.json", site: "status.stux.design" }
  };
  var DEFAULT_SOURCE = "stuxdesign";
  var PILL = { up: "Online", degraded: "Degraded", down: "Offline" };
  var WHOLE = { up: "All operational", degraded: "Degraded", partial: "Partial outage", down: "Major outage" };
  var OVERALL = {
    up: "All systems operational", degraded: "Degraded performance",
    partial: "Partial outage", down: "Major outage"
  };
  function monitorOf(card) {
    var v = card.getAttribute("data-monitor") || "";
    var i = v.indexOf(":");
    return i < 0 ? { source: DEFAULT_SOURCE, slug: v } : { source: v.slice(0, i), slug: v.slice(i + 1) };
  }
  function loadSummary(source) {
    return fetch(SOURCES[source].url + "?t=" + Date.now(), { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); });
  }
  var wanted = {};
  document.querySelectorAll("[data-monitor]").forEach(function (card) {
    var m = monitorOf(card);
    if (SOURCES[m.source]) wanted[m.source] = true;
  });
  wanted[DEFAULT_SOURCE] = true; // the page-wide status band
  Object.keys(wanted).forEach(function (source) {
    loadSummary(source).then(function (summary) {
      var bySlug = {};
      (summary.monitors || []).forEach(function (m) { bySlug[m.slug] = m; });
      document.querySelectorAll("[data-monitor]").forEach(function (card) {
        var want = monitorOf(card);
        if (want.source !== source) return;
        // "<source>:*" is the status page's overall status (used by the Status card).
        var m = want.slug === "*" ? { status: summary.status } : bySlug[want.slug];
        if (stateOf(card) || !m || !(want.slug === "*" ? WHOLE[m.status] : PILL[m.status])) return;
        var badge = badgeOf(card);
        badge.className = "badge-status " + (m.status === "partial" ? "degraded" : m.status);
        badge.textContent = want.slug === "*" ? WHOLE[m.status] : PILL[m.status];
        badge.title = "Live from " + SOURCES[source].site;
        badge.hidden = false;
      });
      var band = document.getElementById("status-band");
      if (source === DEFAULT_SOURCE && band && OVERALL[summary.status]) {
        band.className = "status-band " + summary.status;
        band.querySelector("h2").textContent = OVERALL[summary.status];
        var n = (summary.monitors || []).length;
        band.querySelector("p").textContent = n + " services checked every 5 minutes by GitHup.";
      }
    }).catch(function () {});
  });

  // Seasonal overlays: SeasonalOverlaysLibrary (StuxAPIs) plays today's preset
  // from its seasonal calendar. It plays once per visit on its own (never for
  // people who ask for reduced motion), and the hero button replays it.
  var lib = window.SeasonalOverlaysLibrary;
  if (!lib) return;
  var LABEL = {
    fireworks: "\uD83C\uDF86 Fireworks", hearts: "\u2764\uFE0F Hearts", stpatricks: "\uD83C\uDF40 Shamrocks",
    eastereggs: "\uD83E\uDD5A Easter eggs", rainbows: "\uD83C\uDF08 Pride rainbows", sunny: "\u2600\uFE0F Sunshine",
    pumpkins: "\uD83C\uDF83 Pumpkins", skullsghosts: "\uD83D\uDC7B Spooky season", thanksgiving: "\uD83E\uDD83 Thanksgiving",
    snow: "\u2744\uFE0F Snow", christmas: "\uD83C\uDF84 Christmas", nyeve: "\uD83C\uDF89 New Year's Eve",
    leavesSpring: "\uD83C\uDF31 Spring leaves", leavesSummer: "\uD83C\uDF3F Summer leaves",
    leavesAutumn: "\uD83C\uDF42 Autumn leaves", leavesWinter: "\uD83C\uDF3E Winter leaves"
  };
  var preset = lib.resolveAutoPreset(new Date());
  var btn = document.getElementById("season-btn");
  if (btn && preset) {
    // "Pumpkins?" until the overlay is running, "Pumpkins!" while it runs. The
    // text is the button's accessible name, so it updates for assistive tech too.
    var baseLabel = (LABEL[preset] || "\u2728 Today's overlay");
    var setActive = function (on) { btn.textContent = baseLabel + (on ? "!" : "?"); };
    var running = function () { return !!document.getElementById("seasonal-overlays-container"); };
    setActive(false);
    btn.hidden = false;
    // The library has no "finished" event, so watch its container: it is added
    // when an overlay starts and removed when it ends (or is stopped).
    new MutationObserver(function () { setActive(running()); }).observe(document.body, { childList: true });
    btn.addEventListener("click", function () {
      setActive(true); // immediate, even if the overlay is skipped
      // Safety net: if nothing is running shortly after (e.g. the overlay was
      // suppressed), drop back to "?" once the default duration has passed.
      setTimeout(function () { if (!running()) setActive(false); }, 2600);
    });
  }
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var played = false;
  try { played = sessionStorage.getItem("sg-season-played") === "1"; } catch (e) {}
  if (preset && !reduced && !played) {
    setTimeout(function () { lib.auto(); }, 600);
    try { sessionStorage.setItem("sg-season-played", "1"); } catch (e) {}
  }
})();

// Footer version link: this site's own VERSION.md, published with the site. If it can't be
// read, the link keeps its fallback text ("Changelogs").
(function () {
  var links = document.querySelectorAll("[data-site-version]");
  if (!links.length || !window.fetch) return;
  fetch("/VERSION.md", { cache: "no-cache" }).then(function (r) {
    if (!r.ok) throw new Error(r.status);
    return r.text();
  }).then(function (v) {
    v = v.trim().replace(/^v/i, "");
    if (!/^\d+\.\d+\.\d+/.test(v)) return;
    Array.prototype.forEach.call(links, function (a) {
      a.textContent = "v" + v;
      a.setAttribute("title", "Version " + v + ": changelogs");
    });
  }).catch(function () {});
})();

// Brand swatches: click one to see the whole site in that brand's colour (Stux.Design's own
// magenta is the default). The pick is remembered in this browser (stuxdesign-accent) and applied
// on every page; "Back to Stux.Design magenta" or the magenta swatch clears it. On dark each colour
// gets a lighter tint for text and glows; on light it's deepened until text in it is readable
// (4.5:1). Buttons get dark or white text, whichever reads better, and a theme change re-applies it.
(function () {
  var KEY = "stuxdesign-accent";
  var DEFAULT = "#e71081";
  var root = document.documentElement;
  function rgb(hex) {
    var n = parseInt(hex.slice(1), 16);
    return [n >> 16 & 255, n >> 8 & 255, n & 255];
  }
  function hex(c) {
    return "#" + c.map(function (v) { return ("0" + Math.round(v).toString(16)).slice(-2); }).join("");
  }
  function luminance(c) {
    var l = c.map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2];
  }
  var lightMq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: light)") : null;
  function isLight() {
    var t = root.getAttribute("data-theme");
    return t ? t === "light" : !!(lightMq && lightMq.matches);
  }
  function contrast(a, b) {
    var x = luminance(a), y = luminance(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  }
  var current = null;
  function apply(color) {
    current = color;
    var names = ["--accent", "--accent-rgb", "--accent-bright", "--accent-bright-rgb", "--accent-pink", "--accent-soft", "--accent-grad", "--accent-ink"];
    if (!color || color === DEFAULT) {
      names.forEach(function (n) { root.style.removeProperty(n); });
      return;
    }
    var c = rgb(color), b;
    if (isLight()) {
      // Deepen it until text in it reads on the light page, as #c20c6c is to #e71081.
      while (contrast(c, [251, 245, 248]) < 4.5) c = c.map(function (v) { return v * 0.92; });
      color = hex(c);
      b = c.map(function (v) { return v * 0.88; });
    } else {
      // A lighter tint, as #ff6fbd is to #e71081: 45% of the way to white.
      b = c.map(function (v) { return v + (255 - v) * 0.45; });
    }
    c = c.map(Math.round);
    root.style.setProperty("--accent", color);
    root.style.setProperty("--accent-rgb", c.join(", "));
    root.style.setProperty("--accent-bright", hex(b));
    root.style.setProperty("--accent-bright-rgb", b.map(Math.round).join(", "));
    root.style.setProperty("--accent-pink", color);
    root.style.setProperty("--accent-soft", "rgba(" + c.join(", ") + ", 0.14)");
    root.style.setProperty("--accent-grad", "linear-gradient(135deg, " + hex(b) + " 0%, " + color + " 100%)");
    root.style.setProperty("--accent-ink", luminance(c) > 0.4 ? "#110c0f" : "#fff");
  }
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (saved && !/^#[0-9a-f]{6}$/.test(saved)) saved = null;
  apply(saved);
  if (lightMq) {
    var reapply = function () { apply(current); };
    if (lightMq.addEventListener) lightMq.addEventListener("change", reapply);
    else if (lightMq.addListener) lightMq.addListener(reapply);
  }

  var swatches = document.querySelectorAll(".swatch[data-accent]");
  var reset = document.getElementById("accent-reset");
  function show(color) {
    color = color || DEFAULT;
    Array.prototype.forEach.call(swatches, function (s) {
      s.setAttribute("aria-pressed", String(s.getAttribute("data-accent") === color));
    });
    if (reset) reset.hidden = color === DEFAULT;
  }
  function pick(color) {
    apply(color);
    show(color);
    try {
      if (color === DEFAULT) localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, color);
    } catch (e) {}
  }
  show(saved);
  Array.prototype.forEach.call(swatches, function (s) {
    s.addEventListener("click", function () { pick(s.getAttribute("data-accent")); });
  });
  if (reset) reset.addEventListener("click", function () { pick(DEFAULT); });
})();
