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
  generatedAt: Date.parse('2026-09-23T02:00:00Z'),
  sentiment: 'neutral',
  bullets: [
    {
      id: 'Emas berhenti jatuh seminggu pasca kenaikan Fed: spot $4.347 memantul dari titik terendah mingguan $4.290 — pola klasik "jual rumor, beli berita" sedang berjalan.',
      en: 'Gold has stopped falling one week after the Fed hike: spot at $4,347 is rebounding from a weekly low of $4,290 — the classic "sell the rumor, buy the news" pattern is playing out.',
    },
    {
      id: 'Kurva futures menanjak rapi (contango): Des 2026 $4.400 → Mei 2027 $4.469. Uang institusional memproyeksikan pemulihan bertahap, bukan koreksi berlanjut.',
      en: 'The futures curve slopes cleanly upward (contango): Dec 2026 $4,400 → May 2027 $4,469. Institutional money is pricing a gradual recovery, not further decline.',
    },
    {
      id: 'Namun Wall Street terbelah tajam: target akhir 2026 JPMorgan $6.300 vs Goldman Sachs $5.400 — selisih $900. Ketidakpastian masih tinggi; posisi net long padat (~228 rb kontrak) bisa memperbesar gerakan ke dua arah.',
      en: 'But Wall Street is sharply split: JPMorgan targets $6,300 for year-end 2026 vs Goldman Sachs at $5,400 — a $900 gap. Uncertainty remains high; crowded net-long positioning (~228k contracts) can amplify moves both ways.',
    },
    {
      id: 'Investor IDR: harga bertahan ~Rp2,49 juta/gram (kurs 17.820). Fase sideways pasca-kejutan Fed secara historis fase paling produktif untuk DCA — selama $4.290 bertahan, struktur pemulihan utuh.',
      en: 'IDR investors: price holds ~Rp2.49M/gram (17,820 rate). Sideways phases after a Fed shock have historically been the most productive for DCA — as long as $4,290 holds, the recovery structure is intact.',
    },
  ],
};
