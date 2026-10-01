/**
 * Renders a text-free EmasKuy article cover (1280×720 PNG) from a JSON spec.
 * No words or numbers are drawn, so one image serves both /analisis and /en.
 *
 * Usage (from the repo root, after `npm ci` so sharp resolves):
 *   node .claude/skills/gold-daily-content/render-cover.mjs <spec.json> public/article-<name>.png
 *
 * Spec (all fields except `points` optional):
 * {
 *   "points": [4170, 4166, 4195, 4213, 4180, 4152],  // price path, oldest first
 *   "pivot": 3,                // index where the line switches colour (e.g. a spike); default: none
 *   "before": "gold",          // colour before the pivot: gold | red | green
 *   "after": "red",            // colour after the pivot
 *   "levels": [ { "value": 4213, "tone": "grey" }, { "value": 4100, "tone": "gold" } ],  // dashed lines
 *   "projection": "down",      // dotted continuation after the last point: up | down | none
 *   "question": true,          // big "?" for an undecided outlook
 *   "cards": [ { "dir": "down", "tone": "green", "bars": [70, 58, 64, 40] } ],  // up to 3 data cards
 *   "icon": "bar"              // bottom-right icon: bar | coin | none
 * }
 */
import { readFileSync } from 'node:fs';
import sharp from 'sharp';

const [, , specPath, outPath] = process.argv;
if (!specPath || !outPath) {
  console.error('usage: render-cover.mjs <spec.json> <out.png>');
  process.exit(1);
}
const spec = JSON.parse(readFileSync(specPath, 'utf8'));
const W = 1280, H = 720;
const C = { gold: '#f5b83d', red: '#f05a5a', green: '#4fd18b', grey: '#9aa0ab', light: '#ffd877' };
const pts = spec.points;
if (!Array.isArray(pts) || pts.length < 2) throw new Error('spec.points needs at least 2 values');

const levelVals = (spec.levels ?? []).map((l) => l.value);
const lo = Math.min(...pts, ...levelVals), hi = Math.max(...pts, ...levelVals);
const pad = (hi - lo) * 0.08 || 1;
const yTop = hi + pad, yBot = lo - pad;
const x0 = 80, x1 = 1000, py0 = 110, py1 = 430;
const X = (i) => x0 + (i * (x1 - x0)) / (pts.length - 1);
const Y = (v) => py0 + ((yTop - v) * (py1 - py0)) / (yTop - yBot);
const seg = (a, b) => pts.slice(a, b + 1).map((v, k) => `${X(a + k).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
const last = pts.length - 1;
const pivot = Number.isInteger(spec.pivot) ? Math.min(Math.max(spec.pivot, 0), last) : last;
const before = C[spec.before ?? 'gold'], after = C[spec.after ?? 'red'];

const grid = [];
for (let g = 0; g <= W; g += 64) grid.push(`<line x1="${g}" y1="0" x2="${g}" y2="${H}" stroke="#fff" stroke-opacity="0.025"/>`);
for (let g = 0; g <= H; g += 64) grid.push(`<line x1="0" y1="${g}" x2="${W}" y2="${g}" stroke="#fff" stroke-opacity="0.025"/>`);

const levels = (spec.levels ?? []).map((l) =>
  `<line x1="80" y1="${Y(l.value)}" x2="1200" y2="${Y(l.value)}" stroke="${C[l.tone ?? 'grey']}" stroke-opacity="0.5" stroke-dasharray="10 10" stroke-width="2"/>`).join('');

const marker = (i, col) => `<circle cx="${X(i)}" cy="${Y(pts[i])}" r="10" fill="none" stroke="${col}" stroke-width="3"/><circle cx="${X(i)}" cy="${Y(pts[i])}" r="4" fill="${col}"/>`;

const lastCol = pivot < last ? after : before;
let projection = '';
if (spec.projection === 'up' || spec.projection === 'down') {
  const ex = X(last), ey = Y(pts[last]);
  const ty = spec.projection === 'down' ? Math.min(py1 - 24, ey + 120) : Math.max(py0 + 24, ey - 120);
  projection = `<path d="M${ex + 24},${ey} Q${ex + 80},${ey} ${ex + 100},${ty}" fill="none" stroke="${lastCol}" stroke-opacity="0.55" stroke-width="3" stroke-dasharray="6 8"/>`;
}

const card = (cx, c) => {
  const col = C[c.tone ?? (c.dir === 'down' ? 'green' : 'red')];
  const arrow = c.dir === 'down' ? 'M0,-10 L18,18 L36,-10 Z' : 'M0,18 L18,-10 L36,18 Z';
  const bars = (c.bars ?? [40, 50, 45, 75]).slice(0, 5);
  const rects = bars.map((h, i) => `<rect x="${92 + i * 26}" y="${100 - Math.min(h, 80)}" width="16" height="${Math.min(h, 80)}" rx="3" fill="${i === bars.length - 1 ? col : '#3a3324'}"/>`).join('');
  return `<g transform="translate(${cx},530)"><rect width="236" height="128" rx="14" fill="#11141a" stroke="${C.gold}" stroke-opacity="0.45"/><g transform="translate(34,52)"><path d="${arrow}" fill="${col}"/></g>${rects}</g>`;
};
const cards = (spec.cards ?? []).slice(0, 3);
const cardStart = 640 - (cards.length * 300 - 64) / 2;

const icon = spec.icon === 'none' ? '' : spec.icon === 'coin'
  ? `<g transform="translate(1100,558)"><circle cx="45" cy="45" r="45" fill="${C.gold}"/><circle cx="45" cy="45" r="34" fill="none" stroke="#7a5a18" stroke-width="3"/></g>`
  : `<g transform="translate(1088,566)"><path d="M14,0 L90,0 L104,64 L0,64 Z" fill="${C.gold}"/><path d="M14,0 L90,0 L82,14 L22,14 Z" fill="${C.light}"/><path d="M22,14 L82,14 L92,56 L12,56 Z" fill="none" stroke="#7a5a18" stroke-width="3" stroke-opacity="0.7"/></g>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  <radialGradient id="bg" cx="0.1" cy="0.1" r="1.1"><stop offset="0" stop-color="#15130e"/><stop offset="0.55" stop-color="#0b0c10"/><stop offset="1" stop-color="#08090c"/></radialGradient>
  <linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.gold}" stop-opacity="0.18"/><stop offset="1" stop-color="${C.gold}" stop-opacity="0"/></linearGradient>
  <filter id="glow" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>${grid.join('')}
<polygon points="${X(0)},${py1} ${seg(0, last)} ${X(last)},${py1}" fill="url(#area)"/>
${levels}
<polyline points="${seg(0, pivot)}" fill="none" stroke="${before}" stroke-width="5" stroke-linejoin="round" filter="url(#glow)"/>
${pivot < last ? `<polyline points="${seg(pivot, last)}" fill="none" stroke="${after}" stroke-width="5" stroke-linejoin="round" filter="url(#glow)"/>${marker(pivot, C.light)}` : ''}
${marker(last, lastCol)}
${projection}
${spec.question ? `<path transform="translate(1110,190) scale(1.3)" d="M10,30 C10,5 70,5 70,30 C70,50 42,52 42,72 L42,80" fill="none" stroke="${C.light}" stroke-width="16" stroke-linecap="round"/><circle cx="1164.6" cy="320" r="11" fill="${C.light}"/>` : ''}
${cards.map((c, i) => card(cardStart + i * 300, c)).join('')}
${icon}
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(outPath);
const meta = await sharp(outPath).metadata();
console.log(`${outPath}: ${meta.width}x${meta.height}`);
