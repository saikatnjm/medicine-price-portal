#!/usr/bin/env node
/**
 * SEO audit of a RUNNING site (no dependencies). Samples URLs from the sitemaps listed in robots.txt and checks
 * status, title/description length, canonical, robots meta, one H1, hreflang, Open Graph image and JSON-LD validity.
 * Also flags noindex pages that appear in a sitemap and internal links that return errors (sampled).
 *
 *   node scripts/seo-audit.mjs http://localhost:3001 [--sample 25] [--strict]
 */
const args = process.argv.slice(2);
const base = (args.find((a) => /^https?:\/\//.test(a)) ?? "http://localhost:3000").replace(/\/+$/, "");
const sampleArg = args.indexOf("--sample");
const SAMPLE = sampleArg >= 0 ? Number(args[sampleArg + 1]) || 25 : 25;
const strict = args.includes("--strict");

const problems = [];
const note = (url, level, msg) => problems.push({ url, level, msg });

async function get(url) {
  const res = await fetch(url, { redirect: "manual", headers: { "user-agent": "bhs-seo-audit" } });
  return { status: res.status, location: res.headers.get("location"), text: res.status < 300 ? await res.text() : "" };
}
const tag = (html, re) => re.exec(html)?.[1];
const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const pathOf = (u) => new URL(u, base).pathname;

function shuffle(a) {
  return [...a].sort(() => Math.random() - 0.5);
}

const robots = await get(`${base}/robots.txt`);
const sitemapUrls = [...robots.text.matchAll(/^Sitemap:\s*(\S+)/gim)].map((m) => m[1]);
if (sitemapUrls.length === 0) note("/robots.txt", "error", "no Sitemap lines (site may be set to noindex)");

const urls = new Set(["/", "/bn"]);
for (const s of sitemapUrls) {
  const { status, text } = await get(`${base}${pathOf(s)}`);
  if (status !== 200) {
    note(pathOf(s), "error", `sitemap status ${status}`);
    continue;
  }
  const entries = locs(text.replace(/<xhtml:link[^>]*>/g, ""));
  for (const u of shuffle(entries).slice(0, SAMPLE)) urls.add(pathOf(u));
}

const seenTitles = new Map();
const linkChecked = new Set();
for (const path of urls) {
  const { status, text: html } = await get(`${base}${path}`);
  if (status !== 200) {
    note(path, "error", `status ${status}`);
    continue;
  }
  const title = tag(html, /<title[^>]*>([^<]*)<\/title>/i) ?? "";
  const description = tag(html, /<meta name="description" content="([^"]*)"/i) ?? "";
  const canonical = tag(html, /<link rel="canonical" href="([^"]*)"/i);
  const robotsMeta = tag(html, /<meta name="robots" content="([^"]*)"/i) ?? "";
  const h1s = (html.match(/<h1[\s>]/gi) ?? []).length;
  if (!title) note(path, "error", "missing <title>");
  else if (title.length > 65) note(path, "warn", `title ${title.length} chars (>65)`);
  if (!description) note(path, "error", "missing meta description");
  else if (description.length > 165) note(path, "warn", `description ${description.length} chars (>165)`);
  else if (description.length < 50) note(path, "warn", `description ${description.length} chars (<50)`);
  if (!canonical) note(path, "error", "missing canonical");
  if (h1s !== 1) note(path, "error", `${h1s} <h1> elements`);
  if (!/hreflang=/i.test(html)) note(path, "warn", "no hreflang alternates");
  if (!/property="og:image"/i.test(html)) note(path, "warn", "no og:image");
  if (/noindex/i.test(robotsMeta)) note(path, "warn", "noindex page is listed in a sitemap or homepage sample");
  for (const [, body] of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(body.replace(/\\u003c/g, "<"));
    } catch {
      note(path, "error", "invalid JSON-LD");
    }
  }
  const key = title.toLowerCase();
  if (title) seenTitles.set(key, [...(seenTitles.get(key) ?? []), path]);
  // Sample a few internal links for broken targets.
  const links = shuffle([...html.matchAll(/<a [^>]*href="(\/[^"#?]*)"/g)].map((m) => m[1])).slice(0, 5);
  for (const link of links) {
    if (linkChecked.has(link)) continue;
    linkChecked.add(link);
    const r = await get(`${base}${link}`);
    if (r.status >= 400) note(path, "error", `broken internal link ${link} (${r.status})`);
  }
}
for (const [title, paths] of seenTitles) if (paths.length > 1) note(paths[0], "warn", `duplicate title shared with ${paths.length - 1} other sampled page(s): "${title.slice(0, 50)}"`);

const errors = problems.filter((p) => p.level === "error");
console.log(`Audited ${urls.size} URLs on ${base}: ${errors.length} errors, ${problems.length - errors.length} warnings`);
for (const p of problems.slice(0, 80)) console.log(`${p.level.toUpperCase().padEnd(5)} ${p.url}  ${p.msg}`);
process.exit(strict && errors.length > 0 ? 1 : 0);
