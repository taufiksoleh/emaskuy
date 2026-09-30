/**
 * One-off: app icons for the web app manifest, from public/logo-mark.png.
 * The outputs in public/icons/ are committed; re-run after a logo change.
 *
 *   node scripts/gen-icons.mjs
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const PUBLIC = path.resolve(import.meta.dirname, '../public');
const SOURCE = path.join(PUBLIC, 'logo-mark.png');
const BG = '#0a0b0e';

/** Logo centered on the brand background, taking `scale` of the canvas. */
async function icon(size, scale, file) {
  const logo = await sharp(SOURCE)
    .resize(Math.round(size * scale), Math.round(size * scale), { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: BG } })
    .composite([{ input: logo, gravity: 'centre' }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(PUBLIC, 'icons', file));
}

await mkdir(path.join(PUBLIC, 'icons'), { recursive: true });
await icon(192, 0.7, 'pwa-192.png');
await icon(512, 0.7, 'pwa-512.png');
// Maskable: keep the logo inside the 80% safe zone launchers crop to.
await icon(512, 0.56, 'pwa-maskable-512.png');
await icon(72, 0.8, 'badge-72.png');
console.log('icons written to public/icons/');
