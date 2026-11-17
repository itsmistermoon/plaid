/**
 * Regenerates the static assets drawn from the Clan tartan: the favicon and
 * the Open Graph image. Run with `pnpm tartan:assets` after changing the sett.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { chromium } from '@playwright/test';
import { tartanColors, tartanSvg, tartanUrl } from '../src/tartan.ts';

writeFileSync('public/favicon.svg', `${tartanSvg('check', 64)}\n`);

const require = createRequire(import.meta.url);
// The page has no origin, so the fonts travel inline as data URLs.
const font = (file: string) =>
  `data:font/woff2;base64,${readFileSync(require.resolve(`@fontsource/${file}`)).toString('base64')}`;
const html = `<!doctype html><style>
@font-face { font-family: Kaushan; src: url(${font('kaushan-script/files/kaushan-script-latin-400-normal.woff2')}); }
@font-face { font-family: Outfit; src: url(${font('outfit/files/outfit-latin-700-normal.woff2')}); }
body { margin: 0; width: 1200px; height: 630px; display: grid; place-items: center;
  background: ${tartanUrl()} 0 0 / 404px 404px; }
.card { padding: 40px 72px 48px; border-radius: 18px; text-align: center;
  background: ${tartanColors.K}; color: ${tartanColors.W};
  box-shadow: 0 0 0 6px ${tartanColors.W}, 0 24px 60px #000a; }
h1 { margin: 0; font: 400 108px Kaushan; color: ${tartanColors.G}; }
p { margin: 8px 0 0; font: 700 34px Outfit; letter-spacing: .04em; }
</style><div class="card"><h1>plaid</h1><p>UI Kit</p></div>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'public/og.png' });

// Raster icons: browsers and dashboards (Vercel's included) that ignore SVG
// favicons read favicon.ico; iOS reads apple-touch-icon.png.
const icon = async (size: number) => {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(
    `<style>body{margin:0}svg{width:${size}px;height:${size}px;display:block}</style>${tartanSvg('check', 64)}`,
  );
  return page.screenshot({ omitBackground: true });
};
writeFileSync('public/apple-touch-icon.png', await icon(180));
// An ICO file can hold a PNG as is: a 6-byte header and one 16-byte entry.
const png = await icon(32);
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6);
header.writeUInt8(32, 7);
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(png.length, 14);
header.writeUInt32LE(22, 18);
writeFileSync('public/favicon.ico', Buffer.concat([header, png]));
await browser.close();
