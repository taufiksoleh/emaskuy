/**
 * Page: Kalkulator Emas Perhiasan — `/kalkulator/perhiasan`.
 * Gold value of jewelry from weight × purity, and an estimated resale price
 * after the shop's deduction.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { registerStrings, useI18n } from '@/lib/i18n';
import { useRouteMeta } from '@/hooks/useDocumentMeta';
import { useCalcCurrency, useGramPrice } from '@/hooks/useGramPrice';
import { fmtMoney } from '@/lib/calc';
import { formatNumber } from '@/lib/gold';
import type { PriceBasis } from '@/lib/gramPrice';
import { KARAT_PURITY, computeJewelry } from '@/lib/jewelry';
import { formatRaw, parseAmount } from '@/lib/number';
import { buildResultText } from '@/lib/share';
import { WhatsAppButton } from '@/components/share/WhatsAppButton';
import { Panel } from '@/components/ui-atoms/Panel';
import { MoneyInput } from '@/components/ui-atoms/MoneyInput';
import { StatCard } from '@/components/ui-atoms/StatCard';
import { CalcHeader } from '@/components/calculator/CalcHeader';
import { Field } from '@/components/calculator/Field';
import { KaratPicker } from '@/components/calculator/KaratPicker';
import { PriceBasisField } from '@/components/calculator/PriceBasisField';

registerStrings({
  'jewelry.title': { id: 'Kalkulator Emas Perhiasan', en: 'Gold Jewelry Calculator' },
  'jewelry.subtitle': {
    id: 'Berapa nilai emas di perhiasan Anda? Hitung dari berat dan kadar (karat) dengan harga emas hari ini.',
    en: "What is the gold in your jewelry worth? Work it out from weight and purity (karat) at today's gold price.",
  },
  'jewelry.params': { id: 'Perhiasan Anda', en: 'Your jewelry' },
  'jewelry.weight': { id: 'Berat perhiasan', en: 'Jewelry weight' },
  'jewelry.kadar': { id: 'Kadar / karat', en: 'Purity / karat' },
  'jewelry.deduction': { id: 'Potongan toko saat jual kembali', en: 'Shop deduction on resale' },
  'jewelry.deductionHelp': {
    id: 'Toko emas membeli kembali di bawah nilai emasnya. Besar potongan berbeda tiap toko, tanyakan sebelum menjual.',
    en: 'Shops buy back below the gold value. The deduction differs per shop, so ask before selling.',
  },
  'jewelry.invalid': { id: 'Isi kadar antara 0 dan 100%', en: 'Enter a purity between 0 and 100%' },
  'jewelry.result': { id: 'Nilai Perhiasan', en: 'Jewelry Value' },
  'jewelry.value': { id: 'Nilai kandungan emas', en: 'Value of the gold content' },
  'jewelry.sellBack': { id: 'Perkiraan harga jual kembali', en: 'Estimated resale price' },
  'jewelry.pure': { id: 'Emas murni', en: 'Pure gold' },
  'jewelry.karatEq': { id: 'Setara karat', en: 'Equivalent karat' },
  'jewelry.perGram': { id: 'Nilai per gram perhiasan', en: 'Value per gram of jewelry' },
  'jewelry.note': {
    id: 'Harga beli perhiasan di toko lebih tinggi dari nilai emasnya karena ada ongkos pembuatan. Angka di sini adalah nilai emasnya saja.',
    en: 'Jewelry costs more than its gold value in shops because of making charges. These figures are the gold value only.',
  },
  'jewelry.table': { id: 'Karat dan kadar emas', en: 'Karat and purity' },
  'jewelry.table.karat': { id: 'Karat', en: 'Karat' },
  'jewelry.table.kadar': { id: 'Kadar', en: 'Purity' },
  'jewelry.table.perGram': { id: 'Nilai per gram', en: 'Value per gram' },
});

export default function PerhiasanPage() {
  const { lang, t } = useI18n();
  useRouteMeta('calcJewelry');
  const currency = useCalcCurrency();

  const [weightRaw, setWeightRaw] = useState(() => formatRaw(10, lang, 2));
  const [kadarRaw, setKadarRaw] = useState(() => formatRaw(75, lang, 1));
  const [deductionRaw, setDeductionRaw] = useState(() => formatRaw(5, lang, 1));
  const [basis, setBasis] = useState<PriceBasis>('spot');
  const [manualRaw, setManualRaw] = useState('');

  const num = (raw: string) => {
    const n = parseAmount(raw, lang);
    return Number.isFinite(n) ? n : 0;
  };
  const kadarPct = parseAmount(kadarRaw, lang);
  const kadarInvalid = !Number.isFinite(kadarPct) || kadarPct <= 0 || kadarPct > 100;
  const { perGram, status } = useGramPrice(basis, currency, num(manualRaw));
  const r = computeJewelry({
    weightGrams: num(weightRaw),
    kadarPct: kadarInvalid ? 0 : kadarPct,
    pricePerGram: perGram ?? 0,
    deductionPct: num(deductionRaw),
  });

  const money = (v: number) => (perGram !== null ? fmtMoney(v, currency, lang) : '—');
  const grams = (g: number) => formatNumber(g, lang, { decimals: 3, minDecimals: 0 });

  return (
    <>
      <CalcHeader title={t('jewelry.title')} subtitle={t('jewelry.subtitle')} />
      <div className="grid grid-cols-1 gap-4 pb-4 lg:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="order-1 min-w-0 lg:order-2 lg:col-span-7"
        >
          <Panel glow title={t('jewelry.result')}>
            <div className="flex flex-col gap-5">
              <div>
                <div className="label-micro">{t('jewelry.value')}</div>
                <div className="text-gold-gradient mt-1 break-all font-mono text-[32px] font-bold leading-none tabular md:text-[48px]">
                  {money(r.value)}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <StatCard label={t('jewelry.sellBack')} value={r.sellBack} format={money} />
                <StatCard label={t('jewelry.perGram')} value={r.perGram} format={money} />
                <StatCard label={t('jewelry.pure')} value={r.pureGrams} format={(v) => `${grams(v)} gr`} />
                <StatCard
                  label={t('jewelry.karatEq')}
                  value={r.karat}
                  format={(v) => `${formatNumber(v, lang, { decimals: 1, minDecimals: 0 })}K`}
                />
              </div>
              <p className="flex gap-2 text-[12px] leading-relaxed text-t3">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                {t('jewelry.note')}
              </p>
              {perGram !== null && (
                <WhatsAppButton
                  className="self-start"
                  text={buildResultText(
                    t('jewelry.title'),
                    [
                      [t('jewelry.weight'), `${grams(num(weightRaw))} gr · ${formatNumber(kadarInvalid ? 0 : kadarPct, lang, { decimals: 1, minDecimals: 0 })}%`],
                      [t('jewelry.value'), money(r.value), true],
                      [t('jewelry.sellBack'), money(r.sellBack)],
                    ],
                    '/kalkulator/perhiasan',
                    t,
                  )}
                />
              )}
            </div>
          </Panel>
        </motion.div>

        <div className="order-2 min-w-0 lg:order-1 lg:col-span-5">
          <Panel title={t('jewelry.params')} className="h-fit">
            <div className="flex flex-col gap-5">
              <Field label={t('jewelry.weight')} htmlFor="jewelry-weight">
                <MoneyInput id="jewelry-weight" value={weightRaw} onChange={setWeightRaw} suffix="gr" decimals={3} />
              </Field>
              <Field
                label={t('jewelry.kadar')}
                htmlFor="jewelry-kadar"
                error={kadarInvalid ? t('jewelry.invalid') : undefined}
              >
                <KaratPicker id="jewelry-kadar" value={kadarRaw} onChange={setKadarRaw} invalid={kadarInvalid} />
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
              <Field label={t('jewelry.deduction')} htmlFor="jewelry-deduction" help={t('jewelry.deductionHelp')}>
                <MoneyInput id="jewelry-deduction" value={deductionRaw} onChange={setDeductionRaw} suffix="%" decimals={1} />
              </Field>
            </div>
          </Panel>
        </div>
      </div>

      <Panel title={t('jewelry.table')} className="mb-12 mt-4" bodyClassName="px-0 md:px-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-sm tabular">
            <thead>
              <tr className="border-b border-hairline text-[11px] uppercase tracking-wider text-t3">
                <th className="px-4 py-2 font-medium md:px-6">{t('jewelry.table.karat')}</th>
                <th className="px-4 py-2 font-medium md:px-6">{t('jewelry.table.kadar')}</th>
                <th className="px-4 py-2 text-right font-medium md:px-6">{t('jewelry.table.perGram')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {KARAT_PURITY.map((k) => (
                <tr key={k.karat} className="text-t2">
                  <td className="px-4 py-2 md:px-6">{k.karat}K</td>
                  <td className="px-4 py-2 md:px-6">{formatNumber(k.pct, lang, { decimals: 1, minDecimals: 0 })}%</td>
                  <td className="px-4 py-2 text-right text-t1 md:px-6">
                    {perGram !== null ? fmtMoney((perGram * k.pct) / 100, currency, lang) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
