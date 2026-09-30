/**
 * Page: Portofolio Emas / Gold Portfolio — `/portofolio`.
 * Holdings are stored in the browser only (localStorage) and valued at the
 * live price of their pure-gold content. Backup files move them between
 * devices; "Hitung zakat" hands the totals to the zakat calculator.
 */
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { HandCoins, Pencil, Trash2, Wallet, X } from 'lucide-react';
import { toast } from 'sonner';
import { useI18n, registerStrings } from '@/lib/i18n';
import { useGoldPrice } from '@/hooks/useGoldPrice';
import { useRouteMeta } from '@/hooks/useDocumentMeta';
import { commitHoldings, usePortfolio } from '@/hooks/usePortfolio';
import { xauUsdToIdrGram, formatIdr, formatNumber, formatDateOnly, formatPct } from '@/lib/gold';
import { newHoldingId, pureGrams, summarize, type Holding } from '@/lib/portfolio';
import { mergeHoldings } from '@/lib/portfolioBackup';
import { cn, fill } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Panel } from '@/components/ui-atoms/Panel';
import { StatCard } from '@/components/ui-atoms/StatCard';
import { HoldingForm, type HoldingDraft } from '@/components/portfolio/HoldingForm';
import { BackupMenu } from '@/components/portfolio/BackupMenu';

registerStrings({
  'portfolio.title': { id: 'Portofolio Emas', en: 'Gold Portfolio' },
  'portfolio.subtitle': {
    id: 'Catat pembelian emasmu dan pantau nilai serta untung/rugi secara live.',
    en: 'Record your gold purchases and track value and profit/loss live.',
  },
  'portfolio.addTitle': { id: 'Tambah Kepemilikan', en: 'Add Holding' },
  'portfolio.add': { id: 'Tambah', en: 'Add' },
  'portfolio.save': { id: 'Simpan perubahan', en: 'Save changes' },
  'portfolio.editTitle': { id: 'Ubah kepemilikan', en: 'Edit holding' },
  'portfolio.edit': { id: 'Ubah kepemilikan', en: 'Edit holding' },
  'portfolio.close': { id: 'Tutup', en: 'Close' },
  'portfolio.added': { id: 'Kepemilikan ditambahkan', en: 'Holding added' },
  'portfolio.updated': { id: 'Kepemilikan diperbarui', en: 'Holding updated' },
  'portfolio.removed': { id: 'Kepemilikan dihapus', en: 'Holding removed' },
  'portfolio.remove': { id: 'Hapus kepemilikan', en: 'Remove holding' },
  'portfolio.totalGrams': { id: 'Total Emas Murni', en: 'Total Pure Gold' },
  'portfolio.totalInvested': { id: 'Total Investasi', en: 'Total Invested' },
  'portfolio.currentValue': { id: 'Nilai Saat Ini', en: 'Current Value' },
  'portfolio.pnl': { id: 'Untung/Rugi', en: 'Profit/Loss' },
  'portfolio.holdings': { id: 'Daftar Kepemilikan', en: 'Holdings' },
  'portfolio.empty': {
    id: 'Belum ada kepemilikan. Tambahkan pembelian emas pertamamu di atas.',
    en: 'No holdings yet. Add your first gold purchase above.',
  },
  'portfolio.pureOf': { id: '{g} gr emas murni', en: '{g} g pure gold' },
  'portfolio.zakat': { id: 'Hitung zakat', en: 'Work out zakat' },
  'portfolio.imported': {
    id: '{added} ditambahkan, {updated} diperbarui, {skipped} dilewati',
    en: '{added} added, {updated} updated, {skipped} skipped',
  },
  'portfolio.disclaimer': {
    id: 'Data portofolio tersimpan hanya di browser ini (localStorage) dan tidak dikirim ke server mana pun. Nilai dihitung dari harga emas murni spot.',
    en: 'Portfolio data is stored only in this browser (localStorage) and is never sent to any server. Values use the spot price of pure gold.',
  },
});

