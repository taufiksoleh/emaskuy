/**
 * Build-time only: one static HTML file per route and article in both
 * languages, plus sitemap.xml, robots.txt and an RSS feed per language (see
 * vite/seo-prerender.ts).
 *
 * GitHub Pages serves `/kalkulator` from `kalkulator.html` and
 * `/en/calculator` from `en/calculator.html` with HTTP 200 (also when a
 * `kalkulator/` folder of subpages exists, as long as it has no
 * index.html; verify-dist guards that), so every URL
 * gets its own title, description, canonical, hreflang alternates,
 * link-preview tags and JSON-LD instead of the 404-redirect of a plain SPA.
 * A small static body is included for crawlers that don't run JavaScript;
 * it is hidden for everyone else and replaced when React mounts.
 */
import { sortedArticles, type Article } from '@/data/articles';
import '@/lib/about-strings';
import { antamData, antamOneGram } from '@/lib/antam';
import { formatDateOnly, formatIdr, isoDateUtc } from '@/lib/gold';
import { PAGE_KEYS, articlePath, pathFor, type PageKey } from '@/lib/routes';
import {
  ROUTE_META,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  articleHead,
  routeHead,
  type HeadData,
} from '@/lib/seo';
import { translate, type Lang } from '@/lib/strings';

export interface PrerenderFile {
  /** Path inside dist/ */
  file: string;
  content: string;
}

const LANGS: Lang[] = ['id', 'en'];
const LOCALE: Record<Lang, { og: string; bcp47: string }> = {
  id: { og: 'id_ID', bcp47: 'id-ID' },
  en: { og: 'en_US', bcp47: 'en-US' },
};
const WORDS: Record<Lang, { home: string; analysis: string; latest: string; allAnalysis: string; feed: string }> = {
  id: { home: 'Beranda', analysis: 'Analisis', latest: 'Analisis terbaru', allAnalysis: 'Semua analisis', feed: 'Analisis Harga Emas' },
  en: { home: 'Home', analysis: 'Analysis', latest: 'Latest analysis', allAnalysis: 'All analysis', feed: 'Gold Price Analysis' },
};

const antam = antamData();

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** JSON for a <script> element: `<` escaped so text can't close the tag. */
const jsonLd = (data: object) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

const rssPath = (lang: Lang) => (lang === 'en' ? '/en/rss.xml' : '/rss.xml');

const ORGANIZATION = {
  '@type': 'Organization',
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: absoluteUrl('/logo-mark.png'),
};

function breadcrumbs(items: Array<[name: string, path: string]>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: absoluteUrl(path),
    })),
  };
}

function headTags(h: HeadData, extra: { published?: string; modified?: string; ld: object[] }): string {
  const meta = (attr: 'name' | 'property', key: string, value: string) =>
    `<meta ${attr}="${key}" content="${escapeHtml(value)}" />`;
  const isDefaultImage = h.ogImage.endsWith('/og-cover.png');
  const other: Lang = h.lang === 'id' ? 'en' : 'id';
  const alternates = h.alternates
    ? [
        `<link rel="alternate" hreflang="id" href="${h.alternates.id}" />`,
        `<link rel="alternate" hreflang="en" href="${h.alternates.en}" />`,
        `<link rel="alternate" hreflang="x-default" href="${h.alternates.en}" />`,
      ]
    : [];
  return [
    `<title>${escapeHtml(h.title)}</title>`,
    meta('name', 'description', h.description),
    h.canonical ? `<link rel="canonical" href="${h.canonical}" />` : '',
    ...alternates,
    meta('name', 'robots', h.noindex ? 'noindex' : 'index,follow,max-image-preview:large'),
    meta('property', 'og:type', h.ogType),
    meta('property', 'og:site_name', SITE_NAME),
    meta('property', 'og:locale', LOCALE[h.lang].og),
    meta('property', 'og:locale:alternate', LOCALE[other].og),
    meta('property', 'og:title', h.title),
    meta('property', 'og:description', h.description),
    h.canonical ? meta('property', 'og:url', h.canonical) : '',
    meta('property', 'og:image', h.ogImage),
    meta('property', 'og:image:width', isDefaultImage ? '1216' : '1200'),
    meta('property', 'og:image:height', isDefaultImage ? '640' : '630'),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', h.title),
    meta('name', 'twitter:description', h.description),
    meta('name', 'twitter:image', h.ogImage),
    extra.published ? meta('property', 'article:published_time', extra.published) : '',
    extra.modified ? meta('property', 'article:modified_time', extra.modified) : '',
    `<link rel="alternate" type="application/rss+xml" title="${SITE_NAME}" href="${SITE_URL}${rssPath(h.lang)}" />`,
    ...extra.ld.map(jsonLd),
  ]
    .filter(Boolean)
    .join('\n    ');
}

