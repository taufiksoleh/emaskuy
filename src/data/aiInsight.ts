/**
 * EmasKuy — AI Insight harian.
 *
 * File ini DITULIS ULANG setiap hari oleh penjadwal (cron 09.00 WIB):
 * AI membaca berita pasar hari itu, lalu merangkum 3–4 insight singkat
 * bilingual beserta sentimen pasar. Komponen `AiInsightPanel` di beranda
 * membaca dari sini — jangan mengubah bentuk interface tanpa
 * memperbarui prompt cron.
 */

export type InsightSentiment = 'bullish' | 'bearish' | 'neutral';

export interface AiInsight {
  /** Waktu insight dihasilkan (unix ms). */
  generatedAt: number;
  /** Sentimen pasar emas untuk 24–72 jam ke depan. */
  sentiment: InsightSentiment;
  /** 3–4 insight singkat (maks. ~2 kalimat per butir). */
  bullets: { id: string; en: string }[];
}

export const AI_INSIGHT: AiInsight = {
  generatedAt: Date.parse('2026-09-29T03:00:00Z'),
  sentiment: 'bearish',
  bullets: [
    {
      id: 'Tekanan jual berlanjut: emas spot turun 2,95% ke $4.159,92 (terendah intraday $4.139,69) dan futures -3% — reli minyak memperkuat ekspektasi kenaikan Fed Oktober. Total penurunan sebulan kini 6,65%.',
      en: 'Selling pressure continues: spot gold fell 2.95% to $4,159.92 (intraday low $4,139.69) and futures dropped 3% — rising oil is strengthening expectations of an October Fed hike. The monthly decline now totals 6.65%.',
    },
    {
      id: 'Katalis hari ini: rilis JOLTS dan CB Consumer Confidence (29 Sep). Data pasar tenaga kerja yang masih ketat bisa membawa emas menembus support $4.157 menuju $4.000; data lemah membuka pantulan ke $4.313.',
      en: 'Today\u2019s catalysts: JOLTS and CB Consumer Confidence (Sep 29). Still-tight labor data could push gold through $4,157 support toward $4,000; weak data opens a rebound to $4,313.',
    },
    {
      id: 'Antam turun Rp17.000 ke Rp2.580.000 — terendah sejak Januari 2026. Namun rupiah yang melemah mendekati Rp18.000/USD menahan sebagian penurunan: versi rupiah jatuh lebih dangkal daripada versi dolar.',
      en: 'Antam fell Rp17,000 to Rp2,580,000 — the lowest since January 2026. But a rupiah weakening toward Rp18,000/USD cushioned part of the drop: the rupiah-denominated decline is shallower than the dollar one.',
    },
    {
      id: 'Spread jual–buyback Antam melebar ke Rp205.000 — biaya transaksi naik saat pasar volatile. Ini saatnya akumulasi bertahap (DCA), bukan jual cepat yang terkunci rugi spread.',
      en: 'Antam\u2019s sell–buyback spread widened to Rp205,000 — transaction costs rise in volatile markets. This is a time for gradual accumulation (DCA), not quick sells locked into the spread loss.',
    },
  ],
};
