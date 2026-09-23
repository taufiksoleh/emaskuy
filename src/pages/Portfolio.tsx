/**
 * Page: Portofolio Emas / Gold Portfolio — `/portofolio`.
 * Holdings are stored in the browser only (localStorage) and valued against
 * the live IDR/gram gold price.
 */
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { useI18n, registerStrings } from '@/lib/i18n';
import { useGoldPrice } from '@/hooks/useGoldPrice';
import { xauUsdToIdrGram, formatIdr, formatNumber, formatDate, formatPct } from '@/lib/gold';
import {
  loadHoldings,
  saveHoldings,
  summarize,
  type Holding,
} from '@/lib/portfolio';
import { Panel } from '@/components/ui-atoms/Panel';
import { StatCard } from '@/components/ui-atoms/StatCard';
import { cn } from '@/lib/utils';

registerStrings({
  'portfolio.title': { id: 'Portofolio Emas', en: 'Gold Portfolio' },
  'portfolio.subtitle': {
    id: 'Catat pembelian emasmu dan pantau nilai serta untung/rugi secara live.',
    en: 'Record your gold purchases and track value and profit/loss live.',
  },
  'portfolio.addTitle': { id: 'Tambah Kepemilikan', en: 'Add Holding' },
  'portfolio.grams': { id: 'Gram', en: 'Grams' },
  'portfolio.buyPrice': { id: 'Harga Beli per Gram (IDR)', en: 'Buy Price per Gram (IDR)' },
  'portfolio.date': { id: 'Tanggal', en: 'Date' },
  'portfolio.note': { id: 'Catatan (opsional)', en: 'Note (optional)' },
  'portfolio.add': { id: 'Tambah', en: 'Add' },
  'portfolio.added': { id: 'Kepemilikan ditambahkan', en: 'Holding added' },
  'portfolio.removed': { id: 'Kepemilikan dihapus', en: 'Holding removed' },
  'portfolio.invalid': {
    id: 'Gram dan harga beli harus lebih dari 0.',
    en: 'Grams and buy price must be greater than 0.',
  },
  'portfolio.totalGrams': { id: 'Total Gram', en: 'Total Grams' },
  'portfolio.totalInvested': { id: 'Total Investasi', en: 'Total Invested' },
  'portfolio.currentValue': { id: 'Nilai Saat Ini', en: 'Current Value' },
  'portfolio.pnl': { id: 'Untung/Rugi', en: 'Profit/Loss' },
  'portfolio.holdings': { id: 'Daftar Kepemilikan', en: 'Holdings' },
  'portfolio.empty': {
    id: 'Belum ada kepemilikan. Tambahkan pembelian emas pertamamu di atas.',
    en: 'No holdings yet. Add your first gold purchase above.',
  },
  'portfolio.liveNow': { id: 'Nilai live', en: 'Live value' },
  'portfolio.disclaimer': {
    id: 'Data portofolio tersimpan hanya di browser ini (localStorage) — tidak dikirim ke server mana pun.',
    en: 'Portfolio data is stored only in this browser (localStorage) — it is never sent to any server.',
  },
});

