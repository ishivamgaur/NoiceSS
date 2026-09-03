import { 
  Layers, Maximize, Square, Monitor, Smartphone, Image as ImageIcon, LayoutTemplate, 
  Orbit, RotateCw, Moon, Sun, Globe, Box, Flame, Zap, SunMedium, Film, Droplet 
} from 'lucide-react';

export const ASPECT_CATEGORIES = [
  {
    name: 'Standard Proportions',
    ratios: [
      { id: 'auto', aspect: 'auto', name: 'Auto', desc: 'Freeform', icon: Maximize },
      { id: 'standard-1-1', aspect: '1/1', name: '1:1', desc: 'Square', icon: Square },
      { id: 'standard-16-9', aspect: '16/9', name: '16:9', desc: 'Widescreen', icon: Monitor },
      { id: 'standard-9-16', aspect: '9/16', name: '9:16', desc: 'Portrait', icon: Smartphone },
      { id: 'standard-4-3', aspect: '4/3', name: '4:3', desc: 'Classic', icon: ImageIcon },
      { id: 'standard-3-2', aspect: '3/2', name: '3:2', desc: 'Photo 35mm', icon: ImageIcon },
      { id: 'standard-4-5', aspect: '4/5', name: '4:5', desc: 'Feed Portrait', icon: LayoutTemplate },
      { id: 'standard-21-9', aspect: '21/9', name: '21:9', desc: 'Ultrawide', icon: Monitor },
    ]
  },
  {
    name: 'Banners & Covers',
    ratios: [
      { id: 'banner-3-1', aspect: '3/1', name: '3:1', desc: 'Header Banner', icon: LayoutTemplate },
      { id: 'banner-4-1', aspect: '4/1', name: '4:1', desc: 'Hero Strip', icon: LayoutTemplate },
      { id: 'banner-2-1', aspect: '2/1', name: '2:1', desc: 'Landscape Card', icon: LayoutTemplate },
      { id: 'banner-2.62-1', aspect: '2.62/1', name: '2.6:1', desc: 'Cover Art', icon: LayoutTemplate },
    ]
  }
];

export const FLAT_RATIOS = ASPECT_CATEGORIES.flatMap(c => c.ratios);

export const MACOS_BACKGROUNDS = [
  { name: 'Dark Green 8K', url: '/wallpapers/dark-green-8k.webp' },
  { name: 'Big Sur Dark', url: '/wallpapers/macos-big-sur-dark.webp' },
  { name: 'Big Sur Light', url: '/wallpapers/macos-big-sur-light.webp' },
  { name: 'Monterey Dark', url: '/wallpapers/macos-monterey-dark.webp' },
  { name: 'Monterey WWDC', url: '/wallpapers/macos-monterey-wwdc.webp' },
  { name: 'Sequoia', url: '/wallpapers/macos-sequoia.webp' },
  { name: 'Sequoia Alt 1', url: '/wallpapers/macos-sequoia-alt-1.webp' },
  { name: 'Sequoia Alt 2', url: '/wallpapers/macos-sequoia-alt-2.webp' },
  { name: 'Sequoia Alt 3', url: '/wallpapers/macos-sequoia-alt-3.webp' },
  { name: 'Sequoia Alt 4', url: '/wallpapers/macos-sequoia-alt-4.webp' },
  { name: 'Sequoia Alt 5', url: '/wallpapers/macos-sequoia-alt-5.webp' },
  { name: 'Tahoe Light', url: '/wallpapers/macos-tahoe-light.webp' },
  { name: 'Tahoe Dark', url: '/wallpapers/macos-tahoe-dark.webp' },
  { name: 'Abstract Waves', url: '/wallpapers/abstract-waves.webp' },
  { name: 'Blue Abstract', url: '/wallpapers/blue-abstract.webp' },
  { name: 'Iridescent', url: '/wallpapers/iridescent-spheres.webp' },
  { name: 'Golden', url: '/wallpapers/macos-golden.webp' },
  { name: 'Surface', url: '/wallpapers/surface-abstract.webp' },
  { name: 'MacBook Abstract', url: '/wallpapers/macbook-abstract.webp' },
  { name: 'Emerald Dark', url: '/wallpapers/emerald-dark.webp' },
  { name: 'Dark macOS 4K', url: '/wallpapers/macos-dark-4k.webp' },
  { name: 'Apple Retina', url: '/wallpapers/apple-retina.webp' }
];

