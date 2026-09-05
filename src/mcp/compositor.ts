import fs from 'node:fs';
import path from 'node:path';
import sharp, { type OverlayOptions } from 'sharp';
import { MCP_PRESETS, ALL_FILTERS, ASCII_PATTERNS } from './presets.js';
import type { GenerateMockupOptions, ImageFormat } from './types.js';

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
  if (source.startsWith('data:')) {
    const commaIdx = source.indexOf(',');
    const base64Data = commaIdx !== -1 ? source.slice(commaIdx + 1) : source;
    return Buffer.from(base64Data, 'base64');
  }

  if (source.startsWith('http://') || source.startsWith('https://')) {
    const res = await fetch(source);
    if (!res.ok) {
      throw new Error(`Failed to fetch image from ${source}: ${res.statusText}`);
    }
    const arrayBuf = await res.arrayBuffer();
    return Buffer.from(arrayBuf);
  }

  // Local filesystem path
  const resolved = path.isAbsolute(source) ? source : path.resolve(process.cwd(), source);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Image file does not exist at: ${resolved}`);
  }
  return fs.readFileSync(resolved);
}

/**
 * Resolves wallpaper path from public/wallpapers/ directory
 */
function resolveWallpaperPath(bgNameOrUrl: string): string | null {
  const cleanName = bgNameOrUrl.replace(/^url\(["']?|["']?\)$/g, '').replace(/^\/wallpapers\//, '');
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
 * Matches NoiceSS Studio browser implementation (page.tsx L3982-4001) exactly:
 * - Height: 40px (or 52px when showBrowserBar is true)
 * - Background: #1C1C1E
 * - Traffic lights: 12px dots, 8px gap, #ff5f56, #ffbd2e, #27c93f
 * - Integrated URL pill with lock icon if browserUrl is set
 * - Centered title if windowTitle is set
 */
function createWindowChromeSvg(
  width: number,
  height: number,
  showBrowserBar: boolean,
  browserUrl?: string,
  title?: string
): Buffer {
  const dotR = 6;
  const dotY = Math.round(height / 2);
  const startX = 20;
  const dotGap = 20;

  let centerContent = '';
  if (showBrowserBar) {
    const pillW = Math.min(420, Math.max(180, Math.round(width * 0.45)));
    const pillH = 28;
    const pillX = Math.round((width - pillW) / 2);
    const pillY = Math.round((height - pillH) / 2);
    const displayUrl = browserUrl || 'example.com';

    centerContent = `
      <!-- Integrated Safari URL Pill -->
      <rect x="${pillX}" y="${pillY}" width="${pillW}" height="${pillH}" rx="6" ry="6" fill="#2C2C2E" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
      <!-- Lock Icon -->
      <g transform="translate(${pillX + 12}, ${pillY + 8}) scale(0.65)">
        <path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2" />
      </g>
      <!-- URL Text -->
      <text x="${pillX + 30}" y="${pillY + 18}" fill="rgba(255,255,255,0.7)" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="400">${escapeXml(displayUrl)}</text>
    `;
  } else if (title) {
    centerContent = `<text x="50%" y="${dotY + 4}" text-anchor="middle" fill="#9ca3af" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500">${escapeXml(title)}</text>`;
  }

  const bottomBorder = showBrowserBar
    ? `<line x1="0" y1="${height - 1}" x2="${width}" y2="${height - 1}" stroke="rgba(0,0,0,0.4)" stroke-width="1" />`
    : '';

  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#1C1C1E" />
      ${bottomBorder}
      <!-- Close (Red) -->
      <circle cx="${startX}" cy="${dotY}" r="${dotR}" fill="#ff5f56" stroke="rgba(0,0,0,0.1)" stroke-width="0.5" />
      <!-- Minimize (Yellow) -->
      <circle cx="${startX + dotGap}" cy="${dotY}" r="${dotR}" fill="#ffbd2e" stroke="rgba(0,0,0,0.1)" stroke-width="0.5" />
      <!-- Maximize (Green) -->
      <circle cx="${startX + dotGap * 2}" cy="${dotY}" r="${dotR}" fill="#27c93f" stroke="rgba(0,0,0,0.1)" stroke-width="0.5" />
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

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="noise" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="${baseFreq.toFixed(3)}" numOctaves="4" seed="42" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <rect width="${width}" height="${height}" filter="url(#noise)" opacity="${opacity.toFixed(3)}" />
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
      // Zoom in slightly before blur to avoid edge bleed (page.tsx L3973: scale(1 + bgBlur/100))
      const scaleFactor = 1 + Math.min(0.2, blurRadius / 100);
      const scaledW = Math.round(targetWidth * scaleFactor);
      const scaledH = Math.round(targetHeight * scaleFactor);

      bgBuffer = await sharp(inputImageBuffer)
        .resize(scaledW, scaledH, { fit: 'cover', position: 'center' })
        .blur(Math.max(0.3, Math.min(100, blurRadius)))
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
      // Zoom in slightly before blur to avoid edge bleed (page.tsx L3876: scale(1 + bgBlur/100))
      const scaleFactor = 1 + Math.min(0.2, bgBlur / 100);
      const scaledW = Math.round(targetWidth * scaleFactor);
      const scaledH = Math.round(targetHeight * scaleFactor);

      bgBuffer = await sharp(wallpaperFile)
        .resize(scaledW, scaledH, { fit: 'cover', position: 'center' })
        .blur(Math.max(0.3, Math.min(100, bgBlur)))
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

