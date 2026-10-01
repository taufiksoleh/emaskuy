/**
 * AI Insight — rangkuman analisis harian yang ditulis AI dari berita pasar.
 * Membaca dari `src/content/ai-insight.json` (ditulis agen konten, divalidasi
 * di CI). Tampil di beranda setelah ChartPanel. Kuy, maskot koin emas
 * bersayap, melayang di pojok atas panel dan "mengucapkan" isinya lewat
 * bubble dialog.
 */
import { Reveal } from '../ui-atoms/Reveal';
import { useState } from 'react';
import { Globe } from 'lucide-react';
import { registerStrings, useI18n } from '@/lib/i18n';
import { ageInDays, formatDate } from '@/lib/gold';
import { formatClockZone } from '@/lib/time';
import { cn, fill } from '@/lib/utils';
import { useAiInsight, type InsightSentiment } from '@/lib/aiInsight';
import { sourceSite } from '@/lib/sourceSite';
import { Panel } from '../ui-atoms/Panel';
import { SpeechBubble } from '../ui-atoms/SpeechBubble';
import { InsightMascot } from './InsightMascot';

registerStrings({
  'ai.title': { id: 'AI Insight Hari Ini', en: "Today's AI Insight" },
  'ai.titleDated': { id: 'AI Insight', en: 'AI Insight' },
  'ai.stale': { id: 'Belum diperbarui', en: 'Not updated recently' },
  'ai.badge': { id: 'AI', en: 'AI' },
  'ai.sentiment.bullish': { id: 'Bullish', en: 'Bullish' },
  'ai.sentiment.bearish': { id: 'Bearish', en: 'Bearish' },
  'ai.sentiment.neutral': { id: 'Netral', en: 'Neutral' },
  'ai.sentimentLabel': { id: 'Sentimen', en: 'Sentiment' },
  'ai.sources': { id: 'Sumber', en: 'Sources' },
  'ai.sourceOpens': { id: '{title} (buka di tab baru)', en: '{title} (opens in a new tab)' },
  'ai.disclaimer': {
    id: 'Dihasilkan AI dari berita pasar pada tanggal di atas · Bukan saran investasi',
    en: 'AI-generated from market news on the date above · Not investment advice',
  },
  'ai.mascot.name': { id: 'Kuy', en: 'Kuy' },
  'ai.mascot.tagline': { id: '{name}, asisten emas kamu', en: '{name}, your gold sidekick' },
  'ai.mascot.says': { id: 'Kata {name}', en: '{name} says' },
});

const SENTIMENT_STYLE: Record<InsightSentiment, string> = {
  bullish: 'border-up/40 bg-up/10 text-up',
  bearish: 'border-down/40 bg-down/10 text-down',
  neutral: 'border-goldline bg-gold/10 text-gold',
};

export function AiInsightPanel() {
  const { lang, t } = useI18n();
  const insight = useAiInsight();
  const age = ageInDays(insight.generatedAt);
  const name = t('ai.mascot.name');

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-4 md:px-6">
      <Reveal amount={0.2} duration={0.5}>
        <Panel glow className="relative overflow-hidden">
          {/* Maskot melayang di pojok kiri atas, judul di sampingnya */}
          <div className="flex items-start gap-3 md:gap-4">
            <div className="h-16 w-16 shrink-0 md:h-[72px] md:w-[72px]">
              <InsightMascot sentiment={insight.sentiment} />
            </div>
            <div className="min-w-0 flex-1 pt-1.5 md:pt-2">
              <h2 className="flex flex-wrap items-center gap-2 font-display text-xl font-semibold leading-[1.3] tracking-[-0.02em] text-t1">
                {age === 0 ? t('ai.title') : `${t('ai.titleDated')} · ${formatDate(insight.generatedAt, lang)}`}
                {age > 2 && (
                  <span className="rounded-full border border-down/40 bg-down/10 px-2 py-0.5 font-body text-[11px] font-medium text-down">
                    {t('ai.stale')}
                  </span>
                )}
                <span className="rounded-md border border-goldline bg-bg3 px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-widest text-gold">
                  {t('ai.badge')}
                </span>
              </h2>
              <p className="mt-1 text-xs text-t3">{fill(t('ai.mascot.tagline'), { name })}</p>
            </div>
          </div>

          {/* Ekor bubble menunjuk ke maskot di atasnya */}
          <SpeechBubble className="mt-3 md:mt-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="label-micro">{fill(t('ai.mascot.says'), { name })}</span>
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-display text-xs font-semibold',
                  SENTIMENT_STYLE[insight.sentiment],
                )}
              >
                <span className="hidden text-t3 sm:inline">{t('ai.sentimentLabel')}</span>
                {t(`ai.sentiment.${insight.sentiment}`)}
              </span>
            </div>
            <ul className="mt-4 space-y-3">
              {insight.bullets.map((b, i) => (
                <Reveal key={i} as="li" x={-10} y={0} amount={0.4} duration={0.35} delay={0.08 + i * 0.07} className="flex items-start gap-3">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  <p className="text-sm leading-relaxed text-t2">{lang === 'id' ? b.id : b.en}</p>
                </Reveal>
              ))}
            </ul>
            {insight.sources.length > 0 && (
              <div className="mt-4 border-t border-hairline pt-3">
                <p className="label-micro">{t('ai.sources')}</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {insight.sources.map((s) => {
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
                          aria-label={fill(t('ai.sourceOpens'), { title: label })}
                          className="inline-flex max-w-[16rem] items-center gap-1.5 rounded-full border border-hairline bg-bg3 py-1 pl-1.5 pr-2.5 text-xs text-t2 transition-colors hover:border-goldline hover:text-gold focus-visible:border-goldline focus-visible:text-gold"
                        >
                          <SiteIcon src={site?.icon} />
                          <span className="truncate">{name}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </SpeechBubble>
          <p className="mt-4 border-t border-hairline pt-3 text-[11px] leading-relaxed text-t3">
            {formatDate(insight.generatedAt, lang)},{' '}
            {formatClockZone(insight.generatedAt, lang, { tz: 'Asia/Jakarta' })} · {t('ai.disclaimer')}
          </p>
        </Panel>
      </Reveal>
    </section>
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
