/**
 * AI Insight — rangkuman analisis harian yang ditulis AI dari berita pasar.
 * Membaca dari `src/content/ai-insight.json` (ditulis agen konten, divalidasi
 * di CI). Tampil di beranda setelah ChartPanel.
 */
import { motion } from 'framer-motion';
import { ExternalLink, Sparkles } from 'lucide-react';
import { registerStrings, useI18n } from '@/lib/i18n';
import { ageInDays, formatDate } from '@/lib/gold';
import { formatClockZone } from '@/lib/time';
import { cn } from '@/lib/utils';
import { useAiInsight, type InsightSentiment } from '@/lib/aiInsight';
import { Panel } from '../ui-atoms/Panel';

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
  'ai.disclaimer': {
    id: 'Dihasilkan AI dari berita pasar pada tanggal di atas · Bukan saran investasi',
    en: 'AI-generated from market news on the date above · Not investment advice',
  },
});

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const SENTIMENT_STYLE: Record<InsightSentiment, string> = {
  bullish: 'border-up/40 bg-up/10 text-up',
  bearish: 'border-down/40 bg-down/10 text-down',
  neutral: 'border-goldline bg-gold/10 text-gold',
};

export function AiInsightPanel() {
  const { lang, t } = useI18n();
  const insight = useAiInsight();
  const age = ageInDays(insight.generatedAt);

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-4 md:px-6">
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease }}
      >
        <Panel
          glow
          className="relative overflow-hidden"
          title={
            <span className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-goldline bg-gold/10">
                <Sparkles className="h-4 w-4 text-gold" />
              </span>
              {age === 0 ? t('ai.title') : `${t('ai.titleDated')} · ${formatDate(insight.generatedAt, lang)}`}
              {age > 2 && (
                <span className="rounded-full border border-down/40 bg-down/10 px-2 py-0.5 font-body text-[11px] font-medium text-down">
                  {t('ai.stale')}
                </span>
              )}
              <span className="rounded-md border border-goldline bg-bg3 px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-widest text-gold">
                {t('ai.badge')}
              </span>
            </span>
          }
          actions={
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-display text-xs font-semibold',
                SENTIMENT_STYLE[insight.sentiment],
              )}
            >
              <span className="hidden text-t3 sm:inline">{t('ai.sentimentLabel')}</span>
              {t(`ai.sentiment.${insight.sentiment}`)}
            </span>
          }
        >
          <ul className="mt-4 space-y-3">
            {insight.bullets.map((b, i) => (
              <motion.li
                key={i}
                initial={{ x: -10, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.35, ease, delay: 0.08 + i * 0.07 }}
                className="flex items-start gap-3"
              >
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <p className="text-sm leading-relaxed text-t2">{lang === 'id' ? b.id : b.en}</p>
              </motion.li>
            ))}
          </ul>
          {insight.sources.length > 0 && (
            <p className="mt-4 text-[11px] leading-relaxed text-t3">
              {t('ai.sources')}:{' '}
              {insight.sources.map((s, i) => (
                <span key={s.url}>
                  {i > 0 && ' · '}
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 underline decoration-dotted hover:text-gold"
                  >
                    {s.title}
                    <ExternalLink className="h-3 w-3" aria-hidden />
                  </a>
                </span>
              ))}
            </p>
          )}
          <p className="mt-4 border-t border-hairline pt-3 text-[11px] leading-relaxed text-t3">
            {formatDate(insight.generatedAt, lang)},{' '}
            {formatClockZone(insight.generatedAt, lang, { tz: 'Asia/Jakarta' })} · {t('ai.disclaimer')}
          </p>
        </Panel>
      </motion.div>
    </section>
  );
}
