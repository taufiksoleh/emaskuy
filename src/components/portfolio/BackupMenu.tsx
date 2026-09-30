/**
 * BackupMenu — export the portfolio (JSON backup, CSV for spreadsheets) and
 * import a backup file. The portfolio exists only in this browser.
 */
import { useRef } from 'react';
import { Download, FileSpreadsheet, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { registerStrings, useI18n } from '@/lib/i18n';
import { isoDateLocal } from '@/lib/gold';
import type { Holding } from '@/lib/portfolio';
import { downloadText, exportCsv, exportJson, parseBackup } from '@/lib/portfolioBackup';

registerStrings({
  'backup.title': { id: 'Cadangan data', en: 'Backup' },
  'backup.help': {
    id: 'Portofolio hanya tersimpan di browser ini. Unduh cadangan agar data tidak hilang saat ganti HP atau menghapus data browser.',
    en: 'The portfolio is stored only in this browser. Download a backup so it survives a new phone or cleared browser data.',
  },
  'backup.exportJson': { id: 'Unduh cadangan', en: 'Download backup' },
  'backup.exportCsv': { id: 'Ekspor CSV (Excel)', en: 'Export CSV (Excel)' },
  'backup.import': { id: 'Pulihkan dari file', en: 'Restore from file' },
  'backup.error.too_large': { id: 'File terlalu besar', en: 'The file is too large' },
  'backup.error.not_json': { id: 'File ini bukan cadangan EmasKuy', en: 'This is not an EmasKuy backup' },
  'backup.error.wrong_app': { id: 'File ini bukan cadangan EmasKuy', en: 'This is not an EmasKuy backup' },
  'backup.error.unsupported_version': {
    id: 'Cadangan ini dari versi EmasKuy yang lebih baru. Muat ulang halaman lalu coba lagi.',
    en: 'This backup is from a newer EmasKuy version. Reload the page and try again.',
  },
  'backup.error.empty': { id: 'Tidak ada data yang bisa dipulihkan di file ini', en: 'The file has nothing to restore' },
});

export function BackupMenu({
  holdings,
  onImport,
}: {
  holdings: Holding[];
  onImport: (incoming: Holding[], invalid: number) => void;
}) {
  const { lang, t } = useI18n();
  const fileRef = useRef<HTMLInputElement>(null);
  const fileName = (ext: string) => `emaskuy-portofolio-${isoDateLocal()}.${ext}`;

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const result = parseBackup(await file.text());
    if (!result.ok) {
      toast.error(t(`backup.error.${result.error}`));
      return;
    }
    onImport(result.holdings, result.invalid);
  };

  const btn =
    'flex cursor-pointer items-center gap-2 rounded-lg border border-hairline bg-bg2 px-3 py-2 font-display text-sm font-medium text-t1 transition-colors hover:border-goldline hover:text-gold disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm leading-relaxed text-t2">{t('backup.help')}</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={btn}
          disabled={holdings.length === 0}
          onClick={() => downloadText(exportJson(holdings), fileName('json'), 'application/json')}
        >
          <Download className="h-4 w-4" aria-hidden />
          {t('backup.exportJson')}
        </button>
        <button
          type="button"
          className={btn}
          disabled={holdings.length === 0}
          onClick={() =>
            downloadText(
              exportCsv(holdings, lang, (type) => t(`portfolio.type.${type}`)),
              fileName('csv'),
              'text/csv;charset=utf-8',
            )
          }
        >
          <FileSpreadsheet className="h-4 w-4" aria-hidden />
          {t('backup.exportCsv')}
        </button>
        <button type="button" className={btn} onClick={() => fileRef.current?.click()}>
          <Upload className="h-4 w-4" aria-hidden />
          {t('backup.import')}
        </button>
        <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={onFile} />
      </div>
    </div>
  );
}