/**
 * Renders a true frosted glass watermark badge matching browser studio (page.tsx L4270-4286):
 * - Backdrop blur of canvas content underneath the badge (backdropFilter: blur(20px))
 * - Pill shape with rounded-full radius (rx=boxH/2)
 * - Translucent white glass wash fill: rgba(255, 255, 255, 0.15)
 * - Hairline border stroke: rgba(255, 255, 255, 0.22)
 * - Drop shadow: 0 2px 10px rgba(0, 0, 0, 0.25)
 * - Crisp white typography with letter-spacing 0.025em
 */
async function renderFrostedWatermark(
  canvasBuffer: Buffer,
  canvasW: number,
  canvasH: number,
  text: string,
  position: string = 'top-right',
  opacity: number = 85,
  watermarkScale: number | string = 100,
  watermarkBlur: number = 20,
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

  // Exact browser studio styling: text-xs (12px), px-4 (16px), py-2 (8px), top-6 right-6 (24px margin)
  const scale = Math.max(0.3, Math.min(3.0, (scalePercent / 100) * dpiScale));
  const fontSize = Math.round(12 * scale);
  const textLen = text.length * fontSize * 0.58;
  const padX = Math.round(16 * scale);
  const padY = Math.round(8 * scale);
  const boxW = Math.round(textLen + padX * 2);
  const boxH = Math.round(fontSize * 1.33 + padY * 2);
  const boxR = Math.round(boxH / 2); // rounded-full (9999px)
  const margin = Math.round(24 * dpiScale); // top-6 right-6 = 24px

  let x = canvasW - boxW - margin;
  let y = margin;

  if (position.includes('left')) x = margin;
  else if (position.includes('center')) x = Math.round((canvasW - boxW) / 2);

  if (position.startsWith('top')) y = margin;
  else if (position.includes('bottom')) y = canvasH - boxH - margin;
  else if (position.includes('center') && !position.includes('bottom')) y = Math.round((canvasH - boxH) / 2);

  // 1. Extract slice of canvas directly under the pill and blur it (backdropFilter: blur(20px))
  const blurRadius = Math.max(1, Math.min(50, Math.round(watermarkBlur * dpiScale)));
  let frostedSlice: Buffer;
  try {
    const rawSlice = await sharp(canvasBuffer)
      .extract({
        left: Math.max(0, x),
        top: Math.max(0, y),
        width: Math.min(boxW, canvasW - x),
        height: Math.min(boxH, canvasH - y),
      })
      .blur(blurRadius)
      .png()
      .toBuffer();

    // 2. Translucent wash + 1px border stroke + typography
    const strokeW = Math.max(1, Math.round(dpiScale * 0.8));
    const glassBg = watermarkGlass === 'dark' 
      ? 'rgba(15, 15, 18, 0.60)' 
      : watermarkGlass === 'clear' 
      ? 'rgba(255, 255, 255, 0.05)' 
      : 'rgba(255, 255, 255, 0.15)'; // Studio standard
    const borderAlpha = (watermarkBorderOpacity / 100).toFixed(2);
    const textAlpha = (opacity / 100).toFixed(2);

    const pillSheenSvg = Buffer.from(`
      <svg width="${boxW}" height="${boxH}" viewBox="0 0 ${boxW} ${boxH}" xmlns="http://www.w3.org/2000/svg">
        <!-- Translucent glass wash fill -->
        <rect x="0" y="0" width="${boxW}" height="${boxH}" rx="${boxR}" ry="${boxR}" fill="${glassBg}" />
        <!-- Hairline border stroke -->
        <rect x="${strokeW / 2}" y="${strokeW / 2}" width="${boxW - strokeW}" height="${boxH - strokeW}" rx="${boxR}" ry="${boxR}" fill="none" stroke="rgba(255,255,255,${borderAlpha})" stroke-width="${strokeW}" />
        <!-- Crisp white text perfectly centered -->
        <text x="${boxW / 2}" y="${boxH / 2}" text-anchor="middle" dominant-baseline="central" fill="rgba(255,255,255,${textAlpha})" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="${fontSize}" font-weight="500" letter-spacing="0.025em">${escapeXml(text)}</text>
      </svg>
    `);

    const pillMask = createRoundedMask(boxW, boxH, boxR);
    frostedSlice = await sharp(rawSlice)
      .composite([
        { input: pillMask, blend: 'dest-in' },
        { input: pillSheenSvg, blend: 'over' },
      ])
      .png()
      .toBuffer();
  } catch {
    const strokeW = Math.max(1, Math.round(dpiScale * 0.8));
    const pillSvg = Buffer.from(`
      <svg width="${boxW}" height="${boxH}" viewBox="0 0 ${boxW} ${boxH}" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="${boxW}" height="${boxH}" rx="${boxR}" ry="${boxR}" fill="rgba(255,255,255,0.15)" />
        <rect x="${strokeW / 2}" y="${strokeW / 2}" width="${boxW - strokeW}" height="${boxH - strokeW}" rx="${boxR}" ry="${boxR}" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="${strokeW}" />
        <text x="${boxW / 2}" y="${boxH / 2 + fontSize * 0.35}" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="${fontSize}" font-weight="500" letter-spacing="0.025em">${escapeXml(text)}</text>
      </svg>
    `);
    frostedSlice = await sharp(pillSvg).png().toBuffer();
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
  const padding = mergedConfig.padding ?? 0; // Studio default: 0 (scale controls framing)
  const radius = mergedConfig.radius ?? 12; // Studio default: 12
  const shadow = mergedConfig.shadow ?? 25; // Studio default: 25
  const glassBorder = mergedConfig.glassBorder ?? false;
  const glassBorderWidth = mergedConfig.glassBorderWidth ?? 8; // Studio default: 8
  const glassBorderOpacity = mergedConfig.glassBorderOpacity ?? 20; // Studio default: 20
  const glassBorderBlur = mergedConfig.glassBorderBlur ?? 20; // Studio default: 20
  const background = mergedConfig.background || 'dark-green-8k.webp'; // Studio default: dark-green-8k
  const rawFormat = (options.format || 'webp').toLowerCase();
  const format: ImageFormat = rawFormat === 'jpg' ? 'jpeg' : (rawFormat as ImageFormat);
  const quality = options.quality ?? 90;
  const exportScale = mergedConfig.exportScale ?? 1;
  const imgScale = mergedConfig.scale ?? 85; // Studio default: 85%
  const imageBlur = mergedConfig.imageBlur ?? 0;
  const bgBlur = mergedConfig.bgBlur ?? 0;
  const aspectRatio = mergedConfig.aspectRatio || 'auto';

  // 2. Studio Shadow Formula (matching page.tsx L3931-3933)
  // In browser: 0 ${shadow}px ${shadow * 2}px rgba(0,0,0,0.35)
  // Perspective: 20px 20px ${shadow * 3}px rgba(0,0,0,0.45)
  const is3D = mergedConfig.perspective && mergedConfig.perspective !== 'front';
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

  // Watermark
  const watermarkText = mergedConfig.watermark ?? mergedConfig.watermarkText;
  const watermarkPosition = mergedConfig.watermarkPosition ?? 'bottom-right';
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
  const MAX_WIDTH = 2048;

  let processedImageBuffer = rawImageBuffer;
  if (imgW > MAX_WIDTH) {
    const scaleFactor = MAX_WIDTH / imgW;
    imgW = MAX_WIDTH;
    imgH = Math.round(imgH * scaleFactor);
    processedImageBuffer = await sharp(rawImageBuffer)
      .resize(imgW, imgH, { fit: 'inside' })
      .toBuffer();
  }

  if (imageBlur > 0) {
    processedImageBuffer = await sharp(processedImageBuffer)
      .blur(Math.max(0.3, Math.min(100, imageBlur)))
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
  // When compositing high-res screenshots (e.g. 1920px or 2048px), scale styling parameters
  // proportionally so borders, corner radiuses, and shadows maintain exact browser studio proportions.
  const dpiScale = Math.max(1, imgW / 800);
  const gbWidth = glassBorder ? Math.round((glassBorderWidth ?? 8) * dpiScale) : 0;
  const scaledRadius = Math.round(radius * dpiScale);
  const scaledPadding = Math.round(padding * dpiScale);
  const scaledShadowBlur = Math.round(shadowBlur * dpiScale);
  const scaledShadowOffsetY = Math.round(shadowOffsetY * dpiScale);
  const scaledShadowOffsetX = Math.round(shadowOffsetX * dpiScale);

  // 4. Window Chrome (Unified Safari header bar: 40px or 52px, scaled with DPI)
  const hasChrome = showMacOsBar || showBrowserBar;
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
      options.windowTitle
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
  const roundedWindowBuffer = await sharp(rawWindowBuffer)
    .composite([{ input: innerMaskBuffer, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // 6. Canvas Dimensions & Aspect Ratio Calculation (matching browser studio page.tsx L2250-2350)
  // In the browser studio:
  // - When aspectRatio is 'auto' (or omitted), the canvas aspect ratio strictly matches the image aspect ratio (imgW / imgH).
  // - When fixed aspectRatio is provided, the canvas matches that ratio.
  // - The screenshot card occupies exactly scale% (e.g. 90%) of the canvas along its constraining dimension.
  const scaleFraction = Math.max(0.3, Math.min(1.0, (imgScale ?? 85) / 100));

  let targetRatio: number;
  if (!aspectRatio || aspectRatio === 'auto') {
    targetRatio = imgW / imgH;
  } else {
    const [wStr, hStr] = aspectRatio.replace(':', '/').split('/');
    const parsed = parseFloat(wStr) / parseFloat(hStr);
    targetRatio = !isNaN(parsed) && parsed > 0 ? parsed : imgW / imgH;
  }

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
  const bgBuffer = await createBackgroundCanvas(canvasW, canvasH, background, bgBlur, processedImageBuffer);

  // 9. Assemble Layers in precise visual hierarchy
  const finalLayers: OverlayOptions[] = [
    // Layer 1: Ambient Drop Shadow
    {
      input: shadowBuffer,
      top: 0,
      left: 0,
    },
  ];

  // Layer 2: True Frosted Glass Card Frame (if enabled)
  if (glassBorder && gbWidth > 0) {
    const gbBlurRadius = Math.round(glassBorderBlur * dpiScale);
    // Extract slice of canvas background under the card, blur it, and mask to rounded rect
    let frostedCardSlice: Buffer;
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

    finalLayers.push({
      input: frostedCardSlice,
      top: cardY,
      left: cardX,
    });
  }

  // Layer 3: Inset Screenshot Window
  finalLayers.push({
    input: roundedWindowBuffer,
    top: cardY + gbWidth,
    left: cardX + gbWidth,
  });

  // Layer 4: Noise / Film Grain (if enabled)
  if ((noiseIntensity > 0 || grainIntensity > 0) && noiseTarget !== 'image') {
    const noiseSvg = createNoiseSvg(canvasW, canvasH, noiseIntensity, grainIntensity);
    try {
      const noiseBuffer = await sharp(noiseSvg).png().toBuffer();
      finalLayers.push({
        input: noiseBuffer,
        top: 0,
        left: 0,
        blend: 'over',
      });
    } catch {
      // Gracefully continue
    }
  }

  // Layer 5: ASCII / Pattern Overlay (if enabled)
  if (asciiEnabled && asciiOpacity > 0) {
    const char = ASCII_PATTERNS[asciiPattern] || '░';
    const asciiSvg = createAsciiOverlaySvg(canvasW, canvasH, char, asciiSize, asciiOpacity, asciiColor);
    try {
      const asciiBuffer = await sharp(asciiSvg).png().toBuffer();
      finalLayers.push({
        input: asciiBuffer,
        top: 0,
        left: 0,
        blend: 'over',
      });
    } catch {
      // Gracefully continue
    }
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
      watermarkPosition,
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

  // Export scale multiplier (1x, 2x retina, 4x print)
  if (exportScale > 1) {
    const scaledW = Math.round(canvasW * exportScale);
    const scaledH = Math.round(canvasH * exportScale);
    outputBuffer = await sharp(outputBuffer)
      .resize(scaledW, scaledH, { fit: 'fill', kernel: 'lanczos3' })
      .png()
      .toBuffer();
  }

  // Format encoding
  let finalPipeline = sharp(outputBuffer);
  if (format === 'webp') {
    finalPipeline = finalPipeline.webp({ quality, effort: 4 });
  } else if (format === 'jpeg') {
    finalPipeline = finalPipeline.jpeg({ quality });
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
  const outW = outputMeta.width || Math.round(canvasW * Math.max(1, exportScale));
  const outH = outputMeta.height || Math.round(canvasH * Math.max(1, exportScale));

  return {
    outputPath: resolvedOutputPath,
    buffer: finalBuffer,
    width: outW,
    height: outH,
    format,
    sizeBytes: finalBuffer.length,
  };
}