function page(template: string, lang: Lang, head: string, body: string): string {
  const start = template.indexOf('<!--seo-->');
  const end = template.indexOf('<!--/seo-->');
  if (start < 0 || end < start) throw new Error('index.html is missing the <!--seo--> markers');
  if (!template.includes('<html lang="id"')) throw new Error('index.html should start with <html lang="id">');
  return (template.slice(0, start) + `<!--seo-->\n    ${head}\n    ` + template.slice(end))
    .replace('<html lang="id"', `<html lang="${lang}"`)
    .replace('<div id="root"></div>', `<div id="root"><div data-prerender>${body}</div></div>`);
}

/** Crawlable links to the main pages, and to the same page in the other language. */
function siteNav(lang: Lang, key: PageKey | null): string {
  const links = PAGE_KEYS.map(
    (k) => `<li><a href="${pathFor(k, lang)}">${escapeHtml(ROUTE_META[k].title[lang])}</a></li>`,
  );
  const other: Lang = lang === 'id' ? 'en' : 'id';
  const switchTo = key
    ? `<p><a href="${pathFor(key, other)}" hreflang="${other}">${other === 'en' ? 'English' : 'Bahasa Indonesia'}</a></p>`
    : '';
  return `<nav><ul>${links.join('')}</ul></nav>${switchTo}`;
}

function articleList(articles: Article[], lang: Lang): string {
  return `<ul>${articles
    .map(
      (a) =>
        `<li><a href="${articlePath(a.slug, lang)}">${escapeHtml(a.title[lang])}</a> <p>${escapeHtml(a.excerpt[lang])}</p></li>`,
    )
    .join('')}</ul>`;
}

function routeLd(key: PageKey, h: HeadData, articles: Article[]): object[] {
  const { lang } = h;
  const meta = ROUTE_META[key];
  const inLanguage = LOCALE[lang].bcp47;
  switch (meta.kind) {
    case 'home':
      return [
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_NAME,
          url: absoluteUrl(pathFor('home', lang)),
          inLanguage,
          description: h.description,
        },
        { '@context': 'https://schema.org', ...ORGANIZATION },
      ];
    case 'collection':
      return [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: h.title,
          url: h.canonical,
          inLanguage,
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: articles.map((a, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: absoluteUrl(articlePath(a.slug, lang)),
              name: a.title[lang],
            })),
          },
        },
      ];
    case 'app':
      return [
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: meta.title[lang],
          url: h.canonical,
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Any',
          inLanguage,
          offers: { '@type': 'Offer', price: 0, priceCurrency: 'IDR' },
          description: h.description,
        },
        breadcrumbs([
          [WORDS[lang].home, pathFor('home', lang)],
          [meta.title[lang], pathFor(key, lang)],
        ]),
      ];
    case 'faq': {
      const faqs = [1, 2, 3, 4, 5].map((i) => ({
        '@type': 'Question',
        name: translate(`about.faq.${i}.q`, lang),
        acceptedAnswer: { '@type': 'Answer', text: translate(`about.faq.${i}.a`, lang) },
      }));
      return [{ '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage, mainEntity: faqs }];
    }
    default:
      return [];
  }
}

