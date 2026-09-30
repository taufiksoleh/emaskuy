/**
 * useDocumentMeta — keep <head> in step with the current page.
 *
 * Updates the tags already in the (prerendered) HTML instead of rendering
 * <title>/<meta> in JSX: React 19 hoists those but does not replace tags
 * already in the document, so the first static <title> would keep winning.
 */
import { useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { ROUTE_META, localize, type HeadData, type RouteKey } from '@/lib/seo';

export type DocumentMeta = Pick<HeadData, 'title' | 'description'> & Partial<Omit<HeadData, 'title' | 'description'>>;

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

export function useDocumentMeta({ title, description, canonical, ogImage, ogType, noindex = false }: DocumentMeta): void {
  useEffect(() => {
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
  }, [title, description, canonical, ogImage, ogType, noindex]);
}

/** Head tags for a static route from the SEO registry. */
export function useRouteMeta(key: RouteKey): void {
  const { lang } = useI18n();
  useDocumentMeta(localize(ROUTE_META[key], lang));
}
