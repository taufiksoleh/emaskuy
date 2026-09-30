/**
 * Build step: responsive WebP copies of the PNG/JPG images in public/.
 *
 * Writes public/_img/<name>-{480,960,1440}.webp (never enlarged) for the
 * <Img> component, and public/_img/og/<name>.jpg at 1200×630 under 250 KB
 * for link previews (WhatsApp ignores images much above 300 KB). Outputs
 * newer than their source are skipped, so it is cheap to run before every
 * dev/build and picks up images the content agent adds.
 */
import { mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const PUBLIC = path.resolve(import.meta.dirname, '../public');
const OUT = path.join(PUBLIC, '_img');
const WIDTHS = [480, 960, 1440];
/** Not photos: icons and the pre-made social card. */
const SKIP = new Set(['apple-touch-icon.png', 'logo-mark.png', 'og-cover.png']);
const OG_MAX_BYTES = 250_000;

async function newerThan(target, source) {
  try {
    return (await stat(target)).mtimeMs >= (await stat(source)).mtimeMs;
  } catch {
    return false;
  }
}

async function ogJpeg(input) {
  for (const quality of [82, 74, 66, 58, 50]) {
    const buf = await sharp(input).resize(1200, 630, { fit: 'cover' }).jpeg({ quality, mozjpeg: true }).toBuffer();
    if (buf.length <= OG_MAX_BYTES) return buf;
  }
  return sharp(input).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 45, mozjpeg: true }).toBuffer();
}

await mkdir(path.join(OUT, 'og'), { recursive: true });
const files = (await readdir(PUBLIC)).filter((f) => /\.(png|jpe?g)$/i.test(f) && !SKIP.has(f));
let written = 0;

for (const file of files) {
  const input = path.join(PUBLIC, file);
  const name = file.replace(/\.(png|jpe?g)$/i, '');
  for (const width of WIDTHS) {
    const target = path.join(OUT, `${name}-${width}.webp`);
    if (await newerThan(target, input)) continue;
    await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 72 }).toFile(target);
    written++;
  }
  const og = path.join(OUT, 'og', `${name}.jpg`);
  if (!(await newerThan(og, input))) {
    await sharp(await ogJpeg(input)).toFile(og);
    written++;
  }
}

console.log(`images: ${files.length} sources, ${written} files written`);
