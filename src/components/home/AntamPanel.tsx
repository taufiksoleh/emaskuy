/**
 * Harga Emas Antam — today's Antam (Logam Mulia) prices from
 * src/content/antam.json next to the live spot price: 1-gram and buyback
 * price, the sell–buyback spread, the premium over spot, every bar size the
 * source quoted, Galeri24 and UBS when quoted, and the recent history of
 * Antam, buyback and spot.
 */
import { useState, type CSSProperties } from 'react';
import { Reveal } from '../ui-atoms/Reveal';
import { Scale } from 'lucide-react';
import { registerStrings, useI18n } from '@/lib/i18n';
import { formatDate, formatDateOnly, formatIdr, formatNumber, formatPct, xauUsdToIdrGram } from '@/lib/gold';
import { antamOneGram, antamRows, brandRows, historyWithSpot, staleness, useAntam, type BrandRow } from '@/lib/antam';
import { useDisplay } from '@/hooks/useDisplay';
import { useGoldPrice } from '@/hooks/useGoldPrice';
import { useHistory } from '@/hooks/useHistory';
import { convertMoney, formatMoney } from '@/lib/money';
import { cn, fill } from '@/lib/utils';
import { MultiLineChart } from '../ui-atoms/MultiLineChart';
import { Panel } from '../ui-atoms/Panel';
import { SourceChips } from '../ui-atoms/SourceChips';

registerStrings({
  'antam.title': { id: 'Harga Emas Antam', en: 'Antam Gold Prices' },
  'antam.asOf': { id: 'Data per {date}', en: 'As of {date}' },
  'antam.stale': { id: 'Belum diperbarui {n} hari', en: 'Not updated for {n} days' },
  'antam.sell1g': { id: 'Antam 1 gram', en: 'Antam 1 gram' },
  'antam.buyback': { id: 'Buyback per gram', en: 'Buyback per gram' },
  'antam.spread': { id: 'Selisih jual–buyback', en: 'Sell–buyback spread' },
  'antam.premium': { id: 'Premium vs spot', en: 'Premium over spot' },
  'antam.premium.above': { id: 'di atas spot', en: 'above spot' },
  'antam.premium.below': { id: 'di bawah spot', en: 'below spot' },
  'antam.sizes': { id: 'Harga per ukuran', en: 'Prices by bar size' },
  'antam.col.size': { id: 'Ukuran', en: 'Size' },
  'antam.col.price': { id: 'Harga', en: 'Price' },
  'antam.col.perGram': { id: 'Per gram', en: 'Per gram' },
  'antam.col.vsSpot': { id: 'vs spot', en: 'vs spot' },
  'antam.col.buyback': { id: 'Buyback', en: 'Buyback' },
  'antam.showAll': { id: 'Tampilkan semua ukuran ({n} lagi)', en: 'Show all sizes ({n} more)' },
  'antam.brands': { id: 'Perbandingan merek · 1 gram', en: 'Brand comparison · 1 gram' },
  'antam.col.brand': { id: 'Merek', en: 'Brand' },
  'antam.col.sell': { id: 'Harga jual', en: 'Selling price' },
  'antam.col.spread': { id: 'Selisih', en: 'Spread' },
  'antam.history': { id: 'Riwayat harga per gram', en: 'Price history per gram' },
  'antam.series.antam': { id: 'Antam 1 gram', en: 'Antam 1 gram' },
  'antam.series.buyback': { id: 'Buyback Antam', en: 'Antam buyback' },
  'antam.series.spot': { id: 'Spot (emas murni)', en: 'Spot (pure gold)' },
  'antam.bullet.1': {
    id: 'Premium di atas spot menutup biaya pencetakan, sertifikat, dan distribusi. Persentasenya paling tinggi di ukuran kecil.',
    en: 'The premium over spot covers minting, certification and distribution. It is highest on small bars.',
  },
  'antam.bullet.2': {
    id: 'Saat menjual kembali, yang Anda terima adalah harga buyback, bukan harga jual. Selisihnya adalah biaya bolak-balik Anda.',
    en: 'When you sell back you get the buyback price, not the selling price. The gap is your round-trip cost.',
  },
  'antam.bullet.3': {
    id: 'Penjualan kembali di atas nilai tertentu dapat dikenai PPh 22. Cek ketentuan terbaru di gerai sebelum menjual.',
    en: 'Sales above a certain amount may be subject to PPh 22 income tax. Check the current rules at the outlet before selling.',
  },
  'antam.source': { id: 'Sumber', en: 'Source' },
  'antam.disclaimer': { id: 'Bukan saran investasi', en: 'Not investment advice' },
});


