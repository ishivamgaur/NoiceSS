import type { MockupConfig, PerspectiveId, FilterId } from './types.js';

export interface PresetItem {
  id: string;
  name: string;
  desc: string;
  config: MockupConfig;
}

// ─── 8 Studio Presets ─────────────────────────────────────────────
export const MCP_PRESETS: PresetItem[] = [
  {
    id: 'studio-minimal',
    name: 'Studio Minimal',
    desc: 'Matte Slate • Clean Frame',
    config: {
      background: 'radial-gradient(ellipse at 50% 30%, #27272a 0%, #09090b 100%)',
      showMacOsBar: false,
      perspective: 'front',
      rotateX: 0, rotateY: 0, rotateZ: 0, perspectiveDepth: 1200,
      glassBorder: false, padding: 56, radius: 16, shadow: 30,
      bgBlur: 0, filter: 'none', noiseIntensity: 0, grainIntensity: 0,
      brightness: 100, contrast: 100, saturation: 100, hueRotate: 0,
    },
  },
  {
    id: 'apple-sequoia',
    name: 'Apple Sequoia',
    desc: 'Forest 4K • Frosted Glass',
    config: {
      background: 'macos-sequoia.webp',
      showMacOsBar: false, perspective: 'front',
      rotateX: 0, rotateY: 0, rotateZ: 0, perspectiveDepth: 1200,
      glassBorder: true, glassBorderWidth: 4, glassBorderOpacity: 25, glassBorderBlur: 20,
      padding: 64, radius: 16, shadow: 35, bgBlur: 0, filter: 'none',
      noiseIntensity: 0, grainIntensity: 0, brightness: 100, contrast: 100, saturation: 100, hueRotate: 0,
    },
  },
  {
    id: '3d-hero-angle',
    name: '3D Hero Angle',
    desc: 'Isometric Left • Deep Shadow',
    config: {
      background: 'dark-green-8k.webp',
      showMacOsBar: false, perspective: 'isometric-left',
      rotateX: 14, rotateY: -20, rotateZ: 8, perspectiveDepth: 1400,
      glassBorder: true, glassBorderWidth: 3, glassBorderOpacity: 30, glassBorderBlur: 16,
      padding: 64, radius: 16, shadow: 42, bgBlur: 0, filter: 'none',
      noiseIntensity: 0, grainIntensity: 0, brightness: 100, contrast: 100, saturation: 100, hueRotate: 0,
    },
  },
  {
    id: 'monterey-dark',
    name: 'Monterey Dark',
    desc: '5K Flow • Subtle Tilt',
    config: {
      background: 'macos-monterey-dark.webp',
      showMacOsBar: false, perspective: 'subtle',
      rotateX: 6, rotateY: -10, rotateZ: 2, perspectiveDepth: 1200,
      glassBorder: false, padding: 60, radius: 18, shadow: 32, bgBlur: 0, filter: 'none',
      noiseIntensity: 0, grainIntensity: 0, brightness: 100, contrast: 100, saturation: 100, hueRotate: 0,
    },
  },
  {
    id: 'safari-minimal',
    name: 'Ocean Waves',
    desc: 'Clean Wave • Smooth Frame',
    config: {
      background: 'blue-abstract.webp',
      showMacOsBar: false, perspective: 'front',
      rotateX: 0, rotateY: 0, rotateZ: 0, perspectiveDepth: 1200,
      glassBorder: false, padding: 56, radius: 14, shadow: 28, bgBlur: 0, filter: 'none',
      noiseIntensity: 0, grainIntensity: 0, brightness: 100, contrast: 100, saturation: 100, hueRotate: 0,
    },
  },
  {
    id: 'tahoe-sunset',
    name: 'Tahoe Sunset',
    desc: 'Alpine Dusk • Frosted Frame',
    config: {
      background: 'macos-tahoe-light.webp',
      showMacOsBar: false, perspective: 'front',
      rotateX: 0, rotateY: 0, rotateZ: 0, perspectiveDepth: 1200,
      glassBorder: true, glassBorderWidth: 4, glassBorderOpacity: 25, glassBorderBlur: 20,
      padding: 64, radius: 16, shadow: 35, bgBlur: 0, filter: 'none',
      noiseIntensity: 0, grainIntensity: 0, brightness: 100, contrast: 100, saturation: 100, hueRotate: 0,
    },
  },
  {
    id: 'pure-obsidian',
    name: 'Pure Obsidian',
    desc: 'OLED Black • Sharp Outline',
    config: {
      background: 'linear-gradient(180deg, #111113 0%, #000000 100%)',
      showMacOsBar: false, perspective: 'front',
      rotateX: 0, rotateY: 0, rotateZ: 0, perspectiveDepth: 1200,
      glassBorder: true, glassBorderWidth: 2, glassBorderOpacity: 35, glassBorderBlur: 14,
      padding: 56, radius: 14, shadow: 38, bgBlur: 0, filter: 'none',
      noiseIntensity: 0, grainIntensity: 0, brightness: 100, contrast: 100, saturation: 100, hueRotate: 0,
    },
  },
  {
    id: 'big-sur-3d',
    name: 'Big Sur 3D',
    desc: 'WWDC Colors • Right Tilt',
    config: {
      background: 'macos-big-sur-dark.webp',
      showMacOsBar: false, perspective: 'isometric-right',
      rotateX: 14, rotateY: 20, rotateZ: -8, perspectiveDepth: 1400,
      glassBorder: false, padding: 64, radius: 18, shadow: 36, bgBlur: 0, filter: 'none',
      noiseIntensity: 0, grainIntensity: 0, brightness: 100, contrast: 100, saturation: 100, hueRotate: 0,
    },
  },
];

