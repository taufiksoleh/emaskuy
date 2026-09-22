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
  generatedAt: Date.parse('2026-09-22T02:00:00Z'),
  sentiment: 'neutral',
  bullets: [
    {
      id: 'Kenaikan Fed 25 bps (16 September) memicu koreksi ~6% bulan ini, tetapi harga bertahan di atas $4.300 — pola koreksi taktis, bukan pembalikan tren.',
      en: 'The Fed’s 25bp hike (Sep 16) triggered a ~6% monthly correction, yet price holds above $4,300 — a tactical pullback pattern, not a trend reversal.',
    },
    {
      id: 'Lantai struktural tetap kokoh: bank sentral menyerap 288,9 ton pada Q2 2026 dan 89% berencana menambah cadangan — penurunan tajam konsisten terserap cepat.',
      en: 'The structural floor stays firm: central banks absorbed 288.9t in Q2 2026 and 89% plan to add reserves — sharp dips keep getting absorbed quickly.',
    },
    {
      id: 'Risiko terdekat: 16 dari 18 pejabat FOMC memproyeksikan satu kenaikan lagi sebelum akhir tahun. Variabel yang wajib diawasi adalah imbal hasil riil 10-tahun, bukan headline.',
      en: 'Near-term risk: 16 of 18 FOMC officials project one more hike before year-end. The variable to watch is the 10-year real yield, not the headlines.',
    },
    {
      id: 'Untuk investor IDR: rupiah di ~17.800/USD menahan sebagian koreksi — Antam hanya turun Rp71.000/gram bulan ini. Fase seperti ini secara historis cocok untuk akumulasi bertahap (DCA).',
      en: 'For IDR investors: the rupiah near 17,800/USD cushioned the dip — Antam fell only Rp71k/gram this month. Phases like this have historically suited staged DCA accumulation.',
    },
  ],
};