/** Sizes shown on phones before "show all". */
const COMMON_SIZES = new Set([1, 5, 10, 25, 50, 100]);
const BRAND_LABEL: Record<BrandRow['brand'], string> = { antam: 'Antam', galeri24: 'Galeri24', ubs: 'UBS' };

function SummaryCard({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: 'gold' | 'down' }) {
  // As in StatCard: the value shrinks to the card width (cqi) instead of overflowing it.
  const fit = { '--fit': `calc(100cqi / ${Math.max(4, value.length) * 0.62})` } as CSSProperties;
  return (
    <div
      className={cn(
        'rounded-[10px] border bg-bg2 p-4 [container-type:inline-size]',
        tone === 'gold' ? 'border-goldline bg-gold/5' : 'border-hairline',
      )}
      style={fit}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-t3">{label}</p>
      <p
        className={cn(
          'mt-2 font-mono text-[length:min(20px,var(--fit))] font-semibold tabular md:text-[length:min(24px,var(--fit))]',
          tone === 'gold' ? 'text-gold' : tone === 'down' ? 'text-down' : 'text-t1',
        )}
      >
        {value}
      </p>
      {sub && <p className="mt-1.5 text-[11px] text-t3">{sub}</p>}
    </div>
  );
}

export function AntamPanel() {
  const { lang, t } = useI18n();
  const { gold, usdIdr, rates, lastUpdated } = useGoldPrice();
  const { currency } = useDisplay();
  const history = useHistory('1y');
  const antam = useAntam();

  const spot = gold && gold.price > 0 && usdIdr > 0 ? xauUsdToIdrGram(gold.price, usdIdr) : null;
  const sell1g = antamOneGram(antam);
  const buyback = antam.antam.buybackPerGram;
  const spread = sell1g - buyback;
  const premium = spot !== null ? sell1g - spot : null;
  const rows = antamRows(antam, spot);
  const [allSizes, setAllSizes] = useState(false);
  const moreSizes = rows.filter((r) => !COMMON_SIZES.has(r.grams)).length;
  const brands = brandRows(antam);
  const { ageDays, level } = staleness(antam, lastUpdated || undefined);
  const asOf = formatDateOnly(antam.priceDate, lang);
  // Antam prices are in rupiah; other currencies get an approximate figure.
  const approx = (idr: number) => {
    const v = currency === 'IDR' ? null : convertMoney(idr, 'IDR', currency, rates);
    return v === null ? asOf : `${asOf} · ≈ ${formatMoney(v, currency, lang)}`;
  };

  const chartRows = historyWithSpot(antam, history.points);
  const idrShort = (v: number) => `Rp${formatNumber(v / 1e6, lang, { decimals: 2, minDecimals: 2 })} jt`;

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-4 md:px-6">
      <Reveal duration={0.5}>
        <Panel
          glow
          className="relative overflow-hidden"
          title={
            <h2 className="flex flex-wrap items-center gap-2.5 font-display text-xl font-semibold leading-[1.3] tracking-[-0.02em] text-t1">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-goldline bg-gold/10">
                <Scale className="h-4 w-4 text-gold" aria-hidden />
              </span>
              {t('antam.title')}
              <span className="font-body text-xs font-normal text-t3">{fill(t('antam.asOf'), { date: asOf })}</span>
              {level !== 'fresh' && (
                <span
                  className={cn(
                    'rounded-full border px-2 py-0.5 font-body text-[11px] font-medium',
                    level === 'stale' ? 'border-down/40 bg-down/10 text-down' : 'border-goldline bg-gold/10 text-gold',
                  )}
                >
                  {fill(t('antam.stale'), { n: ageDays })}
                </span>
              )}
            </h2>
          }
        >
          <div className="mt-2 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <SummaryCard label={t('antam.sell1g')} value={formatIdr(sell1g, lang)} sub={approx(sell1g)} />
            <SummaryCard label={t('antam.buyback')} value={formatIdr(buyback, lang)} sub={approx(buyback)} />
            <SummaryCard
              label={t('antam.spread')}
              value={formatIdr(spread, lang)}
              sub={`${formatNumber((spread / sell1g) * 100, lang, { decimals: 1 })}%`}
            />
            <SummaryCard
              label={t('antam.premium')}
              value={premium !== null ? formatIdr(premium, lang) : '—'}
              sub={
                premium !== null && spot
                  ? `${formatPct((premium / spot) * 100, lang)} ${t(premium < 0 ? 'antam.premium.below' : 'antam.premium.above')}`
                  : undefined
              }
              tone={premium !== null && premium < 0 ? 'down' : 'gold'}
            />
          </div>

          {rows.length > 1 && (
            <div className="mt-5">
              <h3 className="label-micro">{t('antam.sizes')}</h3>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full text-left font-mono text-[13px] tabular sm:text-sm">
                  <thead>
                    <tr className="border-b border-hairline text-[11px] uppercase tracking-wider text-t3">
                      <th className="py-2 pr-3 font-medium">{t('antam.col.size')}</th>
                      <th className="py-2 pr-3 text-right font-medium">{t('antam.col.price')}</th>
                      <th className="hidden py-2 pr-3 text-right font-medium sm:table-cell">{t('antam.col.perGram')}</th>
                      <th className="hidden py-2 pr-3 text-right font-medium sm:table-cell">{t('antam.col.vsSpot')}</th>
                      <th className="py-2 text-right font-medium">{t('antam.col.buyback')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {rows.map((r) => (
                      <tr
                        key={r.grams}
                        className={cn('text-t2', !allSizes && !COMMON_SIZES.has(r.grams) && 'hidden md:table-row')}
                      >
                        <td className="py-2 pr-3 text-t1">{formatNumber(r.grams, lang, { decimals: 1, minDecimals: 0 })} gr</td>
                        <td className="py-2 pr-3 text-right text-t1">{formatIdr(r.sell, lang)}</td>
                        <td className="hidden py-2 pr-3 text-right sm:table-cell">{formatIdr(r.perGram, lang)}</td>
                        <td className="hidden py-2 pr-3 text-right sm:table-cell">
                          {r.vsSpotPct !== null ? formatPct(r.vsSpotPct, lang) : '—'}
                        </td>
                        <td className="py-2 text-right">{formatIdr(r.buybackTotal, lang)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!allSizes && moreSizes > 0 && (
                <button
                  type="button"
                  onClick={() => setAllSizes(true)}
                  className="mt-2 text-xs font-medium text-gold underline decoration-dotted underline-offset-4 md:hidden"
                >
                  {fill(t('antam.showAll'), { n: moreSizes })}
                </button>
              )}
            </div>
          )}

          {brands.length > 0 && (
            <div className="mt-5">
              <h3 className="label-micro">{t('antam.brands')}</h3>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full text-left font-mono text-[13px] tabular sm:text-sm">
                  <thead>
                    <tr className="border-b border-hairline text-[11px] uppercase tracking-wider text-t3">
                      <th className="py-2 pr-3 font-medium">{t('antam.col.brand')}</th>
                      <th className="py-2 pr-3 text-right font-medium">{t('antam.col.sell')}</th>
                      <th className="py-2 text-right font-medium sm:pr-3">{t('antam.col.buyback')}</th>
                      <th className="hidden py-2 text-right font-medium sm:table-cell">{t('antam.col.spread')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {brands.map((b) => (
                      <tr key={b.brand} className="text-t2">
                        <td className="py-2 pr-3 font-body text-t1">{BRAND_LABEL[b.brand]}</td>
                        <td className="py-2 pr-3 text-right text-t1">{formatIdr(b.sellPerGram, lang)}</td>
                        <td className="py-2 text-right sm:pr-3">{formatIdr(b.buybackPerGram, lang)}</td>
                        <td className="hidden py-2 text-right sm:table-cell">{formatNumber(b.spreadPct, lang, { decimals: 1 })}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {chartRows.length > 1 && (
            <div className="mt-5">
              <h3 className="label-micro">{t('antam.history')}</h3>
              <div className="mt-2">
                <MultiLineChart
                  ariaLabel={t('antam.history')}
                  formatY={idrShort}
                  formatX={(ms) => formatDate(ms, lang)}
                  series={[
                    { key: 'antam', label: t('antam.series.antam'), color: 'var(--gold)', points: chartRows.map((r) => ({ t: r.t, v: r.sell1g })) },
                    { key: 'buyback', label: t('antam.series.buyback'), color: 'var(--info)', points: chartRows.map((r) => ({ t: r.t, v: r.buyback })) },
                    { key: 'spot', label: t('antam.series.spot'), color: 'var(--text-3)', dashed: true, points: chartRows.map((r) => ({ t: r.t, v: r.spot })) },
                  ]}
                />
              </div>
            </div>
          )}

          <ul className="mt-5 space-y-3">
            {(['antam.bullet.1', 'antam.bullet.2', 'antam.bullet.3'] as const).map((key) => (
              <li key={key} className="flex items-start gap-3">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <p className="text-sm leading-relaxed text-t2">{t(key)}</p>
              </li>
            ))}
          </ul>

          <div className="mt-4 border-t border-hairline pt-3">
            <p className="text-[11px] leading-relaxed text-t3">
              {antam.note[lang]} · {t('antam.disclaimer')}
            </p>
            <p className="label-micro mt-3">{t('antam.source')}</p>
            <SourceChips sources={[{ title: antam.source.name, url: antam.source.url }]} className="mt-2" />
          </div>
        </Panel>
      </Reveal>
    </section>
  );
}
