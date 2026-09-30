/**
 * CI check on the built site (run after `npm run build`): every prerendered
 * page has one title, an absolute canonical matching og:url, an absolute
 * og:image that exists and fits WhatsApp's preview limit, valid JSON-LD and
 * lang="id"; the sitemap lists exactly those pages; the PWA files exist.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const DIST = path.resolve(import.meta.dirname, '../dist');
const SITE = 'https://emaskuy.com';
const OG_MAX_BYTES = 300_000;
const errors = [];
const fail = (file, msg) => errors.push(`${file}: ${msg}`);

function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) return ['_img', 'assets', 'icons'].includes(e.name) ? [] : htmlFiles(full);
    return e.name.endsWith('.html') && e.name !== '404.html' ? [full] : [];
  });
}

const attr = (html, selector) => {
  const m = html.match(new RegExp(`<meta ${selector} content="([^"]*)"`));
  return m?.[1];
};

const pages = htmlFiles(DIST);
for (const file of pages) {
  const rel = path.relative(DIST, file);
  const html = readFileSync(file, 'utf8');
  const titles = html.match(/<title>/g)?.length ?? 0;
  if (titles !== 1) fail(rel, `expected 1 <title>, found ${titles}`);
  if (!html.startsWith('<!doctype html>\n<html lang="id"')) fail(rel, 'missing lang="id"');
  if (!html.includes('<div data-prerender>')) fail(rel, 'missing prerendered body');
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical?.startsWith(SITE)) fail(rel, `canonical not absolute: ${canonical}`);
  if (attr(html, 'property="og:url"') !== canonical) fail(rel, 'og:url differs from canonical');
  const og = attr(html, 'property="og:image"');
  if (!og?.startsWith(`${SITE}/`)) {
    fail(rel, `og:image not absolute: ${og}`);
  } else {
    const local = path.join(DIST, og.slice(SITE.length));
    if (!existsSync(local)) fail(rel, `og:image missing: ${og}`);
    else if (statSync(local).size > OG_MAX_BYTES) fail(rel, `og:image over ${OG_MAX_BYTES} bytes: ${og}`);
  }
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(m[1]);
    } catch {
      fail(rel, 'invalid JSON-LD');
    }
  }
  if (!html.includes('manifest.webmanifest')) fail(rel, 'no web app manifest link');
}

const sitemap = readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
const locs = sitemap.match(/<loc>/g)?.length ?? 0;
if (locs !== pages.length) fail('sitemap.xml', `${locs} URLs for ${pages.length} pages`);
for (const f of ['robots.txt', 'rss.xml', 'sw.js', 'manifest.webmanifest', 'CNAME', '404.html']) {
  if (!existsSync(path.join(DIST, f))) fail(f, 'missing');
}
for (const f of readdirSync(path.join(DIST, 'assets')).filter((n) => n.endsWith('.js'))) {
  if (readFileSync(path.join(DIST, 'assets', f), 'utf8').includes('code-path=')) {
    fail(`assets/${f}`, 'source paths leaked into the bundle');
  }
}

if (errors.length > 0) {
  console.error(`verify-dist: ${errors.length} problem(s)\n${errors.map((e) => `  - ${e}`).join('\n')}`);
  process.exit(1);
}
console.log(`verify-dist: ${pages.length} pages OK`);