// ─── 7 Perspectives ───────────────────────────────────────────────
export const MCP_PERSPECTIVES: Array<{
  id: PerspectiveId;
  name: string;
  desc: string;
  cssTransform: string;
  rx: number;
  ry: number;
  rz: number;
  depth: number;
}> = [
  { id: 'front', name: 'Flat 2D', desc: 'Classic Flat Studio', cssTransform: 'rotateX(0deg) rotateY(0deg)', rx: 0, ry: 0, rz: 0, depth: 1200 },
  { id: 'isometric-left', name: 'Iso Left', desc: 'Dynamic Left Tilt', cssTransform: 'perspective(1200px) rotateX(15deg) rotateY(-20deg) rotateZ(2deg)', rx: 15, ry: -20, rz: 2, depth: 1200 },
  { id: 'isometric-right', name: 'Iso Right', desc: 'Reverse Right Angle', cssTransform: 'perspective(1200px) rotateX(15deg) rotateY(20deg) rotateZ(-2deg)', rx: 15, ry: 20, rz: -2, depth: 1200 },
  { id: 'elevated', name: 'Hero Float', desc: 'Forward Elevation', cssTransform: 'perspective(1200px) rotateX(24deg) rotateY(0deg) rotateZ(0deg)', rx: 24, ry: 0, rz: 0, depth: 1200 },
  { id: 'skew-left', name: 'Deep Skew', desc: 'Cinematic Depth', cssTransform: 'perspective(900px) rotateX(8deg) rotateY(-32deg) rotateZ(4deg)', rx: 8, ry: -32, rz: 4, depth: 900 },
  { id: 'subtle', name: 'Subtle Tilt', desc: 'Gentle Studio Angle', cssTransform: 'perspective(1200px) rotateX(8deg) rotateY(-10deg) rotateZ(1deg)', rx: 8, ry: -10, rz: 1, depth: 1200 },
  { id: 'flat-lay', name: 'Tabletop', desc: 'Top-Down Angled Lay', cssTransform: 'perspective(900px) rotateX(40deg) rotateY(0deg) rotateZ(0deg)', rx: 40, ry: 0, rz: 0, depth: 900 },
];

// ─── ALL Wallpapers (macOS + Raycast + Nature) ────────────────────
export interface WallpaperItem {
  name: string;
  filename: string;
  category: 'macos' | 'raycast' | 'nature';
}