function todayIso(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

const fieldLabel = 'label-micro';
const inputCls =
  'w-full rounded-lg border border-hairline bg-bg3 px-3 py-2.5 font-mono text-sm tabular text-t1 outline-none transition-colors focus:border-goldline focus:ring-2 focus:ring-gold/40';

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
  const { gold, usdIdr, loading } = useGoldPrice();

  const [holdings, setHoldings] = useState<Holding[]>(loadHoldings);
  const [gramsRaw, setGramsRaw] = useState('');
  const [priceRaw, setPriceRaw] = useState('');
  const [dateRaw, setDateRaw] = useState(todayIso);
  const [noteRaw, setNoteRaw] = useState('');
  const [invalid, setInvalid] = useState(false);

  const liveIdrGram =
    gold && gold.price > 0 && usdIdr > 0 ? xauUsdToIdrGram(gold.price, usdIdr) : 0;

  const summary = useMemo(() => summarize(holdings), [holdings]);
  const currentValue = summary.totalGrams * liveIdrGram;
  const pnl = currentValue - summary.totalInvested;
  const pnlPct =
    summary.totalInvested > 0 ? (pnl / summary.totalInvested) * 100 : 0;

  const addHolding = (e: React.FormEvent) => {
    e.preventDefault();
    const grams = Number(gramsRaw);
    const price = Number(priceRaw);
    if (!Number.isFinite(grams) || grams <= 0 || !Number.isFinite(price) || price <= 0) {
      setInvalid(true);
      toast.error(t('portfolio.invalid'));
      return;
    }
    const holding: Holding = {
      id:
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      grams,
      buyPriceIdrPerGram: price,
      date: dateRaw || todayIso(),
      note: noteRaw.trim() || undefined,
    };
    const next = [...holdings, holding];
    setHoldings(next);
    saveHoldings(next);
    setGramsRaw('');
    setPriceRaw('');
    setDateRaw(todayIso());
    setNoteRaw('');
    setInvalid(false);
    toast.success(t('portfolio.added'));
  };

  const removeHolding = (id: string) => {
    const next = holdings.filter((h) => h.id !== id);
    setHoldings(next);
    saveHoldings(next);
    toast.success(t('portfolio.removed'));
  };

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-8 md:px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-2xl pb-6 pt-2"
      >
        <h1 className="font-display text-[40px] font-bold leading-[1.1] tracking-[-0.02em] text-t1">
          {t('portfolio.title')}
        </h1>
        <p className="mt-3 text-sm leading-[1.5] text-t2">{t('portfolio.subtitle')}</p>
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
            <StatCard
              label={t('portfolio.totalGrams')}
              value={summary.totalGrams}
              format={(v) => `${formatNumber(v, lang, { decimals: 2 })} gr`}
            />
            <StatCard
              label={t('portfolio.totalInvested')}
              value={summary.totalInvested}
              format={(v) => formatIdr(v, lang)}
            />
            <StatCard
              label={t('portfolio.currentValue')}
              value={currentValue}
              format={(v) => formatIdr(v, lang)}
            />
            <StatCard
              label={t('portfolio.pnl')}
              value={pnl}
              format={(v) => formatIdr(v, lang)}
              delta={pnlPct}
            />
          </>
        )}
      </div>

      {/* Add form */}
      <Panel title={t('portfolio.addTitle')} className="mt-6">
        <form
          onSubmit={addHolding}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-end"
        >
          <div className="flex flex-col gap-1.5">
            <label className={fieldLabel} htmlFor="pf-grams">
              {t('portfolio.grams')}
            </label>
            <input
              id="pf-grams"
              type="number"
              step="0.01"
              min="0"
              inputMode="decimal"
              value={gramsRaw}
              onChange={(e) => setGramsRaw(e.target.value)}
              className={cn(inputCls, invalid && 'border-down')}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={fieldLabel} htmlFor="pf-price">
              {t('portfolio.buyPrice')}
            </label>
            <input
              id="pf-price"
              type="number"
              min="0"
              inputMode="decimal"
              value={priceRaw}
              onChange={(e) => setPriceRaw(e.target.value)}
              className={cn(inputCls, invalid && 'border-down')}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={fieldLabel} htmlFor="pf-date">
              {t('portfolio.date')}
            </label>
            <input
              id="pf-date"
              type="date"
              value={dateRaw}
              onChange={(e) => setDateRaw(e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={fieldLabel} htmlFor="pf-note">
              {t('portfolio.note')}
            </label>
            <input
              id="pf-note"
              type="text"
              value={noteRaw}
              onChange={(e) => setNoteRaw(e.target.value)}
              className={inputCls}
            />
          </div>
          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-gold px-5 py-2.5 font-display text-sm font-semibold text-bg0 transition-opacity hover:opacity-90"
          >
            {t('portfolio.add')}
          </button>
        </form>
      </Panel>

      {/* Holdings list */}
      <Panel title={t('portfolio.holdings')} className="mt-6">
        {holdings.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <Wallet className="h-10 w-10 text-t3" aria-hidden />
            <p className="max-w-sm text-sm leading-[1.5] text-t2">{t('portfolio.empty')}</p>
          </div>
        ) : (
          <motion.ul
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
            className="flex flex-col divide-y divide-hairline"
          >
            {holdings.map((h) => {
              const value = h.grams * liveIdrGram;
              const invested = h.grams * h.buyPriceIdrPerGram;
              const hPnl = value - invested;
              const hPnlPct = invested > 0 ? (hPnl / invested) * 100 : 0;
              const dateTs = new Date(h.date).getTime();
              return (
                <motion.li
                  key={h.id}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
                  }}
                  className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-[90px]">
                    <div className="font-mono text-sm tabular text-t1">
                      {formatNumber(h.grams, lang, { decimals: 2 })} gr
                    </div>
                    <div className="text-xs text-t3">
                      {formatIdr(h.buyPriceIdrPerGram, lang)}/gr
                    </div>
                  </div>
                  <div className="min-w-[90px] text-xs text-t3">
                    {Number.isFinite(dateTs) ? formatDate(dateTs, lang) : h.date}
                  </div>
                  {h.note && <div className="min-w-0 flex-1 text-xs text-t2">{h.note}</div>}
                  <div className="ml-auto flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-mono text-sm tabular text-t1">
                        {liveIdrGram > 0 ? formatIdr(value, lang) : '—'}
                      </div>
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
                      onClick={() => removeHolding(h.id)}
                      aria-label={t('portfolio.removed')}
                      className="cursor-pointer rounded-lg border border-hairline bg-bg2 p-2 text-t3 transition-colors hover:border-down hover:text-down"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </Panel>

      <p className="mt-6 text-xs leading-[1.5] text-t3">{t('portfolio.disclaimer')}</p>
    </section>
  );
}
