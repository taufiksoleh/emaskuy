/**
 * Page: Dashboard (Home) — `/`  (design home.md)
 */
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { registerStrings, useI18n } from '@/lib/i18n';
import { useGoldPrice } from '@/hooks/useGoldPrice';
import { TickerStrip } from '@/components/home/TickerStrip';
import { HeroBand } from '@/components/home/HeroBand';
import { ChartPanel } from '@/components/home/ChartPanel';
import { AiInsightPanel } from '@/components/home/AiInsightPanel';
import { AlertsPanel } from '@/components/home/AlertsPanel';
import { AntamPanel } from '@/components/home/AntamPanel';
import { StatsGrid } from '@/components/home/StatsGrid';
import { AnalysisPreview } from '@/components/home/AnalysisPreview';
import { CtaBand } from '@/components/home/CtaBand';

registerStrings({
  'home.hero.label': { id: 'Harga Emas Spot', en: 'Spot Gold Price' },
  'home.hero.today': { id: 'hari ini', en: 'today' },
  'home.hero.perOz': { id: 'Per troy ounce', en: 'Per troy ounce' },
  'home.hero.perGram': { id: 'Per gram', en: 'Per gram' },
  'home.hero.source': { id: 'Sumber', en: 'Source' },
  'home.hero.updated': { id: 'Diperbarui', en: 'Updated' },
  'home.hero.refresh': { id: 'Muat ulang', en: 'Refresh' },
  'home.stats.gramIdr': { id: 'Harga per Gram (IDR)', en: 'Price per Gram (IDR)' },
  'home.stats.usdIdr': { id: 'Kurs USD/IDR', en: 'USD/IDR Rate' },
  'home.stats.fxSource': { id: 'Sumber: Frankfurter (ECB)', en: 'Source: Frankfurter (ECB)' },
  'home.stats.change24': { id: 'Perubahan 24 Jam', en: '24h Change' },
  'home.stats.change30': { id: 'Perubahan 30 Hari', en: '30d Change' },
  'home.stats.high52': { id: 'Tertinggi 52 Minggu', en: '52-Week High' },
  'home.stats.low52': { id: 'Terendah 52 Minggu', en: '52-Week Low' },
  'home.stats.reached': { id: 'dicapai', en: 'reached' },
  'home.stats.ratio': { id: 'Rasio Emas/Perak', en: 'Gold/Silver Ratio' },
  'home.stats.ratioAvg': { id: 'Rata-rata 10th: 68', en: '10y avg: 68' },
  'home.stats.vol30': { id: 'Volatilitas 30 Hari', en: '30d Volatility' },
  'home.chart.title': { id: 'Grafik Harga Emas', en: 'Gold Price Chart' },
  'home.chart.footnote': {
    id: '7D–1Y: seri harian resmi (NBP) dinormalisasi ke harga live · ALL: histori penuh sejak 2013 · 1H/24H: tick live dari sesi browser Anda',
    en: '7D–1Y: official daily series (NBP) normalized to live price · ALL: full history since 2013 · 1H/24H: live ticks from your browser session',
  },
  'home.metals.title': { id: 'Perbandingan Multi-Logam', en: 'Multi-Metal Comparison' },
  'home.conv.title': { id: 'Konverter Cepat', en: 'Quick Converter' },
  'home.conv.amount': { id: 'Jumlah', en: 'Amount' },
  'home.conv.youGet': { id: 'Anda mendapatkan', en: 'You get' },
  'home.conv.note': {
    id: 'Menggunakan harga spot live gold-api.com + kurs Frankfurter (ECB).',
    en: 'Using live gold-api.com spot price + Frankfurter (ECB) rate.',
  },
  'home.analysis.title': { id: 'Analisis Terbaru', en: 'Latest Analysis' },
  'home.analysis.viewAll': { id: 'Lihat Semua', en: 'View All' },
  'home.cta.headline': {
    id: 'Berapa nilai emas Anda 10 tahun lagi?',
    en: 'What could your gold be worth in 10 years?',
  },
  'home.cta.body': {
    id: 'Simulasikan investasi lump-sum dan DCA dengan harga emas live hari ini.',
    en: "Simulate lump-sum and DCA strategies using today's live gold price.",
  },
  'home.cta.openCalc': { id: 'Buka Kalkulator', en: 'Open Calculator' },
  'home.cta.methodology': { id: 'Pelajari Metodologi', en: 'Read Methodology' },
});

export default function Home() {
  const { t } = useI18n();
  const { status, loading } = useGoldPrice();
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const showBanner = !loading && status === 'offline' && !bannerDismissed;

  return (
    <>
      <TickerStrip />
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-b border-hairline bg-bg2"
          >
            <div className="mx-auto flex max-w-[1440px] items-center gap-2 px-4 py-2 md:px-6">
              <span className="h-2 w-2 rounded-full bg-down" />
              <span className="text-xs text-t2">{t('common.offlineBanner')}</span>
              <button
                onClick={() => setBannerDismissed(true)}
                aria-label="Dismiss"
                className="ml-auto cursor-pointer text-t3 transition-colors hover:text-t1"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <HeroBand />
      <ChartPanel />
      <AiInsightPanel />
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-0 xl:grid-cols-2">
        <AlertsPanel />
        <AntamPanel />
      </div>
      <StatsGrid />
      <AnalysisPreview />
      <div className="mb-8">
        <CtaBand />
      </div>
    </>
  );
}
