/**
 * useDocumentMeta — keep <head> in step with the current page.
 *
 * Updates the tags already in the (prerendered) HTML instead of rendering
 * <title>/<meta> in JSX: React 19 hoists those but does not replace tags
 * already in the document, so the first static <title> would keep winning.
 */
import { useEffect } from 'react';
import { useI18n, type Lang } from '@/lib/i18n';
import { SITE_URL, routeHead, type HeadData, type RouteKey } from '@/lib/seo';

export type DocumentMeta = Pick<HeadData, 'title' | 'description'> & Partial<Omit<HeadData, 'title' | 'description'>>;

const OG_LOCALE: Record<Lang, string> = { id: 'id_ID', en: 'en_US' };

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string | undefined) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!href) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = href;
}

/** hreflang links for the page in each language; x-default is the English one. */
function upsertAlternates(alternates: Record<Lang, string> | undefined) {
  for (const el of document.head.querySelectorAll('link[rel="alternate"][hreflang]')) el.remove();
  if (!alternates) return;
  const links: Array<[string, string]> = [
    ['id', alternates.id],
    ['en', alternates.en],
    ['x-default', alternates.en],
  ];
  for (const [hreflang, href] of links) {
    const el = document.createElement('link');
    el.rel = 'alternate';
    el.hreflang = hreflang;
    el.href = href;
    document.head.appendChild(el);
  }
}

export function useDocumentMeta({
  lang,
  title,
  description,
  canonical,
  alternates,
  ogImage,
  ogType,
  noindex = false,
}: DocumentMeta): void {
  const altId = alternates?.id;
  const altEn = alternates?.en;
  useEffect(() => {
    if (lang) {
      upsertMeta('property', 'og:locale', OG_LOCALE[lang]);
      upsertMeta('property', 'og:locale:alternate', OG_LOCALE[lang === 'id' ? 'en' : 'id']);
      document.head
        .querySelector('link[rel="alternate"][type="application/rss+xml"]')
        ?.setAttribute('href', `${SITE_URL}${lang === 'en' ? '/en' : ''}/rss.xml`);
    }
    upsertAlternates(altId && altEn ? { id: altId, en: altEn } : undefined);
    document.title = title;
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    if (ogType) upsertMeta('property', 'og:type', ogType);
    if (ogImage) {
      upsertMeta('property', 'og:image', ogImage);
      upsertMeta('name', 'twitter:image', ogImage);
    }
    upsertCanonical(canonical);
    if (canonical) upsertMeta('property', 'og:url', canonical);
    const robots = document.head.querySelector('meta[name="robots"]');
    if (noindex) upsertMeta('name', 'robots', 'noindex');
    else robots?.setAttribute('content', 'index,follow,max-image-preview:large');
  }, [lang, title, description, canonical, altId, altEn, ogImage, ogType, noindex]);
}

/** Head tags for a static route from the SEO registry. */
export function useRouteMeta(key: RouteKey): void {
  const { lang } = useI18n();
  useDocumentMeta(routeHead(key, lang));
}