function antamLine(lang: Lang): string {
  const price = formatIdr(antamOneGram(antam), lang);
  const buyback = formatIdr(antam.antam.buybackPerGram, lang);
  const date = formatDateOnly(antam.priceDate, lang);
  return lang === 'id'
    ? `Harga emas Antam 1 gram: ${price}, buyback ${buyback}/gram (${date}).`
    : `Antam 1-gram gold bar: ${price}, buyback ${buyback}/gram (${date}).`;
}

function homeDescription(lang: Lang): string {
  const price = formatIdr(antamOneGram(antam), lang);
  const date = formatDateOnly(antam.priceDate, lang);
  return lang === 'id'
    ? `Harga emas hari ini live per gram dalam Rupiah, USD dan 14 mata uang lain. Antam 1 gram ${price} (${date}), grafik sejak 2013, kalkulator zakat & investasi emas.`
    : `Live gold price today per gram in rupiah, dollars and 14 other currencies. Antam 1 gram ${price} (${date}), charts since 2013, zakat and investment calculators.`;
}

function routeBody(key: PageKey, articles: Article[], lang: Lang): string {
  const meta = ROUTE_META[key];
  const intro = `<h1>${escapeHtml(meta.title[lang])}</h1><p>${escapeHtml(meta.description[lang])}</p>`;
  const nav = siteNav(lang, key);
  if (key === 'home') {
    return `${intro}<p>${escapeHtml(antamLine(lang))}</p>${nav}<h2>${WORDS[lang].latest}</h2>${articleList(articles.slice(0, 5), lang)}`;
  }
  if (key === 'analysis') return `${intro}${articleList(articles, lang)}${nav}`;
  if (key === 'about') {
    const faq = [1, 2, 3, 4, 5]
      .map(
        (i) =>
          `<h3>${escapeHtml(translate(`about.faq.${i}.q`, lang))}</h3><p>${escapeHtml(translate(`about.faq.${i}.a`, lang))}</p>`,
      )
      .join('');
    return `${intro}${faq}${nav}`;
  }
  return `${intro}${nav}`;
}

function articleBody(a: Article, lang: Lang): string {
  const sections = a.sections
    .map(
      (s) =>
        `<h2>${escapeHtml(s.heading[lang])}</h2>${s.paragraphs.map((p) => `<p>${escapeHtml(p[lang])}</p>`).join('')}`,
    )
    .join('');
  const other: Lang = lang === 'id' ? 'en' : 'id';
  return (
    `<article><h1>${escapeHtml(a.title[lang])}</h1>` +
    `<p>${escapeHtml(`${formatDateOnly(isoDateUtc(a.publishedAt), lang)} · ${a.author[lang]}`)}</p>` +
    `<p>${escapeHtml(a.excerpt[lang])}</p>${sections}</article>` +
    `<p><a href="${pathFor('analysis', lang)}">${WORDS[lang].allAnalysis}</a> · ` +
    `<a href="${articlePath(a.slug, other)}" hreflang="${other}">${escapeHtml(a.title[other])}</a></p>`
  );
}

function articleLd(a: Article, h: HeadData): object[] {
  const { lang } = h;
  const published = new Date(a.publishedAt).toISOString();
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: a.title[lang],
      description: h.description,
      image: [h.ogImage],
      datePublished: published,
      dateModified: published,
      inLanguage: LOCALE[lang].bcp47,
      author: { '@type': 'Organization', name: a.author[lang], url: absoluteUrl(pathFor('about', lang)) },
      publisher: ORGANIZATION,
      mainEntityOfPage: h.canonical,
    },
    breadcrumbs([
      [WORDS[lang].home, pathFor('home', lang)],
      [WORDS[lang].analysis, pathFor('analysis', lang)],
      [a.title[lang], articlePath(a.slug, lang)],
    ]),
  ];
}