function StatSkeleton() {
  return (
    <div className="rounded-[10px] border border-hairline bg-bg1 p-4 md:p-5">
      <div className="h-3 w-20 animate-pulse rounded bg-bg3" />
      <div className="mt-3 h-7 w-32 animate-pulse rounded bg-bg3" />
      <div className="mt-3 h-4 w-16 animate-pulse rounded bg-bg3" />
    </div>
  );
}

export default function PortfolioPage() {
  const { lang, t } = useI18n();
  useRouteMeta('portfolio');
  const navigate = useNavigate();
  const { gold, usdIdr, loading } = useGoldPrice();
  const holdings = usePortfolio();
  const [editing, setEditing] = useState<Holding | null>(null);

  const liveIdrGram = gold && gold.price > 0 && usdIdr > 0 ? xauUsdToIdrGram(gold.price, usdIdr) : 0;
  const summary = useMemo(() => summarize(holdings), [holdings]);
  const currentValue = summary.totalGrams * liveIdrGram;
  const pnl = currentValue - summary.totalInvested;
  const pnlPct = summary.totalInvested > 0 ? (pnl / summary.totalInvested) * 100 : 0;
  const grams = (g: number) => formatNumber(g, lang, { decimals: 2, minDecimals: 0 });

  const commit = (next: Holding[]) => {
    const saved = commitHoldings(next);
    if (!saved) toast.error(t('common.saveFailed'), { id: 'save-failed' });
    return saved;
  };

  const add = (draft: HoldingDraft) => {
    const holding: Holding = { ...draft, id: newHoldingId(), currency: 'IDR', updatedAt: Date.now() };
    const saved = commit([...holdings, holding]);
    if (saved) toast.success(t('portfolio.added'));
    return saved;
  };

  const update = (draft: HoldingDraft) => {
    if (!editing) return false;
    const next = holdings.map((h) => (h.id === editing.id ? { ...h, ...draft, updatedAt: Date.now() } : h));
    const saved = commit(next);
    if (saved) {
      toast.success(t('portfolio.updated'));
      setEditing(null);
    }
    return saved;
  };

  const remove = (id: string) => {
    if (commit(holdings.filter((h) => h.id !== id))) toast.success(t('portfolio.removed'));
  };

  const importBackup = (incoming: Holding[], invalid: number) => {
    const result = mergeHoldings(holdings, incoming);
    if (!commit(result.holdings)) return;
    toast.success(
      fill(t('portfolio.imported'), { added: result.added, updated: result.updated, skipped: result.skipped + invalid }),
    );
  };

  const toZakat = () =>
    navigate('/kalkulator/zakat', {
      state: { prefill: { investGrams: summary.investGrams, jewelryPureGrams: summary.jewelryGrams } },
    });

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-8 md:px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-wrap items-end justify-between gap-4 pb-6 pt-2"
      >
        <div className="max-w-2xl">
          <h1 className="font-display text-[40px] font-bold leading-[1.1] tracking-[-0.02em] text-t1">
            {t('portfolio.title')}
          </h1>
          <p className="mt-3 text-sm leading-[1.5] text-t2">{t('portfolio.subtitle')}</p>
        </div>
        {holdings.length > 0 && (
          <button
            type="button"
            onClick={toZakat}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-goldline bg-gold/10 px-4 py-2 font-display text-sm font-semibold text-gold transition-colors hover:bg-gold/15"
          >
            <HandCoins className="h-4 w-4" aria-hidden />
            {t('portfolio.zakat')}
          </button>
        )}
      </motion.div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            <StatCard label={t('portfolio.totalGrams')} value={summary.totalGrams} format={(v) => `${grams(v)} gr`} />
            <StatCard label={t('portfolio.totalInvested')} value={summary.totalInvested} format={(v) => formatIdr(v, lang)} />
            <StatCard label={t('portfolio.currentValue')} value={currentValue} format={(v) => formatIdr(v, lang)} />
            <StatCard
              label={t('portfolio.pnl')}
              value={pnl}
              format={(v) => formatIdr(v, lang)}
              delta={pnlPct}
              valueColor={holdings.length > 0 ? (pnl >= 0 ? 'var(--up)' : 'var(--down)') : undefined}
            />
          </>
        )}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-12">
        {/* Add form */}
        <Panel title={t('portfolio.addTitle')} className="lg:col-span-7">
          <HoldingForm idPrefix="pf" submitLabel={t('portfolio.add')} onSubmit={add} />
        </Panel>
        {/* Backup */}
        <Panel title={t('backup.title')} className="h-fit lg:col-span-5">
          <BackupMenu holdings={holdings} onImport={importBackup} />
        </Panel>
      </div>

      {/* Holdings list */}
      <Panel title={t('portfolio.holdings')} className="mt-6">
        {holdings.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <Wallet className="h-10 w-10 text-t3" aria-hidden />
            <p className="max-w-sm text-sm leading-[1.5] text-t2">{t('portfolio.empty')}</p>
          </div>
        ) : (
          <ul className="flex flex-col divide-y divide-hairline">
            {holdings.map((h) => {
              const pure = pureGrams(h);
              const value = pure * liveIdrGram;
              const invested = h.grams * h.buyPricePerGram;
              const hPnl = value - invested;
              const hPnlPct = invested > 0 ? (hPnl / invested) * 100 : 0;
              return (
                <li key={h.id} className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-[140px]">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md border border-goldline bg-bg3 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-gold">
                        {t(`portfolio.type.${h.type}`)}
                      </span>
                      <span className="font-mono text-sm tabular text-t1">{grams(h.grams)} gr</span>
                    </div>
                    <div className="mt-1 text-xs text-t3">
                      {formatIdr(h.buyPricePerGram, lang)}/gr
                      {h.type === 'perhiasan' && (
                        <> · {formatNumber(h.kadarPct, lang, { decimals: 1, minDecimals: 0 })}% · {fill(t('portfolio.pureOf'), { g: grams(pure) })}</>
                      )}
                    </div>
                  </div>
                  <div className="min-w-[90px] text-xs text-t3">{formatDateOnly(h.date, lang)}</div>
                  {h.note && <div className="min-w-0 flex-1 text-xs text-t2">{h.note}</div>}
                  <div className="ml-auto flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-mono text-sm tabular text-t1">{liveIdrGram > 0 ? formatIdr(value, lang) : '—'}</div>
                      {liveIdrGram > 0 && (
                        <div
                          className={cn(
                            'flex items-center justify-end gap-1.5 font-mono text-xs tabular',
                            hPnl >= 0 ? 'text-up' : 'text-down',
                          )}
                        >
                          {formatIdr(hPnl, lang)}
                          <span>({formatPct(hPnlPct, lang)})</span>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditing(h)}
                      aria-label={t('portfolio.edit')}
                      title={t('portfolio.edit')}
                      className="cursor-pointer rounded-lg border border-hairline bg-bg2 p-2 text-t3 transition-colors hover:border-goldline hover:text-gold"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(h.id)}
                      aria-label={t('portfolio.remove')}
                      title={t('portfolio.remove')}
                      className="cursor-pointer rounded-lg border border-hairline bg-bg2 p-2 text-t3 transition-colors hover:border-down hover:text-down"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>

      <p className="mt-6 text-xs leading-[1.5] text-t3">{t('portfolio.disclaimer')}</p>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent
          showCloseButton={false}
          aria-describedby={undefined}
          className="z-[100] max-h-[92dvh] overflow-y-auto border-goldline bg-bg1 p-5 text-t1 sm:max-w-xl"
        >
          <div className="flex items-center justify-between gap-3">
            <DialogTitle className="font-display text-lg font-semibold text-t1">{t('portfolio.editTitle')}</DialogTitle>
            <button
              type="button"
              onClick={() => setEditing(null)}
              aria-label={t('portfolio.close')}
              className="cursor-pointer rounded-md p-1 text-t3 transition-colors hover:text-t1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {editing && (
            <HoldingForm key={editing.id} idPrefix="pf-edit" initial={editing} submitLabel={t('portfolio.save')} onSubmit={update} />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
