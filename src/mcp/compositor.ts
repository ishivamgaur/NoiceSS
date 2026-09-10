import fs from 'node:fs';
import path from 'node:path';
import sharp, { type OverlayOptions } from 'sharp';
import { MCP_PRESETS, ALL_FILTERS, ASCII_PATTERNS } from './presets.js';
import type { GenerateMockupOptions, ImageFormat, BatchMockupOptions, BatchMockupItemResult } from './types.js';

export interface CompositorResult {
  outputPath?: string;
  buffer: Buffer;
  width: number;
  height: number;
  format: ImageFormat;
  sizeBytes: number;
}

/**
 * Loads an image from a local path, web URL, or base64 data URL.
 */
export async function loadImageBuffer(source: string): Promise<Buffer> {
  const cleanSource = source.trim().replace(/^["']|["']$/g, '');

  if (cleanSource.startsWith('data:')) {
    const commaIdx = cleanSource.indexOf(',');
    const base64Data = commaIdx !== -1 ? cleanSource.slice(commaIdx + 1) : cleanSource;
    return Buffer.from(base64Data, 'base64');
  }

  if (cleanSource.startsWith('http://') || cleanSource.startsWith('https://')) {
    const res = await fetch(cleanSource);
    if (!res.ok) {
      throw new Error(`Failed to fetch image from ${cleanSource}: ${res.statusText}`);
    }
    const arrayBuf = await res.arrayBuffer();
    return Buffer.from(arrayBuf);
  }

  // Local filesystem path
  const resolved = path.isAbsolute(cleanSource) ? cleanSource : path.resolve(process.cwd(), cleanSource);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Image file does not exist at: ${resolved}`);
  }
  return fs.readFileSync(resolved);
}

/**
 * Resolves wallpaper path from local disk or public/wallpapers/ directory
 */
function resolveWallpaperPath(bgNameOrUrl: string): string | null {
  const cleanName = bgNameOrUrl.replace(/^url\(["']?|["']?\)$/g, '').replace(/^\/wallpapers\//, '').trim().replace(/^["']|["']$/g, '');

  // 1. Direct local file path
  const directPath = path.isAbsolute(cleanName) ? cleanName : path.resolve(process.cwd(), cleanName);
  if (fs.existsSync(directPath) && fs.statSync(directPath).isFile()) {
    return directPath;
  }

  // 2. Preset in public/wallpapers
  const candidate = cleanName.endsWith('.webp') ? cleanName : `${cleanName}.webp`;
  const possiblePaths = [
    path.resolve(process.cwd(), 'public', 'wallpapers', candidate),
    path.resolve(__dirname, '..', '..', 'public', 'wallpapers', candidate),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

/**
 * Helper to escape XML characters
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generates the unified macOS / Safari window chrome header
/**
 * Creates macOS window chrome header SVG (matching NoiceSS Studio page.tsx L4080-4120 exactly):
 * - Height: 40px (default macOS) or 52px (Safari browser bar), scaled by dpiScale
 * - Background: #1C1C1E
 * - Traffic lights: 12px dots, 8px gap, #ff5f56, #ffbd2e, #27c93f, with 1px inset shine & 0.5px dark border
 * - Safari address bar (when showBrowserBar is true):
 *   - Height: 28px * scale
 *   - Background: #2C2C2E with subtle inset shadow and 1px border rgba(255,255,255,0.06)
 *   - Border radius: 6px * scale
 *   - Centered lock icon (size 12 * scale, stroke 2, opacity 50%) + URL text (13px * scale, rgba(255,255,255,0.7))
 * - Window title (when showBrowserBar is false & title is present):
 *   - Centered 13px * scale, medium weight (500), rgba(255,255,255,0.7)
 * - Bottom border (when showBrowserBar is true): rgba(0,0,0,0.4) 1px
 */
function createWindowChromeSvg(
  width: number,
  height: number,
  showBrowserBar: boolean,
  browserUrl?: string,
  title?: string
): Buffer {
  const baseH = showBrowserBar ? 52 : 40;
  const scale = height / baseH;

  // Dot dimensions matching page.tsx L4084-4088 exactly
  const dotR = Math.max(2, Math.round(6 * scale));
  const dotY = Math.round(height / 2);
  const padLeft = Math.round(20 * scale);
  const dotGap = Math.round(8 * scale);
  const dotPitch = dotR * 2 + dotGap; // center-to-center distance

  const redCx = padLeft + dotR;
  const yellowCx = redCx + dotPitch;
  const greenCx = yellowCx + dotPitch;

  const strokeWidth = Math.max(0.5, Number((0.6 * scale).toFixed(1)));
  const highlightRx = Math.max(1, Number((dotR * 0.65).toFixed(1)));
  const highlightRy = Math.max(0.5, Number((dotR * 0.32).toFixed(1)));
  const highlightCy = dotY - Math.round(dotR * 0.3);

  let centerContent = '';
  if (showBrowserBar) {
    const pillH = Math.round(28 * scale);
    const pillY = Math.round((height - pillH) / 2);
    const pillRadius = Math.max(2, Math.round(6 * scale));
    const maxPillW = Math.round(400 * scale);
    const trafficZone = Math.round((20 + 52 + 16) * scale);
    const pillW = Math.min(maxPillW, Math.max(Math.round(160 * scale), width - trafficZone * 2));
    const pillX = Math.round((width - pillW) / 2);

    const lockSize = Math.max(8, Math.round(12 * scale));
    const lockGap = Math.max(3, Math.round(6 * scale));
    const fontSize = Math.max(9, Math.round(13 * scale));
    const displayUrl = browserUrl || 'example.com';

    // Perfectly center lock icon + URL text inside pill (matching flex items-center justify-center)
    const approxCharW = fontSize * 0.54;
    const maxTextW = pillW - (lockSize + lockGap + Math.round(20 * scale));
    const estTextW = Math.min(maxTextW, Math.round(displayUrl.length * approxCharW));
    const totalInnerW = lockSize + lockGap + estTextW;
    const innerStartX = Math.round(pillX + (pillW - totalInnerW) / 2);

    const lockX = innerStartX;
    const lockY = Math.round(height / 2 - lockSize / 2);
    const lockScale = Number((lockSize / 24).toFixed(3));

    const textX = innerStartX + lockSize + lockGap;
    const textY = Math.round(height / 2 + fontSize * 0.34);

    centerContent = `
      <!-- URL Pill Container matching bg-[#2C2C2E] border-white/[0.06] shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] -->
      <rect x="${pillX}" y="${pillY}" width="${pillW}" height="${pillH}" rx="${pillRadius}" ry="${pillRadius}" fill="#2C2C2E" stroke="rgba(255,255,255,0.06)" stroke-width="${strokeWidth}" />
      <!-- Subtle Pill Inner Top Shadow -->
      <line x1="${pillX + pillRadius}" y1="${pillY + 1}" x2="${pillX + pillW - pillRadius}" y2="${pillY + 1}" stroke="rgba(0,0,0,0.25)" stroke-width="${strokeWidth}" />
      <!-- Lock Icon (Lucide 12px) -->
      <g transform="translate(${lockX}, ${lockY}) scale(${lockScale})" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      </g>
      <!-- URL Text matching text-[13px] text-white/70 font-sans tracking-wide -->
      <text x="${textX}" y="${textY}" fill="rgba(255,255,255,0.7)" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif" font-size="${fontSize}" font-weight="400" letter-spacing="0.02em">${escapeXml(displayUrl)}</text>
    `;
  } else if (title) {
    const fontSize = Math.max(9, Math.round(13 * scale));
    const textY = Math.round(height / 2 + fontSize * 0.34);
    centerContent = `
      <!-- Centered Window Title matching text-[13px] font-medium text-white/70 -->
      <text x="50%" y="${textY}" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif" font-size="${fontSize}" font-weight="500" letter-spacing="0.01em">${escapeXml(title)}</text>
    `;
  }

  const bottomBorder = showBrowserBar
    ? `<line x1="0" y1="${height - 1}" x2="${width}" y2="${height - 1}" stroke="rgba(0,0,0,0.4)" stroke-width="${Math.max(1, Math.round(1 * scale))}" />`
    : '';

  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#1C1C1E" />
      ${bottomBorder}
      <!-- Close (Red #ff5f56) -->
      <circle cx="${redCx}" cy="${dotY}" r="${dotR}" fill="#ff5f56" stroke="rgba(0,0,0,0.12)" stroke-width="${strokeWidth}" />
      <ellipse cx="${redCx}" cy="${highlightCy}" rx="${highlightRx}" ry="${highlightRy}" fill="rgba(255,255,255,0.22)" />
      <!-- Minimize (Yellow #ffbd2e) -->
      <circle cx="${yellowCx}" cy="${dotY}" r="${dotR}" fill="#ffbd2e" stroke="rgba(0,0,0,0.12)" stroke-width="${strokeWidth}" />
      <ellipse cx="${yellowCx}" cy="${highlightCy}" rx="${highlightRx}" ry="${highlightRy}" fill="rgba(255,255,255,0.22)" />
      <!-- Maximize (Green #27c93f) -->
      <circle cx="${greenCx}" cy="${dotY}" r="${dotR}" fill="#27c93f" stroke="rgba(0,0,0,0.12)" stroke-width="${strokeWidth}" />
      <ellipse cx="${greenCx}" cy="${highlightCy}" rx="${highlightRx}" ry="${highlightRy}" fill="rgba(255,255,255,0.22)" />
      ${centerContent}
    </svg>
  `.trim();

  return Buffer.from(svg);
}

/**
 * Creates rounded corner mask for window content
 */
function createRoundedMask(width: number, height: number, radius: number): Buffer {
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="#ffffff" />
    </svg>
  `.trim();
  return Buffer.from(svg);
}

/**
 * Creates studio glass border card container
 * Matches browser studio (page.tsx L3934-3940):
 * - Translucent background: rgba(255,255,255, opacity * 0.25)
 * - 1px outer stroke: rgba(255,255,255, opacity)
 */
function createGlassBorderSvg(
  width: number,
  height: number,
  radius: number,
  opacity: number = 20,
  strokeWidth: number = 1
): Buffer {
  const alpha = (opacity / 100).toFixed(2);
  const bgAlpha = ((opacity / 100) * 0.25).toFixed(3);
  const inset = strokeWidth / 2;

  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect 
        x="${inset}" 
        y="${inset}" 
        width="${width - strokeWidth}" 
        height="${height - strokeWidth}" 
        rx="${radius}" 
        ry="${radius}" 
        fill="rgba(255,255,255,${bgAlpha})" 
        stroke="rgba(255,255,255,${alpha})" 
        stroke-width="${strokeWidth}" 
      />
    </svg>
  `.trim();
  return Buffer.from(svg);
}

/**
 * Creates studio drop shadow rendered directly at canvas dimensions
 * Matches browser formula (page.tsx L3931-3933):
 * 2D:  0 ${shadow}px ${shadow * 2}px rgba(0,0,0,0.35)
 * 3D: 20px 20px ${shadow * 3}px rgba(0,0,0,0.45)
 */
async function createDropShadow(
  canvasW: number,
  canvasH: number,
  cardX: number,
  cardY: number,
  windowW: number,
  windowH: number,
  radius: number,
  blurRadius: number,
  opacityPercent: number,
  offsetX: number = 0,
  offsetY: number = 35
): Promise<Buffer> {
  const alpha = (opacityPercent / 100).toFixed(2);
  const shadowX = Math.round(cardX + offsetX);
  const shadowY = Math.round(cardY + offsetY);

  const shadowSvg = Buffer.from(`
    <svg width="${canvasW}" height="${canvasH}" viewBox="0 0 ${canvasW} ${canvasH}" xmlns="http://www.w3.org/2000/svg">
      <rect 
        x="${shadowX}" 
        y="${shadowY}" 
        width="${windowW}" 
        height="${windowH}" 
        rx="${radius}" 
        ry="${radius}" 
        fill="rgba(0,0,0,${alpha})" 
      />
    </svg>
  `);

  return sharp(shadowSvg)
    .blur(Math.max(1, Math.min(80, blurRadius)))
    .png()
    .toBuffer();
}

/**
 * Creates a noise/grain overlay using SVG feTurbulence
 */
function createNoiseSvg(
  width: number,
  height: number,
  noiseIntensity: number,
  grainIntensity: number
): Buffer {
  const baseFreq = 0.65 + (grainIntensity / 100) * 0.8;
  const opacity = ((noiseIntensity + grainIntensity) / 200) * 0.45;
  const tileSize = 300;

  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="noiseFilter" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="${baseFreq.toFixed(3)}" numOctaves="3" seed="42" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <pattern id="noisePattern" width="${tileSize}" height="${tileSize}" patternUnits="userSpaceOnUse">
          <rect width="${tileSize}" height="${tileSize}" filter="url(#noiseFilter)" />
        </pattern>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#noisePattern)" opacity="${opacity.toFixed(3)}" />
    </svg>
  `.trim();

  return Buffer.from(svg);
}

/**
 * Creates an ASCII/pattern overlay using SVG text tiles
 */
function createAsciiOverlaySvg(
  width: number,
  height: number,
  char: string,
  size: number,
  opacity: number,
  color: string
): Buffer {
  const alpha = (opacity / 100).toFixed(2);
  const cols = Math.ceil(width / size);
  const rows = Math.ceil(height / size);

  let textElements = '';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      textElements += `<text x="${c * size + size / 2}" y="${r * size + size / 2}" text-anchor="middle" dominant-baseline="central" fill="${color}" fill-opacity="${alpha}" font-size="${size * 0.8}" font-family="monospace">${escapeXml(char)}</text>`;
    }
  }

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      ${textElements}
    </svg>
  `.trim();

  return Buffer.from(svg);
}

/**
 * Parses gradient CSS string into SVG gradient definition
 */
function parseGradientToSvg(
  gradientCss: string,
  targetWidth: number,
  targetHeight: number
): Buffer {
  const isRadial = gradientCss.startsWith('radial');

  const stopsMatch = gradientCss.match(/#[a-fA-F0-9]{3,8}(?:\s+\d+%)?/g);
  const stops: Array<{ color: string; offset: string }> = [];

  if (stopsMatch) {
    stopsMatch.forEach((s) => {
      const parts = s.trim().split(/\s+/);
      const color = parts[0];
      const offset = parts[1] || '';
      stops.push({ color, offset });
    });
  }

  if (stops.length < 2) {
    stops.length = 0;
    stops.push({ color: '#18181b', offset: '0%' }, { color: '#09090b', offset: '100%' });
  }

  stops.forEach((s, i) => {
    if (!s.offset) {
      s.offset = `${Math.round((i / (stops.length - 1)) * 100)}%`;
    }
  });

  const stopsSvg = stops.map((s) => `<stop offset="${s.offset}" stop-color="${s.color}" />`).join('\n');

  let gradientDef: string;
  if (isRadial) {
    const posMatch = gradientCss.match(/at\s+([\d.]+)%\s+([\d.]+)%/);
    const cx = posMatch ? posMatch[1] : '50';
    const cy = posMatch ? posMatch[2] : '30';
    gradientDef = `<radialGradient id="g" cx="${cx}%" cy="${cy}%" r="70%">${stopsSvg}</radialGradient>`;
  } else {
    const angleMatch = gradientCss.match(/([\d.]+)deg/);
    const angle = angleMatch ? parseFloat(angleMatch[1]) : 135;
    const rad = (angle * Math.PI) / 180;
    const x2 = (Math.cos(rad) * 0.5 + 0.5).toFixed(3);
    const y2 = (Math.sin(rad) * 0.5 + 0.5).toFixed(3);
    const x1 = (1 - parseFloat(x2)).toFixed(3);
    const y1 = (1 - parseFloat(y2)).toFixed(3);
    gradientDef = `<linearGradient id="g" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stopsSvg}</linearGradient>`;
  }

  const svg = `
    <svg width="${targetWidth}" height="${targetHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>${gradientDef}</defs>
      <rect width="${targetWidth}" height="${targetHeight}" fill="url(#g)" />
    </svg>
  `.trim();

  return Buffer.from(svg);
}

/**
 * Creates background canvas buffer with edge bleed prevention on blur
 */
async function createBackgroundCanvas(
  targetWidth: number,
  targetHeight: number,
  bgParam?: string,
  bgBlur?: number,
  inputImageBuffer?: Buffer
): Promise<Buffer> {
  const bg = bgParam || 'macos-sequoia.webp';

  let bgBuffer: Buffer;
  const wallpaperFile = resolveWallpaperPath(bg);

  if (bg === 'CURRENT_IMAGE' && inputImageBuffer) {
    const blurRadius = bgBlur !== undefined ? bgBlur : 25;
    if (blurRadius > 0) {
      // Scale blur radius proportionally with resolution relative to base canvas (~1560px)
      const resScale = Math.max(1, targetWidth / 1560);
      const effectiveBlur = Math.round(blurRadius * resScale);
      const scaleFactor = 1 + Math.min(0.25, effectiveBlur / 100);
      const scaledW = Math.round(targetWidth * scaleFactor);
      const scaledH = Math.round(targetHeight * scaleFactor);

      bgBuffer = await sharp(inputImageBuffer)
        .resize(scaledW, scaledH, { fit: 'cover', position: 'center' })
        .blur(Math.max(0.3, Math.min(250, effectiveBlur)))
        .extract({
          left: Math.round((scaledW - targetWidth) / 2),
          top: Math.round((scaledH - targetHeight) / 2),
          width: targetWidth,
          height: targetHeight,
        })
        .png()
        .toBuffer();
    } else {
      // No blur: crisp image cover resize directly to canvas
      bgBuffer = await sharp(inputImageBuffer)
        .resize(targetWidth, targetHeight, { fit: 'cover', position: 'center' })
        .png()
        .toBuffer();
    }
  } else if (wallpaperFile) {
    if (bgBlur && bgBlur > 0) {
      // Scale blur radius proportionally with resolution relative to base canvas (~1560px)
      const resScale = Math.max(1, targetWidth / 1560);
      const effectiveBlur = Math.round(bgBlur * resScale);
      const scaleFactor = 1 + Math.min(0.25, effectiveBlur / 100);
      const scaledW = Math.round(targetWidth * scaleFactor);
      const scaledH = Math.round(targetHeight * scaleFactor);

      bgBuffer = await sharp(wallpaperFile)
        .resize(scaledW, scaledH, { fit: 'cover', position: 'center' })
        .blur(Math.max(0.3, Math.min(250, effectiveBlur)))
        .extract({
          left: Math.round((scaledW - targetWidth) / 2),
          top: Math.round((scaledH - targetHeight) / 2),
          width: targetWidth,
          height: targetHeight,
        })
        .png()
        .toBuffer();
    } else {
      bgBuffer = await sharp(wallpaperFile)
        .resize(targetWidth, targetHeight, { fit: 'cover', position: 'center' })
        .png()
        .toBuffer();
    }
  } else if (bg.startsWith('http://') || bg.startsWith('https://') || bg.startsWith('data:')) {
    try {
      const customBgBuffer = await loadImageBuffer(bg);
      if (bgBlur && bgBlur > 0) {
        const resScale = Math.max(1, targetWidth / 1560);
        const effectiveBlur = Math.round(bgBlur * resScale);
        const scaleFactor = 1 + Math.min(0.25, effectiveBlur / 100);
        const scaledW = Math.round(targetWidth * scaleFactor);
        const scaledH = Math.round(targetHeight * scaleFactor);

        bgBuffer = await sharp(customBgBuffer)
          .resize(scaledW, scaledH, { fit: 'cover', position: 'center' })
          .blur(Math.max(0.3, Math.min(250, effectiveBlur)))
          .extract({
            left: Math.round((scaledW - targetWidth) / 2),
            top: Math.round((scaledH - targetHeight) / 2),
            width: targetWidth,
            height: targetHeight,
          })
          .png()
          .toBuffer();
      } else {
        bgBuffer = await sharp(customBgBuffer)
          .resize(targetWidth, targetHeight, { fit: 'cover', position: 'center' })
          .png()
          .toBuffer();
      }
    } catch {
      bgBuffer = await sharp({
        create: {
          width: targetWidth,
          height: targetHeight,
          channels: 4,
          background: '#09090b',
        },
      })
        .png()
        .toBuffer();
    }
  } else if (bg.includes('gradient')) {
    const gradientSvg = parseGradientToSvg(bg, targetWidth, targetHeight);
    bgBuffer = await sharp(gradientSvg).png().toBuffer();
    if (bgBlur && bgBlur > 0) {
      bgBuffer = await sharp(bgBuffer).blur(Math.max(0.3, Math.min(100, bgBlur))).png().toBuffer();
    }
  } else {
    const isTransparent = bg === 'transparent';
    const hex = isTransparent ? 'transparent' : (bg.startsWith('#') ? bg : '#09090b');
    bgBuffer = await sharp({
      create: {
        width: targetWidth,
        height: targetHeight,
        channels: 4,
        background: isTransparent ? { r: 0, g: 0, b: 0, alpha: 0 } : hex,
      },
    })
      .png()
      .toBuffer();
  }

  return bgBuffer;
}

/**
 * Applies brightness / contrast / saturation / hue rotation via Sharp
 */
async function applyColorAdjustments(
  buffer: Buffer,
  brightness: number = 100,
  contrast: number = 100,
  saturation: number = 100,
  hueRotate: number = 0,
  filterId: string = 'none'
): Promise<Buffer> {
  let pipeline = sharp(buffer);

  const filterItem = ALL_FILTERS.find((f) => f.id === filterId);
  if (filterItem && filterItem.id !== 'none') {
    switch (filterItem.id) {
      case 'grayscale':
        saturation = 0;
        break;
      case 'sepia':
        saturation = Math.min(saturation, 40);
        hueRotate = (hueRotate + 30) % 360;
        break;
      case 'contrast':
        contrast = Math.round(contrast * 1.6);
        break;
      case 'warm':
        saturation = Math.round(saturation * 1.3);
        break;
      case 'cool':
        hueRotate = (hueRotate + 180) % 360;
        saturation = Math.round(saturation * 1.2);
        break;
      case 'cyberpunk':
        saturation = Math.round(saturation * 1.8);
        hueRotate = (hueRotate + 280) % 360;
        contrast = Math.round(contrast * 1.4);
        break;
    }
  }

  const needsModulate = brightness !== 100 || saturation !== 100 || hueRotate !== 0;
  if (needsModulate) {
    pipeline = pipeline.modulate({
      brightness: brightness / 100,
      saturation: saturation / 100,
      hue: hueRotate,
    });
  }

  if (contrast !== 100) {
    const factor = contrast / 100;
    const offset = Math.round(128 * (1 - factor));
    pipeline = pipeline.linear(factor, offset);
  }

  return pipeline.png().toBuffer();
}

function getPlatformIconInnerSvg(platform: string, color: string): string {
  switch (platform) {
    case 'x':
      return `<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="${color}"/>`;
    case 'github':
      return `<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" fill="${color}"/>`;
    case 'instagram':
      return `
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="17.5" cy="6.5" r="1.5" fill="${color}"/>
      `;
    case 'linkedin':
      return `<path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" fill="${color}"/>`;
    case 'globe':
      return `
        <circle cx="12" cy="12" r="10" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="2" x2="22" y1="12" y2="12" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      `;
    default:
      return '';
  }
}

function resolveBgBlur(val?: number | string): number {
  if (typeof val === 'string') {
    const s = val.toLowerCase().trim();
    if (s === 'off' || s === 'none') return 0;
    if (s === 'less' || s === 'soft') return 12;
    if (s === 'default' || s === 'medium') return 25;
    if (s === 'more' || s === 'frosted') return 40;
    const parsed = parseFloat(s);
    if (!isNaN(parsed)) return parsed;
  }
  if (typeof val === 'number') return val;
  return 0;
}

function resolveWatermarkBlur(val?: number | string): number {
  if (typeof val === 'string') {
    const s = val.toLowerCase().trim();
    if (s === 'off' || s === 'none') return 0;
    if (s === 'less' || s === 'soft') return 10;
    if (s === 'default' || s === 'frosted') return 20;
    if (s === 'more' || s === 'deep') return 32;
    const parsed = parseFloat(s);
    if (!isNaN(parsed)) return parsed;
  }
  if (typeof val === 'number') return val;
  return 20;
}

/**
 * Renders a true frosted glass watermark badge matching browser studio (page.tsx L4296-4316):
 * - Backdrop blur of content underneath the badge (backdropFilter: blur(20px))
 * - Pill shape with rounded-full radius (rx=boxH/2)
 * - Translucent white glass wash fill: rgba(255, 255, 255, 0.15) (or 0.18 on screenshot)
 * - Hairline border stroke: rgba(255, 255, 255, 0.22)
 * - Drop shadow: 0 2px 10px rgba(0, 0, 0, 0.25)
 * - Platform SVG icon (X, GitHub, Instagram, LinkedIn, Globe) alongside typography
 * - Crisp white typography (text-xs, font-medium, letter-spacing 0.025em)
 */
async function renderFrostedWatermark(
  canvasBuffer: Buffer,
  canvasW: number,
  canvasH: number,
  text: string,
  platform: string = 'x',
  position: string = 'bottom-right',
  target: string = 'canvas',
  cardBounds?: { x: number; y: number; w: number; h: number },
  opacity: number = 85,
  watermarkScale: number | string = 100,
  watermarkBlur: number | string = 20,
  watermarkGlass: string = 'frosted',
  watermarkBorderOpacity: number = 22,
  dpiScale: number = 1
): Promise<Buffer> {
  // Resolve flexible size: browser presets ('small' -> 85%, 'medium'/'default' -> 100%, 'large' -> 125%) or any custom percentage
  let scalePercent = 100;
  if (typeof watermarkScale === 'string') {
    const s = watermarkScale.toLowerCase().trim();
    if (s === 'small') scalePercent = 85;
    else if (s === 'large') scalePercent = 125;
    else if (s === 'medium' || s === 'default') scalePercent = 100;
    else {
      const parsed = parseFloat(s);
      if (!isNaN(parsed) && parsed > 0) scalePercent = parsed;
    }
  } else if (typeof watermarkScale === 'number' && !isNaN(watermarkScale) && watermarkScale > 0) {
    scalePercent = watermarkScale;
  }

  // Resolve blur preset
  const resolvedBlur = resolveWatermarkBlur(watermarkBlur);

  // Exact browser studio styling: text-xs (12px), px-4 (16px), py-2 (8px), gap-1.5 (6px)
  const normPlatform = (platform || 'x').toLowerCase().trim();
  let displayText = text;
  if (normPlatform === 'x' && !text.startsWith('@')) {
    displayText = `@${text}`;
  }

  const scale = Math.max(0.3, Math.min(3.0, (scalePercent / 100) * dpiScale));
  const fontSize = Math.round(12 * scale);
  const iconSize = Math.round(12 * scale);
  const gap = Math.round(6 * scale);
  const padX = Math.round(16 * scale);
  const padY = Math.round(8 * scale);

  const hasIcon = normPlatform !== 'none';

  const textLen = displayText.length * fontSize * 0.58;
  const contentW = (hasIcon ? iconSize + gap : 0) + textLen;
  const boxW = Math.round(contentW + padX * 2);
  const boxH = Math.round(Math.max(fontSize * 1.33, iconSize) + padY * 2);
  const boxR = Math.round(boxH / 2); // rounded-full (9999px)

  // Coordinate positioning matching browser studio
  let x = 0;
  let y = 0;

  if (target === 'screenshot' && cardBounds) {
    const margin = Math.round(16 * dpiScale); // Studio default on screenshot: bottom-4 / right-4 (16px)
    x = cardBounds.x + cardBounds.w - boxW - margin;
    y = cardBounds.y + cardBounds.h - boxH - margin;

    if (position.includes('left')) x = cardBounds.x + margin;
    else if (position.includes('center')) x = Math.round(cardBounds.x + (cardBounds.w - boxW) / 2);

    if (position.startsWith('top')) y = cardBounds.y + margin;
    else if (position.includes('bottom')) y = cardBounds.y + cardBounds.h - boxH - margin;
    else if (position.includes('center') && !position.includes('bottom')) y = Math.round(cardBounds.y + (cardBounds.h - boxH) / 2);
  } else {
    const margin = Math.round(24 * dpiScale); // Studio default on canvas: bottom-6 / right-6 (24px)
    x = canvasW - boxW - margin;
    y = canvasH - boxH - margin;

    if (position.includes('left')) x = margin;
    else if (position.includes('center')) x = Math.round((canvasW - boxW) / 2);

    if (position.startsWith('top')) y = margin;
    else if (position.includes('bottom')) y = canvasH - boxH - margin;
    else if (position.includes('center') && !position.includes('bottom')) y = Math.round((canvasH - boxH) / 2);
  }

  // 1. Extract slice of canvas directly under the pill and blur it (backdropFilter: blur)
  const blurRadius = Math.max(1, Math.min(50, Math.round(resolvedBlur * dpiScale)));
  let frostedSlice: Buffer;
  let rawSlice: Buffer | null = null;
  try {
    rawSlice = await sharp(canvasBuffer)
      .extract({
        left: Math.max(0, x),
        top: Math.max(0, y),
        width: Math.min(boxW, canvasW - x),
        height: Math.min(boxH, canvasH - y),
      })
      .blur(blurRadius)
      .png()
      .toBuffer();

    // 2. Translucent wash + 1px border stroke + platform icon / avatar + typography
    const strokeW = Math.max(1, Math.round(dpiScale * 0.8));
    const glassBg = watermarkGlass === 'dark' 
      ? 'rgba(15, 15, 18, 0.60)' 
      : watermarkGlass === 'clear' 
      ? 'rgba(255, 255, 255, 0.05)' 
      : (target === 'screenshot' ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.15)'); // Studio standard
    const borderAlpha = (watermarkBorderOpacity / 100).toFixed(2);
    const textAlpha = (opacity / 100).toFixed(2);
    const textColor = `rgba(255, 255, 255, ${textAlpha})`;

    let iconSvgFragment = '';
    const iconX = padX;
    const iconY = Math.round((boxH - iconSize) / 2);

    if (hasIcon) {
      const innerIcon = getPlatformIconInnerSvg(normPlatform, textColor);
      iconSvgFragment = `<svg x="${iconX}" y="${iconY}" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24">${innerIcon}</svg>`;
    }

    const textX = hasIcon ? padX + iconSize + gap : Math.round(boxW / 2);
    const textAnchor = hasIcon ? 'start' : 'middle';
    const textY = Math.round(boxH / 2);

    const pillSheenSvg = Buffer.from(`
      <svg width="${boxW}" height="${boxH}" viewBox="0 0 ${boxW} ${boxH}" xmlns="http://www.w3.org/2000/svg">
        <!-- Translucent glass wash fill -->
        <rect x="0" y="0" width="${boxW}" height="${boxH}" rx="${boxR}" ry="${boxR}" fill="${glassBg}" />
        <!-- Hairline border stroke -->
        <rect x="${strokeW / 2}" y="${strokeW / 2}" width="${boxW - strokeW}" height="${boxH - strokeW}" rx="${boxR}" ry="${boxR}" fill="none" stroke="rgba(255,255,255,${borderAlpha})" stroke-width="${strokeW}" />
        <!-- Platform Icon -->
        ${iconSvgFragment}
        <!-- Crisp white text perfectly matching browser studio -->
        <text x="${textX}" y="${textY}" text-anchor="${textAnchor}" dominant-baseline="central" fill="${textColor}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="${fontSize}" font-weight="500" letter-spacing="0.025em">${escapeXml(displayText)}</text>
      </svg>
    `);

    const pillMask = createRoundedMask(boxW, boxH, boxR);
    const pillLayers: OverlayOptions[] = [
      { input: pillMask, blend: 'dest-in' },
      { input: pillSheenSvg, blend: 'over' },
    ];

    frostedSlice = await sharp(rawSlice)
      .composite(pillLayers)
      .png()
      .toBuffer();
  } catch {
    const strokeW = Math.max(1, Math.round(dpiScale * 0.8));
    const glassBg = watermarkGlass === 'dark' ? 'rgba(15, 15, 18, 0.60)' : 'rgba(255, 255, 255, 0.15)';
    const textAlpha = (opacity / 100).toFixed(2);
    const textColor = `rgba(255, 255, 255, ${textAlpha})`;
    const iconX = padX;
    const iconY = Math.round((boxH - iconSize) / 2);

    let iconSvgFragment = '';
    if (hasIcon) {
      const innerIcon = getPlatformIconInnerSvg(normPlatform, textColor);
      iconSvgFragment = `<svg x="${iconX}" y="${iconY}" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24">${innerIcon}</svg>`;
    }
    const textX = hasIcon ? padX + iconSize + gap : Math.round(boxW / 2);
    const textAnchor = hasIcon ? 'start' : 'middle';
    const textY = Math.round(boxH / 2);

    const pillSvg = Buffer.from(`
      <svg width="${boxW}" height="${boxH}" viewBox="0 0 ${boxW} ${boxH}" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="${boxW}" height="${boxH}" rx="${boxR}" ry="${boxR}" fill="${glassBg}" />
        <rect x="${strokeW / 2}" y="${strokeW / 2}" width="${boxW - strokeW}" height="${boxH - strokeW}" rx="${boxR}" ry="${boxR}" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="${strokeW}" />
        ${iconSvgFragment}
        <text x="${textX}" y="${textY}" text-anchor="${textAnchor}" dominant-baseline="central" fill="${textColor}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="${fontSize}" font-weight="500" letter-spacing="0.025em">${escapeXml(displayText)}</text>
      </svg>
    `);

    const fallbackLayers: OverlayOptions[] = [{ input: pillSvg, blend: 'over' }];

    const baseBuffer = rawSlice || await sharp({
      create: {
        width: boxW,
        height: boxH,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    }).png().toBuffer();

    frostedSlice = await sharp(baseBuffer)
      .composite(fallbackLayers)
      .png()
      .toBuffer();
  }

  // 3. Drop Shadow: 0 2px 10px rgba(0,0,0,0.25)
  const shadowDy = Math.round(2 * dpiScale);
  const shadowBlur = Math.max(2, Math.round(10 * dpiScale));
  const padShadow = shadowBlur * 3;
  const shadowW = boxW + padShadow * 2;
  const shadowH = boxH + padShadow * 2;

  const composites: OverlayOptions[] = [];

  try {
    const shadowSvg = Buffer.from(`
      <svg width="${shadowW}" height="${shadowH}" xmlns="http://www.w3.org/2000/svg">
        <rect x="${padShadow}" y="${padShadow + shadowDy}" width="${boxW}" height="${boxH}" rx="${boxR}" ry="${boxR}" fill="rgba(0,0,0,0.25)" />
      </svg>
    `);
    const blurredShadow = await sharp(shadowSvg)
      .blur(shadowBlur)
      .png()
      .toBuffer();

    composites.push({
      input: blurredShadow,
      top: y - padShadow,
      left: x - padShadow,
      blend: 'over',
    });
  } catch {
    // Graceful fallback
  }

  composites.push({
    input: frostedSlice,
    top: y,
    left: x,
    blend: 'over',
  });

  return sharp(canvasBuffer).composite(composites).png().toBuffer();
}

/**
 * Master Compositor: Produces pixel-perfect screenshot mockups
 * Matches NoiceSS Studio browser rendering 100%
 */
export async function compositeMockup(options: GenerateMockupOptions): Promise<CompositorResult> {
  // 1. Resolve preset if specified
  const preset = options.preset ? MCP_PRESETS.find((p) => p.id === options.preset) : undefined;
  const mergedConfig = {
    ...(preset?.config || {}),
    ...options,
  };

  const view = mergedConfig.view;
  const showMacOsBar = mergedConfig.showMacOsBar ?? (view === 'minimal' ? false : view === 'browser' || view === 'default' ? true : false);
  const showBrowserBar = mergedConfig.showBrowserBar ?? (view === 'browser');
  const browserUrl = mergedConfig.browserUrl ?? 'example.com';
  const windowTitle = mergedConfig.windowTitle;
  const padding = mergedConfig.padding ?? 0; // Studio default: 0 (scale controls framing)
  const radius = mergedConfig.radius ?? 12; // Studio default: 12
  const shadow = mergedConfig.shadow ?? 25; // Studio default: 25
  const glassBorder = mergedConfig.glassBorder ?? false;
  const glassBorderWidth = mergedConfig.glassBorderWidth ?? 8; // Studio default: 8
  const glassBorderOpacity = mergedConfig.glassBorderOpacity ?? 20; // Studio default: 20
  const glassBorderBlur = mergedConfig.glassBorderBlur ?? 20; // Studio default: 20
  const background = mergedConfig.background || 'dark-green-8k.webp'; // Studio default: dark-green-8k
  let rawFormat = (options.format || (mergedConfig as any).format || '').toLowerCase();
  if (!rawFormat && options.outputPath) {
    if (options.outputPath.endsWith('.jpg') || options.outputPath.endsWith('.jpeg')) {
      rawFormat = 'jpeg';
    } else if (options.outputPath.endsWith('.png')) {
      rawFormat = 'png';
    } else if (options.outputPath.endsWith('.webp')) {
      rawFormat = 'webp';
    }
  }
  if (!rawFormat) rawFormat = 'webp';
  const format: ImageFormat = (rawFormat === 'jpg' || rawFormat === 'jpeg') ? 'jpeg' : (rawFormat as ImageFormat);
  const quality = options.quality ?? (mergedConfig as any).quality ?? (format === 'jpeg' ? 95 : 90);
  const rawExportScale = mergedConfig.exportScale ?? 1;
  const resolution = ((mergedConfig as any).resolution || (options as any).resolution || '').toLowerCase();
  const targetWidth = (mergedConfig as any).targetWidth || (options as any).targetWidth;
  const targetHeight = (mergedConfig as any).targetHeight || (options as any).targetHeight;
  const imgScale = mergedConfig.scale ?? 85; // Studio default: 85%
  const imageBlur = mergedConfig.imageBlur ?? 0;
  const bgBlur = resolveBgBlur(mergedConfig.bgBlur);
  const aspectRatio = mergedConfig.aspectRatio || 'auto';

  // 2. 3D Perspective & Shadow Formula (matching page.tsx L3931-3933)
  const is3D = Boolean((mergedConfig.perspective && mergedConfig.perspective !== 'front') ||
    (mergedConfig.rotateX !== undefined && mergedConfig.rotateX !== 0) ||
    (mergedConfig.rotateY !== undefined && mergedConfig.rotateY !== 0) ||
    (mergedConfig.rotateZ !== undefined && mergedConfig.rotateZ !== 0));

  let rotateX = mergedConfig.rotateX ?? 0;
  let rotateY = mergedConfig.rotateY ?? 0;
  let rotateZ = mergedConfig.rotateZ ?? 0;

  if (mergedConfig.perspective && mergedConfig.perspective !== 'front' && rotateX === 0 && rotateY === 0 && rotateZ === 0) {
    if (mergedConfig.perspective === 'isometric-left') {
      rotateX = 15; rotateY = -20; rotateZ = 2;
    } else if (mergedConfig.perspective === 'isometric-right') {
      rotateX = 15; rotateY = 20; rotateZ = -2;
    } else if (mergedConfig.perspective === 'elevated') {
      rotateX = 24; rotateY = 0; rotateZ = 0;
    } else if (mergedConfig.perspective === 'skew-left') {
      rotateX = 8; rotateY = -32; rotateZ = 4;
    } else if (mergedConfig.perspective === 'subtle') {
      rotateX = 8; rotateY = -10; rotateZ = 1;
    } else if (mergedConfig.perspective === 'flat-lay') {
      rotateX = 40; rotateY = 0; rotateZ = 0;
    }
  }

  const shadowBlur = mergedConfig.shadowBlur ?? (is3D ? Math.round(shadow * 3) : Math.round(shadow * 2));
  const shadowOpacity = mergedConfig.shadowOpacity ?? (is3D ? 45 : 35);
  const shadowOffsetX = mergedConfig.shadowOffsetX ?? (is3D ? 20 : 0);
  const shadowOffsetY = mergedConfig.shadowOffsetY ?? (is3D ? 20 : shadow);

  // Lighting
  const brightness = mergedConfig.brightness ?? 100;
  const contrast = mergedConfig.contrast ?? 100;
  const saturation = mergedConfig.saturation ?? 100;
  const hueRotate = mergedConfig.hueRotate ?? 0;
  const filter = mergedConfig.filter ?? 'none';

  const imageBrightness = mergedConfig.imageBrightness ?? 100;
  const imageContrast = mergedConfig.imageContrast ?? 100;
  const imageSaturation = mergedConfig.imageSaturation ?? 100;
  const imageHueRotate = mergedConfig.imageHueRotate ?? 0;
  const imageFilter = mergedConfig.imageFilter ?? 'none';

  // Noise & Grain
  const noiseIntensity = mergedConfig.noiseIntensity ?? 0;
  const grainIntensity = mergedConfig.grainIntensity ?? 0;
  const noiseTarget = mergedConfig.noiseTarget ?? 'both';

  // ASCII
  const asciiEnabled = mergedConfig.asciiEnabled ?? false;
  const asciiPattern = mergedConfig.asciiPattern ?? 'medium-shade';
  const asciiSize = mergedConfig.asciiSize ?? 16;
  const asciiOpacity = mergedConfig.asciiOpacity ?? 30;
  const asciiColor = mergedConfig.asciiColor ?? '#ffffff';
  const asciiTarget = mergedConfig.asciiTarget ?? 'canvas';

  // Watermark
  const watermarkText = mergedConfig.watermark ?? mergedConfig.watermarkText;
  const watermarkPlatform = mergedConfig.watermarkPlatform ?? 'x';
  const watermarkPosition = mergedConfig.watermarkPosition ?? 'bottom-right';
  const watermarkTarget = mergedConfig.watermarkTarget ?? 'canvas';
  const watermarkOpacity = mergedConfig.watermarkOpacity ?? 85;
  const watermarkScaleVal = mergedConfig.watermarkScale ?? mergedConfig.watermarkSize ?? 100;
  const watermarkBlurVal = mergedConfig.watermarkBlur ?? 20;
  const watermarkGlass = mergedConfig.watermarkGlass ?? 'frosted';
  const watermarkBorderOpacity = mergedConfig.watermarkBorderOpacity ?? 22;

  // 3. Load & preprocess input image
  const rawImageBuffer = await loadImageBuffer(options.imagePath);
  const imageMetadata = await sharp(rawImageBuffer).metadata();

  if (!imageMetadata.width || !imageMetadata.height) {
    throw new Error('Unable to read input image dimensions');
  }

  let imgW = imageMetadata.width;
  let imgH = imageMetadata.height;
  const MAX_WIDTH = 8192; // Safeguard for 4K/8K masters

  let processedImageBuffer = rawImageBuffer;
  if (imgW > MAX_WIDTH) {
    const scaleFactor = MAX_WIDTH / imgW;
    imgW = MAX_WIDTH;
    imgH = Math.round(imgH * scaleFactor);
    processedImageBuffer = await sharp(rawImageBuffer)
      .resize(imgW, imgH, { fit: 'inside' })
      .toBuffer();
  }

  // Pre-calculate target aspect ratio
  let targetRatio: number;
  if (!aspectRatio || aspectRatio === 'auto') {
    targetRatio = imgW / imgH;
  } else {
    const [wStr, hStr] = aspectRatio.replace(':', '/').split('/');
    const parsed = parseFloat(wStr) / parseFloat(hStr);
    targetRatio = !isNaN(parsed) && parsed > 0 ? parsed : imgW / imgH;
  }

  const hasChrome = showMacOsBar || showBrowserBar;
  const scaleFraction = Math.max(0.3, Math.min(1.0, (imgScale ?? 85) / 100));

  // Determine base canvas dimensions at 1x
  const baseDpi = Math.max(1, imgW / 800);
  const baseGbW = glassBorder ? Math.round((glassBorderWidth ?? 8) * baseDpi) : 0;
  const baseChromeH = hasChrome ? Math.round((showBrowserBar ? 52 : 40) * baseDpi) : 0;
  const baseCardW = imgW + baseGbW * 2;
  const baseCardH = imgH + baseChromeH + baseGbW * 2;
  const basePad = Math.round(padding * baseDpi);

  let baseCanvasW: number;
  let baseCanvasH: number;
  if (baseCardW / baseCardH >= targetRatio) {
    baseCanvasW = Math.round(baseCardW / scaleFraction) + basePad * 2;
    baseCanvasH = Math.round(baseCanvasW / targetRatio);
  } else {
    baseCanvasH = Math.round(baseCardH / scaleFraction) + basePad * 2;
    baseCanvasW = Math.round(baseCanvasH * targetRatio);
  }

  // Native resolution scaling multiplier for pristine 4K/2K/8K rendering
  let scaleMultiplier = 1;
  let targetRequestedWidth: number | undefined;
  if (targetWidth && targetWidth > 0) {
    targetRequestedWidth = targetWidth;
    scaleMultiplier = targetWidth / baseCanvasW;
  } else if (targetHeight && targetHeight > 0) {
    scaleMultiplier = targetHeight / baseCanvasH;
  } else if (resolution === '4k' || resolution === 'uhd') {
    targetRequestedWidth = targetRatio >= 1 ? 3840 : Math.round(2160 * targetRatio);
    scaleMultiplier = targetRequestedWidth / baseCanvasW;
  } else if (resolution === '2k' || resolution === 'qhd') {
    targetRequestedWidth = targetRatio >= 1 ? 2560 : Math.round(1440 * targetRatio);
    scaleMultiplier = targetRequestedWidth / baseCanvasW;
  } else if (resolution === '1080p' || resolution === 'fhd') {
    targetRequestedWidth = targetRatio >= 1 ? 1920 : Math.round(1080 * targetRatio);
    scaleMultiplier = targetRequestedWidth / baseCanvasW;
  } else if (resolution === '8k') {
    targetRequestedWidth = targetRatio >= 1 ? 7680 : Math.round(4320 * targetRatio);
    scaleMultiplier = targetRequestedWidth / baseCanvasW;
  } else if (rawExportScale && rawExportScale > 1) {
    scaleMultiplier = rawExportScale;
  }

  // If high resolution is requested, scale input image natively with Lanczos3
  if (scaleMultiplier > 1) {
    imgW = Math.round(imgW * scaleMultiplier);
    imgH = Math.round(imgH * scaleMultiplier);
    processedImageBuffer = await sharp(processedImageBuffer)
      .resize(imgW, imgH, { fit: 'fill', kernel: 'lanczos3' })
      .toBuffer();
  }

  if (imageBlur > 0) {
    processedImageBuffer = await sharp(processedImageBuffer)
      .blur(Math.max(0.3, Math.min(100, imageBlur * scaleMultiplier)))
      .toBuffer();
  }

  const needsImageColor =
    imageBrightness !== 100 || imageContrast !== 100 ||
    imageSaturation !== 100 || imageHueRotate !== 0 ||
    imageFilter !== 'none';
  if (needsImageColor) {
    processedImageBuffer = await applyColorAdjustments(
      processedImageBuffer, imageBrightness, imageContrast,
      imageSaturation, imageHueRotate, imageFilter as string
    );
  }

  // Proportional resolution scaling (matching html-to-image optimalMultiplier in page.tsx L1918)
  // The studio UI comp is designed for an 800px base canvas.
  // When compositing high-res screenshots (e.g. 1920px, 2048px, or 4K masters), scale styling parameters
  // proportionally so borders, corner radiuses, and shadows maintain exact browser studio proportions.
  const dpiScale = Math.max(1, imgW / 800);
  const gbWidth = glassBorder ? Math.round((glassBorderWidth ?? 8) * dpiScale) : 0;
  const scaledRadius = Math.round(radius * dpiScale);
  const scaledPadding = Math.round(padding * dpiScale);
  const scaledShadowBlur = Math.round(shadowBlur * dpiScale);
  const scaledShadowOffsetY = Math.round(shadowOffsetY * dpiScale);
  const scaledShadowOffsetX = Math.round(shadowOffsetX * dpiScale);

  // 4. Window Chrome (Unified Safari header bar: 40px or 52px, scaled with DPI)
  const chromeHeight = hasChrome ? Math.round((showBrowserBar ? 52 : 40) * dpiScale) : 0;

  const windowW = imgW;
  const windowH = imgH + chromeHeight;

  // Assemble Chrome + Screenshot into raw window
  const windowComposites: OverlayOptions[] = [];

  if (hasChrome) {
    const chromeBuffer = createWindowChromeSvg(
      windowW,
      chromeHeight,
      showBrowserBar,
      browserUrl,
      windowTitle
    );
    windowComposites.push({
      input: chromeBuffer,
      top: 0,
      left: 0,
    });
  }

  windowComposites.push({
    input: processedImageBuffer,
    top: chromeHeight,
    left: 0,
  });

  const rawWindowBuffer = await sharp({
    create: {
      width: windowW,
      height: windowH,
      channels: 4,
      background: { r: 20, g: 20, b: 22, alpha: 1 },
    },
  })
    .composite(windowComposites)
    .png()
    .toBuffer();

  // 5. Card Dimensions (Frosted Glass Frame)
  // In the browser studio (page.tsx L4031-4047):
  // When glassBorder is true, the outer card has padding: glassBorderWidth,
  // backdropFilter: blur(20px), a translucent wash, and 1px border.
  // The screenshot is inset inside it with radius: radius - glassBorderWidth - 1.
  const cardW = windowW + gbWidth * 2;
  const cardH = windowH + gbWidth * 2;
  const innerRadius = glassBorder ? Math.max(0, scaledRadius - gbWidth - 1) : scaledRadius;

  // Mask inner window content with innerRadius
  const innerMaskBuffer = createRoundedMask(windowW, windowH, innerRadius);
  let roundedWindowBuffer = await sharp(rawWindowBuffer)
    .composite([{ input: innerMaskBuffer, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // Apply Image-targeted Noise & Grain (matching studio page.tsx L4179-4195)
  if ((noiseIntensity > 0 || grainIntensity > 0) && (noiseTarget === 'image' || noiseTarget === 'both')) {
    const imageNoiseSvg = createNoiseSvg(windowW, windowH, noiseIntensity, grainIntensity);
    try {
      const imageNoiseBuffer = await sharp(imageNoiseSvg).png().toBuffer();
      roundedWindowBuffer = await sharp(roundedWindowBuffer)
        .composite([
          { input: imageNoiseBuffer, blend: 'over' },
          { input: innerMaskBuffer, blend: 'dest-in' },
        ])
        .png()
        .toBuffer();
    } catch {
      // Gracefully continue
    }
  }

  // Apply Image-targeted ASCII overlay (matching studio page.tsx L4199-4215)
  if (asciiEnabled && asciiOpacity > 0 && (asciiTarget === 'image' || asciiTarget === 'both')) {
    const char = ASCII_PATTERNS[asciiPattern] || '░';
    const asciiImgSvg = createAsciiOverlaySvg(windowW, windowH, char, asciiSize, asciiOpacity, asciiColor);
    try {
      const asciiImgBuffer = await sharp(asciiImgSvg).png().toBuffer();
      roundedWindowBuffer = await sharp(roundedWindowBuffer)
        .composite([
          { input: asciiImgBuffer, blend: 'over' },
          { input: innerMaskBuffer, blend: 'dest-in' },
        ])
        .png()
        .toBuffer();
    } catch {
      // Gracefully continue
    }
  }

  // 6. Canvas Dimensions (matching browser studio page.tsx L2250-2350)
  // Determine canvas dimensions: card occupies scaleFraction along the bounding dimension
  let canvasW: number;
  let canvasH: number;

  const cardRatio = cardW / cardH;
  if (cardRatio >= targetRatio) {
    // Width is the constraining dimension: card occupies exactly scale% of canvas width
    canvasW = Math.round(cardW / scaleFraction) + scaledPadding * 2;
    canvasH = Math.round(canvasW / targetRatio);
  } else {
    // Height is the constraining dimension: card occupies exactly scale% of canvas height
    canvasH = Math.round(cardH / scaleFraction) + scaledPadding * 2;
    canvasW = Math.round(canvasH * targetRatio);
  }

  // Snap to exact standard target resolution if requested within small rounding jitter (e.g. 3839 -> 3840)
  if (targetRequestedWidth && Math.abs(canvasW - targetRequestedWidth) <= 4) {
    canvasW = targetRequestedWidth;
    canvasH = Math.round(canvasW / targetRatio);
  }

  // Centering position of the outer card on the canvas
  const cardX = Math.round((canvasW - cardW) / 2);
  const cardY = Math.round((canvasH - cardH) / 2);

  // 7. Drop Shadow (rendered directly onto canvas with exact studio offset & blur)
  const shadowBuffer = await createDropShadow(
    canvasW,
    canvasH,
    cardX,
    cardY,
    cardW,
    cardH,
    scaledRadius,
    scaledShadowBlur,
    shadowOpacity,
    scaledShadowOffsetX,
    scaledShadowOffsetY
  );

  // 8. Background Canvas (wallpaper with bleed-protection, gradient, CURRENT_IMAGE, or solid)
  let bgBuffer = await createBackgroundCanvas(canvasW, canvasH, background, bgBlur, processedImageBuffer);

  // Apply Canvas-targeted Noise & Grain (matching studio page.tsx L4108-4125)
  // When noiseTarget === 'canvas', noise is placed ONLY on the background behind the card
  if ((noiseIntensity > 0 || grainIntensity > 0) && (noiseTarget === 'canvas' || noiseTarget === 'both')) {
    const canvasNoiseSvg = createNoiseSvg(canvasW, canvasH, noiseIntensity, grainIntensity);
    try {
      const canvasNoiseBuffer = await sharp(canvasNoiseSvg).png().toBuffer();
      bgBuffer = await sharp(bgBuffer)
        .composite([{ input: canvasNoiseBuffer, blend: 'over' }])
        .png()
        .toBuffer();
    } catch {
      // Gracefully continue
    }
  }

  // Apply Canvas-targeted ASCII overlay (matching studio page.tsx L4128-4136)
  if (asciiEnabled && asciiOpacity > 0 && (asciiTarget === 'canvas' || asciiTarget === 'both')) {
    const char = ASCII_PATTERNS[asciiPattern] || '░';
    const asciiCanvasSvg = createAsciiOverlaySvg(canvasW, canvasH, char, asciiSize, asciiOpacity, asciiColor);
    try {
      const asciiCanvasBuffer = await sharp(asciiCanvasSvg).png().toBuffer();
      bgBuffer = await sharp(bgBuffer)
        .composite([{ input: asciiCanvasBuffer, blend: 'over' }])
        .png()
        .toBuffer();
    } catch {
      // Gracefully continue
    }
  }

  // 9. Assemble Layers in precise visual hierarchy
  const finalLayers: OverlayOptions[] = [];

  // True Frosted Glass Card Frame (if enabled)
  let frostedCardSlice: Buffer | undefined;
  if (glassBorder && gbWidth > 0) {
    const gbBlurRadius = Math.round(glassBorderBlur * dpiScale);
    try {
      const bgSlice = await sharp(bgBuffer)
        .extract({
          left: Math.max(0, cardX),
          top: Math.max(0, cardY),
          width: Math.min(cardW, canvasW - cardX),
          height: Math.min(cardH, canvasH - cardY),
        })
        .blur(Math.min(80, gbBlurRadius))
        .png()
        .toBuffer();

      const glassAlpha = (glassBorderOpacity / 100).toFixed(2);
      const washAlpha = ((glassBorderOpacity / 100) * 0.35).toFixed(3);
      const strokeW = Math.max(1, Math.round(1.2 * dpiScale));
      const glassSheenSvg = Buffer.from(`
        <svg width="${cardW}" height="${cardH}" viewBox="0 0 ${cardW} ${cardH}" xmlns="http://www.w3.org/2000/svg">
          <!-- Glass translucent wash fill -->
          <rect x="0" y="0" width="${cardW}" height="${cardH}" rx="${scaledRadius}" ry="${scaledRadius}" fill="rgba(255,255,255,${washAlpha})" />
          <!-- Outer hairline border stroke -->
          <rect x="${strokeW / 2}" y="${strokeW / 2}" width="${cardW - strokeW}" height="${cardH - strokeW}" rx="${scaledRadius}" ry="${scaledRadius}" fill="none" stroke="rgba(255,255,255,${glassAlpha})" stroke-width="${strokeW}" />
        </svg>
      `);

      const cardMaskSvg = createRoundedMask(cardW, cardH, scaledRadius);
      frostedCardSlice = await sharp(bgSlice)
        .composite([
          { input: cardMaskSvg, blend: 'dest-in' },
          { input: glassSheenSvg, blend: 'over' },
        ])
        .png()
        .toBuffer();
    } catch {
      frostedCardSlice = createGlassBorderSvg(cardW, cardH, scaledRadius, glassBorderOpacity, Math.max(1, Math.round(1.2 * dpiScale)));
    }
  }

  const is3DActive = is3D && (rotateX !== 0 || rotateY !== 0 || rotateZ !== 0);
  let activeCardX = cardX;
  let activeCardY = cardY;
  let activeCardW = cardW;
  let activeCardH = cardH;

  if (is3DActive) {
    const cardComposites: OverlayOptions[] = [];
    if (glassBorder && gbWidth > 0 && frostedCardSlice) {
      cardComposites.push({ input: frostedCardSlice, top: 0, left: 0 });
    }
    cardComposites.push({ input: roundedWindowBuffer, top: gbWidth, left: gbWidth });

    const cardBuffer = await sharp({
      create: {
        width: cardW,
        height: cardH,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite(cardComposites)
      .png()
      .toBuffer();

    const radX = (rotateX * Math.PI) / 180;
    const radY = (rotateY * Math.PI) / 180;
    const radZ = (rotateZ * Math.PI) / 180;
    const a = Math.cos(radY) * Math.cos(radZ);
    const b = Math.sin(radX) * Math.sin(radY) * Math.cos(radZ) - Math.cos(radX) * Math.sin(radZ);
    const c = Math.cos(radY) * Math.sin(radZ);
    const d = Math.sin(radX) * Math.sin(radY) * Math.sin(radZ) + Math.cos(radX) * Math.cos(radZ);

    const affineCard = await sharp(cardBuffer)
      .affine([a, b, c, d], {
        background: '#00000000',
        interpolator: sharp.interpolators.bicubic,
      })
      .toBuffer({ resolveWithObject: true });

    activeCardW = affineCard.info.width;
    activeCardH = affineCard.info.height;
    activeCardX = Math.round((canvasW - activeCardW) / 2);
    activeCardY = Math.round((canvasH - activeCardH) / 2);

    try {
      const alphaChannel = await sharp(affineCard.data).ensureAlpha().extractChannel(3).toBuffer();
      const blackCard = await sharp({
        create: {
          width: activeCardW,
          height: activeCardH,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: shadowOpacity / 100 },
        },
      })
        .composite([{ input: alphaChannel, blend: 'dest-in' }])
        .png()
        .toBuffer();

      const shadow3d = await sharp(blackCard)
        .blur(Math.max(1, Math.min(100, scaledShadowBlur)))
        .png()
        .toBuffer();

      finalLayers.push({
        input: shadow3d,
        top: Math.max(0, activeCardY + scaledShadowOffsetY),
        left: Math.max(0, activeCardX + scaledShadowOffsetX),
      });
    } catch {
      finalLayers.push({ input: shadowBuffer, top: 0, left: 0 });
    }

    finalLayers.push({
      input: affineCard.data,
      top: activeCardY,
      left: activeCardX,
    });
  } else {
    finalLayers.push({
      input: shadowBuffer,
      top: 0,
      left: 0,
    });
    if (glassBorder && gbWidth > 0 && frostedCardSlice) {
      finalLayers.push({
        input: frostedCardSlice,
        top: cardY,
        left: cardX,
      });
    }
    finalLayers.push({
      input: roundedWindowBuffer,
      top: cardY + gbWidth,
      left: cardX + gbWidth,
    });
  }

  // 10. Composite Canvas
  let outputBuffer = await sharp(bgBuffer).composite(finalLayers).png().toBuffer();

  // 11. Watermark Badge: True Frosted Glass Pill matching studio browser (backdrop blur, translucent white wash, hairline border, drop shadow)
  if (watermarkText && watermarkText.trim().length > 0) {
    outputBuffer = Buffer.from(await renderFrostedWatermark(
      outputBuffer,
      canvasW,
      canvasH,
      watermarkText.trim(),
      watermarkPlatform,
      watermarkPosition,
      watermarkTarget,
      { x: activeCardX, y: activeCardY, w: activeCardW, h: activeCardH },
      watermarkOpacity,
      watermarkScaleVal,
      watermarkBlurVal,
      watermarkGlass,
      watermarkBorderOpacity,
      dpiScale
    ));
  }

  // Canvas-level color grading
  const needsCanvasColor =
    brightness !== 100 || contrast !== 100 ||
    saturation !== 100 || hueRotate !== 0 ||
    filter !== 'none';
  if (needsCanvasColor) {
    outputBuffer = Buffer.from(await applyColorAdjustments(
      outputBuffer, brightness, contrast, saturation, hueRotate, filter as string
    ));
  }

  // Export scale multiplier (fallback if not already rendered natively)
  if (rawExportScale > 1 && scaleMultiplier === 1) {
    const scaledW = Math.round(canvasW * rawExportScale);
    const scaledH = Math.round(canvasH * rawExportScale);
    outputBuffer = await sharp(outputBuffer)
      .resize(scaledW, scaledH, { fit: 'fill', kernel: 'lanczos3' })
      .png()
      .toBuffer();
  }

  // Format encoding
  let finalPipeline = sharp(outputBuffer);
  if (format === 'webp') {
    finalPipeline = finalPipeline.webp({ quality: Math.min(100, Math.max(1, quality)), effort: 4 });
  } else if (format === 'jpeg') {
    finalPipeline = finalPipeline.jpeg({
      quality: Math.min(100, Math.max(1, quality)),
      chromaSubsampling: '4:4:4',
      mozjpeg: true,
    });
  } else {
    finalPipeline = finalPipeline.png({ compressionLevel: 8 });
  }

  const finalBuffer = await finalPipeline.toBuffer();

  // Output to disk if requested
  let resolvedOutputPath: string | undefined;
  if (options.outputPath) {
    resolvedOutputPath = path.isAbsolute(options.outputPath)
      ? options.outputPath
      : path.resolve(process.cwd(), options.outputPath);

    const dir = path.dirname(resolvedOutputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(resolvedOutputPath, finalBuffer);
  }

  const outputMeta = await sharp(finalBuffer).metadata();
  const outW = outputMeta.width || canvasW;
  const outH = outputMeta.height || canvasH;

  return {
    outputPath: resolvedOutputPath,
    buffer: finalBuffer,
    width: outW,
    height: outH,
    format,
    sizeBytes: finalBuffer.length,
  };
}

/**
 * Batch composites multiple screenshots into mockups using common or preset styling.
 */
export async function batchCompositeMockups(
  options: BatchMockupOptions
): Promise<BatchMockupItemResult[]> {
  const { inputPaths, inputDir, outputDir, pattern, ...mockupConfig } = options;

  if (!outputDir) {
    throw new Error('outputDir is required for batch mockup generation');
  }

  const resolvedOutputDir = path.isAbsolute(outputDir)
    ? outputDir
    : path.resolve(process.cwd(), outputDir);

  if (!fs.existsSync(resolvedOutputDir)) {
    fs.mkdirSync(resolvedOutputDir, { recursive: true });
  }

  let filesToProcess: string[] = [];

  if (inputPaths && Array.isArray(inputPaths) && inputPaths.length > 0) {
    filesToProcess = inputPaths;
  } else if (inputDir) {
    const resolvedInputDir = path.isAbsolute(inputDir)
      ? inputDir
      : path.resolve(process.cwd(), inputDir);

    if (!fs.existsSync(resolvedInputDir)) {
      throw new Error(`inputDir does not exist: ${resolvedInputDir}`);
    }

    const validExts = new Set(['.png', '.jpg', '.jpeg', '.webp', '.PNG', '.JPG', '.JPEG', '.WEBP']);
    const dirEntries = fs.readdirSync(resolvedInputDir);
    let filterRegex: RegExp | null = null;
    if (pattern) {
      try {
        filterRegex = new RegExp(pattern);
      } catch {
        filterRegex = null;
      }
    }

    filesToProcess = dirEntries
      .filter((file) => {
        const ext = path.extname(file);
        if (!validExts.has(ext)) return false;
        if (filterRegex && !filterRegex.test(file)) return false;
        return true;
      })
      .map((file) => path.join(resolvedInputDir, file));
  } else {
    throw new Error('Either inputPaths or inputDir must be provided for batch generation');
  }

  if (filesToProcess.length === 0) {
    return [];
  }

  const format = mockupConfig.format || 'webp';
  const results: BatchMockupItemResult[] = [];

  for (const itemPath of filesToProcess) {
    const parsed = path.parse(itemPath);
    const outFilename = `${parsed.name}-mockup.${format === 'jpeg' ? 'jpg' : format}`;
    const targetOutPath = path.join(resolvedOutputDir, outFilename);

    try {
      const res = await compositeMockup({
        ...mockupConfig,
        imagePath: itemPath,
        outputPath: targetOutPath,
      });

      results.push({
        inputPath: itemPath,
        outputPath: res.outputPath,
        width: res.width,
        height: res.height,
        format: res.format,
        sizeBytes: res.sizeBytes,
        success: true,
      });
    } catch (err: any) {
      results.push({
        inputPath: itemPath,
        outputPath: targetOutPath,
        success: false,
        error: err?.message || String(err),
      });
    }
  }

  return results;
}
