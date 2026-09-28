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
  generatedAt: Date.parse('2026-09-28T03:00:00Z'),
  sentiment: 'bearish',
  bullets: [
    {
      id: 'Tekanan jual mendominasi pagi ini: emas spot turun 1,71% ke $4.211 dan total -5,17% dalam sebulan — ditahan trio dolar AS yang kuat, yield Treasury tertinggi hampir dua dekade, dan odds kenaikan Fed Oktober yang kini ~69% (CME FedWatch).',
      en: 'Selling pressure dominates this morning: spot gold fell 1.71% to $4,211, now down 5.17% over the month — weighed down by a strong dollar, Treasury yields at near two-decade highs, and October Fed-hike odds around 69% (CME FedWatch).',
    },
    {
      id: 'Pelipur lara: support $4.200 dan $4.157 masih utuh, dan 60-day moving average kembali menahan penurunan seperti 16 September lalu. Goldman Sachs juga tetap mematok target $4.650 untuk akhir 2026.',
      en: 'The silver lining: support at $4,200 and $4,157 holds, and the 60-day moving average is containing the drop just as it did on September 16. Goldman Sachs also still targets $4,650 by year-end 2026.',
    },
    {
      id: 'Pekan data yang padat menanti: JOLTS dan consumer confidence (Selasa), ADP dan PDB Q2 (Rabu), lalu jobless claims dan PMI manufaktur (Kamis). Volatilitas dua arah hampir pasti terjadi.',
      en: 'A packed data week lies ahead: JOLTS and consumer confidence (Tuesday), ADP and Q2 GDP (Wednesday), then jobless claims and manufacturing PMI (Thursday). Two-way volatility is almost guaranteed.',
    },
    {
      id: 'Investor IDR: Antam sempat turun dua hari ke Rp2,59 juta/gram lalu rebound ke Rp2.613.000 (26 Sep). Koreksi ini lebih tepat dibaca sebagai window DCA, bukan alasan panik.',
      en: 'IDR investors: Antam fell for two days to Rp2.59M/gram before rebounding to Rp2,613,000 (Sep 26). This correction is better read as a DCA window, not a reason to panic.',
    },
  ],
};
