/**
 * useDocumentMeta — set the tab title and description for the current page.
 *
 * Updates the existing tags in <head> instead of rendering <title>/<meta>
 * in JSX: React 19 hoists those but does not replace tags already in the
 * HTML, so the first (static) <title> would keep winning.
 */
import { useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { ROUTE_META, localize, type RouteKey } from '@/lib/seo';

export interface DocumentMeta {
  title: string;
  description?: string;
  noindex?: boolean;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function useDocumentMeta({ title, description, noindex = false }: DocumentMeta): void {
  useEffect(() => {
    document.title = title;
    upsertMeta('property', 'og:title', title);
    if (description) {
      upsertMeta('name', 'description', description);
      upsertMeta('property', 'og:description', description);
    }
    const robots = document.head.querySelector('meta[name="robots"]');
    if (noindex) upsertMeta('name', 'robots', 'noindex');
    else robots?.remove();
  }, [title, description, noindex]);
}

/** Title and description for a static route from the SEO registry. */
export function useRouteMeta(key: RouteKey): void {
  const { lang } = useI18n();
  useDocumentMeta(localize(ROUTE_META[key], lang));
}
