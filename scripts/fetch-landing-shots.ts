import path from 'path';
import fs from 'fs';
import { compositeMockup } from '../src/mcp/compositor';

const root = process.cwd();
const srcDir = path.join(root, '.landing-src');
const outDir = path.join(root, 'public', 'landing');

const API = 'https://picsum.photos/v2/list?page=1&limit=100';

type Photo = { id: string; author: string; url: string };

async function loadPhotos(): Promise<Map<string, Photo>> {
  const res = await fetch(API, { headers: { 'User-Agent': 'NoiceSS-landing/1.0' } });
  const list = (await res.json()) as Photo[];
  return new Map(list.map((p) => [p.id, p]));
}

async function photoInfo(id: string): Promise<Photo> {
  try {
    const res = await fetch(`https://picsum.photos/id/${id}/info`, {
      headers: { 'User-Agent': 'NoiceSS-landing/1.0' },
    });
    if (res.ok) {
      const j = (await res.json()) as any;
      return { id, author: j.author ?? 'Unknown', url: j.url ?? '' };
    }
  } catch {
    /* fall through */
  }
  return { id, author: 'Unknown', url: '' };
}

async function grab(id: string, w: number, h: number, dest: string): Promise<boolean> {
  try {
    const res = await fetch(`https://picsum.photos/id/${id}/${w}/${h}`, {
      headers: { 'User-Agent': 'NoiceSS-landing/1.0' },
      redirect: 'follow',
    });
    if (!res.ok) return false;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 20000) return false;
    fs.writeFileSync(dest, buf);
    return true;
  } catch {
    return false;
  }
}

const STYLE: Record<string, any> = {
  iso: { preset: '3d-hero-angle', background: 'dark-green-8k.webp' },
  glass: { preset: 'apple-sequoia', background: 'macos-sequoia.webp', glassBorder: true, glassBorderWidth: 14, glassBorderOpacity: 55, glassBorderBlur: 30 },
  chrome: { preset: 'big-sur-3d', background: 'macos-big-sur-dark.webp', showMacOsBar: true, showBrowserBar: true, browserUrl: 'noicess.fun', windowTitle: 'noicess.fun' },
  noise: { preset: 'monterey-dark', background: 'macos-monterey-dark.webp', noiseIntensity: 42, grainIntensity: 34, noiseTarget: 'both' },
  filter: { preset: 'studio-minimal', background: 'raycast-chromatic-dark-1.webp', filter: 'cyberpunk', imageSaturation: 165, imageContrast: 125 },
  blur: { preset: 'safari-minimal', background: 'chosen-nature-3.webp', bgBlur: 'frosted', glassBorder: true, glassBorderWidth: 10, glassBorderOpacity: 45, glassBorderBlur: 26 },
  ascii: { preset: 'pure-obsidian', background: 'emerald-dark.webp', asciiEnabled: true, asciiPattern: 'block', asciiSize: 18, asciiOpacity: 22, asciiColor: '#ffffff', asciiTarget: 'canvas' },
  watermark: { preset: 'tahoe-sunset', background: 'macos-tahoe-light.webp', showMacOsBar: true, watermarkText: '@ishivgaur', watermarkPlatform: 'x', watermarkPosition: 'bottom-right', watermarkOpacity: 100, watermarkBlur: 'default', watermarkGlass: 'frosted' },
  flatlay: { preset: 'studio-minimal', background: 'abstract-waves.webp', perspective: 'flat-lay', rotateX: 34, rotateY: 0, rotateZ: 0, perspectiveDepth: 1100 },
  skew: { preset: 'studio-minimal', background: 'raycast-blue-distortion-1.webp', perspective: 'skew-left', rotateX: 10, rotateY: -30, rotateZ: 5, perspectiveDepth: 900 },
  light: { preset: 'tahoe-sunset', background: 'macos-tahoe-light.webp', imageBrightness: 112, imageSaturation: 118, glassBorder: true, glassBorderWidth: 8, glassBorderOpacity: 30 },
  black: { preset: 'pure-obsidian', background: 'macos-dark-4k.webp', view: 'minimal', imageBlur: 2 },
};

type Job = {
  out: string;
  id: string;
  style: keyof typeof STYLE;
  ratio: string;
  srcW: number;
  srcH: number;
};

const JOBS: Job[] = [
  { out: 'p-perspective', id: '1011', style: 'iso', ratio: '16/9', srcW: 1400, srcH: 788 },
  { out: 'p-ascii', id: '1024', style: 'ascii', ratio: '16/9', srcW: 1400, srcH: 788 },
  { out: 'p-chrome', id: '1013', style: 'chrome', ratio: '16/9', srcW: 1400, srcH: 788 },
  { out: 'p-noise', id: '1020', style: 'noise', ratio: '16/9', srcW: 1400, srcH: 788 },
  { out: 'p-filter', id: '1022', style: 'filter', ratio: '16/9', srcW: 1400, srcH: 788 },
  { out: 'p-watermark', id: '1025', style: 'watermark', ratio: '16/9', srcW: 1400, srcH: 788 },
  { out: 'p-glass', id: '1012', style: 'glass', ratio: '16/9', srcW: 1400, srcH: 788 },
  { out: 'p-blur', id: '1023', style: 'blur', ratio: '16/9', srcW: 1400, srcH: 788 },
  { out: 'p-flatlay', id: '1014', style: 'flatlay', ratio: '16/9', srcW: 1400, srcH: 788 },
  { out: 'p-banner', id: '1035', style: 'chrome', ratio: '21/9', srcW: 2000, srcH: 857 },
];

async function run() {
  fs.mkdirSync(srcDir, { recursive: true });
  fs.mkdirSync(outDir, { recursive: true });
  const photos = await loadPhotos();
  const credits: string[] = [];

  for (const job of JOBS) {
    const srcPath = path.join(srcDir, `${job.out}.jpg`);
    if (!(await grab(job.id, job.srcW, job.srcH, srcPath))) {
      console.error(`MISS  ${job.out}: download failed`);
      continue;
    }
    try {
      const r = await compositeMockup({
        imagePath: srcPath,
        outputPath: path.join(outDir, `${job.out}.webp`),
        ...STYLE[job.style],
        aspectRatio: job.ratio,
        format: 'webp',
        quality: 72,
        scale: 92, targetWidth: 1400,
        padding: 30,
      } as never);
      const p = photos.get(job.id) ?? (await photoInfo(job.id));
      credits.push(`${job.out}.webp  ${job.ratio}  ${job.style}  photo id ${job.id}  by ${p?.author ?? 'unknown'}  https://picsum.photos/id/${job.id}`);
      console.log(`ok    ${job.out}.webp  ${job.ratio.padEnd(6)} ${job.style.padEnd(9)} ${r.width}x${r.height}  ${(r.sizeBytes / 1024).toFixed(0)}KB  (${p?.author})`);
    } catch (e) {
      console.error(`FAIL  ${job.out}: ${(e as Error).message}`);
    }
  }

  fs.writeFileSync(
    path.join(outDir, 'CREDITS.txt'),
    `Photos served by Lorem Picsum (https://picsum.photos), sourced from Unsplash.\n` +
      `Styled with the NoiceSS MCP compositor (scripts/fetch-landing-shots.ts).\n\n${credits.join('\n')}\n`
  );
  console.log(`\nwrote ${credits.length} images + CREDITS.txt`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
