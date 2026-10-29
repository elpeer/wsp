/* WSP SEO layer — URL mapping, page metadata, breadcrumbs and JSON-LD.
   Used in the browser (window.WSPSEO) and by scripts/build.mjs for static prerendering.
   Depends on globals from data.js (P, ORDER, ARTICLES) and articles-data.js (ARTICLE_BODIES). */
(function (g) {
  const BRAND = "WSP";
  const ORG = "WSP – הקול של הספורטאיות בישראל";
  const SLUG = { pod: "podcast", hm: "fast-break", mm: "court-summary", pb: "stands", ss: "sport-talk", vid: "field" };
  const SLUG2K = Object.fromEntries(Object.entries(SLUG).map(([k, v]) => [v, k]));
  const DEFAULT_DESC = "הבמה של ספורט הנשים בישראל: הפודקאסט הרשמי, תכניות, סיקורים, ראיונות, כתבות ומצטיינות השנה מעולם הספורטאיות הישראליות.";
  const SOCIAL = ["https://www.facebook.com/WSPpodcast", "https://instagram.com/wsp.sport", "https://www.tiktok.com/@womenssportpower", "https://www.youtube.com/channel/UC6duCxv3pdUP6j7Ch6MZTAQ"];

  const items = () => {
    const out = [];
    ORDER.forEach(k => P[k].items.forEach(a => out.push({ id: a[0], ep: a[1], name: a[2], role: a[3], dur: a[4], sub: a[5] || "", p: k })));
    return out;
  };
  let _all; const ALLV = () => (_all = _all || items());
  const video = id => ALLV().find(v => v.id === id);
  const articleIndexBySlug = slug => ARTICLES.findIndex(a => a.slug === slug);

  /* ---------- keys <-> paths ---------- */
  function keyToPath(key) {
    if (!key || key === "home") return "/";
    if (key === "about-contact" || key === "about-team") return "/about";
    if (["programs", "articles", "awards", "about", "search"].includes(key)) return "/" + key;
    if (key === "p-pod") return "/podcast";
    if (key.startsWith("p-")) return "/programs/" + (SLUG[key.slice(2)] || key.slice(2));
    if (key.startsWith("v-")) return "/video/" + key.slice(2);
    if (key.startsWith("a-")) { const a = ARTICLES[+key.slice(2)]; return a ? "/articles/" + encodeURIComponent(a.slug) : "/articles"; }
    return "/";
  }
  function pathToKey(path) {
    let p = path || "/";
    try { p = decodeURIComponent(p); } catch (e) {}
    p = p.replace(/\/index\.html$/, "").replace(/\/+$/, "") || "/";
    if (p === "/") return "home";
    const seg = p.split("/").filter(Boolean);
    if (seg[0] === "podcast" && seg.length === 1) return "p-pod";
    if (seg[0] === "programs") return seg[1] ? (SLUG2K[seg[1]] ? "p-" + SLUG2K[seg[1]] : null) : "programs";
    if (seg[0] === "video" && seg[1]) return video(seg[1]) ? "v-" + seg[1] : null;
    if (seg[0] === "articles") { if (!seg[1]) return "articles"; const i = articleIndexBySlug(seg.slice(1).join("/")); return i >= 0 ? "a-" + i : null; }
    if (["awards", "about", "search"].includes(seg[0]) && seg.length === 1) return seg[0];
    return null;
  }
  const isKey = k => /^(home|programs|articles|awards|about|search|about-contact|about-team|p-.+|v-.+|a-\d+)$/.test(k);

  /* ---------- helpers ---------- */
  const ytThumb = id => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const wix = (f, w = 1200, h = 630) => `https://static.wixstatic.com/media/${f}/v1/fill/w_${w},h_${h},al_c,q_85,enc_auto/og.jpg`;
  const isoDur = d => { const t = d.split(":").map(Number); const [h, m, s] = t.length === 3 ? t : [0, t[0], t[1]]; return `PT${h ? h + "H" : ""}${m}M${s}S`; };
  const clip = (t, n = 158) => (t.length > n ? t.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : t);
  const progCrumb = k => (k === "pod" ? [["הפודקאסט", "p-pod"]] : [["תכניות", "programs"], [P[k].name, "p-" + k]]);
  const epLabel = v => (v.ep ? `פרק ${v.ep}` : (P[v.p].subs && v.sub ? P[v.p].subs[v.sub] : P[v.p].short));
  const textOfArticle = slug => {
    const b = (typeof ARTICLE_BODIES !== "undefined" && ARTICLE_BODIES[slug] && ARTICLE_BODIES[slug].b) || [];
    return b.filter(x => x.t === "p" || x.t === "h2" || x.t === "h3").map(x => x.x.replace(/\*\*|_/g, "")).join(" ");
  };

  /* ---------- page model ---------- */
  function pageInfo(key) {
    const home = ["בית", "home"];
    if (!key || key === "home") return { key: "home", title: `${ORG} | פודקאסט, תכניות וכתבות על ספורט נשים`, desc: DEFAULT_DESC, image: ytThumb(P.pod.items[0][0]), type: "website", crumbs: [home] };
    if (key === "programs") return { key, title: `התכניות של WSP | ספורט נשים בישראל`, desc: "שש תכניות על ספורט נשים והעצמה נשית: הפודקאסט הרשמי, התקפה מתפרצת, מגרש מסכם, פצצה ביציע, שיחה ספורטיבית וקצרים מהשטח.", image: ytThumb(P.hm.items[0][0]), type: "website", crumbs: [home, ["תכניות", "programs"]] };
    if (key.startsWith("p-")) {
      const k = key.slice(2), p = P[k]; if (!p) return null;
      return { key, title: `${p.name} | ${BRAND} – ספורט נשים`, desc: clip(`${p.desc} ${p.items.length} ${k === "vid" ? "סרטונים" : "פרקים"} לצפייה.`), image: ytThumb(p.items[0][0]), type: "website", crumbs: [home, ...progCrumb(k)], collection: p.items.map(a => ["v-" + a[0], a[2]]) };
    }
    if (key.startsWith("v-")) {
      const v = video(key.slice(2)); if (!v) return null; const p = P[v.p];
      return { key, title: `${v.name} – ${v.role} | ${p.name} | ${BRAND}`, desc: clip(`${epLabel(v)} ב${p.name}: ${v.name}, ${v.role}. ${p.desc}`), image: ytThumb(v.id), type: "video.other",
        crumbs: [home, ...progCrumb(v.p), [v.ep ? `פרק ${v.ep}: ${v.name}` : v.name, key]], video: v };
    }
    if (key === "articles") return { key, title: `כתבות | ${BRAND} – ספורט נשים בישראל`, desc: "ידיעות, ראיונות, פרופילים ודעות מעולם ספורט הנשים בישראל, מצוות הכתבות של WSP.", image: wix(ARTICLES[0].img), type: "website", crumbs: [home, ["כתבות", "articles"]], collection: ARTICLES.map((a, i) => ["a-" + i, a.t]) };
    if (key.startsWith("a-")) {
      const i = +key.slice(2), a = ARTICLES[i]; if (!a) return null;
      return { key, title: `${a.t} | ${BRAND}`, desc: clip(a.ex), image: wix(a.img), type: "article", crumbs: [home, ["כתבות", "articles"], [a.t, key]], article: a, body: textOfArticle(a.slug) };
    }
    if (key === "awards") return { key, title: `מצטיינות השנה 2026 – הצבעה | ${BRAND}`, desc: "בחרו את ספורטאיות השנה שהובילו את ספורט הנשים בישראל. הזוכות יקבלו הצטיינות בכנס המצטיינות של WSP ב־30.7.26.", image: wix("974295_96e14de4d64f4c84a9107f3ebfab0d81~mv2.png"), type: "website", crumbs: [home, ["מצטיינות השנה 2026", "awards"]] };
    if (key === "about" || key === "about-contact" || key === "about-team") return { key: "about", title: `על המיזם – הצוות, השותפים ויצירת קשר | ${BRAND}`, desc: "WSP היא פלטפורמה לקידום ספורט הנשים בישראל: הכירו את הצוות, השותפים, ואיך להצטרף, לתרום או לשתף פעולה.", image: wix("974295_fe7489b68ecd4298b446ce7f6ef248c6~mv2.jpeg"), type: "website", crumbs: [home, ["על המיזם", "about"]] };
    if (key === "search") return { key, title: `חיפוש | ${BRAND}`, desc: "חיפוש ספורטאיות, ענפים, תכניות ופרקים ב־WSP.", image: ytThumb(P.pod.items[0][0]), type: "website", crumbs: [home, ["חיפוש", "search"]], noindex: true };
    return null;
  }

  /* ---------- JSON-LD ---------- */
  function jsonLd(info, origin) {
    const url = origin + keyToPath(info.key);
    const orgNode = { "@type": "Organization", "@id": origin + "/#org", name: ORG, alternateName: "Women's Sports Power", url: origin + "/", logo: origin + "/icons/icon-512.png", sameAs: SOCIAL };
    const graph = [orgNode];
    if (info.crumbs.length > 1) graph.push({ "@type": "BreadcrumbList", itemListElement: info.crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c[0], item: origin + keyToPath(c[1]) })) });
    if (info.key === "home") graph.push({ "@type": "WebSite", "@id": origin + "/#site", url: origin + "/", name: ORG, inLanguage: "he-IL", publisher: { "@id": origin + "/#org" }, potentialAction: { "@type": "SearchAction", target: origin + "/search?q={q}", "query-input": "required name=q" } });
    if (info.video) {
      const v = info.video;
      graph.push({ "@type": "VideoObject", name: `${v.name} – ${v.role}`, description: info.desc, thumbnailUrl: [ytThumb(v.id), `https://i.ytimg.com/vi/${v.id}/hq2.jpg`], duration: isoDur(v.dur), embedUrl: `https://www.youtube.com/embed/${v.id}`, contentUrl: `https://www.youtube.com/watch?v=${v.id}`, inLanguage: "he-IL", publisher: { "@id": origin + "/#org" }, isPartOf: { "@type": "CreativeWorkSeries", name: P[v.p].name, url: origin + keyToPath("p-" + v.p) }, ...(v.ep ? { episodeNumber: v.ep } : {}) });
    }
    if (info.article) {
      const a = info.article;
      graph.push({ "@type": "NewsArticle", headline: a.t, description: info.desc, image: [info.image], datePublished: a.d, dateModified: a.d, inLanguage: "he-IL", author: { "@type": "Person", name: a.a }, publisher: { "@id": origin + "/#org" }, mainEntityOfPage: url, articleSection: a.tag });
    }
    if (info.collection) graph.push({ "@type": "CollectionPage", name: info.title, url, inLanguage: "he-IL", hasPart: info.collection.slice(0, 40).map(([k, n]) => ({ "@type": "CreativeWork", name: n, url: origin + keyToPath(k) })) });
    return { "@context": "https://schema.org", "@graph": graph };
  }

  /* ---------- static HTML for crawlers / link previews (prerender) ---------- */
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function headTags(info, origin) {
    const url = origin + keyToPath(info.key);
    return [
      `<title>${esc(info.title)}</title>`,
      `<meta name="description" content="${esc(info.desc)}">`,
      `<link rel="canonical" href="${esc(url)}">`,
      info.noindex ? `<meta name="robots" content="noindex,follow">` : `<meta name="robots" content="index,follow,max-image-preview:large">`,
      `<meta property="og:site_name" content="${ORG}">`, `<meta property="og:locale" content="he_IL">`,
      `<meta property="og:type" content="${info.type}">`, `<meta property="og:title" content="${esc(info.title)}">`,
      `<meta property="og:description" content="${esc(info.desc)}">`, `<meta property="og:url" content="${esc(url)}">`,
      `<meta property="og:image" content="${esc(info.image)}">`,
      `<meta name="twitter:card" content="summary_large_image">`, `<meta name="twitter:title" content="${esc(info.title)}">`,
      `<meta name="twitter:description" content="${esc(info.desc)}">`, `<meta name="twitter:image" content="${esc(info.image)}">`,
      `<script type="application/ld+json" id="ld">${JSON.stringify(jsonLd(info, origin)).replace(/</g, "\\u003c")}</script>`
    ].join("\n");
  }
  function crumbsHTML(info, opts = {}) {
    if (!info || info.crumbs.length < 2) return "";
    const last = info.crumbs.length - 1;
    return `<nav class="crumbs${opts.light ? " light" : ""}" aria-label="פירורי לחם"><ol>${info.crumbs.map((c, i) => `<li>${i === last ? `<span aria-current="page">${esc(c[0])}</span>` : `<a href="${keyToPath(c[1])}">${i === 0 ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>' : ""}${esc(c[0])}</a>`}</li>`).join("")}</ol></nav>`;
  }
  function staticBody(info) {
    let h = crumbsHTML(info) + `<h1>${esc(info.title.split(" | ")[0])}</h1><p>${esc(info.desc)}</p>`;
    if (info.body) h += `<div>${esc(info.body)}</div>`;
    const links = info.collection || (info.key === "home" ? [...ORDER.map(k => ["p-" + k, P[k].name]), ["articles", "כתבות"], ["awards", "מצטיינות השנה 2026"], ["about", "על המיזם"], ...ARTICLES.slice(0, 6).map((a, i) => ["a-" + i, a.t])]
      : info.key === "programs" ? ORDER.map(k => ["p-" + k, P[k].name])
      : info.video ? P[info.video.p].items.filter(a => a[0] !== info.video.id).slice(0, 12).map(a => ["v-" + a[0], a[2]])
      : info.article ? ARTICLES.map((a, i) => ["a-" + i, a.t]).filter(x => x[0] !== info.key).slice(0, 8) : []);
    if (links.length) h += `<ul>${links.map(([k, n]) => `<li><a href="${keyToPath(k)}">${esc(n)}</a></li>`).join("")}</ul>`;
    return `<div id="seo-static" class="seo-static">${h}</div>`;
  }
  function allKeys() {
    return ["home", "programs", ...ORDER.map(k => "p-" + k), ...ALLV().map(v => "v-" + v.id), "articles", ...ARTICLES.map((a, i) => "a-" + i), "awards", "about", "search"];
  }

  g.WSPSEO = { keyToPath, pathToKey, isKey, pageInfo, jsonLd, headTags, crumbsHTML, staticBody, allKeys, SLUG };
})(typeof window !== "undefined" ? window : globalThis);
