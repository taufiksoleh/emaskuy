/**
 * Build-time only: one static HTML file per route and article, plus
 * sitemap.xml, robots.txt and rss.xml (see vite/seo-prerender.ts).
 *
 * GitHub Pages serves `/kalkulator` from `kalkulator.html` with HTTP 200,
 * so every URL gets its own title, description, canonical, link-preview
 * tags and JSON-LD instead of the 404-redirect of a plain SPA. A small
 * static body is included for crawlers that don't run JavaScript; it is
 * hidden for everyone else and replaced when React mounts.
 */
import { sortedArticles, type Article } from '@/data/articles';
import '@/lib/about-strings';
import { antamData, antamOneGram } from '@/lib/antam';
import { formatDateOnly, formatIdr, isoDateUtc } from '@/lib/gold';
import {
  PRERENDERED_ROUTES,
  ROUTE_META,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  articleHead,
  articlePath,
  localize,
  type HeadData,
  type RouteKey,
} from '@/lib/seo';
import { translate } from '@/lib/strings';

export interface PrerenderFile {
  /** Path inside dist/ */
  file: string;
  content: string;
}

const LANG = 'id' as const;
const antam = antamData();
const t = (key: string) => translate(key, LANG);

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** JSON for a <script> element: `<` escaped so text can't close the tag. */
const jsonLd = (data: object) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

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
  return [
    `<title>${escapeHtml(h.title)}</title>`,
    meta('name', 'description', h.description),
    h.canonical ? `<link rel="canonical" href="${h.canonical}" />` : '',
    meta('name', 'robots', h.noindex ? 'noindex' : 'index,follow,max-image-preview:large'),
    meta('property', 'og:type', h.ogType),
    meta('property', 'og:site_name', SITE_NAME),
    meta('property', 'og:locale', 'id_ID'),
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
    `<link rel="alternate" type="application/rss+xml" title="${SITE_NAME}" href="${SITE_URL}/rss.xml" />`,
    ...extra.ld.map(jsonLd),
  ]
    .filter(Boolean)
    .join('\n    ');
}

function page(template: string, head: string, body: string): string {
  const start = template.indexOf('<!--seo-->');
  const end = template.indexOf('<!--/seo-->');
  if (start < 0 || end < start) throw new Error('index.html is missing the <!--seo--> markers');
  return (
    template.slice(0, start) +
    `<!--seo-->\n    ${head}\n    ` +
    template.slice(end)
  ).replace('<div id="root"></div>', `<div id="root"><div data-prerender>${body}</div></div>`);
}

/** Crawlable links to the main pages. */
function siteNav(): string {
  const links = PRERENDERED_ROUTES.map((key) => {
    const meta = ROUTE_META[key];
    return `<li><a href="${meta.path}">${escapeHtml(meta.title[LANG])}</a></li>`;
  });
  return `<nav><ul>${links.join('')}</ul></nav>`;
}

function articleList(articles: Article[]): string {
  return `<ul>${articles
    .map(
      (a) =>
        `<li><a href="${articlePath(a.slug)}">${escapeHtml(a.title[LANG])}</a> <p>${escapeHtml(a.excerpt[LANG])}</p></li>`,
    )
    .join('')}</ul>`;
}

function routeLd(key: RouteKey, h: HeadData, articles: Article[]): object[] {
  const meta = ROUTE_META[key];
  switch (meta.kind) {
    case 'home':
      return [
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_NAME,
          url: `${SITE_URL}/`,
          inLanguage: 'id-ID',
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
          inLanguage: 'id-ID',
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: articles.map((a, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: absoluteUrl(articlePath(a.slug)),
              name: a.title[LANG],
            })),
          },
        },
      ];
    case 'app':
      return [
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: meta.title[LANG],
          url: h.canonical,
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Any',
          inLanguage: 'id-ID',
          offers: { '@type': 'Offer', price: 0, priceCurrency: 'IDR' },
          description: h.description,
        },
        breadcrumbs([
          ['Beranda', '/'],
          [meta.title[LANG], meta.path ?? '/'],
        ]),
      ];
    case 'faq': {
      const faqs = [1, 2, 3, 4, 5].map((i) => ({
        '@type': 'Question',
        name: t(`about.faq.${i}.q`),
        acceptedAnswer: { '@type': 'Answer', text: t(`about.faq.${i}.a`) },
      }));
      return [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs }];
    }
    default:
      return [];
  }
}

function routeBody(key: RouteKey, articles: Article[]): string {
  const meta = ROUTE_META[key];
  const intro = `<h1>${escapeHtml(meta.title[LANG])}</h1><p>${escapeHtml(meta.description[LANG])}</p>`;
  if (key === 'home') {
    const line =
      `Harga emas Antam 1 gram: ${formatIdr(antamOneGram(antam), LANG)}, buyback ${formatIdr(antam.antam.buybackPerGram, LANG)}/gram ` +
      `(${formatDateOnly(antam.priceDate, LANG)}).`;
    return `${intro}<p>${escapeHtml(line)}</p>${siteNav()}<h2>Analisis terbaru</h2>${articleList(articles.slice(0, 5))}`;
  }
  if (key === 'analysis') return `${intro}${articleList(articles)}${siteNav()}`;
  if (key === 'about') {
    const faq = [1, 2, 3, 4, 5]
      .map((i) => `<h3>${escapeHtml(t(`about.faq.${i}.q`))}</h3><p>${escapeHtml(t(`about.faq.${i}.a`))}</p>`)
      .join('');
    return `${intro}${faq}${siteNav()}`;
  }
  return `${intro}${siteNav()}`;
}

