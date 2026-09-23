/**
 * Antam 1g base price — REWRITTEN DAILY by the cron job (auto-updated every
 * 09.00 WIB). Do NOT change the `AntamQuote` interface without updating the
 * cron prompt that regenerates this file, or the daily rewrite will break.
 */
export interface AntamQuote {
  date: string;
  gramIdr: number;
  note: { id: string; en: string };
}

export const ANTAM: AntamQuote = {
  date: '2026-09-23',
  gramIdr: 2627000,
  note: {
    id: 'Harga dasar Antam 1 gram terakhir yang dikutip media (23 Sep 2026, turun Rp1.000 dari hari sebelumnya). Diperbarui otomatis oleh AI setiap 09.00 WIB.',
    en: 'Latest media-quoted Antam 1g base price (Sep 23, 2026, down Rp1,000 from the previous day). Auto-updated by AI daily at 09:00 WIB.',
  },
};
