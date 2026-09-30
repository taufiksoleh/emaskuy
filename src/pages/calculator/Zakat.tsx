/**
 * Page: Kalkulator Zakat Emas — `/kalkulator/zakat`.
 * Nisab 85 g of pure gold, 2.5% after a lunar year, jewelry by purity.
 */
import { useState } from 'react';
import { useLocation } from 'react-router';
import { motion } from 'framer-motion';
import { HandCoins, Info, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { registerStrings, useI18n } from '@/lib/i18n';
import { useRouteMeta } from '@/hooks/useDocumentMeta';
import { useCalcCurrency, useGramPrice } from '@/hooks/useGramPrice';
import { fmtMoney } from '@/lib/calc';
import { formatNumber } from '@/lib/gold';
import type { PriceBasis } from '@/lib/gramPrice';
import { formatRaw, parseAmount } from '@/lib/number';
import { loadHoldings, summarize } from '@/lib/portfolio';
import { NISAB_GRAMS, computeZakat } from '@/lib/zakat';
import { buildResultText } from '@/lib/share';
import { WhatsAppButton } from '@/components/share/WhatsAppButton';
import { cn, fill } from '@/lib/utils';
import { Panel } from '@/components/ui-atoms/Panel';
import { MoneyInput } from '@/components/ui-atoms/MoneyInput';
import { SegToggle } from '@/components/ui-atoms/SegToggle';
import { StatCard } from '@/components/ui-atoms/StatCard';
import { CalcHeader } from '@/components/calculator/CalcHeader';
import { Field } from '@/components/calculator/Field';
import { KaratPicker } from '@/components/calculator/KaratPicker';
import { PriceBasisField } from '@/components/calculator/PriceBasisField';

registerStrings({
  'zakat.title': { id: 'Kalkulator Zakat Emas', en: 'Gold Zakat Calculator' },
  'zakat.subtitle': {
    id: 'Hitung zakat emas Anda dengan harga emas hari ini. Nisab 85 gram emas murni, zakat 2,5% setelah emas dimiliki satu tahun hijriah (haul).',
    en: "Work out zakat on your gold at today's gold price. The nisab is 85 grams of pure gold; zakat is 2.5% once the gold has been held for a lunar year (haul).",
  },
  'zakat.params': { id: 'Emas yang Anda miliki', en: 'Your gold' },
  'zakat.invest': { id: 'Emas batangan, koin & tabungan emas', en: 'Gold bars, coins & digital gold' },
  'zakat.investHelp': {
    id: 'Dalam gram emas murni: Antam, UBS, Galeri24, tabungan emas, dan sejenisnya.',
    en: 'In grams of pure gold: bars, coins, gold savings accounts and similar.',
  },
  'zakat.fromPortfolio': { id: 'Ambil dari portofolio', en: 'Use my portfolio' },
  'zakat.portfolioEmpty': { id: 'Portofolio Anda masih kosong', en: 'Your portfolio is empty' },
  'zakat.portfolioLoaded': { id: '{g} gram dari portofolio', en: '{g} grams from your portfolio' },
  'zakat.jewelry': { id: 'Perhiasan emas', en: 'Gold jewelry' },
  'zakat.jewelryKadar': { id: 'Kadar perhiasan', en: 'Jewelry purity' },
  'zakat.jewelryUse': { id: 'Perhiasan ini', en: 'This jewelry is' },
  'zakat.stored': { id: 'Disimpan', en: 'Stored' },
  'zakat.worn': { id: 'Dipakai', en: 'Worn' },
  'zakat.includeWorn': { id: 'Tetap hitung perhiasan yang dipakai', en: 'Count worn jewelry as well' },
  'zakat.wornNote': {
    id: 'Ulama berbeda pendapat: mazhab Hanafi mewajibkan zakat perhiasan yang dipakai, sedangkan mayoritas ulama tidak mewajibkannya selama dipakai sewajarnya. Perhiasan yang disimpan tetap dihitung.',
    en: 'Scholars differ: the Hanafi school requires zakat on worn jewelry, while most scholars do not as long as it is worn within normal use. Stored jewelry always counts.',
  },
  'zakat.haul': { id: 'Sudah dimiliki 1 tahun hijriah (haul)?', en: 'Held for a full lunar year (haul)?' },
  'zakat.yes': { id: 'Sudah', en: 'Yes' },
  'zakat.no': { id: 'Belum', en: 'Not yet' },
  'zakat.result': { id: 'Hasil Perhitungan', en: 'Result' },
  'zakat.due': { id: 'Wajib zakat', en: 'Zakat is due' },
  'zakat.notDue': { id: 'Belum wajib zakat', en: 'Zakat not due yet' },
  'zakat.reason.below-nisab': {
    id: 'Emas murni Anda {pure} gram, kurang {short} gram dari nisab 85 gram.',
    en: 'Your pure gold is {pure} grams, {short} grams short of the 85-gram nisab.',
  },
  'zakat.reason.haul-not-met': {
    id: 'Sudah mencapai nisab, tetapi zakat baru wajib setelah emas dimiliki satu tahun hijriah.',
    en: 'You have reached the nisab, but zakat is due only after the gold has been held for a lunar year.',
  },
  'zakat.reason.due': { id: '2,5% dari {pure} gram emas murni.', en: '2.5% of {pure} grams of pure gold.' },
  'zakat.amount': { id: 'Zakat yang dikeluarkan', en: 'Zakat to pay' },
  'zakat.inGold': { id: 'atau {g} gram emas', en: 'or {g} grams of gold' },
  'zakat.totalPure': { id: 'Total emas murni', en: 'Total pure gold' },
  'zakat.nisabToday': { id: 'Nisab hari ini (85 gram)', en: "Today's nisab (85 g)" },
  'zakat.progress': { id: 'Menuju nisab', en: 'Towards the nisab' },
  'zakat.noPrice': {
    id: 'Harga emas belum tersedia. Nilai dalam uang muncul setelah harga dimuat atau diisi.',
    en: 'No gold price yet. Money values appear once a price loads or is entered.',
  },
  'zakat.about': { id: 'Tentang zakat emas', en: 'About zakat on gold' },
  'zakat.about.1': {
    id: 'Nisab zakat emas adalah 85 gram emas murni. Di bawah itu belum wajib zakat.',
    en: 'The nisab for gold is 85 grams of pure gold. Below that, no zakat is due.',
  },
  'zakat.about.2': {
    id: 'Zakat sebesar 2,5% dikeluarkan setelah emas dimiliki selama satu tahun hijriah (haul).',
    en: 'Zakat of 2.5% is due once the gold has been held for one lunar year (haul).',
  },
  'zakat.about.3': {
    id: 'Zakat boleh dibayar dengan emas, atau dengan uang senilai emas tersebut pada hari pembayaran.',
    en: 'Zakat may be paid in gold, or in money worth that gold on the day you pay.',
  },
  'zakat.about.4': {
    id: 'Perhiasan dihitung dari kandungan emas murninya: 10 gram emas 18K (75%) = 7,5 gram emas murni.',
    en: 'Jewelry counts by its pure-gold content: 10 g of 18K gold (75%) = 7.5 g of pure gold.',
  },
  'zakat.disclaimer': {
    id: 'Perhitungan ini bersifat panduan. Untuk kepastian hukum dan penyaluran zakat, konsultasikan dengan BAZNAS atau lembaga amil zakat resmi.',
    en: 'This calculation is guidance only. For rulings and to pay your zakat, consult BAZNAS or an official zakat institution.',
  },
});

type JewelryUse = 'stored' | 'worn';

/** Totals handed over by the portfolio page ("Hitung zakat"). */
interface Prefill {
  investGrams: number;
  jewelryPureGrams: number;
}

function readPrefill(state: unknown): Prefill | null {
  const p = (state as { prefill?: Partial<Prefill> } | null)?.prefill;
  if (!p || typeof p.investGrams !== 'number' || typeof p.jewelryPureGrams !== 'number') return null;
  return { investGrams: p.investGrams, jewelryPureGrams: p.jewelryPureGrams };
}

export default function ZakatPage() {
  const { lang, t } = useI18n();
  useRouteMeta('calcZakat');
  const currency = useCalcCurrency();
  const prefill = readPrefill(useLocation().state);

  const [investRaw, setInvestRaw] = useState(() => (prefill?.investGrams ? formatRaw(prefill.investGrams, lang, 4) : ''));
  const [jewelryRaw, setJewelryRaw] = useState(() =>
    prefill?.jewelryPureGrams ? formatRaw(prefill.jewelryPureGrams, lang, 4) : '',
  );
  // Portfolio jewelry arrives as pure gold already.
  const [kadarRaw, setKadarRaw] = useState(() => formatRaw(prefill?.jewelryPureGrams ? 100 : 75, lang, 1));
  const [use, setUse] = useState<JewelryUse>('stored');
  const [includeWorn, setIncludeWorn] = useState(false);
  const [haul, setHaul] = useState<'yes' | 'no'>('yes');
  const [basis, setBasis] = useState<PriceBasis>('spot');
  const [manualRaw, setManualRaw] = useState('');

  const num = (raw: string) => {
    const n = parseAmount(raw, lang);
    return Number.isFinite(n) ? n : 0;
  };
  const kadarPct = parseAmount(kadarRaw, lang);
  const kadarInvalid = !Number.isFinite(kadarPct) || kadarPct <= 0 || kadarPct > 100;
  const { perGram, status } = useGramPrice(basis, currency, num(manualRaw));

  const r = computeZakat({
    investGrams: num(investRaw),
    jewelry: { grams: num(jewelryRaw), kadar: kadarInvalid ? 0 : kadarPct / 100, worn: use === 'worn' },
    includeWorn,
    haulMet: haul === 'yes',
    pricePerGram: perGram,
  });

  const grams = (g: number, decimals = 2) => formatNumber(g, lang, { decimals, minDecimals: 0 });
  const money = (v: number) => fmtMoney(v, currency, lang);

  const fromPortfolio = () => {
    const s = summarize(loadHoldings());
    if (s.totalGrams <= 0) {
      toast(t('zakat.portfolioEmpty'));
      return;
    }
    setInvestRaw(formatRaw(s.investGrams, lang, 4));
    setJewelryRaw(s.jewelryGrams > 0 ? formatRaw(s.jewelryGrams, lang, 4) : '');
    if (s.jewelryGrams > 0) setKadarRaw(formatRaw(100, lang, 1));
    toast.success(fill(t('zakat.portfolioLoaded'), { g: grams(s.totalGrams) }));
  };

  return (
    <>
      <CalcHeader title={t('zakat.title')} subtitle={t('zakat.subtitle')} />
      <div className="grid grid-cols-1 gap-4 pb-4 lg:grid-cols-12">
        {/* Results first on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="order-1 min-w-0 lg:order-2 lg:col-span-7"
        >
          <Panel glow title={t('zakat.result')}>
            <div className="flex flex-col gap-5">
              <div>
                <span
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full border px-3 py-1 font-display text-sm font-semibold',
                    r.due ? 'border-goldline bg-gold/10 text-gold' : 'border-hairline bg-bg2 text-t2',
                  )}
                >
                  <HandCoins className="h-4 w-4" aria-hidden />
                  {r.due ? t('zakat.due') : t('zakat.notDue')}
                </span>
                <p className="mt-3 text-sm leading-relaxed text-t2">
                  {fill(t(`zakat.reason.${r.reason}`), { pure: grams(r.pureGrams), short: grams(r.shortfallGrams) })}
                </p>
              </div>

              {r.due && (
                <div>
                  <div className="label-micro">{t('zakat.amount')}</div>
                  <div className="text-gold-gradient mt-1 break-all font-mono text-[32px] font-bold leading-none tabular md:text-[48px]">
                    {r.zakatValue !== null ? money(r.zakatValue) : '—'}
                  </div>
                  <p className="mt-2 font-mono text-sm tabular text-t2">
                    {fill(t('zakat.inGold'), { g: grams(r.zakatGrams, 3) })}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <StatCard
                  label={t('zakat.totalPure')}
                  value={r.pureGrams}
                  format={(v) => `${grams(v)} gr`}
                  sub={r.totalValue !== null ? money(r.totalValue) : undefined}
                />
                <StatCard
                  label={t('zakat.nisabToday')}
                  value={r.nisabValue ?? 0}
                  format={(v) => (r.nisabValue !== null ? money(v) : '—')}
                  sub={`${NISAB_GRAMS} gr`}
                />
              </div>

              <div>
                <div className="flex justify-between font-mono text-[11px] tabular text-t3">
                  <span>{t('zakat.progress')}</span>
                  <span>
                    {grams(Math.min(r.pureGrams, NISAB_GRAMS))} / {NISAB_GRAMS} gr
                  </span>
                </div>
                <div
                  className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-bg3"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(r.progress * 100)}
                  aria-label={t('zakat.progress')}
                >
                  <div className="h-full rounded-full bg-gold transition-[width] duration-500" style={{ width: `${r.progress * 100}%` }} />
                </div>
              </div>

              {perGram === null && <p className="text-xs text-t3">{t('zakat.noPrice')}</p>}

              <WhatsAppButton
                className="self-start"
                text={buildResultText(
                  t('zakat.title'),
                  [
                    [t('zakat.totalPure'), `${grams(r.pureGrams)} gr`],
                    [t('zakat.nisabToday'), r.nisabValue !== null ? money(r.nisabValue) : `${NISAB_GRAMS} gr`],
                    r.due
                      ? [t('zakat.amount'), `${r.zakatValue !== null ? money(r.zakatValue) : '—'} (${grams(r.zakatGrams, 3)} gr)`, true]
                      : [t('zakat.result'), t('zakat.notDue'), true],
                  ],
                  '/kalkulator/zakat',
                  t,
                )}
              />
            </div>
          </Panel>
        </motion.div>

        <div className="order-2 min-w-0 lg:order-1 lg:col-span-5">
          <Panel title={t('zakat.params')} className="h-fit">
            <div className="flex flex-col gap-5">
              <Field
                label={t('zakat.invest')}
                htmlFor="zakat-invest"
                help={t('zakat.investHelp')}
                aside={
                  <button
                    type="button"
                    onClick={fromPortfolio}
                    className="flex cursor-pointer items-center gap-1 text-[11px] font-medium text-gold hover:underline"
                  >
                    <Wallet className="h-3.5 w-3.5" aria-hidden />
                    {t('zakat.fromPortfolio')}
                  </button>
                }
              >
                <MoneyInput id="zakat-invest" value={investRaw} onChange={setInvestRaw} suffix="gr" decimals={4} placeholder="0" />
              </Field>

              <Field label={t('zakat.jewelry')} htmlFor="zakat-jewelry">
                <MoneyInput id="zakat-jewelry" value={jewelryRaw} onChange={setJewelryRaw} suffix="gr" decimals={4} placeholder="0" />
              </Field>

              <Field label={t('zakat.jewelryKadar')} htmlFor="zakat-kadar">
                <KaratPicker id="zakat-kadar" value={kadarRaw} onChange={setKadarRaw} invalid={kadarInvalid} />
              </Field>

              <Field label={t('zakat.jewelryUse')}>
                <SegToggle
                  ariaLabel={t('zakat.jewelryUse')}
                  className="w-full [&>button]:flex-1"
                  value={use}
                  onChange={setUse}
                  options={[
                    { value: 'stored', label: t('zakat.stored') },
                    { value: 'worn', label: t('zakat.worn') },
                  ]}
                />
                {use === 'worn' && (
                  <>
                    <label className="mt-1 flex cursor-pointer items-center gap-2 text-sm text-t2">
                      <input
                        type="checkbox"
                        checked={includeWorn}
                        onChange={(e) => setIncludeWorn(e.target.checked)}
                        className="h-4 w-4 accent-[var(--gold)]"
                      />
                      {t('zakat.includeWorn')}
                    </label>
                    <p className="flex gap-2 rounded-lg border border-hairline bg-bg2 p-3 text-[12px] leading-relaxed text-t3">
                      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                      {t('zakat.wornNote')}
                    </p>
                  </>
                )}
              </Field>

              <Field label={t('zakat.haul')}>
                <SegToggle
                  ariaLabel={t('zakat.haul')}
                  className="w-full [&>button]:flex-1"
                  value={haul}
                  onChange={setHaul}
                  options={[
                    { value: 'yes', label: t('zakat.yes') },
                    { value: 'no', label: t('zakat.no') },
                  ]}
                />
              </Field>

              <PriceBasisField
                basis={basis}
                onBasis={setBasis}
                manualRaw={manualRaw}
                onManual={setManualRaw}
                currency={currency}
                perGram={perGram}
                status={status}
              />
            </div>
          </Panel>
        </div>
      </div>

      <Panel title={t('zakat.about')} className="mb-12 mt-4">
        <ul className="space-y-3">
          {(['zakat.about.1', 'zakat.about.2', 'zakat.about.3', 'zakat.about.4'] as const).map((key) => (
            <li key={key} className="flex items-start gap-3">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              <p className="text-sm leading-relaxed text-t2">{t(key)}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex gap-2 border-t border-hairline pt-3 text-[12px] leading-relaxed text-t3">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          {t('zakat.disclaimer')}
        </p>
      </Panel>
    </>
  );
}
