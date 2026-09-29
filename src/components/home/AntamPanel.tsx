/**
 * Antam vs Spot — perbandingan live antara harga spot teoretis (XAU/USD
 * dikonversi ke IDR/gram) dan harga dasar Antam 1 gram dari
 * `src/data/antam.ts` (diperbarui otomatis oleh penjadwal setiap 09.00 WIB).
 */
import { motion } from 'framer-motion';
import { Scale } from 'lucide-react';
import { registerStrings, useI18n } from '@/lib/i18n';
import { formatDate, formatIdr, formatPct, xauUsdToIdrGram } from '@/lib/gold';
import { useGoldPrice } from '@/hooks/useGoldPrice';
import { ANTAM } from '@/data/antam';
import { Panel } from '../ui-atoms/Panel';

registerStrings({
  'antam.title': { id: 'Antam vs Spot', en: 'Antam vs Spot' },
  'antam.spot.label': { id: 'Harga Spot Teoretis', en: 'Theoretical Spot' },
  'antam.spot.caption': { id: 'Live XAU/USD → IDR/gram', en: 'Live XAU/USD → IDR/gram' },
  'antam.antam.label': { id: 'Harga Antam 1gr', en: 'Antam 1g Price' },
  'antam.premium.label': { id: 'Premium', en: 'Premium' },
  'antam.premium.above': { id: 'di atas spot', en: 'above spot' },
  'antam.bar.antam': { id: 'Antam', en: 'Antam' },
  'antam.bar.spot': { id: 'Spot', en: 'Spot' },
  'antam.bullet.1': {
    id: 'Premium mencakup biaya fabrikasi, sertifikasi, dan distribusi hingga ke gerai ritel.',
    en: 'The premium covers fabrication, certification, and distribution costs to retail outlets.',
  },
  'antam.bullet.2': {
    id: 'Persentase premium tertinggi ada pada denominasi kecil dan menyusut pada batangan besar.',
    en: 'Premium % is highest on small denominations and shrinks on larger bars.',
  },
  'antam.bullet.3': {
    id: 'Saat menjual kembali, harga buyback Antam lebih menentukan daripada spot — pantau tren premiumnya, bukan hanya spot.',
    en: "When reselling, Antam's buyback price matters more than spot — track the premium trend, not just spot.",
  },
  'antam.disclaimer': { id: 'Bukan saran investasi', en: 'Not investment advice' },
});

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function AntamPanel() {
  const { lang, t } = useI18n();
  const { gold, usdIdr, loading } = useGoldPrice();

  const spotIdr = gold && usdIdr ? xauUsdToIdrGram(gold.price, usdIdr) : null;
  const premiumIdr = spotIdr != null ? ANTAM.gramIdr - spotIdr : null;
  const premiumPct =
    spotIdr != null && spotIdr > 0 ? ((ANTAM.gramIdr - spotIdr) / spotIdr) * 100 : null;
  const spotShare =
    spotIdr != null && ANTAM.gramIdr > 0
      ? Math.min(100, Math.max(0, (spotIdr / ANTAM.gramIdr) * 100))
      : null;

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
                <Scale className="h-4 w-4 text-gold" />
              </span>
              {t('antam.title')}
            </span>
          }
        >
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {/* (a) Theoretical spot */}
            <div className="rounded-[10px] border border-hairline bg-bg2 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-t3">
                {t('antam.spot.label')}
              </p>
              {loading || spotIdr == null ? (
                <div className="skeleton-shimmer mt-2 h-8 w-3/4 rounded" />
              ) : (
                <p className="mt-2 font-mono text-2xl font-semibold tabular text-t1">
                  {formatIdr(spotIdr, lang)}
                </p>
              )}
              <p className="mt-1.5 text-[11px] text-t3">{t('antam.spot.caption')}</p>
            </div>

            {/* (b) Antam 1g price */}
            <div className="rounded-[10px] border border-hairline bg-bg2 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-t3">
                {t('antam.antam.label')}
              </p>
              <p className="mt-2 font-mono text-2xl font-semibold tabular text-t1">
                {formatIdr(ANTAM.gramIdr, lang)}
              </p>
              <p className="mt-1.5 text-[11px] text-t3">
                {formatDate(Date.parse(ANTAM.date), lang)}
              </p>
            </div>

            {/* (c) Premium */}
            <div className="rounded-[10px] border border-goldline bg-gold/5 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-t3">
                {t('antam.premium.label')}
              </p>
              {loading || premiumIdr == null || premiumPct == null ? (
                <div className="skeleton-shimmer mt-2 h-8 w-3/4 rounded" />
              ) : (
                <>
                  <p className="mt-2 font-mono text-2xl font-semibold tabular text-gold">
                    {formatIdr(premiumIdr, lang)}
                  </p>
                  <p className="mt-1.5 font-mono text-sm tabular text-gold">
                    {formatPct(premiumPct, lang)}
                    <span className="ml-1.5 font-body text-[11px] text-t3">
                      {t('antam.premium.above')}
                    </span>
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Premium share bar: Antam bar full width, spot portion overlaid brighter */}
          <div className="mt-5">
            <div className="relative h-2.5 overflow-hidden rounded-full bg-golddim">
              {spotShare != null && (
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gold"
                  style={{ width: `${spotShare}%` }}
                />
              )}
            </div>
            <div className="mt-1.5 flex justify-between text-[11px] text-t3">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                {t('antam.bar.spot')}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-golddim" />
                {t('antam.bar.antam')}
              </span>
            </div>
          </div>

          <ul className="mt-4 space-y-3">
            {(['antam.bullet.1', 'antam.bullet.2', 'antam.bullet.3'] as const).map((key, i) => (
              <motion.li
                key={key}
                initial={{ x: -10, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.35, ease, delay: 0.08 + i * 0.07 }}
                className="flex items-start gap-3"
              >
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <p className="text-sm leading-relaxed text-t2">{t(key)}</p>
              </motion.li>
            ))}
          </ul>

          <p className="mt-4 border-t border-hairline pt-3 text-[11px] leading-relaxed text-t3">
            {ANTAM.note[lang]} · {t('antam.disclaimer')}
          </p>
        </Panel>
      </motion.div>
    </section>
  );
}
