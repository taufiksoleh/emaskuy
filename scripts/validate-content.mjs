/**
 * CI gate for the content the agent writes: Antam prices, the AI insight
 * and articles. Catches the mistakes that have happened or would hurt most:
 * a per-gram price typed as a bar price, buyback above the selling price,
 * a price 10× off, image paths that 404 on GitHub Pages, and content
 * branches that touch code or the lockfile.
 *
 *   npm run validate:content            # validate, exit 1 on errors
 *   node scripts/validate-content.mjs --print-schema
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { AiInsightSchema, AntamSchema } from './content-schema.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MAX_IMAGE_BYTES = 400_000;
const DAY = 86_400_000;

/** Files a `content/*` branch may change. */
const CONTENT_ALLOWLIST = [
  /^src\/content\/antam\.json$/,
  /^src\/content\/ai-insight\.json$/,
  /^src\/data\/articles\.ts$/,
  /^public\/article-[\w-]+\.(png|jpe?g)$/,
];

const dayNum = (iso) => Math.floor(Date.parse(`${iso}T00:00:00Z`) / DAY);
const schemaErrors = (result) =>
  result.success ? [] : result.error.issues.map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`);

/** `today` is the WIB date (YYYY-MM-DD); `previous` the Antam file on the base branch. */
export function checkAntam(data, { today, previous = null }) {
  const errors = schemaErrors(AntamSchema.safeParse(data));
  const warnings = [];
  if (errors.length > 0) return { errors, warnings };

  const { antam, history, priceDate } = data;
  if (priceDate > today) errors.push(`priceDate ${priceDate} is in the future (today ${today} WIB)`);

  const grams = antam.sizes.map((s) => s.grams);
  if (new Set(grams).size !== grams.length) errors.push('antam.sizes has duplicate sizes');
  const one = antam.sizes.find((s) => s.grams === 1);
  if (!one) {
    errors.push('antam.sizes must include the 1 g bar');
    return { errors, warnings };
  }
  if (antam.buybackPerGram >= one.sell) errors.push('buybackPerGram must be below the 1 g selling price');
  const spreadPct = ((one.sell - antam.buybackPerGram) / one.sell) * 100;
  if (spreadPct < 2 || spreadPct > 20) errors.push(`sell–buyback spread ${spreadPct.toFixed(1)}% is outside 2–20%`);

  for (const s of antam.sizes) {
    const ratio = s.sell / s.grams / one.sell;
    if (ratio < 0.9 || ratio > 1.25) {
      errors.push(`${s.grams} g costs ${(ratio * 100).toFixed(0)}% of the 1 g price per gram; is "sell" the whole-bar price?`);
    }
  }

  for (const [brand, q] of Object.entries(data.others ?? {})) {
    if (q.buybackPerGram >= q.sellPerGram) errors.push(`others.${brand}: buybackPerGram must be below sellPerGram`);
    const ratio = q.sellPerGram / one.sell;
    if (ratio < 0.8 || ratio > 1.25) {
      errors.push(`others.${brand}.sellPerGram is ${(ratio * 100).toFixed(0)}% of the Antam 1 g price; check the digits`);
    }
  }

  const dates = history.map((h) => h.date);
  if (dates.some((d, i) => i > 0 && d <= dates[i - 1])) errors.push('history must be sorted by date without duplicates');
  const last = history[history.length - 1];
  if (last.date !== priceDate || last.sell1g !== one.sell || (last.buyback !== null && last.buyback !== antam.buybackPerGram)) {
    errors.push("history's last entry must match priceDate, the 1 g price and buybackPerGram");
  }

  const prevOne = previous?.antam?.sizes?.find?.((s) => s.grams === 1)?.sell;
  if (prevOne) {
    const change = one.sell / prevOne;
    if (change < 0.5 || change > 2) errors.push(`1 g price moved from ${prevOne} to ${one.sell}; check the digits`);
    else if (Math.abs(change - 1) > 0.05) warnings.push(`1 g price moved ${((change - 1) * 100).toFixed(1)}% since the last file`);
  }
  const age = dayNum(today) - dayNum(priceDate);
  if (age > 3) warnings.push(`Antam prices are ${age} days old`);
  return { errors, warnings };
}

export function checkInsight(data, { now }) {
  const errors = schemaErrors(AiInsightSchema.safeParse(data));
  const warnings = [];
  if (errors.length > 0) return { errors, warnings };
  const at = Date.parse(data.generatedAt);
  if (at > now + 3_600_000) errors.push(`generatedAt ${data.generatedAt} is in the future`);
  if (now - at > 3 * DAY) warnings.push('AI insight is more than 3 days old');
  return { errors, warnings };
}

/** Checks on the TypeScript source of src/data/articles.ts. */
export function checkArticles(source, { publicDir, now }) {
  const errors = [];
  const slugs = [...source.matchAll(/^\s{4}slug:\s*'([^']+)'/gm)].map((m) => m[1]);
  const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  if (dupes.length > 0) errors.push(`duplicate slugs: ${[...new Set(dupes)].join(', ')}`);

  for (const m of source.matchAll(/image:\s*(withBase\()?'([^']+)'/g)) {
    const [, wrapped, src] = m;
    if (!wrapped && src.startsWith('/')) errors.push(`image '${src}' must be wrapped: withBase('${src}')`);
    if (!/^\/[\w-]+\.(png|jpe?g)$/i.test(src)) {
      errors.push(`image ${src} must be a PNG or JPG directly in public/ (the WebP and link-preview copies are made from those)`);
    }
    const file = path.join(publicDir, src.replace(/^\//, ''));
    if (!existsSync(file)) errors.push(`image ${src} is missing from public/`);
    else if (statSync(file).size > MAX_IMAGE_BYTES) errors.push(`image ${src} is over ${MAX_IMAGE_BYTES / 1000} KB`);
  }

  for (const m of source.matchAll(/publishedAt:\s*Date\.parse\('([^']+)'\)/g)) {
    const t = Date.parse(m[1]);
    if (!Number.isFinite(t)) errors.push(`publishedAt '${m[1]}' is not a date`);
    else if (t > now + 3_600_000) errors.push(`publishedAt ${m[1]} is in the future`);
  }
  return { errors, warnings: [] };
}

/** Rules on which files a change may touch. */
export function checkChangedFiles(files, branch) {
  const errors = [];
  if (files.includes('package-lock.json') && !files.includes('package.json')) {
    errors.push('package-lock.json changed without package.json; run `npm ci`, not `npm install`');
  }
  if (branch.startsWith('content/')) {
    for (const f of files) {
      if (!CONTENT_ALLOWLIST.some((re) => re.test(f))) errors.push(`content branches may not change ${f}`);
    }
  }
  return { errors, warnings: [] };
}

/* ------------------------------------------------------------------ */

function git(args) {
  try {
    return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

/**
 * What the change is compared against. In a pull_request run HEAD is the
 * merge commit and its first parent the base branch; elsewhere it is where
 * the branch left origin/main.
 */
function baseCommit() {
  return process.env.GITHUB_BASE_REF ? git(['rev-parse', 'HEAD^1']) : git(['merge-base', 'HEAD', 'origin/main']);
}

/** Files changed since `base`, committed or not. */
function changedFiles(base) {
  const lines = (out) => (out ?? '').split('\n').filter(Boolean);
  return [...new Set([...lines(git(['diff', '--name-only', base])), ...lines(git(['ls-files', '--others', '--exclude-standard']))])];
}

function report(file, { errors, warnings }) {
  const gh = process.env.GITHUB_ACTIONS === 'true';
  // Annotations attach to a file only when `file` is a real path.
  const at = file.startsWith('(') ? '' : ` file=${file}`;
  for (const w of warnings) console.log(gh ? `::warning${at}::${w}` : `warning  ${file}: ${w}`);
  for (const e of errors) console.log(gh ? `::error${at}::${e}` : `error    ${file}: ${e}`);
  return errors.length;
}

function main() {
  if (process.argv.includes('--print-schema')) {
    console.log(JSON.stringify({ antam: z.toJSONSchema(AntamSchema), aiInsight: z.toJSONSchema(AiInsightSchema) }, null, 2));
    return;
  }
  const now = Date.now();
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(now);
  const read = (rel) => readFileSync(path.join(ROOT, rel), 'utf8');
  const base = baseCommit();
  const previousText = base ? git(['show', `${base}:src/content/antam.json`]) : null;
  let previous = null;
  try {
    previous = previousText ? JSON.parse(previousText) : null;
  } catch {
    previous = null;
  }
  const changed = base ? changedFiles(base) : [];
  const branch = process.env.GITHUB_HEAD_REF || git(['rev-parse', '--abbrev-ref', 'HEAD']) || '';

  let failures = 0;
  failures += report('src/content/antam.json', checkAntam(JSON.parse(read('src/content/antam.json')), { today, previous }));
  failures += report('src/content/ai-insight.json', checkInsight(JSON.parse(read('src/content/ai-insight.json')), { now }));
  failures += report('src/data/articles.ts', checkArticles(read('src/data/articles.ts'), { publicDir: path.join(ROOT, 'public'), now }));
  failures += report('(changed files)', checkChangedFiles(changed, branch));
  for (const legacy of ['src/data/antam.ts', 'src/data/aiInsight.ts']) {
    if (existsSync(path.join(ROOT, legacy))) failures += report(legacy, { errors: ['moved to src/content/*.json; delete this file'], warnings: [] });
  }

  if (failures > 0) {
    console.log(`validate-content: ${failures} error(s)`);
    process.exit(1);
  }
  console.log('validate-content: OK');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