const rfc822 = (ms: number) => new Date(ms).toUTCString();
const xml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Every page in both languages, each listing its alternates (x-default: English). */
function sitemap(articles: Article[]): string {
  const newest = articles[0] ? isoDateUtc(articles[0].publishedAt) : undefined;
  const lastmod: Partial<Record<PageKey, string>> = { home: antam.priceDate, analysis: newest };
  const pages = [
    ...PAGE_KEYS.map((key) => ({ path: (l: Lang) => pathFor(key, l), lastmod: lastmod[key] })),
    ...articles.map((a) => ({ path: (l: Lang) => articlePath(a.slug, l), lastmod: isoDateUtc(a.publishedAt) })),
  ];
  const urls = pages.flatMap((p) =>
    LANGS.map((lang) => {
      const links = [...LANGS.map((l) => [l, p.path(l)]), ['x-default', p.path('en')]]
        .map(([hreflang, path]) => `<xhtml:link rel="alternate" hreflang="${hreflang}" href="${absoluteUrl(path)}" />`)
        .join('');
      return `  <url><loc>${absoluteUrl(p.path(lang))}</loc>${p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : ''}${links}</url>`;
    }),
  );
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
    urls.join('\n') +
    '\n</urlset>\n'
  );
}

function rss(articles: Article[], now: Date, lang: Lang): string {
  const items = articles
    .map((a) => {
      const h = articleHead(a, lang);
      return [
        '    <item>',
        `      <title>${xml(a.title[lang])}</title>`,
        `      <link>${h.canonical}</link>`,
        `      <guid isPermaLink="true">${h.canonical}</guid>`,
        `      <pubDate>${rfc822(a.publishedAt)}</pubDate>`,
        `      <description>${xml(a.excerpt[lang])}</description>`,
        `      <media:content url="${h.ogImage}" medium="image" type="image/jpeg" width="1200" height="630" />`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${SITE_NAME} — ${WORDS[lang].feed}</title>`,
    `    <link>${absoluteUrl(pathFor('analysis', lang))}</link>`,
    `    <atom:link href="${SITE_URL}${rssPath(lang)}" rel="self" type="application/rss+xml" />`,
    `    <description>${xml(ROUTE_META.analysis.description[lang])}</description>`,
    `    <language>${LOCALE[lang].bcp47}</language>`,
    `    <lastBuildDate>${now.toUTCString()}</lastBuildDate>`,
    items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}

/** `/` → index.html, `/en` → en.html, `/en/calculator/zakat` → en/calculator/zakat.html */
const fileFor = (path: string) => (path === '/' ? 'index.html' : `${path.slice(1)}.html`);

export function renderSite({ template, now }: { template: string; now: Date }): PrerenderFile[] {
  const articles = sortedArticles();
  const files: PrerenderFile[] = [];

  for (const lang of LANGS) {
    for (const key of PAGE_KEYS) {
      const h = routeHead(key, lang);
      if (key === 'home') h.description = homeDescription(lang);
      files.push({
        file: fileFor(pathFor(key, lang)),
        content: page(template, lang, headTags(h, { ld: routeLd(key, h, articles) }), routeBody(key, articles, lang)),
      });
    }
    for (const a of articles) {
      const h = articleHead(a, lang);
      const published = new Date(a.publishedAt).toISOString();
      files.push({
        file: fileFor(articlePath(a.slug, lang)),
        content: page(
          template,
          lang,
          headTags(h, { published, modified: published, ld: articleLd(a, h) }),
          articleBody(a, lang),
        ),
      });
    }
    files.push({ file: rssPath(lang).slice(1), content: rss(articles, now, lang) });
  }

  files.push(
    { file: 'sitemap.xml', content: sitemap(articles) },
    { file: 'robots.txt', content: `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n` },
  );
  return files;
}