function articleBody(a: Article): string {
  const sections = a.sections
    .map(
      (s) =>
        `<h2>${escapeHtml(s.heading[LANG])}</h2>${s.paragraphs.map((p) => `<p>${escapeHtml(p[LANG])}</p>`).join('')}`,
    )
    .join('');
  return (
    `<article><h1>${escapeHtml(a.title[LANG])}</h1>` +
    `<p>${escapeHtml(`${formatDateOnly(isoDateUtc(a.publishedAt), LANG)} · ${a.author[LANG]}`)}</p>` +
    `<p>${escapeHtml(a.excerpt[LANG])}</p>${sections}</article>` +
    `<p><a href="/analisis">Semua analisis</a></p>`
  );
}

function articleLd(a: Article, h: HeadData): object[] {
  const published = new Date(a.publishedAt).toISOString();
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: a.title[LANG],
      description: h.description,
      image: [h.ogImage],
      datePublished: published,
      dateModified: published,
      inLanguage: 'id-ID',
      author: { '@type': 'Organization', name: a.author[LANG], url: `${SITE_URL}/tentang` },
      publisher: ORGANIZATION,
      mainEntityOfPage: h.canonical,
    },
    breadcrumbs([
      ['Beranda', '/'],
      ['Analisis', '/analisis'],
      [a.title[LANG], articlePath(a.slug)],
    ]),
  ];
}

const rfc822 = (ms: number) => new Date(ms).toUTCString();
const xml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function sitemap(articles: Article[]): string {
  const newest = articles[0] ? isoDateUtc(articles[0].publishedAt) : undefined;
  const lastmod: Partial<Record<RouteKey, string>> = { home: antam.priceDate, analysis: newest };
  const urls = [
    ...PRERENDERED_ROUTES.map((key) => ({ loc: absoluteUrl(ROUTE_META[key].path ?? '/'), lastmod: lastmod[key] })),
    ...articles.map((a) => ({ loc: absoluteUrl(articlePath(a.slug)), lastmod: isoDateUtc(a.publishedAt) })),
  ];
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls
      .map((u) => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`)
      .join('\n') +
    '\n</urlset>\n'
  );
}

function rss(articles: Article[], now: Date): string {
  const items = articles
    .map((a) => {
      const h = articleHead(a, LANG);
      return [
        '    <item>',
        `      <title>${xml(a.title[LANG])}</title>`,
        `      <link>${h.canonical}</link>`,
        `      <guid isPermaLink="true">${h.canonical}</guid>`,
        `      <pubDate>${rfc822(a.publishedAt)}</pubDate>`,
        `      <description>${xml(a.excerpt[LANG])}</description>`,
        `      <media:content url="${h.ogImage}" medium="image" type="image/jpeg" width="1200" height="630" />`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${SITE_NAME} — Analisis Harga Emas</title>`,
    `    <link>${SITE_URL}/analisis</link>`,
    `    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />`,
    `    <description>${xml(ROUTE_META.analysis.description[LANG])}</description>`,
    '    <language>id-ID</language>',
    `    <lastBuildDate>${now.toUTCString()}</lastBuildDate>`,
    items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}

export function renderSite({ template, now }: { template: string; now: Date }): PrerenderFile[] {
  const articles = sortedArticles();
  const files: PrerenderFile[] = PRERENDERED_ROUTES.map((key) => {
    const h = localize(ROUTE_META[key], LANG);
    if (key === 'home') {
      h.description = `Harga emas hari ini live per gram dalam Rupiah dan USD/oz. Antam 1 gram ${formatIdr(antamOneGram(antam), LANG)} (${formatDateOnly(antam.priceDate, LANG)}), grafik sejak 2013, kalkulator zakat & investasi emas.`;
    }
    const path = ROUTE_META[key].path ?? '/';
    return {
      file: path === '/' ? 'index.html' : `${path.slice(1)}.html`,
      content: page(template, headTags(h, { ld: routeLd(key, h, articles) }), routeBody(key, articles)),
    };
  });

  for (const a of articles) {
    const h = articleHead(a, LANG);
    const published = new Date(a.publishedAt).toISOString();
    files.push({
      file: `${articlePath(a.slug).slice(1)}.html`,
      content: page(template, headTags(h, { published, modified: published, ld: articleLd(a, h) }), articleBody(a)),
    });
  }

  files.push(
    { file: 'sitemap.xml', content: sitemap(articles) },
    { file: 'robots.txt', content: `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n` },
    { file: 'rss.xml', content: rss(articles, now) },
  );
  return files;
}