export const ALL_WALLPAPERS: WallpaperItem[] = [
  // macOS (22)
  { name: 'Dark Green 8K', filename: 'dark-green-8k.webp', category: 'macos' },
  { name: 'Big Sur Dark', filename: 'macos-big-sur-dark.webp', category: 'macos' },
  { name: 'Big Sur Light', filename: 'macos-big-sur-light.webp', category: 'macos' },
  { name: 'Monterey Dark', filename: 'macos-monterey-dark.webp', category: 'macos' },
  { name: 'Monterey WWDC', filename: 'macos-monterey-wwdc.webp', category: 'macos' },
  { name: 'Sequoia', filename: 'macos-sequoia.webp', category: 'macos' },
  { name: 'Sequoia Alt 1', filename: 'macos-sequoia-alt-1.webp', category: 'macos' },
  { name: 'Sequoia Alt 2', filename: 'macos-sequoia-alt-2.webp', category: 'macos' },
  { name: 'Sequoia Alt 3', filename: 'macos-sequoia-alt-3.webp', category: 'macos' },
  { name: 'Sequoia Alt 4', filename: 'macos-sequoia-alt-4.webp', category: 'macos' },
  { name: 'Sequoia Alt 5', filename: 'macos-sequoia-alt-5.webp', category: 'macos' },
  { name: 'Tahoe Light', filename: 'macos-tahoe-light.webp', category: 'macos' },
  { name: 'Tahoe Dark', filename: 'macos-tahoe-dark.webp', category: 'macos' },
  { name: 'Abstract Waves', filename: 'abstract-waves.webp', category: 'macos' },
  { name: 'Blue Abstract', filename: 'blue-abstract.webp', category: 'macos' },
  { name: 'Iridescent', filename: 'iridescent-spheres.webp', category: 'macos' },
  { name: 'Golden', filename: 'macos-golden.webp', category: 'macos' },
  { name: 'Surface', filename: 'surface-abstract.webp', category: 'macos' },
  { name: 'MacBook Abstract', filename: 'macbook-abstract.webp', category: 'macos' },
  { name: 'Emerald Dark', filename: 'emerald-dark.webp', category: 'macos' },
  { name: 'Dark macOS 4K', filename: 'macos-dark-4k.webp', category: 'macos' },
  { name: 'Apple Retina', filename: 'apple-retina.webp', category: 'macos' },
  // Raycast (17)
  { name: 'Blob Red', filename: 'raycast-blob-red.webp', category: 'raycast' },
  { name: 'Blob', filename: 'raycast-blob.webp', category: 'raycast' },
  { name: 'Blue Distortion 1', filename: 'raycast-blue-distortion-1.webp', category: 'raycast' },
  { name: 'Blue Distortion 2', filename: 'raycast-blue-distortion-2.webp', category: 'raycast' },
  { name: 'Chromatic Dark 1', filename: 'raycast-chromatic-dark-1.webp', category: 'raycast' },
  { name: 'Chromatic Dark 2', filename: 'raycast-chromatic-dark-2.webp', category: 'raycast' },
  { name: 'Cube Prod', filename: 'raycast-cube-prod.webp', category: 'raycast' },
  { name: 'Glaze 1', filename: 'raycast-glaze-1.webp', category: 'raycast' },
  { name: 'Glaze 2', filename: 'raycast-glaze-2.webp', category: 'raycast' },
  { name: 'Loupe Mono Dark', filename: 'raycast-loupe-mono-dark.webp', category: 'raycast' },
  { name: 'Loupe', filename: 'raycast-loupe.webp', category: 'raycast' },
  { name: 'Mono Dark Distortion 1', filename: 'raycast-mono-dark-distortion-1.webp', category: 'raycast' },
  { name: 'Mono Dark Distortion 2', filename: 'raycast-mono-dark-distortion-2.webp', category: 'raycast' },
  { name: 'Red Distortion 1', filename: 'raycast-red-distortion-1.webp', category: 'raycast' },
  { name: 'Red Distortion 2', filename: 'raycast-red-distortion-2.webp', category: 'raycast' },
  { name: 'Red Distortion 3', filename: 'raycast-red-distortion-3.webp', category: 'raycast' },
  { name: 'Red Distortion 4', filename: 'raycast-red-distortion-4.webp', category: 'raycast' },
  // Nature (12)
  { name: 'Chosen Nature 1', filename: 'chosen-nature-1.webp', category: 'nature' },
  { name: 'Chosen Nature 2', filename: 'chosen-nature-2.webp', category: 'nature' },
  { name: 'Chosen Nature 3', filename: 'chosen-nature-3.webp', category: 'nature' },
  { name: 'Chosen Nature 4', filename: 'chosen-nature-4.webp', category: 'nature' },
  { name: 'Chosen Nature 5', filename: 'chosen-nature-5.webp', category: 'nature' },
  { name: 'Chosen Nature 6', filename: 'chosen-nature-6.webp', category: 'nature' },
  { name: 'Chosen Nature 7', filename: 'chosen-nature-7.webp', category: 'nature' },
  { name: 'Chosen Nature 8', filename: 'chosen-nature-8.webp', category: 'nature' },
  { name: 'Chosen Nature 9', filename: 'chosen-nature-9.webp', category: 'nature' },
  { name: 'Chosen Nature 10', filename: 'chosen-nature-10.webp', category: 'nature' },
  { name: 'Chosen Nature 11', filename: 'chosen-nature-11.webp', category: 'nature' },
  { name: 'Chosen Nature 12', filename: 'chosen-nature-12.webp', category: 'nature' },
];

// ─── ALL 19 Gradients ─────────────────────────────────────────────
export interface GradientItem {
  id: string;
  css: string;
}

