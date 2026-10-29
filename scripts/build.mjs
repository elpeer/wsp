// Static prerender for SEO + link previews. Run: node scripts/build.mjs  (Vercel runs it on deploy)
// Writes dist/: one index.html per route with its own <title>, meta, canonical, Open Graph, JSON-LD,
// breadcrumbs and crawlable content, plus sitemap.xml, robots.txt and all static assets.
import fs from "node:fs"; import path from "node:path"; import vm from "node:vm";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const out = path.join(root, "dist");
const ORIGIN = (process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? "https://" + process.env.VERCEL_PROJECT_PRODUCTION_URL : "https://wsp-five.vercel.app")).replace(/\/$/, "");

const read = f => fs.readFileSync(path.join(root, f), "utf8");
const ctx = vm.createContext({ console });
vm.runInContext(read("data.js") + "\n" + read("articles-data.js").replace("window.ARTICLE_BODIES", "var ARTICLE_BODIES") + "\n" + read("seo.js") + "\n;globalThis.__x={P,ORDER,ARTICLES};", ctx);
const SEO = ctx.WSPSEO, { ARTICLES } = ctx.__x;

fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
const copy = rel => { const src = path.join(root, rel), dst = path.join(out, rel); if (!fs.existsSync(src)) return;
  if (fs.statSync(src).isDirectory()) { fs.mkdirSync(dst, { recursive: true }); fs.readdirSync(src).forEach(f => copy(path.join(rel, f))); } else { fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.copyFileSync(src, dst); } };
["app.css", "app.js", "data.js", "seo.js", "articles-data.js", "sw.js", "manifest.webmanifest", "icons", "img"].forEach(copy);

const shell = read("index.html");
const pageHTML = key => {
  const info = SEO.pageInfo(key);
  return shell.replace(/<title>[\s\S]*?<\/title>/, SEO.headTags(info, ORIGIN)).replace(/<body([^>]*)>/, `<body$1>\n${SEO.staticBody(info)}`);
};
const keys = SEO.allKeys(); let n = 0;
for (const key of keys) {
  const p = SEO.keyToPath(key), dir = path.join(out, decodeURIComponent(p));
  fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(path.join(dir, "index.html"), pageHTML(key)); n++;
}
fs.writeFileSync(path.join(out, "404.html"), pageHTML("home").replace('<meta name="robots" content="index,follow,max-image-preview:large">', '<meta name="robots" content="noindex">'));

const today = new Date().toISOString().slice(0, 10);
const urls = keys.filter(k => k !== "search").map(k => {
  const a = k.startsWith("a-") ? ARTICLES[+k.slice(2)] : null;
  const pri = k === "home" ? "1.0" : /^(p-|articles|awards|programs)/.test(k) ? "0.8" : "0.6";
  return `  <url><loc>${ORIGIN}${SEO.keyToPath(k)}</loc><lastmod>${a ? a.d : today}</lastmod><priority>${pri}</priority></url>`;
});
fs.writeFileSync(path.join(out, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`);
fs.writeFileSync(path.join(out, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /search\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);
console.log(`prerendered ${n} pages for ${ORIGIN}`);