export const RAYCAST_BACKGROUNDS = [
  { name: 'Blob Red', url: '/wallpapers/raycast-blob-red.webp' },
  { name: 'Blob', url: '/wallpapers/raycast-blob.webp' },
  { name: 'Blue Distortion 1', url: '/wallpapers/raycast-blue-distortion-1.webp' },
  { name: 'Blue Distortion 2', url: '/wallpapers/raycast-blue-distortion-2.webp' },
  { name: 'Chromatic Dark 1', url: '/wallpapers/raycast-chromatic-dark-1.webp' },
  { name: 'Chromatic Dark 2', url: '/wallpapers/raycast-chromatic-dark-2.webp' },
  { name: 'Cube Prod', url: '/wallpapers/raycast-cube-prod.webp' },
  { name: 'Glaze 1', url: '/wallpapers/raycast-glaze-1.webp' },
  { name: 'Glaze 2', url: '/wallpapers/raycast-glaze-2.webp' },
  { name: 'Loupe Mono Dark', url: '/wallpapers/raycast-loupe-mono-dark.webp' },
  { name: 'Loupe', url: '/wallpapers/raycast-loupe.webp' },
  { name: 'Mono Dark Distortion 1', url: '/wallpapers/raycast-mono-dark-distortion-1.webp' },
  { name: 'Mono Dark Distortion 2', url: '/wallpapers/raycast-mono-dark-distortion-2.webp' },
  { name: 'Red Distortion 1', url: '/wallpapers/raycast-red-distortion-1.webp' },
  { name: 'Red Distortion 2', url: '/wallpapers/raycast-red-distortion-2.webp' },
  { name: 'Red Distortion 3', url: '/wallpapers/raycast-red-distortion-3.webp' },
  { name: 'Red Distortion 4', url: '/wallpapers/raycast-red-distortion-4.webp' },
];

export const NATURE_BACKGROUNDS = [
  { name: 'Chosen Nature 1', url: '/wallpapers/chosen-nature-1.webp' },
  { name: 'Chosen Nature 2', url: '/wallpapers/chosen-nature-2.webp' },
  { name: 'Chosen Nature 3', url: '/wallpapers/chosen-nature-3.webp' },
  { name: 'Chosen Nature 4', url: '/wallpapers/chosen-nature-4.webp' },
  { name: 'Chosen Nature 5', url: '/wallpapers/chosen-nature-5.webp' },
  { name: 'Chosen Nature 6', url: '/wallpapers/chosen-nature-6.webp' },
  { name: 'Chosen Nature 7', url: '/wallpapers/chosen-nature-7.webp' },
  { name: 'Chosen Nature 8', url: '/wallpapers/chosen-nature-8.webp' },
  { name: 'Chosen Nature 9', url: '/wallpapers/chosen-nature-9.webp' },
  { name: 'Chosen Nature 10', url: '/wallpapers/chosen-nature-10.webp' },
  { name: 'Chosen Nature 11', url: '/wallpapers/chosen-nature-11.webp' },
  { name: 'Chosen Nature 12', url: '/wallpapers/chosen-nature-12.webp' },
];

export const GRADIENTS = [
  'radial-gradient(ellipse at 50% 20%, #27272a 0%, #09090b 100%)',
  'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
  'linear-gradient(145deg, #1e1b4b 0%, #09090b 100%)',
  'linear-gradient(135deg, #4338ca 0%, #1e1b4b 50%, #09090b 100%)',
  'linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #0f172a 100%)',
  'linear-gradient(135deg, #059669 0%, #064e3b 50%, #022c22 100%)',
  'linear-gradient(135deg, #0284c7 0%, #0369a1 40%, #0f172a 100%)',
  'linear-gradient(135deg, #2563eb 0%, #3b82f6 40%, #06b6d4 100%)',
  'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)',
  'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #1e1b4b 100%)',
  'linear-gradient(135deg, #f97316 0%, #db2777 50%, #18181b 100%)',
  'linear-gradient(135deg, #e11d48 0%, #881337 50%, #18181b 100%)',
  'linear-gradient(135deg, #d97706 0%, #78350f 60%, #0c0a09 100%)',
  'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%)',
  'linear-gradient(135deg, #0d9488 0%, #115e59 50%, #042f2e 100%)',
  'linear-gradient(135deg, #991b1b 0%, #450a0a 60%, #09090b 100%)',
  'linear-gradient(135deg, #3b82f6 0%, #ec4899 50%, #09090b 100%)',
  'radial-gradient(ellipse at 50% 0%, #3f3f46 0%, #18181b 40%, #000000 100%)',
];

