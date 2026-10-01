/**
 * Turns a source URL into what the UI shows for it: a short site name and a
 * favicon. Used by the AI insight's source chips, where a full article title
 * is too long; the title stays available as the link's tooltip.
 */

/** Hosts whose bare domain reads poorly as a name. Keys have no `www.`. */
const SITE_NAMES: Record<string, string> = {
  'bloombergtechnoz.com': 'Bloomberg Technoz',
  'bisnis.com': 'Bisnis.com',
  'cnbc.com': 'CNBC',
  'cnbcindonesia.com': 'CNBC Indonesia',
  'detik.com': 'detik',
  'finance.yahoo.com': 'Yahoo Finance',
  'galeri24.co.id': 'Galeri 24',
  'goldstockcanada.com': 'Gold Stock Canada',
  'gold.org': 'World Gold Council',
  'indexbox.io': 'IndexBox',
  'investing.com': 'Investing.com',
  'kitco.com': 'Kitco',
  'kompas.com': 'Kompas',
  'kontan.co.id': 'Kontan',
  'logammulia.com': 'Logam Mulia',
  'reuters.com': 'Reuters',
  'riotimesonline.com': 'Rio Times',
  'suara.com': 'Suara.com',
  'tradingeconomics.com': 'Trading Economics',
  'usagold.com': 'USAGOLD',
};

export interface SourceSite {
  /** Hostname without `www.`, e.g. `kitco.com` */
  host: string;
  /** Display name, e.g. `Kitco`; falls back to `host` */
  name: string;
  /** 32 px favicon via Google's favicon service */
  icon: string;
}

/** `null` for a URL that doesn't parse. */
export function sourceSite(url: string): SourceSite | null {
  let hostname: string;
  try {
    hostname = new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
  const host = hostname.replace(/^www\./, '');
  // Subdomains such as money.kompas.com share their parent's name.
  const parts = host.split('.');
  const known =
    SITE_NAMES[host] ??
    parts.map((_, i) => SITE_NAMES[parts.slice(i).join('.')]).find(Boolean);
  return {
    host,
    name: known ?? host,
    icon: `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=32`,
  };
}
