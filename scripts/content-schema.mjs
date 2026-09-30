/**
 * Schemas of the files the content agent writes (see docs/content-pipeline.md).
 * Used by scripts/validate-content.mjs in CI; not bundled into the app.
 */
import { z } from 'zod';

/** Rupiah amount: whole, positive, below 100 billion. */
const Rp = z.number().int().positive().max(1e11);
/** ISO date-time in WIB, e.g. 2026-09-30T09:00:00+07:00 */
const WibDateTime = z.iso
  .datetime({ offset: true })
  .refine((s) => s.endsWith('+07:00'), 'must be in WIB (+07:00)');

export const ANTAM_SIZES = [0.5, 1, 2, 3, 5, 10, 25, 50, 100, 250, 500, 1000];

const Brand = z.strictObject({ sellPerGram: Rp, buybackPerGram: Rp });

export const AntamSchema = z.strictObject({
  schemaVersion: z.literal(1),
  priceDate: z.iso.date(),
  updatedAt: WibDateTime,
  source: z.strictObject({ name: z.string().min(2).max(120), url: z.url() }),
  note: z.strictObject({ id: z.string().min(10).max(300), en: z.string().min(10).max(300) }),
  antam: z.strictObject({
    buybackPerGram: Rp,
    /** `sell` is the price of one whole bar, not per gram */
    sizes: z
      .array(z.strictObject({ grams: z.literal(ANTAM_SIZES), sell: Rp }))
      .min(1)
      .max(ANTAM_SIZES.length),
  }),
  others: z.strictObject({ galeri24: Brand.optional(), ubs: Brand.optional() }).optional(),
  history: z
    .array(z.strictObject({ date: z.iso.date(), sell1g: Rp, buyback: Rp.nullable() }))
    .min(1)
    .max(400),
});

const Bilingual = z.strictObject({ id: z.string().min(20).max(450), en: z.string().min(20).max(450) });

export const AiInsightSchema = z.strictObject({
  schemaVersion: z.literal(1),
  generatedAt: WibDateTime,
  sentiment: z.enum(['bullish', 'bearish', 'neutral']),
  bullets: z.array(Bilingual).min(3).max(4),
  sources: z.array(z.strictObject({ title: z.string().min(2).max(200), url: z.url() })).max(10).optional(),
});