export const SOLID_COLORS = [
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

export const PERSPECTIVES = [
  { id: 'front', name: 'Flat 2D', desc: 'Classic Flat Studio', icon: Square, rx: 0, ry: 0, rz: 0, depth: 1200, transform: '', previewTransform: 'rotateX(0deg) rotateY(0deg)' },
  { id: 'isometric-left', name: 'Iso Left', desc: 'Dynamic Left Tilt', icon: Box, rx: 15, ry: -20, rz: 2, depth: 1200, transform: 'perspective(1200px) rotateX(15deg) rotateY(-20deg) rotateZ(2deg)', previewTransform: 'perspective(200px) rotateX(15deg) rotateY(-20deg) rotateZ(2deg)' },
  { id: 'isometric-right', name: 'Iso Right', desc: 'Reverse Right Angle', icon: Box, rx: 15, ry: 20, rz: -2, depth: 1200, transform: 'perspective(1200px) rotateX(15deg) rotateY(20deg) rotateZ(-2deg)', previewTransform: 'perspective(200px) rotateX(15deg) rotateY(20deg) rotateZ(-2deg)' },
  { id: 'elevated', name: 'Hero Float', desc: 'Forward Elevation', icon: Layers, rx: 24, ry: 0, rz: 0, depth: 1200, transform: 'perspective(1200px) rotateX(24deg) rotateY(0deg) rotateZ(0deg)', previewTransform: 'perspective(200px) rotateX(24deg) rotateY(0deg)' },
  { id: 'skew-left', name: 'Deep Skew', desc: 'Cinematic Depth', icon: RotateCw, rx: 8, ry: -32, rz: 4, depth: 900, transform: 'perspective(900px) rotateX(8deg) rotateY(-32deg) rotateZ(4deg)', previewTransform: 'perspective(200px) rotateX(8deg) rotateY(-32deg)' },
  { id: 'subtle', name: 'Subtle Tilt', desc: 'Gentle Studio Angle', icon: Orbit, rx: 8, ry: -10, rz: 1, depth: 1200, transform: 'perspective(1200px) rotateX(8deg) rotateY(-10deg) rotateZ(1deg)', previewTransform: 'perspective(200px) rotateX(8deg) rotateY(-10deg)' },
  { id: 'flat-lay', name: 'Tabletop', desc: 'Top-Down Angled Lay', icon: Monitor, rx: 40, ry: 0, rz: 0, depth: 900, transform: 'perspective(900px) rotateX(40deg) rotateY(0deg) rotateZ(0deg)', previewTransform: 'perspective(200px) rotateX(40deg) rotateY(0deg)' },
];

export const PRESETS = [
  {
    id: 'studio-minimal',
    name: 'Studio Minimal',
    desc: 'Matte Slate • Clean Frame',
    icon: Square,
    config: {
      background: 'radial-gradient(ellipse at 50% 30%, #27272a 0%, #09090b 100%)',
      showMacOsBar: false,
      view: 'default',
      perspective: 'front',
      rotateX: 0, rotateY: 0, rotateZ: 0, perspectiveDepth: 1200,
      glassBorder: false, padding: 56, radius: 16, shadow: 30,
      bgBlur: 0, filter: 'none', noiseIntensity: 0, grainIntensity: 0,
      brightness: 100, contrast: 100, saturation: 100, hueRotate: 0,
    }
  },
  {
    id: 'apple-sequoia',
    name: 'Apple Sequoia',
    desc: 'Forest 4K • Frosted Glass',
    icon: Layers,
    config: {
      background: 'url("/wallpapers/macos-sequoia.webp")',
      showMacOsBar: false, view: 'default', perspective: 'front',
      rotateX: 0, rotateY: 0, rotateZ: 0, perspectiveDepth: 1200,
      glassBorder: true, glassBorderWidth: 4, glassBorderOpacity: 25, glassBorderBlur: 20,
      padding: 64, radius: 16, shadow: 35, bgBlur: 0, filter: 'none',
      noiseIntensity: 0, grainIntensity: 0, brightness: 100, contrast: 100, saturation: 100, hueRotate: 0,
    }
  },
  {
    id: '3d-hero-angle',
    name: '3D Hero Angle',
    desc: 'Isometric Left • Deep Shadow',
    icon: Orbit,
    config: {
      background: 'url("/wallpapers/dark-green-8k.webp")',
      showMacOsBar: false, view: 'default', perspective: 'isometric-left',
      rotateX: 14, rotateY: -20, rotateZ: 8, perspectiveDepth: 1400,
      glassBorder: true, glassBorderWidth: 3, glassBorderOpacity: 30, glassBorderBlur: 16,
      padding: 64, radius: 16, shadow: 42, bgBlur: 0, filter: 'none',
      noiseIntensity: 0, grainIntensity: 0, brightness: 100, contrast: 100, saturation: 100, hueRotate: 0,
    }
  },
  {
    id: 'monterey-dark',
    name: 'Monterey Dark',
    desc: '5K Flow • Subtle Tilt',
    icon: Moon,
    config: {
      background: 'url("/wallpapers/macos-monterey-dark.webp")',
      showMacOsBar: false, view: 'default', perspective: 'subtle',
      rotateX: 6, rotateY: -10, rotateZ: 2, perspectiveDepth: 1200,
      glassBorder: false, padding: 60, radius: 18, shadow: 32, bgBlur: 0, filter: 'none',
      noiseIntensity: 0, grainIntensity: 0, brightness: 100, contrast: 100, saturation: 100, hueRotate: 0,
    }
  },
  {
    id: 'safari-minimal',
    name: 'Ocean Waves',
    desc: 'Clean Wave • Smooth Frame',
    icon: Globe,
    config: {
      background: 'url("/wallpapers/blue-abstract.webp")',
      showMacOsBar: false, view: 'default', perspective: 'front',
      rotateX: 0, rotateY: 0, rotateZ: 0, perspectiveDepth: 1200,
      glassBorder: false, padding: 56, radius: 14, shadow: 28, bgBlur: 0, filter: 'none',
      noiseIntensity: 0, grainIntensity: 0, brightness: 100, contrast: 100, saturation: 100, hueRotate: 0,
    }
  },
  {
    id: 'tahoe-sunset',
    name: 'Tahoe Sunset',
    desc: 'Alpine Dusk • Frosted Frame',
    icon: Sun,
    config: {
      background: 'url("/wallpapers/macos-tahoe-light.webp")',
      showMacOsBar: false, view: 'default', perspective: 'front',
      rotateX: 0, rotateY: 0, rotateZ: 0, perspectiveDepth: 1200,
      glassBorder: true, glassBorderWidth: 4, glassBorderOpacity: 25, glassBorderBlur: 20,
      padding: 64, radius: 16, shadow: 35, bgBlur: 0, filter: 'none',
      noiseIntensity: 0, grainIntensity: 0, brightness: 100, contrast: 100, saturation: 100, hueRotate: 0,
    }
  },
  {
    id: 'pure-obsidian',
    name: 'Pure Obsidian',
    desc: 'OLED Black • Sharp Outline',
    icon: Box,
    config: {
      background: 'linear-gradient(180deg, #111113 0%, #000000 100%)',
      showMacOsBar: false, view: 'default', perspective: 'front',
      rotateX: 0, rotateY: 0, rotateZ: 0, perspectiveDepth: 1200,
      glassBorder: true, glassBorderWidth: 2, glassBorderOpacity: 35, glassBorderBlur: 14,
      padding: 56, radius: 14, shadow: 38, bgBlur: 0, filter: 'none',
      noiseIntensity: 0, grainIntensity: 0, brightness: 100, contrast: 100, saturation: 100, hueRotate: 0,
    }
  },
  {
    id: 'big-sur-3d',
    name: 'Big Sur 3D',
    desc: 'WWDC Colors • Right Tilt',
    icon: Flame,
    config: {
      background: 'url("/wallpapers/macos-big-sur-dark.webp")',
      showMacOsBar: false, view: 'default', perspective: 'isometric-right',
      rotateX: 14, rotateY: 20, rotateZ: -8, perspectiveDepth: 1400,
      glassBorder: false, padding: 64, radius: 18, shadow: 36, bgBlur: 0, filter: 'none',
      noiseIntensity: 0, grainIntensity: 0, brightness: 100, contrast: 100, saturation: 100, hueRotate: 0,
    }
  }
];

export const FILTERS = [
  { id: 'none', name: 'Normal', desc: 'Original Colors', filterStyle: 'none', icon: Sun },
  { id: 'grayscale', name: 'Monochrome', desc: 'Black & White', filterStyle: 'grayscale(100%)', icon: Moon },
  { id: 'contrast', name: 'High Contrast', desc: 'Punchy & Vivid', filterStyle: 'contrast(160%)', icon: Zap },
  { id: 'warm', name: 'Warm Sunset', desc: 'Golden Saturation', filterStyle: 'saturate(130%) sepia(25%) contrast(110%)', icon: SunMedium },
  { id: 'sepia', name: 'Vintage Sepia', desc: 'Classic Retro', filterStyle: 'sepia(80%)', icon: Film },
  { id: 'cool', name: 'Cool Mint', desc: 'Frosty Palette', filterStyle: 'hue-rotate(180deg) saturate(120%)', icon: Droplet },
  { id: 'cyberpunk', name: 'Cyber Neon', desc: 'Ultra Vivid Glow', filterStyle: 'saturate(180%) hue-rotate(280deg) contrast(140%)', icon: Flame },
];
