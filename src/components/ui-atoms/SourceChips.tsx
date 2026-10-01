/**
 * Source links as compact chips: the site's favicon and short name (Kitco,
 * Bloomberg Technoz, …). Each chip opens the source in a new tab; the full
 * title stays available as the tooltip and the accessible label. Used under
 * the AI insight and at the end of articles.
 */
import { useState } from 'react';
import { Globe } from 'lucide-react';
import { registerStrings, useI18n } from '@/lib/i18n';
import { sourceSite } from '@/lib/sourceSite';
import { cn, fill } from '@/lib/utils';

registerStrings({
  'sources.opens': { id: '{title} (buka di tab baru)', en: '{title} (opens in a new tab)' },
});

export interface SourceLink {
  title: string;
  url: string;
}

export function SourceChips({ sources, className }: { sources: SourceLink[]; className?: string }) {
  const { t } = useI18n();
  return (
    <ul className={cn('flex flex-wrap gap-2', className)}>
      {sources.map((s) => {
        const site = sourceSite(s.url);
        const name = site?.name ?? s.title;
        // Titles usually lead with the outlet ("Kitco: …"); don't say it twice.
        const label = s.title.toLowerCase().startsWith(name.toLowerCase()) ? s.title : `${name}: ${s.title}`;
        return (
          <li key={s.url}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              title={s.title}
              aria-label={fill(t('sources.opens'), { title: label })}
              className="inline-flex max-w-[16rem] items-center gap-1.5 rounded-full border border-hairline bg-bg3 py-1 pl-1.5 pr-2.5 text-xs text-t2 transition-colors hover:border-goldline hover:text-gold focus-visible:border-goldline focus-visible:text-gold"
            >
              <SiteIcon src={site?.icon} />
              <span className="truncate">{name}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/** Site favicon, or a globe when there is none or it fails to load. */
function SiteIcon({ src }: { src?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <Globe className="h-4 w-4 shrink-0 text-t3" aria-hidden />;
  return (
    <img
      src={src}
      alt=""
      width={16}
      height={16}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="h-4 w-4 shrink-0 rounded-sm"
    />
  );
}
