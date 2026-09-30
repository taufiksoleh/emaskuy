/**
 * EmasKuy — portfolio backup: JSON export/import and a CSV export for
 * spreadsheets.
 *
 * The portfolio lives only in this browser, so clearing site data or
 * switching phones loses it; a backup file is the only way to move it.
 * CSV in Indonesian uses ";" and decimal commas (what Excel expects with
 * Indonesian regional settings) and a UTF-8 BOM so "Rp" and notes survive.
 */
import type { Lang } from './i18n';
import { MAX_HOLDINGS, normalizeList, type Holding, type ProductType } from './portfolio';

const APP = 'emaskuy';
const KIND = 'portfolio';
const SCHEMA_VERSION = 2;
const MAX_BYTES = 1_000_000;

export function exportJson(holdings: Holding[], now = Date.now()): string {
  return JSON.stringify(
    { app: APP, kind: KIND, schemaVersion: SCHEMA_VERSION, exportedAt: new Date(now).toISOString(), holdings },
    null,
    2,
  );
}

export type BackupError = 'too_large' | 'not_json' | 'wrong_app' | 'unsupported_version' | 'empty';

export type BackupResult = { ok: true; holdings: Holding[]; invalid: number } | { ok: false; error: BackupError };

/** Read a backup file: a v2 export, or a bare v1 array. */
export function parseBackup(text: string): BackupResult {
  if (text.length > MAX_BYTES) return { ok: false, error: 'too_large' };
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, error: 'not_json' };
  }
  let list: unknown[];
  if (Array.isArray(data)) {
    list = data;
  } else if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>;
    if (d.app !== APP || d.kind !== KIND) return { ok: false, error: 'wrong_app' };
    if (typeof d.schemaVersion !== 'number' || d.schemaVersion > SCHEMA_VERSION) {
      return { ok: false, error: 'unsupported_version' };
    }
    list = Array.isArray(d.holdings) ? d.holdings : [];
  } else {
    return { ok: false, error: 'wrong_app' };
  }
  const holdings = normalizeList(list);
  if (holdings.length === 0) return { ok: false, error: 'empty' };
  return { ok: true, holdings, invalid: Math.min(list.length, MAX_HOLDINGS) - holdings.length };
}

export interface MergeResult {
  holdings: Holding[];
  added: number;
  updated: number;
  skipped: number;
}

/** Add new holdings by id; replace existing ones only with a newer edit. */
export function mergeHoldings(current: Holding[], incoming: Holding[]): MergeResult {
  const byId = new Map(current.map((h) => [h.id, h]));
  let added = 0;
  let updated = 0;
  let skipped = 0;
  for (const h of incoming) {
    const existing = byId.get(h.id);
    if (!existing) {
      byId.set(h.id, h);
      added++;
    } else if (h.updatedAt > existing.updatedAt) {
      byId.set(h.id, h);
      updated++;
    } else {
      skipped++;
    }
  }
  return { holdings: [...byId.values()].slice(0, MAX_HOLDINGS), added, updated, skipped };
}

const CSV_HEADERS: Record<Lang, string[]> = {
  id: ['Tanggal', 'Jenis', 'Berat (gr)', 'Kadar (%)', 'Mata uang', 'Harga beli per gram', 'Total beli', 'Catatan'],
  en: ['Date', 'Type', 'Weight (g)', 'Purity (%)', 'Currency', 'Buy price per gram', 'Total cost', 'Note'],
};

/** Quote per RFC 4180 and defuse spreadsheet formulas in text cells. */
function csvText(value: string, sep: string): string {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return /["\r\n]/.test(safe) || safe.includes(sep) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

function csvNumber(value: number, lang: Lang): string {
  const text = String(Math.round(value * 10_000) / 10_000);
  return lang === 'id' ? text.replace('.', ',') : text;
}

export function exportCsv(
  holdings: Holding[],
  lang: Lang,
  typeLabel: (type: ProductType) => string,
): string {
  const sep = lang === 'id' ? ';' : ',';
  const rows = holdings.map((h) =>
    [
      h.date,
      csvText(typeLabel(h.type), sep),
      csvNumber(h.grams, lang),
      csvNumber(h.kadarPct, lang),
      h.currency,
      csvNumber(h.buyPricePerGram, lang),
      csvNumber(h.grams * h.buyPricePerGram, lang),
      csvText(h.note ?? '', sep),
    ].join(sep),
  );
  return '\uFEFF' + [CSV_HEADERS[lang].join(sep), ...rows].join('\r\n') + '\r\n';
}

/** Offer text as a file download. */
export function downloadText(text: string, filename: string, type: string): void {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