export const ALL_GRADIENTS: GradientItem[] = [
  { id: 'radial-zinc', css: 'radial-gradient(ellipse at 50% 20%, #27272a 0%, #09090b 100%)' },
  { id: 'linear-dark', css: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)' },
  { id: 'linear-indigo-dark', css: 'linear-gradient(145deg, #1e1b4b 0%, #09090b 100%)' },
  { id: 'indigo-deep', css: 'linear-gradient(135deg, #4338ca 0%, #1e1b4b 50%, #09090b 100%)' },
  { id: 'violet-indigo', css: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #0f172a 100%)' },
  { id: 'emerald-forest', css: 'linear-gradient(135deg, #059669 0%, #064e3b 50%, #022c22 100%)' },
  { id: 'sky-ocean', css: 'linear-gradient(135deg, #0284c7 0%, #0369a1 40%, #0f172a 100%)' },
  { id: 'blue-cyan', css: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 40%, #06b6d4 100%)' },
  { id: 'violet-pink', css: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)' },
  { id: 'pink-violet', css: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #1e1b4b 100%)' },
  { id: 'orange-pink', css: 'linear-gradient(135deg, #f97316 0%, #db2777 50%, #18181b 100%)' },
  { id: 'rose-dark', css: 'linear-gradient(135deg, #e11d48 0%, #881337 50%, #18181b 100%)' },
  { id: 'amber-dark', css: 'linear-gradient(135deg, #d97706 0%, #78350f 60%, #0c0a09 100%)' },
  { id: 'emerald-cyan-blue', css: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%)' },
  { id: 'teal-dark', css: 'linear-gradient(135deg, #0d9488 0%, #115e59 50%, #042f2e 100%)' },
  { id: 'red-dark', css: 'linear-gradient(135deg, #991b1b 0%, #450a0a 60%, #09090b 100%)' },
  { id: 'blue-pink', css: 'linear-gradient(135deg, #3b82f6 0%, #ec4899 50%, #09090b 100%)' },
  { id: 'radial-spotlight', css: 'radial-gradient(ellipse at 50% 0%, #3f3f46 0%, #18181b 40%, #000000 100%)' },
];

// ─── ALL 18 Solid Colors ──────────────────────────────────────────
export interface SolidColorItem {
  name: string;
  value: string;
}

export const ALL_SOLID_COLORS: SolidColorItem[] = [
  { name: 'Transparent', value: 'transparent' },
  { name: 'Pitch Black', value: '#000000' },
  { name: 'Obsidian Dark', value: '#09090b' },
  { name: 'Titanium Slate', value: '#18181b' },
  { name: 'Zinc Gray', value: '#3f3f46' },
  { name: 'Pure White', value: '#ffffff' },
  { name: 'Warm Sand', value: '#fef3c7' },
  { name: 'Rose Red', value: '#ef4444' },
  { name: 'Amber Orange', value: '#f97316' },
  { name: 'Gold Yellow', value: '#eab308' },
  { name: 'Emerald Green', value: '#10b981' },
  { name: 'Teal Cyan', value: '#14b8a6' },
  { name: 'Sky Blue', value: '#0ea5e9' },
  { name: 'Royal Sapphire', value: '#3b82f6' },
  { name: 'Indigo Deep', value: '#6366f1' },
  { name: 'Vivid Purple', value: '#8b5cf6' },
  { name: 'Fuchsia Pink', value: '#d946ef' },
  { name: 'Rose Petal', value: '#f43f5e' },
];

// ─── ALL 7 Filters ────────────────────────────────────────────────
export interface FilterItem {
  id: FilterId;
  name: string;
  desc: string;
  filterStyle: string;
}

export const ALL_FILTERS: FilterItem[] = [
  { id: 'none', name: 'Normal', desc: 'Original Colors', filterStyle: 'none' },
  { id: 'grayscale', name: 'Monochrome', desc: 'Black & White', filterStyle: 'grayscale(100%)' },
  { id: 'contrast', name: 'High Contrast', desc: 'Punchy & Vivid', filterStyle: 'contrast(160%)' },
  { id: 'warm', name: 'Warm Sunset', desc: 'Golden Saturation', filterStyle: 'saturate(130%) sepia(25%) contrast(110%)' },
  { id: 'sepia', name: 'Vintage Sepia', desc: 'Classic Retro', filterStyle: 'sepia(80%)' },
  { id: 'cool', name: 'Cool Mint', desc: 'Frosty Palette', filterStyle: 'hue-rotate(180deg) saturate(120%)' },
  { id: 'cyberpunk', name: 'Cyber Neon', desc: 'Ultra Vivid Glow', filterStyle: 'saturate(180%) hue-rotate(280deg) contrast(140%)' },
];

// ─── ASCII Pattern Characters ─────────────────────────────────────
export const ASCII_PATTERNS: Record<string, string> = {
  'medium-shade': '░',
  'dark-shade': '▓',
  'light-shade': '░',
  'block': '█',
  'hash': '#',
  'at': '@',
  'dot': '·',
  'star': '✦',
  'cross': '╬',
  'diamond': '◆',
  'circle': '●',
  'triangle': '▲',
};

// Backwards-compat alias
export const POPULAR_WALLPAPERS = ALL_WALLPAPERS.map((w) => w.filename);
