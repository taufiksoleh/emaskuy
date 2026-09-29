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
  generatedAt: Date.parse('2026-09-29T07:00:00Z'),
  sentiment: 'neutral',
  bullets: [
    {
      id: 'Emas spot memantul +1,1% ke sekitar $4.163 setelah menyentuh level terendah sekitar dua bulan pada Senin. Pemicunya pembeli yang masuk saat harga murah dan premium Shanghai tertinggi dalam 3 bulan menjelang libur Golden Week China.',
      en: 'Spot gold bounced 1.1% to around $4,163 after hitting a roughly two-month low on Monday, on bargain buying and the highest Shanghai premium in 3 months ahead of China’s Golden Week holiday.',
    },
    {
      id: 'Tekanan utama belum hilang: minyak di atas $100 (usulan Iran membuka Selat Hormuz ditolak AS) menjaga risiko inflasi, dan peluang kenaikan Fed Oktober dipatok mendekati 70% setelah kenaikan 25 bps ke 3,75–4,00% pada 16 Sep. Yield tinggi membatasi pantulan emas.',
      en: 'The main pressure has not gone away: oil above $100 (Washington rejected Iran’s offer to reopen the Strait of Hormuz) keeps inflation risk alive, and odds of an October Fed hike are near 70% after the 25 bp hike to 3.75–4.00% on Sep 16. High yields cap the rebound.',
    },
    {
      id: 'Antam bertahan di Rp2.580.000/gram (turun Rp17.000), sementara buyback anjlok Rp47.000 ke Rp2.375.000. Rupiah yang menembus Rp18.000/USD menahan sebagian penurunan harga emas dalam rupiah.',
      en: 'Antam holds at Rp2,580,000/gram (down Rp17,000) while buyback dropped Rp47,000 to Rp2,375,000. A rupiah breaking through Rp18,000/USD cushions part of the fall in rupiah-denominated gold.',
    },
    {
      id: 'Spread jual–buyback Antam Rp205.000 (7,95%) — biaya transaksi tinggi di pasar yang volatile. Cocok untuk akumulasi bertahap (DCA), bukan jual cepat. Pantau data JOLTS dan CB Consumer Confidence hari ini serta support sekitar $4.140.',
      en: 'Antam’s sell–buyback spread is Rp205,000 (7.95%) — high transaction costs in a volatile market. Suited to gradual accumulation (DCA), not quick sells. Watch today’s JOLTS and CB Consumer Confidence data and support near $4,140.',
    },
  ],
};
