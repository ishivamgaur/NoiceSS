"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Upload, Download, Layers, Monitor, Image as ImageIcon, Filter, 
  ChevronDown, Maximize, Square, LayoutTemplate, Smartphone, RotateCw, RotateCcw, Trash2, 
  Maximize2, Minimize2, ZoomIn, ZoomOut, Copy, Check, Sliders, Palette, 
  Wand2, Box, Orbit, Compass, Eye, RefreshCw, Sun, Moon, Laptop, Globe, CheckCircle2,
  Loader2, Aperture, SlidersHorizontal, Droplets, Droplet, Tv, Radio, Film, 
  Focus, Pipette, Paintbrush, Flame, Zap, SunMedium, Type, Scan, Scaling, 
  AppWindow, Gauge, EyeOff, SlidersVertical, X, Lock, Unlock, Bookmark, Save, Plus
} from 'lucide-react';
import { toPng, toJpeg, toBlob } from 'html-to-image';
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const ASPECT_CATEGORIES = [
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

const FLAT_RATIOS = ASPECT_CATEGORIES.flatMap(c => c.ratios);

const MACOS_BACKGROUNDS = [
  { name: 'Dark Green 8K', url: '/wallpapers/wp14135599-8k-mac-dark-green-wallpapers.webp' },
  { name: 'Big Sur Dark', url: '/wallpapers/macos-big-sur-apple-layers-fluidic-colorful-dark-wwdc-2020-6016x6016-1432.webp' },
  { name: 'Big Sur Light', url: '/wallpapers/macos-big-sur-apple-layers-fluidic-colorful-wwdc-stock-4096x2304-1455.webp' },
  { name: 'Monterey Dark', url: '/wallpapers/macos-monterey-stock-black-dark-mode-layers-5k-6016x6016-5889.webp' },
  { name: 'Monterey WWDC', url: '/wallpapers/macos-monterey-wwdc-21-stock-dark-mode-5k-6016x6016-5585.webp' },
  { name: 'Sequoia', url: '/wallpapers/macos-sequoia-forest-3840x2160-24082.webp' },
  { name: 'Tahoe Light', url: '/wallpapers/macos-tahoe-26-5120x2880-22675.webp' },
  { name: 'Tahoe Dark', url: '/wallpapers/macos-tahoe-26-5k-6016x6016-22672.webp' },
  { name: 'Abstract Waves', url: '/wallpapers/abstract-waves-3840x2160-26731.webp' },
  { name: 'Blue Abstract', url: '/wallpapers/blue-abstract-3840x2160-24798.webp' },
  { name: 'Iridescent', url: '/wallpapers/iridescent-spheres-3840x2160-26346.webp' },
  { name: 'Golden', url: '/wallpapers/macos-27-golden-4480x3088-26625.webp' },
  { name: 'Surface', url: '/wallpapers/microsoft-surface-3840x2160-26627.webp' },
  { name: 'MacBook Abstract', url: '/wallpapers/wp14041666-macbook-abstract-wallpapers.webp' },
  { name: 'Emerald Dark', url: '/wallpapers/wp14135646-8k-mac-dark-green-wallpapers.webp' },
  { name: 'Dark macOS 4K', url: '/wallpapers/wp16202777-dark-4k-macos-wallpapers.webp' },
  { name: 'Apple Retina', url: '/wallpapers/wp8994371-apple-4k-retina-wallpapers.webp' }
];

const GRADIENTS = [
  // Row 1: Studio Titanium, Cosmic Void & Linear Indigo
  'radial-gradient(ellipse at 50% 20%, #27272a 0%, #09090b 100%)',
  'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
  'linear-gradient(145deg, #1e1b4b 0%, #09090b 100%)',
  'linear-gradient(135deg, #4338ca 0%, #1e1b4b 50%, #09090b 100%)',
  'linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #0f172a 100%)',
  'linear-gradient(135deg, #059669 0%, #064e3b 50%, #022c22 100%)',

  // Row 2: Deep Saturated Auroras & Neon Dusk
  'linear-gradient(135deg, #0284c7 0%, #0369a1 40%, #0f172a 100%)',
  'linear-gradient(135deg, #2563eb 0%, #3b82f6 40%, #06b6d4 100%)',
  'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)',
  'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #1e1b4b 100%)',
  'linear-gradient(135deg, #f97316 0%, #db2777 50%, #18181b 100%)',
  'linear-gradient(135deg, #e11d48 0%, #881337 50%, #18181b 100%)',

  // Row 3: Midnight Amber, Emerald Abyss & Rich Contrast
  'linear-gradient(135deg, #d97706 0%, #78350f 60%, #0c0a09 100%)',
  'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%)',
  'linear-gradient(135deg, #0d9488 0%, #115e59 50%, #042f2e 100%)',
  'linear-gradient(135deg, #991b1b 0%, #450a0a 60%, #09090b 100%)',
  'linear-gradient(135deg, #3b82f6 0%, #ec4899 50%, #09090b 100%)',
  'radial-gradient(ellipse at 50% 0%, #3f3f46 0%, #18181b 40%, #000000 100%)',
];

const SOLID_COLORS = [
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

const PERSPECTIVES = [
  { 
    id: 'front', 
    name: 'Flat 2D', 
    desc: 'Classic Flat Studio', 
    icon: Square,
    rx: 0,
    ry: 0,
    rz: 0,
    depth: 1200,
    transform: '', 
    previewTransform: 'rotateX(0deg) rotateY(0deg)' 
  },
  { 
    id: 'isometric-left', 
    name: 'Iso Left', 
    desc: 'Dynamic Left Tilt', 
    icon: Box,
    rx: 15,
    ry: -20,
    rz: 2,
    depth: 1200,
    transform: 'perspective(1200px) rotateX(15deg) rotateY(-20deg) rotateZ(2deg)',
    previewTransform: 'perspective(200px) rotateX(15deg) rotateY(-20deg) rotateZ(2deg)'
  },
  { 
    id: 'isometric-right', 
    name: 'Iso Right', 
    desc: 'Reverse Right Angle', 
    icon: Box,
    rx: 15,
    ry: 20,
    rz: -2,
    depth: 1200,
    transform: 'perspective(1200px) rotateX(15deg) rotateY(20deg) rotateZ(-2deg)',
    previewTransform: 'perspective(200px) rotateX(15deg) rotateY(20deg) rotateZ(-2deg)'
  },
  { 
    id: 'elevated', 
    name: 'Hero Float', 
    desc: 'Forward Elevation', 
    icon: Layers,
    rx: 24,
    ry: 0,
    rz: 0,
    depth: 1200,
    transform: 'perspective(1200px) rotateX(24deg) rotateY(0deg) rotateZ(0deg)',
    previewTransform: 'perspective(200px) rotateX(24deg) rotateY(0deg)'
  },
  { 
    id: 'skew-left', 
    name: 'Deep Skew', 
    desc: 'Cinematic Depth', 
    icon: RotateCw,
    rx: 8,
    ry: -32,
    rz: 4,
    depth: 900,
    transform: 'perspective(900px) rotateX(8deg) rotateY(-32deg) rotateZ(4deg)',
    previewTransform: 'perspective(200px) rotateX(8deg) rotateY(-32deg)'
  },
  { 
    id: 'subtle', 
    name: 'Subtle Tilt', 
    desc: 'Gentle Studio Angle', 
    icon: Orbit,
    rx: 8,
    ry: -10,
    rz: 1,
    depth: 1200,
    transform: 'perspective(1200px) rotateX(8deg) rotateY(-10deg) rotateZ(1deg)',
    previewTransform: 'perspective(200px) rotateX(8deg) rotateY(-10deg)'
  },
  { 
    id: 'flat-lay', 
    name: 'Tabletop', 
    desc: 'Top-Down Angled Lay', 
    icon: Monitor,
    rx: 40,
    ry: 0,
    rz: 0,
    depth: 900,
    transform: 'perspective(900px) rotateX(40deg) rotateY(0deg) rotateZ(0deg)',
    previewTransform: 'perspective(200px) rotateX(40deg) rotateY(0deg)'
  },
];

const PRESETS = [
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
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      perspectiveDepth: 1200,
      glassBorder: false,
      padding: 56,
      radius: 16,
      shadow: 30,
      bgBlur: 0,
      filter: 'none',
      noiseIntensity: 0,
      grainIntensity: 0,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hueRotate: 0,
    }
  },
  {
    id: 'apple-sequoia',
    name: 'Apple Sequoia',
    desc: 'Forest 4K • Frosted Glass',
    icon: Layers,
    config: {
      background: 'url("/wallpapers/macos-sequoia-forest-3840x2160-24082.webp")',
      showMacOsBar: false,
      view: 'default',
      perspective: 'front',
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      perspectiveDepth: 1200,
      glassBorder: true,
      glassBorderWidth: 4,
      glassBorderOpacity: 25,
      glassBorderBlur: 20,
      padding: 64,
      radius: 16,
      shadow: 35,
      bgBlur: 0,
      filter: 'none',
      noiseIntensity: 0,
      grainIntensity: 0,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hueRotate: 0,
    }
  },
  {
    id: '3d-hero-angle',
    name: '3D Hero Angle',
    desc: 'Isometric Left • Deep Shadow',
    icon: Orbit,
    config: {
      background: 'url("/wallpapers/wp14135599-8k-mac-dark-green-wallpapers.webp")',
      showMacOsBar: false,
      view: 'default',
      perspective: 'isometric-left',
      rotateX: 14,
      rotateY: -20,
      rotateZ: 8,
      perspectiveDepth: 1400,
      glassBorder: true,
      glassBorderWidth: 3,
      glassBorderOpacity: 30,
      glassBorderBlur: 16,
      padding: 64,
      radius: 16,
      shadow: 42,
      bgBlur: 0,
      filter: 'none',
      noiseIntensity: 0,
      grainIntensity: 0,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hueRotate: 0,
    }
  },
  {
    id: 'monterey-dark',
    name: 'Monterey Dark',
    desc: '5K Flow • Subtle Tilt',
    icon: Moon,
    config: {
      background: 'url("/wallpapers/macos-monterey-stock-black-dark-mode-layers-5k-6016x6016-5889.webp")',
      showMacOsBar: false,
      view: 'default',
      perspective: 'subtle',
      rotateX: 6,
      rotateY: -10,
      rotateZ: 2,
      perspectiveDepth: 1200,
      glassBorder: false,
      padding: 60,
      radius: 18,
      shadow: 32,
      bgBlur: 0,
      filter: 'none',
      noiseIntensity: 0,
      grainIntensity: 0,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hueRotate: 0,
    }
  },
  {
    id: 'safari-minimal',
    name: 'Ocean Waves',
    desc: 'Clean Wave • Smooth Frame',
    icon: Globe,
    config: {
      background: 'url("/wallpapers/blue-abstract-3840x2160-24798.webp")',
      showMacOsBar: false,
      view: 'default',
      perspective: 'front',
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      perspectiveDepth: 1200,
      glassBorder: false,
      padding: 56,
      radius: 14,
      shadow: 28,
      bgBlur: 0,
      filter: 'none',
      noiseIntensity: 0,
      grainIntensity: 0,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hueRotate: 0,
    }
  },
  {
    id: 'tahoe-sunset',
    name: 'Tahoe Sunset',
    desc: 'Alpine Dusk • Frosted Frame',
    icon: Sun,
    config: {
      background: 'url("/wallpapers/macos-tahoe-26-5120x2880-22675.webp")',
      showMacOsBar: false,
      view: 'default',
      perspective: 'front',
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      perspectiveDepth: 1200,
      glassBorder: true,
      glassBorderWidth: 4,
      glassBorderOpacity: 25,
      glassBorderBlur: 20,
      padding: 64,
      radius: 16,
      shadow: 35,
      bgBlur: 0,
      filter: 'none',
      noiseIntensity: 0,
      grainIntensity: 0,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hueRotate: 0,
    }
  },
  {
    id: 'pure-obsidian',
    name: 'Pure Obsidian',
    desc: 'OLED Black • Sharp Outline',
    icon: Box,
    config: {
      background: 'linear-gradient(180deg, #111113 0%, #000000 100%)',
      showMacOsBar: false,
      view: 'default',
      perspective: 'front',
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      perspectiveDepth: 1200,
      glassBorder: true,
      glassBorderWidth: 2,
      glassBorderOpacity: 35,
      glassBorderBlur: 14,
      padding: 56,
      radius: 14,
      shadow: 38,
      bgBlur: 0,
      filter: 'none',
      noiseIntensity: 0,
      grainIntensity: 0,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hueRotate: 0,
    }
  },
  {
    id: 'big-sur-3d',
    name: 'Big Sur 3D',
    desc: 'WWDC Colors • Right Tilt',
    icon: Flame,
    config: {
      background: 'url("/wallpapers/macos-big-sur-apple-layers-fluidic-colorful-dark-wwdc-2020-6016x6016-1432.webp")',
      showMacOsBar: false,
      view: 'default',
      perspective: 'isometric-right',
      rotateX: 14,
      rotateY: 20,
      rotateZ: -8,
      perspectiveDepth: 1400,
      glassBorder: false,
      padding: 64,
      radius: 18,
      shadow: 36,
      bgBlur: 0,
      filter: 'none',
      noiseIntensity: 0,
      grainIntensity: 0,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hueRotate: 0,
    }
  }
];

const FILTERS = [
  { id: 'none', name: 'Normal', desc: 'Original Colors', filterStyle: 'none', icon: Sun },
  { id: 'grayscale', name: 'Monochrome', desc: 'Black & White', filterStyle: 'grayscale(100%)', icon: Moon },
  { id: 'contrast', name: 'High Contrast', desc: 'Punchy & Vivid', filterStyle: 'contrast(160%)', icon: Zap },
  { id: 'warm', name: 'Warm Sunset', desc: 'Golden Saturation', filterStyle: 'saturate(130%) sepia(25%) contrast(110%)', icon: SunMedium },
  { id: 'sepia', name: 'Vintage Sepia', desc: 'Classic Retro', filterStyle: 'sepia(80%)', icon: Film },
  { id: 'cool', name: 'Cool Mint', desc: 'Frosty Palette', filterStyle: 'hue-rotate(180deg) saturate(120%)', icon: Droplet },
  { id: 'cyberpunk', name: 'Cyber Neon', desc: 'Ultra Vivid Glow', filterStyle: 'saturate(180%) hue-rotate(280deg) contrast(140%)', icon: Flame },
];

const renderPlatformIcon = (platform: string, size = 12) => {
  switch (platform) {
    case 'x':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className="shrink-0">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      );
    case 'github':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className="shrink-0">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
      );
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
        </svg>
      );
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className="shrink-0">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z"/>
        </svg>
      );
    case 'globe':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" x2="22" y1="12" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      );
    default:
      return null;
  }
};

const renderAspectBox = (aspect: string) => {
  if (aspect === 'auto') {
    return (
      <div className="w-3.5 h-3.5 border border-dashed border-current rounded-[2px] opacity-70 flex items-center justify-center shrink-0">
        <div className="w-1 h-1 bg-current rounded-full opacity-60" />
      </div>
    );
  }
  const parts = aspect.split('/');
  const w = parseFloat(parts[0]);
  const h = parseFloat(parts[1] || '1');
  if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
    return <div className="w-3.5 h-3.5 border border-current rounded-[2px] opacity-70 shrink-0" />;
  }

  let boxW = 15;
  let boxH = 15;
  if (w >= h) {
    boxW = 16;
    boxH = Math.max(5, Math.min(16, Math.round(16 * (h / w))));
  } else {
    boxH = 16;
    boxW = Math.max(5, Math.min(16, Math.round(16 * (w / h))));
  }

  return (
    <div 
      className="border border-current rounded-[2px] opacity-80 shrink-0" 
      style={{ width: `${boxW}px`, height: `${boxH}px` }} 
    />
  );
};

export default function StudioPage() {
  const [image, setImage] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState({ w: 0, h: 0 });
  const [imageSelected, setImageSelected] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [padding, setPadding] = useState(64);
  const [radius, setRadius] = useState(16);
  const [shadow, setShadow] = useState(25);
  const [scale, setScale] = useState(100);
  const [aspectRatio, setAspectRatio] = useState('auto');
  const [customRatioW, setCustomRatioW] = useState<number>(16);
  const [customRatioH, setCustomRatioH] = useState<number>(9);
  const [showRatioMenu, setShowRatioMenu] = useState(false);
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const [showMacOsBar, setShowMacOsBar] = useState(false);
  const [glassBorder, setGlassBorder] = useState(false);
  const [glassBorderWidth, setGlassBorderWidth] = useState(8);
  const [glassBorderBlur, setGlassBorderBlur] = useState(20);
  const [glassBorderColor, setGlassBorderColor] = useState('#ffffff');
  const [glassBorderOpacity, setGlassBorderOpacity] = useState(20);
  const [background, setBackground] = useState('url("/wallpapers/wp14135599-8k-mac-dark-green-wallpapers.webp")');
  const [isStorageInitialized, setIsStorageInitialized] = useState(false);
  
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '255, 255, 255';
  };

  // Canvas Viewport Zoom & Pan (Figma-style smooth workspace navigation)
  const [viewportZoom, setViewportZoom] = useState(1);
  const [viewportPan, setViewportPan] = useState({ x: 0, y: 0 });
  const [isPanningWorkspace, setIsPanningWorkspace] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const workspacePanRef = useRef<{ startX: number, startY: number, initialPanX: number, initialPanY: number } | null>(null);

  const viewportZoomRef = useRef(viewportZoom);
  viewportZoomRef.current = viewportZoom;
  const viewportPanRef = useRef(viewportPan);
  viewportPanRef.current = viewportPan;

  // Screenshot element drag state
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Resize state
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<{ corner: string, startX: number, startY: number, startScale: number, centerX: number, centerY: number, startDistance: number } | null>(null);

  // Rotate state
  const [isRotating, setIsRotating] = useState(false);
  const [isEditingRotation, setIsEditingRotation] = useState(false);
  const [rotationInput, setRotationInput] = useState('0');
  const rotateRef = useRef<{ startAngle: number, startRotation: number, centerX: number, centerY: number } | null>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);

  // Noise & Blur state
  const [noiseIntensity, setNoiseIntensity] = useState(0);
  const [grainIntensity, setGrainIntensity] = useState(0);
  const [noiseTarget, setNoiseTarget] = useState('both');
  const [imageBlur, setImageBlur] = useState(0);
  const [bgBlur, setBgBlur] = useState(0);
  
  // Manual lighting & grading state
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [hueRotate, setHueRotate] = useState(0);
  
  const [filter, setFilter] = useState('none');

  const resetLighting = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setHueRotate(0);
    setFilter('none');
  };

  const isCustomLighting = brightness !== 100 || contrast !== 100 || saturation !== 100 || hueRotate !== 0 || filter !== 'none';
  const [view, setView] = useState('default');
  const [perspective, setPerspective] = useState('front');
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [rotateZ, setRotateZ] = useState(0);
  const [perspectiveDepth, setPerspectiveDepth] = useState(1200);

  const [watermark, setWatermark] = useState('');
  const [watermarkPlatform, setWatermarkPlatform] = useState<'x' | 'github' | 'instagram' | 'linkedin' | 'globe' | 'none'>('x');
  const [watermarkPosition, setWatermarkPosition] = useState<'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right' | 'top-left' | 'top-center'>('bottom-right');
  const [watermarkTarget, setWatermarkTarget] = useState<'screenshot' | 'canvas'>('screenshot');
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(65);
  const [watermarkBlur, setWatermarkBlur] = useState<number>(20);
  const [watermarkGlass, setWatermarkGlass] = useState<'frosted' | 'dark' | 'clear'>('frosted');
  const [watermarkBorderWidth, setWatermarkBorderWidth] = useState<number>(1);
  const [watermarkBorderOpacity, setWatermarkBorderOpacity] = useState<number>(25);
  const [watermarkOffsetX, setWatermarkOffsetX] = useState<number>(16);
  const [watermarkOffsetY, setWatermarkOffsetY] = useState<number>(16);
  const [watermarkScale, setWatermarkScale] = useState<number>(100);
  
  // Collapsible sidebar accordion sections
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    // Left Sidebar: Layout
    canvasSetup: true,
    frameWindow: true,
    watermark: true,
    // Left Sidebar: Backdrop
    bgBlur: true,
    wallpapers: true,
    gradients: true,
    solidColors: true,
    // Left Sidebar: Effects
    textureNoise: true,
    focusBlur: true,
    colorFilters: true,
    // Right Sidebar
    perspectives: true,
    themes: true,
    templates: false,
    filters: false,
  });

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const applyPerspectivePreset = (p: typeof PERSPECTIVES[0]) => {
    setPerspective(p.id);
    setRotateX(p.rx);
    setRotateY(p.ry);
    setRotateZ(p.rz);
    setPerspectiveDepth(p.depth);
  };

  const reset3D = () => {
    setPerspective('front');
    setRotateX(0);
    setRotateY(0);
    setRotateZ(0);
    setPerspectiveDepth(1200);
  };
  
  // Navigation tabs
  const [leftTab, setLeftTab] = useState<'layout' | 'background' | 'effects'>('layout');
  
  // Custom Saved Presets
  const [customPresets, setCustomPresets] = useState<Array<{
    id: string;
    name: string;
    createdAt: number;
    config: any;
  }>>([]);
  const [newPresetName, setNewPresetName] = useState('');
  const [presetSavedSuccess, setPresetSavedSuccess] = useState(false);

  // 1. Load active studio state, presets, and image from localStorage on mount
  useEffect(() => {
    try {
      // Load Presets
      const savedPresets = localStorage.getItem('noicess_user_presets');
      if (savedPresets) {
        setCustomPresets(JSON.parse(savedPresets));
      }

      // Load Saved Studio Image (if any)
      const savedImage = localStorage.getItem('noicess_studio_image');
      if (savedImage) {
        setImage(savedImage);
        const img = new Image();
        img.src = savedImage;
        img.onload = () => {
          setImageDimensions({ w: img.naturalWidth, h: img.naturalHeight });
        };
      }

      // Load Saved Studio State
      const savedState = localStorage.getItem('noicess_studio_state');
      if (savedState) {
        const s = JSON.parse(savedState);
        if (s.background !== undefined) setBackground(s.background);
        if (s.padding !== undefined) setPadding(s.padding);
        if (s.radius !== undefined) setRadius(s.radius);
        if (s.shadow !== undefined) setShadow(s.shadow);
        if (s.scale !== undefined) setScale(s.scale);
        if (s.rotation !== undefined) setRotation(s.rotation);
        if (s.isLocked !== undefined) setIsLocked(s.isLocked);
        if (s.pos !== undefined) setPos(s.pos);
        if (s.aspectRatio !== undefined) setAspectRatio(s.aspectRatio);
        if (s.customRatioW !== undefined) setCustomRatioW(s.customRatioW);
        if (s.customRatioH !== undefined) setCustomRatioH(s.customRatioH);
        if (s.showMacOsBar !== undefined) setShowMacOsBar(s.showMacOsBar);
        if (s.view !== undefined) setView(s.view);
        if (s.glassBorder !== undefined) setGlassBorder(s.glassBorder);
        if (s.glassBorderWidth !== undefined) setGlassBorderWidth(s.glassBorderWidth);
        if (s.glassBorderBlur !== undefined) setGlassBorderBlur(s.glassBorderBlur);
        if (s.glassBorderColor !== undefined) setGlassBorderColor(s.glassBorderColor);
        if (s.glassBorderOpacity !== undefined) setGlassBorderOpacity(s.glassBorderOpacity);
        if (s.perspective !== undefined) setPerspective(s.perspective);
        if (s.rotateX !== undefined) setRotateX(s.rotateX);
        if (s.rotateY !== undefined) setRotateY(s.rotateY);
        if (s.rotateZ !== undefined) setRotateZ(s.rotateZ);
        if (s.perspectiveDepth !== undefined) setPerspectiveDepth(s.perspectiveDepth);
        if (s.brightness !== undefined) setBrightness(s.brightness);
        if (s.contrast !== undefined) setContrast(s.contrast);
        if (s.saturation !== undefined) setSaturation(s.saturation);
        if (s.hueRotate !== undefined) setHueRotate(s.hueRotate);
        if (s.filter !== undefined) setFilter(s.filter);
        if (s.noiseIntensity !== undefined) setNoiseIntensity(s.noiseIntensity);
        if (s.grainIntensity !== undefined) setGrainIntensity(s.grainIntensity);
        if (s.noiseTarget !== undefined) setNoiseTarget(s.noiseTarget);
        if (s.bgBlur !== undefined) setBgBlur(s.bgBlur);
        if (s.imageBlur !== undefined) setImageBlur(s.imageBlur);
        if (s.watermark !== undefined) setWatermark(s.watermark);
        if (s.watermarkPlatform !== undefined) setWatermarkPlatform(s.watermarkPlatform);
        if (s.watermarkPosition !== undefined) setWatermarkPosition(s.watermarkPosition);
        if (s.watermarkTarget !== undefined) setWatermarkTarget(s.watermarkTarget);
        if (s.watermarkOpacity !== undefined) setWatermarkOpacity(s.watermarkOpacity);
        if (s.watermarkBlur !== undefined) setWatermarkBlur(s.watermarkBlur);
        if (s.watermarkGlass !== undefined) setWatermarkGlass(s.watermarkGlass);
        if (s.watermarkBorderWidth !== undefined) setWatermarkBorderWidth(s.watermarkBorderWidth);
        if (s.watermarkBorderOpacity !== undefined) setWatermarkBorderOpacity(s.watermarkBorderOpacity);
        if (s.watermarkOffsetX !== undefined) setWatermarkOffsetX(s.watermarkOffsetX);
        if (s.watermarkOffsetY !== undefined) setWatermarkOffsetY(s.watermarkOffsetY);
        if (s.watermarkScale !== undefined) setWatermarkScale(s.watermarkScale);
        if (s.leftTab !== undefined) setLeftTab(s.leftTab);
        if (s.expandedSections !== undefined) setExpandedSections(s.expandedSections);
      }
    } catch (e) {
      console.error('Failed to load studio state from localStorage', e);
    } finally {
      setIsStorageInitialized(true);
    }
  }, []);

  // 2. Auto-save active studio state to localStorage on any state change
  useEffect(() => {
    if (!isStorageInitialized) return;

    try {
      const stateToSave = {
        background,
        padding,
        radius,
        shadow,
        scale,
        rotation,
        isLocked,
        pos,
        aspectRatio,
        customRatioW,
        customRatioH,
        showMacOsBar,
        view,
        glassBorder,
        glassBorderWidth,
        glassBorderBlur,
        glassBorderColor,
        glassBorderOpacity,
        perspective,
        rotateX,
        rotateY,
        rotateZ,
        perspectiveDepth,
        brightness,
        contrast,
        saturation,
        hueRotate,
        filter,
        noiseIntensity,
        grainIntensity,
        noiseTarget,
        bgBlur,
        imageBlur,
        watermark,
        watermarkPlatform,
        watermarkPosition,
        watermarkTarget,
        watermarkOpacity,
        watermarkBlur,
        watermarkGlass,
        watermarkBorderWidth,
        watermarkBorderOpacity,
        watermarkOffsetX,
        watermarkOffsetY,
        watermarkScale,
        leftTab,
        expandedSections,
      };

      localStorage.setItem('noicess_studio_state', JSON.stringify(stateToSave));
    } catch (err) {
      console.error('Failed to auto-save studio state', err);
    }
  }, [
    isStorageInitialized,
    background,
    padding,
    radius,
    shadow,
    scale,
    rotation,
    isLocked,
    pos,
    aspectRatio,
    customRatioW,
    customRatioH,
    showMacOsBar,
    view,
    glassBorder,
    glassBorderWidth,
    glassBorderBlur,
    glassBorderColor,
    glassBorderOpacity,
    perspective,
    rotateX,
    rotateY,
    rotateZ,
    perspectiveDepth,
    brightness,
    contrast,
    saturation,
    hueRotate,
    filter,
    noiseIntensity,
    grainIntensity,
    noiseTarget,
    bgBlur,
    imageBlur,
    watermark,
    watermarkPlatform,
    watermarkPosition,
    watermarkTarget,
    watermarkOpacity,
    watermarkBlur,
    watermarkGlass,
    watermarkBorderWidth,
    watermarkBorderOpacity,
    watermarkOffsetX,
    watermarkOffsetY,
    watermarkScale,
    leftTab,
    expandedSections,
  ]);

  // 3. Auto-save or remove uploaded screenshot
  useEffect(() => {
    if (!isStorageInitialized) return;
    try {
      if (image) {
        // Only store if smaller than 4MB to prevent localStorage QuotaExceededError
        if (image.length < 4 * 1024 * 1024) {
          localStorage.setItem('noicess_studio_image', image);
        }
      } else {
        localStorage.removeItem('noicess_studio_image');
      }
    } catch (e) {
      console.warn('Unable to persist image to localStorage', e);
    }
  }, [isStorageInitialized, image]);

  // Save current studio configuration as preset
  const handleSavePreset = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newPresetName.trim() || `Preset ${customPresets.length + 1}`;
    const newPreset = {
      id: `preset-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: trimmed,
      createdAt: Date.now(),
      config: {
        background,
        padding,
        radius,
        shadow,
        bgBlur,
        aspectRatio,
        customRatioW,
        customRatioH,
        showMacOsBar,
        view,
        glassBorder,
        glassBorderWidth,
        glassBorderOpacity,
        glassBorderBlur,
        glassBorderColor,
        perspective,
        rotateX,
        rotateY,
        rotateZ,
        perspectiveDepth,
        brightness,
        contrast,
        saturation,
        hueRotate,
        filter,
        noiseIntensity,
        grainIntensity,
        noiseTarget,
        watermark,
        watermarkPlatform,
        watermarkPosition,
        watermarkTarget,
        watermarkOpacity,
        watermarkBlur,
        watermarkGlass,
        watermarkBorderWidth,
        watermarkBorderOpacity,
        watermarkOffsetX,
        watermarkOffsetY,
        watermarkScale,
      }
    };

    const updated = [newPreset, ...customPresets];
    setCustomPresets(updated);
    try {
      localStorage.setItem('noicess_user_presets', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save preset to localStorage', err);
    }
    setNewPresetName('');
    setPresetSavedSuccess(true);
    setTimeout(() => setPresetSavedSuccess(false), 2000);
  };

  // Apply saved preset
  const handleApplyPreset = (config: any) => {
    if (!config) return;
    if (config.background) setBackground(config.background);
    setPadding(config.padding ?? 64);
    setRadius(config.radius ?? 16);
    setShadow(config.shadow ?? 30);
    setBgBlur(config.bgBlur ?? 0);
    if (config.aspectRatio) setAspectRatio(config.aspectRatio);
    if (config.customRatioW) setCustomRatioW(config.customRatioW);
    if (config.customRatioH) setCustomRatioH(config.customRatioH);
    setShowMacOsBar(config.showMacOsBar ?? false);
    setView(config.view || 'default');
    setGlassBorder(config.glassBorder ?? false);
    setGlassBorderWidth(config.glassBorderWidth ?? 4);
    setGlassBorderOpacity(config.glassBorderOpacity ?? 25);
    setGlassBorderBlur(config.glassBorderBlur ?? 20);
    setGlassBorderColor(config.glassBorderColor || '#ffffff');
    setPerspective(config.perspective || 'front');
    setRotateX(config.rotateX ?? 0);
    setRotateY(config.rotateY ?? 0);
    setRotateZ(config.rotateZ ?? 0);
    setPerspectiveDepth(config.perspectiveDepth ?? 1200);
    setBrightness(config.brightness ?? 100);
    setContrast(config.contrast ?? 100);
    setSaturation(config.saturation ?? 100);
    setHueRotate(config.hueRotate ?? 0);
    setFilter(config.filter || 'none');
    setNoiseIntensity(config.noiseIntensity ?? 0);
    setGrainIntensity(config.grainIntensity ?? 0);
    if (config.noiseTarget) setNoiseTarget(config.noiseTarget);
    if (config.watermark !== undefined) setWatermark(config.watermark);
    if (config.watermarkPlatform) setWatermarkPlatform(config.watermarkPlatform);
    if (config.watermarkPosition) setWatermarkPosition(config.watermarkPosition);
    if (config.watermarkTarget) setWatermarkTarget(config.watermarkTarget);
    if (config.watermarkOpacity !== undefined) setWatermarkOpacity(config.watermarkOpacity);
    if (config.watermarkBlur !== undefined) setWatermarkBlur(config.watermarkBlur);
    if (config.watermarkGlass) setWatermarkGlass(config.watermarkGlass);
    if (config.watermarkBorderWidth !== undefined) setWatermarkBorderWidth(config.watermarkBorderWidth);
    if (config.watermarkBorderOpacity !== undefined) setWatermarkBorderOpacity(config.watermarkBorderOpacity);
    if (config.watermarkOffsetX !== undefined) setWatermarkOffsetX(config.watermarkOffsetX);
    if (config.watermarkOffsetY !== undefined) setWatermarkOffsetY(config.watermarkOffsetY);
    if (config.watermarkScale !== undefined) setWatermarkScale(config.watermarkScale);
  };

  // Delete saved preset
  const handleDeletePreset = (id: string) => {
    const updated = customPresets.filter(p => p.id !== id);
    setCustomPresets(updated);
    try {
      localStorage.setItem('noicess_user_presets', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to delete preset from localStorage', err);
    }
  };

  // Export states
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [exportScale, setExportScale] = useState<number>(2);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Generate real pixel noise texture
  const noiseTexture = React.useMemo(() => {
    if (typeof document === 'undefined') return '';
    const size = 150;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');
    if (!ctx) return '';
    const imageData = ctx.createImageData(size, size);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = Math.random();
      const v = r > 0.5 ? 255 : 0;
      imageData.data[i] = v;
      imageData.data[i + 1] = v;
      imageData.data[i + 2] = v;
      imageData.data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
    return c.toDataURL('image/png');
  }, []);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  // Spacebar key listener for canvas panning
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        setIsSpacePressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Cursor-Anchored Wheel Zoom for Canvas Workspace
  useEffect(() => {
    const workspace = workspaceRef.current;
    if (!workspace) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const rect = workspace.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const currentZoom = viewportZoomRef.current;
      const currentPan = viewportPanRef.current;

      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      const newZoom = Math.min(Math.max(currentZoom * zoomFactor, 0.2), 4.0);

      const pointX = (mouseX - currentPan.x) / currentZoom;
      const pointY = (mouseY - currentPan.y) / currentZoom;

      const newPanX = mouseX - pointX * newZoom;
      const newPanY = mouseY - pointY * newZoom;

      setViewportZoom(newZoom);
      setViewportPan({ x: newPanX, y: newPanY });
    };

    workspace.addEventListener('wheel', handleWheel, { passive: false });
    return () => workspace.removeEventListener('wheel', handleWheel);
  }, []);

  const handleWorkspacePointerDown = (e: React.PointerEvent) => {
    // Check if the event originated inside the screenshot image frame or floating controls
    const isInsideScreenshotFrame = imageFrameRef.current?.contains(e.target as Node);
    
    if (isLocked || !isInsideScreenshotFrame || isSpacePressed || e.button === 1) {
      if (!isInsideScreenshotFrame) {
        setImageSelected(false);
      }
      setIsPanningWorkspace(true);
      workspacePanRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        initialPanX: viewportPan.x,
        initialPanY: viewportPan.y,
      };
      (workspaceRef.current as HTMLElement)?.setPointerCapture?.(e.pointerId);
    }
  };

  const handleWorkspacePointerMove = (e: React.PointerEvent) => {
    if (!isPanningWorkspace || !workspacePanRef.current) return;
    const dx = e.clientX - workspacePanRef.current.startX;
    const dy = e.clientY - workspacePanRef.current.startY;
    setViewportPan({
      x: workspacePanRef.current.initialPanX + dx,
      y: workspacePanRef.current.initialPanY + dy,
    });
  };

  const handleWorkspacePointerUp = (e: React.PointerEvent) => {
    if (isPanningWorkspace) {
      setIsPanningWorkspace(false);
      workspacePanRef.current = null;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {}
    }
  };

  const resetViewport = () => {
    setViewportZoom(1);
    setViewportPan({ x: 0, y: 0 });
  };

  const zoomCanvasAtCenter = (factor: number) => {
    const workspace = workspaceRef.current;
    if (!workspace) return;
    const rect = workspace.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const currentZoom = viewportZoomRef.current;
    const currentPan = viewportPanRef.current;

    const pointX = (centerX - currentPan.x) / currentZoom;
    const pointY = (centerY - currentPan.y) / currentZoom;

    const newZoom = Math.min(Math.max(currentZoom * factor, 0.2), 4.0);
    const newPanX = centerX - pointX * newZoom;
    const newPanY = centerY - pointY * newZoom;

    setViewportZoom(newZoom);
    setViewportPan({ x: newPanX, y: newPanY });
  };

  // Corner resize handling
  useEffect(() => {
    if (!isResizing) return;
    
    const handleMove = (e: PointerEvent) => {
      const state = resizeRef.current;
      if (!state) return;
      
      const currentDistance = Math.hypot(e.clientX - state.centerX, e.clientY - state.centerY);
      const scaleRatio = currentDistance / state.startDistance;
      let newScale = Math.round(state.startScale * scaleRatio);
      
      newScale = Math.min(Math.max(newScale, 20), 300);
      if (Math.abs(newScale - 100) < 3) newScale = 100;
      
      setScale(newScale);
    };
    
    const handleUp = () => {
      setIsResizing(false);
      resizeRef.current = null;
    };
    
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [isResizing]);

  // Rotation handling
  useEffect(() => {
    if (!isRotating) return;

    const handleMove = (e: PointerEvent) => {
      const state = rotateRef.current;
      if (!state) return;
      const currentAngle = Math.atan2(e.clientY - state.centerY, e.clientX - state.centerX) * (180 / Math.PI);
      const diff = currentAngle - state.startAngle;
      let newRot = Math.round(state.startRotation + diff);
      newRot = ((newRot % 360) + 360) % 360;

      if (newRot < 4 || newRot > 356) newRot = 0;
      else if (Math.abs(newRot - 90) < 4) newRot = 90;
      else if (Math.abs(newRot - 180) < 4) newRot = 180;
      else if (Math.abs(newRot - 270) < 4) newRot = 270;

      if (e.shiftKey) {
        newRot = Math.round(newRot / 15) * 15;
      }
      setRotation(newRot);
    };

    const handleUp = () => {
      setIsRotating(false);
      rotateRef.current = null;
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [isRotating]);

  const loadImage = (url: string) => {
    const img = new window.Image();
    img.onload = () => {
      setImageDimensions({ w: img.width, h: img.height });
      setImage(url);
    };
    img.src = url;
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.items) {
        for (let i = 0; i < e.clipboardData.items.length; i++) {
          if (e.clipboardData.items[i].type.indexOf('image') !== -1) {
            const blob = e.clipboardData.items[i].getAsFile();
            if (blob) {
              const reader = new FileReader();
              reader.onload = (e) => {
                if (e.target?.result) loadImage(e.target.result as string);
              };
              reader.readAsDataURL(blob);
            }
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) loadImage(e.target.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const filterExportNodes = (domNode: HTMLElement) => {
    if (!domNode) return true;
    if (domNode.classList && domNode.classList.contains('no-export')) {
      return false;
    }
    if (domNode.dataset && domNode.dataset.noExport === 'true') {
      return false;
    }
    return true;
  };

  const handleExport = useCallback(async (format = exportFormat, multiplier = exportScale) => {
    if (canvasRef.current === null) return;
    setImageSelected(false);
    setIsExporting(true);
    // Wait for React to commit the state update and purge ghost/handle layers from DOM
    await new Promise((resolve) => setTimeout(resolve, 80));
    try {
      let dataUrl = '';
      const options = {
        cacheBust: true,
        pixelRatio: multiplier,
        quality: 0.95,
        filter: filterExportNodes,
      };
      if (format === 'jpeg') {
        dataUrl = await toJpeg(canvasRef.current, options);
      } else if (format === 'webp') {
        const blob = await toBlob(canvasRef.current, options);
        if (blob) {
          dataUrl = URL.createObjectURL(blob);
        } else {
          dataUrl = await toPng(canvasRef.current, options);
        }
      } else {
        dataUrl = await toPng(canvasRef.current, options);
      }
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      const ext = format === 'jpeg' ? 'jpg' : format;
      const link = document.createElement('a');
      link.download = `noicess-${randomNum}.${ext}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
    } finally {
      setIsExporting(false);
    }
  }, [canvasRef, exportFormat, exportScale]);

  const handleCopyClipboard = async () => {
    if (!canvasRef.current || !image) return;
    setImageSelected(false);
    setIsExporting(true);
    await new Promise((resolve) => setTimeout(resolve, 80));
    try {
      const blob = await toBlob(canvasRef.current, { 
        pixelRatio: 2, 
        cacheBust: true,
        filter: filterExportNodes,
      });
      if (blob && navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleResizeDown = (e: React.PointerEvent, corner: string) => {
    if (isLocked) return;
    e.stopPropagation();
    e.preventDefault();
    if (!imageFrameRef.current) return;
    const rect = imageFrameRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const startDistance = Math.hypot(e.clientX - centerX, e.clientY - centerY) || 1;
    resizeRef.current = { corner, startX: e.clientX, startY: e.clientY, startScale: scale, centerX, centerY, startDistance };
    setIsResizing(true);
    setImageSelected(true);
  };

  const handleRotateDown = (e: React.PointerEvent) => {
    if (isLocked) return;
    e.stopPropagation();
    e.preventDefault();
    if (!imageFrameRef.current) return;
    const rect = imageFrameRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    rotateRef.current = { startAngle, startRotation: rotation, centerX, centerY };
    setIsRotating(true);
    setImageSelected(true);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isLocked) return;
    setIsDragging(true);
    setDragStart({ 
      x: e.clientX - pos.x, 
      y: e.clientY - pos.y 
    });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    let newX = e.clientX - dragStart.x;
    let newY = e.clientY - dragStart.y;
    if (Math.abs(newX) < 15) newX = 0;
    if (Math.abs(newY) < 15) newY = 0;
    setPos({ x: newX, y: newY });
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const getFilterStyle = () => {
    const selectedFilter = FILTERS.find(f => f.id === filter);
    const parts: string[] = [];
    
    if (selectedFilter && selectedFilter.filterStyle !== 'none') {
      parts.push(selectedFilter.filterStyle);
    }
    if (brightness !== 100) {
      parts.push(`brightness(${brightness}%)`);
    }
    if (contrast !== 100) {
      parts.push(`contrast(${contrast}%)`);
    }
    if (saturation !== 100) {
      parts.push(`saturate(${saturation}%)`);
    }
    if (hueRotate !== 0) {
      parts.push(`hue-rotate(${hueRotate}deg)`);
    }
    if (imageBlur > 0) {
      parts.push(`blur(${imageBlur}px)`);
    }
    
    return parts.length > 0 ? parts.join(' ') : 'none';
  };

  const activeRatioData = aspectRatio === 'custom'
    ? { id: 'custom', aspect: `${customRatioW}/${customRatioH}`, name: `Custom (${customRatioW}:${customRatioH})`, desc: `${customRatioW}:${customRatioH}`, icon: Scaling }
    : (FLAT_RATIOS.find(r => r.id === aspectRatio) || FLAT_RATIOS[0]);

  const aspectStyle = aspectRatio === 'custom'
    ? `${customRatioW}/${customRatioH}`
    : (activeRatioData.id === 'auto' 
        ? (imageDimensions.w && imageDimensions.h ? `${imageDimensions.w}/${imageDimensions.h}` : 'auto')
        : activeRatioData.aspect);
    
  const glassRgb = hexToRgb(glassBorderColor);
  const activePerspectiveTransform = (rotateX !== 0 || rotateY !== 0 || rotateZ !== 0)
    ? `perspective(${perspectiveDepth}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`
    : (PERSPECTIVES.find(p => p.id === perspective)?.transform || '');
  const bgUrlMatch = background.match(/^url\(['"]?(.*?)['"]?\)$/);
  const bgImageUrl = bgUrlMatch ? bgUrlMatch[1] : null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-dark text-text-main font-sans antialiased">
      
      {/* Left Sidebar */}
      <aside className="w-[300px] min-w-[300px] flex flex-col bg-panel border-r border-white/5 z-20 select-none h-full overflow-hidden">
        {/* Top Tab Bar aligned with h-16 main header */}
        <div className="h-16 border-b border-white/5 px-3.5 flex items-center shrink-0">
          <div className="relative grid grid-cols-3 gap-1 bg-white/[0.02] p-1 rounded-lg border border-white/[0.04] w-full isolate">
            {/* Sliding Translucent Whitish Glass Active Pill */}
            <div 
              className="absolute top-1 bottom-1 w-[calc((100%-16px)/3)] bg-white/10 border border-white/20 rounded-md shadow-sm ring-1 ring-white/10 transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none -z-10"
              style={{
                transform: `translateX(${
                  leftTab === 'layout' ? '0%' : leftTab === 'background' ? 'calc(100% + 4px)' : 'calc(200% + 8px)'
                })`,
                left: '4px'
              }}
            />
            <button 
              onClick={() => setLeftTab('layout')}
              aria-label="Layout settings"
              className={`py-1.5 text-xs font-medium rounded-md transition-colors duration-200 active:scale-95 text-center cursor-pointer ${
                leftTab === 'layout' 
                  ? 'text-white font-semibold' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Layout
            </button>
            <button 
              onClick={() => setLeftTab('background')}
              aria-label="Backdrop settings"
              className={`py-1.5 text-xs font-medium rounded-md transition-colors duration-200 active:scale-95 text-center cursor-pointer ${
                leftTab === 'background' 
                  ? 'text-white font-semibold' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Backdrop
            </button>
            <button 
              onClick={() => setLeftTab('effects')}
              aria-label="Effects and filters"
              className={`py-1.5 text-xs font-medium rounded-md transition-colors duration-200 active:scale-95 text-center cursor-pointer ${
                leftTab === 'effects' 
                  ? 'text-white font-semibold' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Effects
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto [scrollbar-gutter:stable] p-3 pb-8 flex flex-col">
          {/* Tab 1: Layout & Frame */}
          {leftTab === 'layout' && (
          <div className="animate-in fade-in duration-100 flex flex-col gap-3">
            {/* Section 1: Canvas Dimensions */}
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => toggleSection('canvasSetup')}
                className="flex items-center justify-between w-full h-[26px] min-h-[26px] px-0.5 text-[11px] font-semibold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors group cursor-pointer leading-none"
              >
                <div className="flex items-center gap-1.5">
                  <ChevronDown size={13} className={`shrink-0 text-zinc-500 group-hover:text-zinc-300 transition-transform duration-200 ${expandedSections.canvasSetup ? 'rotate-0' : '-rotate-90'}`} />
                  <span className="leading-none">Canvas Setup</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono tabular-nums leading-none bg-white/[0.03] px-1.5 py-1 rounded border border-white/[0.04]">
                  {activeRatioData.name}
                </span>
              </button>
              
              {expandedSections.canvasSetup && (
                <div className="p-3 rounded-xl bg-white/[0.015] border border-white/[0.04] flex flex-col gap-3 animate-in fade-in slide-in-from-top-1 duration-150">
                  {/* Padding */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <label className="text-zinc-300 font-medium">Padding</label>
                      <span className="text-zinc-400 font-mono tabular-nums text-[11px] bg-white/[0.03] px-1.5 py-0.5 rounded-md border border-white/[0.03]">{padding}px</span>
                    </div>
                    <Slider min={0} max={120} step={1} value={[padding]} onValueChange={(v) => setPadding(Array.isArray(v) ? v[0] : v as number)} />
                  </div>
                  
                  {/* Image Scale */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <label className="text-zinc-300 font-medium">Image Scale</label>
                      <span className="text-zinc-400 font-mono tabular-nums text-[11px] bg-white/[0.03] px-1.5 py-0.5 rounded-md border border-white/[0.03]">{Math.round(scale)}%</span>
                    </div>
                    <Slider min={20} max={300} step={1} value={[scale]} onValueChange={(v) => setScale(Array.isArray(v) ? v[0] : v as number)} />
                  </div>

                  {/* Rotation */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <label className="text-zinc-300 font-medium">Rotation</label>
                      <div className="flex items-center gap-1">
                        <input 
                          type="text" 
                          inputMode="numeric"
                          aria-label="Rotation angle"
                          value={rotation} 
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            if (!isNaN(val)) setRotation(((Math.round(val) % 360) + 360) % 360);
                            else if (e.target.value === '') setRotation(0);
                          }}
                          className="w-11 h-5 px-1 bg-white/[0.02] border border-white/5 rounded-md text-center text-[11px] font-mono tabular-nums text-zinc-300 focus:text-white focus:outline-none focus:border-white/20 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-[11px] text-zinc-400 font-mono">°</span>
                      </div>
                    </div>
                    <Slider min={0} max={360} step={1} value={[rotation]} onValueChange={(v) => setRotation(Array.isArray(v) ? v[0] : v as number)} />
                  </div>

                  {/* Lock Canvas Position */}
                  <button
                    onClick={() => setIsLocked(!isLocked)}
                    aria-label={isLocked ? "Unlock position" : "Lock position"}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 active:scale-[0.98] border ${
                      isLocked
                        ? 'bg-white/10 border-white/20 text-white font-semibold shadow-sm'
                        : 'bg-white/[0.02] border-white/[0.04] text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isLocked ? <Lock size={12} className="text-white" /> : <Unlock size={12} />}
                      <span>Lock Position</span>
                    </div>
                    <span className={`text-[9px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded ${isLocked ? 'bg-white text-black' : 'bg-white/5 text-zinc-500'}`}>
                      {isLocked ? 'LOCKED' : 'FREE'}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Section 2: Frame & Window */}
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => toggleSection('frameWindow')}
                className="flex items-center justify-between w-full h-[26px] min-h-[26px] px-0.5 text-[11px] font-semibold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors group cursor-pointer leading-none"
              >
                <div className="flex items-center gap-1.5">
                  <ChevronDown size={13} className={`shrink-0 text-zinc-500 group-hover:text-zinc-300 transition-transform duration-200 ${expandedSections.frameWindow ? 'rotate-0' : '-rotate-90'}`} />
                  <span className="leading-none">Frame & Window</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono tabular-nums leading-none">
                  {radius}px
                </span>
              </button>
              
              {expandedSections.frameWindow && (
                <div className="p-3 rounded-xl bg-white/[0.015] border border-white/[0.04] flex flex-col gap-3 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                  {/* Toggles */}
                  <div className="flex items-center justify-between py-0.5">
                    <label htmlFor="macos-bar-toggle" className="text-zinc-300 font-medium cursor-pointer">macOS Titlebar</label>
                    <Checkbox id="macos-bar-toggle" checked={showMacOsBar} onCheckedChange={(c) => setShowMacOsBar(c as boolean)} />
                  </div>
                  
                  <div className="flex items-center justify-between py-0.5">
                    <label htmlFor="glass-border-toggle" className="text-zinc-300 font-medium cursor-pointer">Frosted Glass Border</label>
                    <Checkbox id="glass-border-toggle" checked={glassBorder} onCheckedChange={(c) => setGlassBorder(c as boolean)} />
                  </div>
                  
                  {glassBorder && (
                    <div className="flex flex-col gap-3 bg-white/[0.02] p-3 rounded-lg border border-white/[0.04] mt-1">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <label className="text-zinc-400 font-medium">Border Width</label>
                          <span className="text-zinc-400 font-mono tabular-nums text-[11px]">{glassBorderWidth}px</span>
                        </div>
                        <Slider min={2} max={32} step={1} value={[glassBorderWidth]} onValueChange={(v) => setGlassBorderWidth(Array.isArray(v) ? v[0] : v as number)} />
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <label className="text-zinc-400 font-medium">Border Opacity</label>
                          <span className="text-zinc-400 font-mono tabular-nums text-[11px]">{glassBorderOpacity}%</span>
                        </div>
                        <Slider min={5} max={100} step={1} value={[glassBorderOpacity]} onValueChange={(v) => setGlassBorderOpacity(Array.isArray(v) ? v[0] : v as number)} />
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <label className="text-zinc-400 font-medium">Border Blur</label>
                          <span className="text-zinc-400 font-mono tabular-nums text-[11px]">{glassBorderBlur}px</span>
                        </div>
                        <Slider min={0} max={60} step={1} value={[glassBorderBlur]} onValueChange={(v) => setGlassBorderBlur(Array.isArray(v) ? v[0] : v as number)} />
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <label className="text-zinc-400 font-medium">Border Tint</label>
                        <div className="flex items-center gap-2 relative">
                          <div className="w-5 h-5 rounded-full border border-white/10 shadow-inner" style={{ backgroundColor: glassBorderColor }} />
                          <input type="color" aria-label="Glass border tint color" value={glassBorderColor} onChange={(e) => setGlassBorderColor(e.target.value)} className="w-5 h-5 rounded cursor-pointer bg-transparent border-0 opacity-0 absolute inset-0" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Border Radius */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <label className="text-zinc-300 font-medium">Corner Radius</label>
                      <span className="text-zinc-400 font-mono tabular-nums text-[11px] bg-white/[0.03] px-1.5 py-0.5 rounded-md border border-white/[0.03]">{radius}px</span>
                    </div>
                    <Slider min={0} max={40} step={1} value={[radius]} onValueChange={(v) => setRadius(Array.isArray(v) ? v[0] : v as number)} />
                  </div>

                  {/* Drop Shadow */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <label className="text-zinc-300 font-medium">Drop Shadow</label>
                      <span className="text-zinc-400 font-mono tabular-nums text-[11px] bg-white/[0.03] px-1.5 py-0.5 rounded-md border border-white/[0.03]">{shadow}px</span>
                    </div>
                    <Slider min={0} max={60} step={1} value={[shadow]} onValueChange={(v) => setShadow(Array.isArray(v) ? v[0] : v as number)} />
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Watermark & Badge */}
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => toggleSection('watermark')}
                className="flex items-center justify-between w-full h-[26px] min-h-[26px] px-0.5 text-[11px] font-semibold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors group cursor-pointer leading-none"
              >
                <div className="flex items-center gap-1.5">
                  <ChevronDown size={13} className={`shrink-0 text-zinc-500 group-hover:text-zinc-300 transition-transform duration-200 ${expandedSections.watermark ? 'rotate-0' : '-rotate-90'}`} />
                  <span className="leading-none">Watermark & Badge</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono tabular-nums leading-none">
                  {watermark ? 'Active' : 'Off'}
                </span>
              </button>
              
              {expandedSections.watermark && (
                <div className="p-3 rounded-xl bg-white/[0.015] border border-white/[0.04] flex flex-col gap-3.5 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                  {/* Platform selector */}
                  <div>
                    <label className="text-[11px] text-zinc-400 font-medium mb-1.5 block">Platform Icon</label>
                    <div className="relative grid grid-cols-6 gap-1 bg-white/[0.02] p-1 rounded-lg border border-white/[0.04] isolate">
                      {/* Sliding Pill for Platform */}
                      {(() => {
                        const platforms = ['x', 'github', 'instagram', 'linkedin', 'globe', 'none'];
                        const idx = platforms.indexOf(watermarkPlatform);
                        return (
                          <div 
                            className="absolute top-1 bottom-1 w-[calc((100%-28px)/6)] bg-white/10 border border-white/20 rounded-md shadow-sm ring-1 ring-white/10 transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none -z-10"
                            style={{
                              transform: `translateX(calc(${idx * 100}% + ${idx * 4}px))`,
                              left: '4px'
                            }}
                          />
                        );
                      })()}
                      {[
                        { id: 'x', label: '𝕏' },
                        { id: 'github', label: 'GH' },
                        { id: 'instagram', label: 'IG' },
                        { id: 'linkedin', label: 'IN' },
                        { id: 'globe', label: 'Web' },
                        { id: 'none', label: 'Text' }
                      ].map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setWatermarkPlatform(p.id as any)}
                          aria-label={`Watermark platform ${p.id}`}
                          className={`py-1 text-[11px] font-medium rounded-md transition-colors duration-200 active:scale-95 flex items-center justify-center cursor-pointer ${
                            watermarkPlatform === p.id 
                              ? 'text-white font-semibold' 
                              : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                          title={p.id.toUpperCase()}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Handle / Text Input */}
                  <div>
                    <label className="text-[11px] text-zinc-400 font-medium mb-1.5 block">Handle / Text</label>
                    <Input 
                      type="text" 
                      placeholder="e.g. @yourname" 
                      value={watermark} 
                      onChange={(e) => setWatermark(e.target.value)}
                      className="bg-white/[0.02] text-xs border-white/[0.05] text-white h-8 focus-visible:ring-1 focus-visible:ring-white/20"
                    />
                  </div>

                  {watermark && (
                    <>
                      {/* Placement Target */}
                      <div>
                        <label className="text-[11px] text-zinc-400 font-medium mb-1.5 block">Overlay Placement</label>
                        <div className="relative grid grid-cols-2 gap-1 bg-white/[0.02] p-1 rounded-lg border border-white/[0.04] isolate">
                          <div 
                            className="absolute top-1 bottom-1 w-[calc((100%-12px)/2)] bg-white/10 border border-white/20 rounded-md shadow-sm ring-1 ring-white/10 transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none -z-10"
                            style={{
                              transform: `translateX(${watermarkTarget === 'screenshot' ? '0%' : 'calc(100% + 4px)'})`,
                              left: '4px'
                            }}
                          />
                          <button
                            onClick={() => setWatermarkTarget('screenshot')}
                            className={`py-1 text-[11px] font-medium rounded-md transition-colors duration-200 active:scale-95 text-center cursor-pointer ${watermarkTarget === 'screenshot' ? 'text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'}`}
                          >
                            On Screenshot
                          </button>
                          <button
                            onClick={() => setWatermarkTarget('canvas')}
                            className={`py-1 text-[11px] font-medium rounded-md transition-colors duration-200 active:scale-95 text-center cursor-pointer ${watermarkTarget === 'canvas' ? 'text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'}`}
                          >
                            On Canvas
                          </button>
                        </div>
                      </div>

                      {/* Position Selector */}
                      <div>
                        <label className="text-[11px] text-zinc-400 font-medium mb-1.5 block">Position</label>
                        <div className="relative grid grid-cols-4 gap-1 bg-white/[0.02] p-1 rounded-lg border border-white/[0.04] isolate">
                          {(() => {
                            const positions = ['bottom-right', 'bottom-center', 'bottom-left', 'top-right'];
                            const idx = positions.indexOf(watermarkPosition);
                            if (idx !== -1) {
                              return (
                                <div 
                                  className="absolute top-1 bottom-1 w-[calc((100%-20px)/4)] bg-white/10 border border-white/20 rounded-md shadow-sm ring-1 ring-white/10 transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none -z-10"
                                  style={{
                                    transform: `translateX(calc(${idx * 100}% + ${idx * 4}px))`,
                                    left: '4px'
                                  }}
                                />
                              );
                            }
                            return null;
                          })()}
                          {[
                            { id: 'bottom-right', label: 'B-Right' },
                            { id: 'bottom-center', label: 'B-Center' },
                            { id: 'bottom-left', label: 'B-Left' },
                            { id: 'top-right', label: 'T-Right' }
                          ].map((pos) => (
                            <button
                              key={pos.id}
                              onClick={() => setWatermarkPosition(pos.id as any)}
                              className={`py-1 text-[10px] font-medium rounded-md transition-colors duration-200 active:scale-95 text-center cursor-pointer ${watermarkPosition === pos.id ? 'text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'}`}
                            >
                              {pos.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Size Selector */}
                      <div>
                        <label className="text-[11px] text-zinc-400 font-medium mb-1.5 block">Size</label>
                        <div className="relative grid grid-cols-3 gap-1 bg-white/[0.02] p-1 rounded-lg border border-white/[0.04] isolate">
                          {(() => {
                            const sizes = [85, 100, 125];
                            const idx = sizes.indexOf(watermarkScale);
                            if (idx !== -1) {
                              return (
                                <div 
                                  className="absolute top-1 bottom-1 w-[calc((100%-16px)/3)] bg-white/10 border border-white/20 rounded-md shadow-sm ring-1 ring-white/10 transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none -z-10"
                                  style={{
                                    transform: `translateX(calc(${idx * 100}% + ${idx * 4}px))`,
                                    left: '4px'
                                  }}
                                />
                              );
                            }
                            return null;
                          })()}
                          {[
                            { val: 85, label: 'Small' },
                            { val: 100, label: 'Default' },
                            { val: 125, label: 'Large' }
                          ].map((s) => (
                            <button
                              key={s.val}
                              onClick={() => setWatermarkScale(s.val)}
                              className={`py-1 text-[10px] font-medium rounded-md transition-colors duration-200 active:scale-95 text-center cursor-pointer ${
                                watermarkScale === s.val ? 'text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                              }`}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Frosted Blur Slider & Quick Presets */}
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <label className="text-zinc-300 font-medium">Frosted Blur</label>
                          <span className="text-zinc-400 font-mono tabular-nums text-[11px] bg-white/[0.03] px-1.5 py-0.5 rounded-md border border-white/[0.03]">{watermarkBlur}px</span>
                        </div>
                        <Slider min={0} max={40} step={1} value={[watermarkBlur]} onValueChange={(v) => setWatermarkBlur(Array.isArray(v) ? v[0] : v as number)} />

                        <div className="relative grid grid-cols-4 gap-1 bg-white/[0.02] p-1 rounded-lg border border-white/[0.04] mt-2 isolate">
                          {(() => {
                            const blurPresets = [0, 10, 20, 32];
                            const idx = blurPresets.indexOf(watermarkBlur);
                            if (idx !== -1) {
                              return (
                                <div 
                                  className="absolute top-1 bottom-1 w-[calc((100%-20px)/4)] bg-white/10 border border-white/20 rounded-md shadow-sm ring-1 ring-white/10 transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none -z-10"
                                  style={{
                                    transform: `translateX(calc(${idx * 100}% + ${idx * 4}px))`,
                                    left: '4px'
                                  }}
                                />
                              );
                            }
                            return null;
                          })()}
                          {[
                            { val: 0, label: 'Off' },
                            { val: 10, label: 'Soft' },
                            { val: 20, label: 'Frosted' },
                            { val: 32, label: 'Deep' }
                          ].map((p) => (
                            <button
                              key={p.val}
                              onClick={() => setWatermarkBlur(p.val)}
                              className={`py-1 text-[10px] font-mono tabular-nums rounded-md transition-colors duration-200 active:scale-95 text-center cursor-pointer ${
                                watermarkBlur === p.val 
                                  ? 'text-white font-semibold' 
                                  : 'text-zinc-400 hover:text-zinc-200'
                              }`}
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Backgrounds */}
        {leftTab === 'background' && (
          <div className="animate-in fade-in duration-100 flex flex-col gap-3">
            {/* Section 1: Blur & Focus */}
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => toggleSection('bgBlur')}
                className="flex items-center justify-between w-full h-[26px] min-h-[26px] px-0.5 text-[11px] font-semibold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors group cursor-pointer leading-none"
              >
                <div className="flex items-center gap-1.5">
                  <ChevronDown size={13} className={`shrink-0 text-zinc-500 group-hover:text-zinc-300 transition-transform duration-200 ${expandedSections.bgBlur ? 'rotate-0' : '-rotate-90'}`} />
                  <span className="leading-none">Background Blur</span>
                </div>
                <span className="text-zinc-400 font-mono tabular-nums text-[10px] leading-none bg-white/[0.03] px-1.5 py-1 rounded border border-white/[0.04]">{bgBlur}px</span>
              </button>

              {expandedSections.bgBlur && (
                <div className="p-3 rounded-xl bg-white/[0.015] border border-white/[0.04] flex flex-col gap-3 animate-in fade-in slide-in-from-top-1 duration-150">
                  <Slider min={0} max={50} step={1} value={[bgBlur]} onValueChange={(v) => setBgBlur(Array.isArray(v) ? v[0] : v as number)} />
                  
                  <div className="relative grid grid-cols-4 gap-1 bg-white/[0.02] p-1 rounded-lg border border-white/[0.04] isolate">
                    {(() => {
                      const presets = [0, 12, 24, 40];
                      const idx = presets.indexOf(bgBlur);
                      if (idx !== -1) {
                        return (
                          <div 
                            className="absolute top-1 bottom-1 w-[calc((100%-20px)/4)] bg-white/10 border border-white/20 rounded-md shadow-sm ring-1 ring-white/10 transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none -z-10"
                            style={{
                              transform: `translateX(calc(${idx * 100}% + ${idx * 4}px))`,
                              left: '4px'
                            }}
                          />
                        );
                      }
                      return null;
                    })()}
                    {[
                      { val: 0, label: 'Off' },
                      { val: 12, label: 'Soft' },
                      { val: 24, label: 'Medium' },
                      { val: 40, label: 'Frosted' }
                    ].map((p) => (
                      <button
                        key={p.val}
                        onClick={() => setBgBlur(p.val)}
                        className={`py-1 text-[10px] font-mono tabular-nums rounded-md transition-colors duration-200 active:scale-95 text-center cursor-pointer ${
                          bgBlur === p.val 
                            ? 'text-white font-semibold' 
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  {image && (
                    <button
                      onClick={() => {
                        setBackground(`url("${image}")`);
                        if (bgBlur === 0) setBgBlur(25);
                      }}
                      className="w-full py-2 px-3 rounded-lg border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.07] text-white text-xs font-medium flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98]"
                    >
                      <ImageIcon size={13} className="text-zinc-300" />
                      <span>Use Screenshot as Backdrop</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Section 2: Curated Wallpapers */}
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => toggleSection('wallpapers')}
                className="flex items-center justify-between w-full h-[26px] min-h-[26px] px-0.5 text-[11px] font-semibold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors group cursor-pointer leading-none"
              >
                <div className="flex items-center gap-1.5">
                  <ChevronDown size={13} className={`shrink-0 text-zinc-500 group-hover:text-zinc-300 transition-transform duration-200 ${expandedSections.wallpapers ? 'rotate-0' : '-rotate-90'}`} />
                  <span className="leading-none">Studio Wallpapers</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono tabular-nums leading-none">{MACOS_BACKGROUNDS.length} Presets</span>
              </button>
              
              {expandedSections.wallpapers && (
                <div className="p-2.5 rounded-xl bg-white/[0.015] border border-white/[0.04] animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="grid grid-cols-6 gap-2">
                    {MACOS_BACKGROUNDS.map((bg, idx) => {
                      const bgUrl = `url("${bg.url}")`;
                      const isSelected = background === bgUrl;
                      return (
                        <button 
                          key={idx} 
                          title={bg.name}
                          aria-label={`Select wallpaper ${bg.name}`}
                          className={`aspect-square rounded-md transition-all duration-150 active:scale-95 border relative overflow-hidden ${
                            isSelected 
                              ? 'border-white ring-2 ring-white/20 shadow-md scale-105' 
                              : 'border-white/[0.06] hover:border-white/30 hover:scale-105'
                          }`}
                          style={{ background: bgUrl, backgroundSize: 'cover', backgroundPosition: 'center' }}
                          onClick={() => setBackground(bgUrl)}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Gradients */}
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => toggleSection('gradients')}
                className="flex items-center justify-between w-full h-[26px] min-h-[26px] px-0.5 text-[11px] font-semibold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors group cursor-pointer leading-none"
              >
                <div className="flex items-center gap-1.5">
                  <ChevronDown size={13} className={`shrink-0 text-zinc-500 group-hover:text-zinc-300 transition-transform duration-200 ${expandedSections.gradients ? 'rotate-0' : '-rotate-90'}`} />
                  <span className="leading-none">Studio Gradients</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono tabular-nums leading-none">{GRADIENTS.length} Themes</span>
              </button>
              
              {expandedSections.gradients && (
                <div className="p-2.5 rounded-xl bg-white/[0.015] border border-white/[0.04] animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="grid grid-cols-6 gap-2">
                    {GRADIENTS.map((bg, idx) => {
                      const isSelected = background === bg;
                      return (
                        <button 
                          key={idx} 
                          aria-label={`Select gradient ${idx + 1}`}
                          className={`aspect-square rounded-md transition-all duration-150 active:scale-95 border ${
                            isSelected 
                              ? 'border-white ring-2 ring-white/20 shadow-md scale-105' 
                              : 'border-white/[0.06] hover:border-white/30 hover:scale-105'
                          }`}
                          style={{ background: bg }}
                          onClick={() => setBackground(bg)}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Section 4: Solid & Custom Colors */}
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => toggleSection('solidColors')}
                className="flex items-center justify-between w-full h-[26px] min-h-[26px] px-0.5 text-[11px] font-semibold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors group cursor-pointer leading-none"
              >
                <div className="flex items-center gap-1.5">
                  <ChevronDown size={13} className={`shrink-0 text-zinc-500 group-hover:text-zinc-300 transition-transform duration-200 ${expandedSections.solidColors ? 'rotate-0' : '-rotate-90'}`} />
                  <span className="leading-none">Solid & Custom Colors</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono tabular-nums leading-none">{SOLID_COLORS.length} Colors</span>
              </button>
              
              {expandedSections.solidColors && (
                <div className="p-2.5 rounded-xl bg-white/[0.015] border border-white/[0.04] flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="grid grid-cols-6 gap-2">
                    {SOLID_COLORS.map((col, idx) => {
                      const isSelected = background === col.value;
                      return (
                        <button 
                          key={idx} 
                          title={col.name}
                          aria-label={`Select solid color ${col.name}`}
                          className={`aspect-square rounded-md transition-all duration-150 active:scale-95 border ${
                            isSelected 
                              ? 'border-white ring-2 ring-white/20 shadow-md scale-105' 
                              : 'border-white/[0.06] hover:border-white/30 hover:scale-105'
                          }`}
                          style={{ background: col.value === 'transparent' ? 'repeating-conic-gradient(#333 0% 25%, #222 0% 50%) 50% / 8px 8px' : col.value }}
                          onClick={() => setBackground(col.value)}
                        />
                      );
                    })}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <label className="py-2 px-3 rounded-lg border border-white/[0.06] hover:border-white/20 flex items-center justify-center gap-2 cursor-pointer bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-150 active:scale-[0.98] text-xs font-medium text-zinc-300 hover:text-white relative overflow-hidden">
                      <Pipette size={13} />
                      <span>Custom Color</span>
                      <input type="color" aria-label="Pick custom background color" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" onChange={(e) => setBackground(e.target.value)} />
                    </label>
                    <label className="py-2 px-3 rounded-lg border border-white/[0.06] hover:border-white/20 flex items-center justify-center gap-2 cursor-pointer bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-150 active:scale-[0.98] text-xs font-medium text-zinc-300 hover:text-white">
                      <Upload size={13} />
                      <span>Upload Image</span>
                      <input type="file" aria-label="Upload custom background image" accept="image/*" className="hidden" onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const reader = new FileReader();
                          reader.onload = (ev) => { if (ev.target?.result) setBackground(`url("${ev.target.result}")`); };
                          reader.readAsDataURL(e.target.files[0]);
                        }
                      }} />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Effects */}
        {leftTab === 'effects' && (
          <div className="animate-in fade-in duration-100 flex flex-col gap-3">
            {/* Section 1: Texture & Noise */}
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => toggleSection('textureNoise')}
                className="flex items-center justify-between w-full h-[26px] min-h-[26px] px-0.5 text-[11px] font-semibold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors group cursor-pointer leading-none"
              >
                <div className="flex items-center gap-1.5">
                  <ChevronDown size={13} className={`shrink-0 text-zinc-500 group-hover:text-zinc-300 transition-transform duration-200 ${expandedSections.textureNoise ? 'rotate-0' : '-rotate-90'}`} />
                  <span className="leading-none">Texture & Noise</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono tabular-nums leading-none">
                  {noiseIntensity > 0 || grainIntensity > 0 ? `${noiseIntensity}%` : 'Off'}
                </span>
              </button>
              
              {expandedSections.textureNoise && (
                <div className="p-3 rounded-xl bg-white/[0.015] border border-white/[0.04] flex flex-col gap-3 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <label className="text-zinc-300 font-medium">Digital Pixel Noise</label>
                      <span className="text-zinc-400 font-mono tabular-nums text-[11px] bg-white/[0.03] px-1.5 py-0.5 rounded-md border border-white/[0.03]">{noiseIntensity}%</span>
                    </div>
                    <Slider min={0} max={100} step={1} value={[noiseIntensity]} onValueChange={(v) => setNoiseIntensity(Array.isArray(v) ? v[0] : v as number)} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <label className="text-zinc-300 font-medium">Film Grain</label>
                      <span className="text-zinc-400 font-mono tabular-nums text-[11px] bg-white/[0.03] px-1.5 py-0.5 rounded-md border border-white/[0.03]">{grainIntensity}%</span>
                    </div>
                    <Slider min={0} max={100} step={1} value={[grainIntensity]} onValueChange={(v) => setGrainIntensity(Array.isArray(v) ? v[0] : v as number)} />
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-2 font-medium">Noise Application Layer</label>
                    <div className="relative grid grid-cols-3 gap-1 bg-white/[0.02] p-1 rounded-lg border border-white/[0.04] isolate">
                      {(() => {
                        const targets = ['canvas', 'image', 'both'];
                        const idx = targets.indexOf(noiseTarget);
                        return (
                          <div 
                            className="absolute top-1 bottom-1 w-[calc((100%-16px)/3)] bg-white/10 border border-white/20 rounded-md shadow-sm ring-1 ring-white/10 transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none -z-10"
                            style={{
                              transform: `translateX(calc(${idx * 100}% + ${idx * 4}px))`,
                              left: '4px'
                            }}
                          />
                        );
                      })()}
                      {['canvas', 'image', 'both'].map((t) => (
                        <button
                          key={t}
                          onClick={() => setNoiseTarget(t)}
                          className={`py-1 text-[11px] font-medium capitalize rounded-md transition-colors duration-200 active:scale-95 text-center cursor-pointer ${
                            noiseTarget === t 
                              ? 'text-white font-semibold' 
                              : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Focus & Blur */}
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => toggleSection('focusBlur')}
                className="flex items-center justify-between w-full h-[26px] min-h-[26px] px-0.5 text-[11px] font-semibold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors group cursor-pointer leading-none"
              >
                <div className="flex items-center gap-1.5">
                  <ChevronDown size={13} className={`shrink-0 text-zinc-500 group-hover:text-zinc-300 transition-transform duration-200 ${expandedSections.focusBlur ? 'rotate-0' : '-rotate-90'}`} />
                  <span className="leading-none">Focus & Blur</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono tabular-nums leading-none">
                  {imageBlur > 0 ? `${imageBlur}px` : 'Sharp'}
                </span>
              </button>
              
              {expandedSections.focusBlur && (
                <div className="p-3 rounded-xl bg-white/[0.015] border border-white/[0.04] flex flex-col gap-3 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <label className="text-zinc-300 font-medium">Backdrop Blur</label>
                      <span className="text-zinc-400 font-mono tabular-nums text-[11px] bg-white/[0.03] px-1.5 py-0.5 rounded-md border border-white/[0.03]">{bgBlur}px</span>
                    </div>
                    <Slider min={0} max={50} step={1} value={[bgBlur]} onValueChange={(v) => setBgBlur(Array.isArray(v) ? v[0] : v as number)} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <label className="text-zinc-300 font-medium">Image Focus Blur</label>
                      <span className="text-zinc-400 font-mono tabular-nums text-[11px] bg-white/[0.03] px-1.5 py-0.5 rounded-md border border-white/[0.03]">{imageBlur}px</span>
                    </div>
                    <Slider min={0} max={20} step={1} value={[imageBlur]} onValueChange={(v) => setImageBlur(Array.isArray(v) ? v[0] : v as number)} />
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Color Filters */}
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => toggleSection('colorFilters')}
                className="flex items-center justify-between w-full h-[26px] min-h-[26px] px-0.5 text-[11px] font-semibold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors group cursor-pointer leading-none"
              >
                <div className="flex items-center gap-1.5">
                  <ChevronDown size={13} className={`shrink-0 text-zinc-500 group-hover:text-zinc-300 transition-transform duration-200 ${expandedSections.colorFilters ? 'rotate-0' : '-rotate-90'}`} />
                  <span className="leading-none">Color Presets</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono tabular-nums leading-none">{FILTERS.length} Filters</span>
              </button>
              
              {expandedSections.colorFilters && (
                <div className="p-3 rounded-xl bg-white/[0.015] border border-white/[0.04] animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="grid grid-cols-2 gap-2">
                    {FILTERS.map((f) => {
                      const isSelected = filter === f.id;
                      return (
                        <button
                          key={f.id}
                          onClick={() => setFilter(f.id)}
                          className={`flex flex-col text-left p-2.5 rounded-lg border transition-all duration-150 active:scale-[0.98] ${
                            isSelected 
                              ? 'bg-white/10 border-white/20 text-white shadow-sm ring-1 ring-white/10' 
                              : 'bg-white/[0.02] border-white/[0.04] text-zinc-400 hover:bg-white/[0.05] hover:border-white/10 hover:text-zinc-200'
                          }`}
                        >
                          <span className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-zinc-300'}`}>{f.name}</span>
                          <span className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">{f.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        </div>
      </aside>

      {/* Main Studio Workspace */}
      <main className="flex-grow flex flex-col bg-bg-dark h-full relative overflow-hidden">
        {/* Top Control Bar */}
        <header className="h-16 border-b border-white/5 bg-panel flex items-center justify-between px-6 z-30 shrink-0">
          <div className="flex items-center">
            <span className="font-bold text-sm tracking-[0.22em] text-white uppercase select-none">
              NOICESS
            </span>
          </div>

          {/* Center Hub: Aspect Ratio + Presets */}
          <div className="flex items-center gap-2">
            {/* Aspect Ratio Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowRatioMenu(!showRatioMenu);
                  setShowPresetsMenu(false);
                }}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/5 text-xs font-medium transition shadow-inner text-zinc-200 hover:text-white"
              >
                <div className="w-4 h-4 flex items-center justify-center text-white shrink-0">
                  {renderAspectBox(aspectStyle)}
                </div>
                <span className="font-semibold text-white">{activeRatioData.name}</span>
                <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-200 ${showRatioMenu ? 'rotate-180 text-white' : ''}`} />
              </button>

              {showRatioMenu && (
                <>
                  {/* Backdrop to close popover on outside click */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowRatioMenu(false)} 
                  />

                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[360px] max-w-[94vw] bg-[#141417] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="max-h-[480px] overflow-y-auto [scrollbar-gutter:stable] p-3 pb-4 flex flex-col gap-3.5">
                      
                      {/* Top Section: Custom Ratio */}
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-0.5">
                          Custom Ratio
                        </span>
                        <div className="p-3 rounded-xl bg-white/[0.015] border border-white/[0.04] flex items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-xs font-medium text-zinc-400">Ratio:</span>
                            <input
                              type="text"
                              inputMode="numeric"
                              aria-label="Custom ratio width"
                              value={customRatioW}
                              onChange={(e) => {
                                const val = Math.max(1, parseInt(e.target.value) || 1);
                                setCustomRatioW(val);
                                setAspectRatio('custom');
                              }}
                              className="w-12 h-7 px-1 bg-black/40 border border-white/10 rounded-md text-center text-xs font-mono tabular-nums text-white focus:outline-none focus:border-white/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              placeholder="16"
                            />
                            <span className="text-zinc-500 text-xs font-bold">:</span>
                            <input
                              type="text"
                              inputMode="numeric"
                              aria-label="Custom ratio height"
                              value={customRatioH}
                              onChange={(e) => {
                                const val = Math.max(1, parseInt(e.target.value) || 1);
                                setCustomRatioH(val);
                                setAspectRatio('custom');
                              }}
                              className="w-12 h-7 px-1 bg-black/40 border border-white/10 rounded-md text-center text-xs font-mono tabular-nums text-white focus:outline-none focus:border-white/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              placeholder="9"
                            />
                          </div>

                          <button
                            onClick={() => {
                              setAspectRatio('custom');
                              setShowRatioMenu(false);
                            }}
                            className="px-3 h-7 rounded-md bg-white hover:bg-zinc-200 text-black text-xs font-semibold shadow-sm transition-colors shrink-0 active:scale-95"
                          >
                            Apply
                          </button>
                        </div>
                      </div>

                      {/* Platform & Standard Ratio Categories */}
                      <div className="flex flex-col gap-3.5">
                        {ASPECT_CATEGORIES.map((cat, idx) => (
                          <div key={idx} className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-0.5">
                              {cat.name}
                            </span>
                            <div className="p-2.5 rounded-xl bg-white/[0.015] border border-white/[0.04]">
                              <div className="grid grid-cols-4 gap-1.5">
                                {cat.ratios.map((r) => {
                                  const isSelected = aspectRatio === r.id;
                                  return (
                                    <button
                                      key={r.id}
                                      onClick={() => { setAspectRatio(r.id); setShowRatioMenu(false); }}
                                      className={`flex flex-col items-center justify-center p-2 rounded-lg text-center transition-all duration-150 active:scale-95 border min-h-[58px] ${
                                        isSelected 
                                          ? 'bg-white/10 border-white/20 text-white font-semibold shadow-sm ring-1 ring-white/10' 
                                          : 'bg-white/[0.02] border-white/[0.04] text-zinc-400 hover:bg-white/[0.05] hover:text-white hover:border-white/10'
                                      }`}
                                      title={`${r.name} - ${r.desc}`}
                                      aria-label={`${r.name} (${r.desc})`}
                                    >
                                      <div className={`w-4 h-4 flex items-center justify-center mb-1 shrink-0 ${isSelected ? 'text-white' : 'text-zinc-400'}`}>
                                        {renderAspectBox(r.aspect)}
                                      </div>
                                      <span className={`text-xs font-mono leading-tight truncate w-full ${isSelected ? 'text-white font-semibold' : 'text-zinc-200'}`}>
                                        {r.name}
                                      </span>
                                      <span className="text-[9px] text-zinc-500 font-mono truncate w-full mt-0.5">
                                        {r.desc}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Presets Popover in Header Center */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowPresetsMenu(!showPresetsMenu);
                  setShowRatioMenu(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/5 text-xs font-medium transition shadow-inner text-zinc-200 hover:text-white"
                title="Custom Presets & Studio Styles"
              >
                <Bookmark size={13} className="text-zinc-300" />
                <span className="font-semibold text-white">Presets</span>
                {customPresets.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-white/10 text-[10px] font-mono flex items-center justify-center text-zinc-300">
                    {customPresets.length}
                  </span>
                )}
                <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-200 ${showPresetsMenu ? 'rotate-180 text-white' : ''}`} />
              </button>

              {showPresetsMenu && (
                <>
                  {/* Backdrop to close popover on outside click */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowPresetsMenu(false)} 
                  />

                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[340px] max-w-[94vw] bg-[#141417] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="max-h-[460px] overflow-y-auto [scrollbar-gutter:stable] p-3 pb-3.5 flex flex-col gap-3.5">
                      
                      {/* Section 1: Save Current Preset */}
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-0.5">
                          Save Current Style
                        </span>
                        <div className="p-2.5 rounded-xl bg-white/[0.015] border border-white/[0.04] flex flex-col gap-2">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={newPresetName}
                              onChange={(e) => setNewPresetName(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleSavePreset(); }}
                              placeholder="Preset Name (e.g. Twitter Hero)"
                              className="flex-1 h-7 px-2 bg-black/40 border border-white/10 rounded-md text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/30"
                            />
                            <button
                              onClick={() => handleSavePreset()}
                              className="h-7 px-2.5 rounded-md bg-white hover:bg-zinc-200 text-black text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors shadow-sm active:scale-95"
                            >
                              <Plus size={12} />
                              <span>Save</span>
                            </button>
                          </div>

                          {presetSavedSuccess && (
                            <div className="flex items-center gap-1.5 text-xs text-zinc-300 bg-white/[0.04] border border-white/10 px-2 py-1 rounded-md animate-in fade-in duration-150">
                              <Check size={12} className="text-white" />
                              <span>Preset saved!</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Section 2: My Custom Presets */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between px-0.5">
                          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                            My Saved Presets
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {customPresets.length} Saved
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white/[0.015] border border-white/[0.04] flex flex-col gap-1.5">
                          {customPresets.length === 0 ? (
                            <div className="py-4 px-2 flex flex-col items-center justify-center text-center gap-1">
                              <Bookmark size={16} className="text-zinc-600 mb-0.5" />
                              <span className="text-xs font-medium text-zinc-400">No saved presets yet</span>
                              <span className="text-[10px] text-zinc-600 max-w-[200px]">
                                Customize your layout, then save it above.
                              </span>
                            </div>
                          ) : (
                            customPresets.map((p) => (
                              <div
                                key={p.id}
                                className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-white/10 flex items-center justify-between gap-2 group transition-all"
                              >
                                <div className="flex flex-col min-w-0 flex-1">
                                  <span className="text-xs font-semibold text-white truncate">
                                    {p.name}
                                  </span>
                                  <span className="text-[9px] text-zinc-500 font-mono truncate mt-0.5">
                                    {p.config.aspectRatio || 'auto'} • {p.config.view || 'standard'}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={() => {
                                      handleApplyPreset(p.config);
                                      setShowPresetsMenu(false);
                                    }}
                                    className="px-2 py-0.5 rounded bg-white hover:bg-zinc-200 text-black text-[10px] font-semibold transition-colors active:scale-95 shadow-sm"
                                  >
                                    Apply
                                  </button>
                                  <button
                                    onClick={() => handleDeletePreset(p.id)}
                                    aria-label={`Delete ${p.name} preset`}
                                    className="w-5 h-5 rounded bg-white/[0.02] hover:bg-white/[0.08] flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Section 3: Curated Studio Presets */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between px-0.5">
                          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                            Curated Styles
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {PRESETS.length} Styles
                          </span>
                        </div>

                        <div className="p-2 rounded-xl bg-white/[0.015] border border-white/[0.04]">
                          <div className="grid grid-cols-2 gap-1.5">
                            {PRESETS.map((p) => (
                              <button
                                key={p.id}
                                onClick={() => {
                                  handleApplyPreset(p.config);
                                  setShowPresetsMenu(false);
                                }}
                                className="flex flex-col text-left p-2 rounded-lg border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 text-zinc-400 hover:text-zinc-200 transition-all duration-150 active:scale-[0.98]"
                              >
                                <span className="text-xs font-semibold text-white truncate w-full">{p.name}</span>
                                <span className="text-[9px] text-zinc-500 truncate w-full mt-0.5">{p.desc}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-3">
            {/* Copy to Clipboard */}
            <button
              onClick={handleCopyClipboard}
              disabled={!image || isExporting}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium border border-white/5 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/5 text-zinc-200 hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.96]"
              title="Copy screenshot to clipboard"
            >
              {copied ? <Check size={14} className="text-white" /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            {/* Clear Button */}
            <button 
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium border border-white/5 text-zinc-400 hover:text-white hover:bg-white/[0.08] hover:border-white/10 transition disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.96]" 
              onClick={() => { setImage(null); setImageSelected(false); setRotation(0); setPos({ x: 0, y: 0 }); }} 
              disabled={!image}
            >
              <Trash2 size={13} />
              <span>Clear</span>
            </button>

            {/* High-End Export Modal Trigger Button */}
            <button 
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-zinc-200 text-black shadow-lg shadow-white/10 hover:shadow-white/20 transition duration-150 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.96]" 
              onClick={() => setShowExportModal(true)} 
              disabled={!image}
            >
              <Download size={14} />
              <span>Export</span>
            </button>
          </div>
        </header>

        {/* Canvas Workspace (Figma / Canva style zoom & pan viewport) */}
        <div 
          ref={workspaceRef}
          data-workspace-bg="true"
          className={`flex-grow flex items-center justify-center overflow-hidden relative select-none ${isPanningWorkspace ? 'cursor-grabbing' : 'cursor-grab'}`}
          onPointerDown={handleWorkspacePointerDown}
          onPointerMove={handleWorkspacePointerMove}
          onPointerUp={handleWorkspacePointerUp}
          onClick={(e) => {
            if (e.target === workspaceRef.current || (e.target as HTMLElement).getAttribute('data-workspace-bg') === 'true') {
              setImageSelected(false);
            }
          }}
        >
          {/* Transformed Canvas Viewport */}
          <div
            className="flex items-center justify-center pointer-events-auto"
            style={{
              transform: `translate(${viewportPan.x}px, ${viewportPan.y}px) scale(${viewportZoom})`,
              transformOrigin: '0 0',
              transition: isPanningWorkspace ? 'none' : 'transform 0.05s cubic-bezier(0,0,0.2,1)',
            }}
          >
            <div 
              ref={canvasRef}
              className={`relative flex items-center justify-center shadow-2xl shrink-0 ${isPanningWorkspace ? 'cursor-grabbing' : 'cursor-grab'}`}
              onClick={() => setImageSelected(false)}
            style={{
              aspectRatio: aspectStyle,
              ...(aspectStyle !== 'auto' ? (
                Number(aspectStyle.split('/')[0]) >= Number(aspectStyle.split('/')[1])
                  ? { width: '800px', maxHeight: '800px' }
                  : { height: '800px', maxWidth: '800px' }
              ) : (image ? { width: '800px', maxHeight: '800px' } : { width: '800px', height: '600px' }))
            }}
          >
            {/* Background Layer (Strictly Clipped, 0 padding) */}
            <div 
              className="absolute inset-0 overflow-hidden z-0 pointer-events-none"
              style={{
                ...(bgBlur === 0 ? (
                  background.startsWith('url(') 
                    ? { backgroundImage: background, backgroundSize: 'cover', backgroundPosition: 'center' }
                    : { background: background }
                ) : {})
              }}
            >
              {bgBlur > 0 && (
                bgImageUrl ? (
                  <div className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center overflow-hidden">
                    <div 
                      className="absolute w-full h-full"
                      style={{
                        top: `-${bgBlur}px`,
                        left: `-${bgBlur}px`,
                        right: `-${bgBlur}px`,
                        bottom: `-${bgBlur}px`,
                        width: `calc(100% + ${bgBlur * 2}px)`,
                        height: `calc(100% + ${bgBlur * 2}px)`,
                      }}
                    >
                      <img 
                        src={bgImageUrl} 
                        alt="" 
                        draggable={false}
                        className="w-full h-full object-cover pointer-events-none"
                        style={{
                          filter: `blur(${bgBlur}px)`,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div 
                    className="absolute pointer-events-none"
                    style={{
                      top: `-${bgBlur}px`,
                      left: `-${bgBlur}px`,
                      right: `-${bgBlur}px`,
                      bottom: `-${bgBlur}px`,
                      width: `calc(100% + ${bgBlur * 2}px)`,
                      height: `calc(100% + ${bgBlur * 2}px)`,
                      background: background,
                      filter: `blur(${bgBlur}px)`,
                    }}
                  />
                )
              )}

              {/* Background Noise & Grain Layer */}
              {(noiseIntensity > 0 || grainIntensity > 0) && (noiseTarget === 'canvas' || noiseTarget === 'both') && (
                <div className="absolute inset-0 pointer-events-none mix-blend-overlay z-0">
                  {noiseIntensity > 0 && (
                    <div className="absolute inset-0" style={{
                      opacity: noiseIntensity / 100,
                      backgroundImage: noiseTexture ? `url("${noiseTexture}")` : 'none',
                      backgroundRepeat: 'repeat',
                      mixBlendMode: 'overlay',
                    }} />
                  )}
                  {grainIntensity > 0 && (
                    <div className="absolute inset-0 mix-blend-soft-light" style={{
                      opacity: grainIntensity / 40,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grainFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.55' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grainFilter)'/%3E%3C/svg%3E")`,
                    }} />
                  )}
                </div>
              )}
            </div>

            {/* 1. Clipped Image Content Container (Applies padding exclusively to content) */}
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none" style={{ padding: `${padding}px` }}>
              {/* Image Frame inside content container */}
              <div 
                ref={imageFrameRef}
                className={`relative group z-10 pointer-events-auto ${isRotating || isDragging || isResizing ? 'transition-none' : 'transition duration-200 ease-out'} flex flex-col justify-center items-center ${!image ? 'w-full h-full' : ''} ${isDragging ? 'cursor-grabbing' : (image ? (isLocked ? 'cursor-default' : 'cursor-move') : 'cursor-default')}`}
                style={{
                  transform: `translate(${pos.x}px, ${pos.y}px) ${activePerspectiveTransform} ${rotation !== 0 ? `rotate(${rotation}deg)` : ''} scale(${scale / 100})`,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Floating image controls (Unclipped, attached directly to frame) */}
                {!isExporting && image && (imageSelected || isRotating) && (
                  <div 
                    data-no-export="true"
                    className="no-export absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-[#1C1C1E] border border-white/5 rounded-md px-2 py-1 shadow-2xl z-[70] pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-200"
                    style={{ bottom: 'calc(100% + 44px)' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                      title="Rotate 90°"
                      onClick={() => setRotation((r) => (r + 90) % 360)}
                    >
                      <RotateCw size={15} />
                    </button>
                    {isEditingRotation ? (
                      <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          inputMode="numeric"
                          autoFocus
                          className="w-12 h-6 px-1 bg-black/70 text-white border border-white/10 rounded text-center text-xs font-mono tabular-nums focus:outline-none focus:ring-1 focus:ring-white/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          value={rotationInput}
                          onChange={(e) => {
                            const v = e.target.value;
                            if (v === '' || v === '-' || !isNaN(Number(v))) {
                              setRotationInput(v);
                            }
                          }}
                          onFocus={(e) => e.target.select()}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const val = parseFloat(rotationInput);
                              if (!isNaN(val)) {
                                setRotation(((Math.round(val) % 360) + 360) % 360);
                              }
                              setIsEditingRotation(false);
                            } else if (e.key === 'Escape') {
                              setIsEditingRotation(false);
                            }
                          }}
                          onBlur={() => {
                            const val = parseFloat(rotationInput);
                            if (!isNaN(val)) {
                              setRotation(((Math.round(val) % 360) + 360) % 360);
                            }
                            setIsEditingRotation(false);
                          }}
                        />
                        <span className="text-[11px] font-mono tabular-nums text-white/50 ml-0.5">°</span>
                      </div>
                    ) : (
                      <button 
                        className="text-[11px] font-mono tabular-nums font-medium text-white/80 px-1.5 py-0.5 rounded bg-white/5 cursor-text hover:text-white hover:bg-white/10 hover:border-white/5 border border-transparent transition"
                        title="Click to manually enter degree"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRotationInput(String(rotation));
                          setIsEditingRotation(true);
                        }}
                      >
                        {rotation}°
                      </button>
                    )}
                    <div className="w-px h-4 bg-white/15 mx-0.5" />
                    <button
                      className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                      title="Minimize / Scale Down (-15%)"
                      onClick={() => setScale((s) => Math.max(s - 15, 20))}
                    >
                      <Minimize2 size={14} />
                    </button>
                    <button
                      className="text-[11px] font-mono tabular-nums font-medium text-white/70 px-1.5 py-0.5 rounded bg-white/5 hover:text-white hover:bg-white/10 transition-colors"
                      title="Click to reset size (100%)"
                      onClick={() => setScale(100)}
                    >
                      {Math.round(scale)}%
                    </button>
                    <button
                      className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                      title="Maximize / Scale Up (+15%)"
                      onClick={() => setScale((s) => Math.min(s + 15, 300))}
                    >
                      <Maximize2 size={14} />
                    </button>
                    <div className="w-px h-4 bg-white/15 mx-0.5" />
                    <button
                      className={`flex items-center justify-center w-7 h-7 rounded-md transition-colors ${
                        isLocked 
                          ? 'bg-white/20 text-white' 
                          : 'hover:bg-white/10 text-white/80 hover:text-white'
                      }`}
                      title={isLocked ? "Unlock Position (Currently Locked)" : "Lock Position on Canvas"}
                      onClick={() => setIsLocked(!isLocked)}
                    >
                      {isLocked ? <Lock size={14} className="text-white" /> : <Unlock size={14} />}
                    </button>
                    <div className="w-px h-4 bg-white/15 mx-0.5" />
                    <button
                      className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                      title="Remove image"
                      onClick={() => { setImage(null); setImageSelected(false); setRotation(0); setPos({ x: 0, y: 0 }); }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}

                {/* Screenshot Card Container */}
                <div 
                  className={`relative flex flex-col ${!image ? 'w-full h-full' : ''} ${image && isDragging ? 'opacity-90 transition-none cursor-grabbing' : image ? 'cursor-grab' : ''}`}
                  style={image ? {
                    borderRadius: `${radius}px`,
                    boxShadow: activePerspectiveTransform 
                      ? `20px 20px ${shadow * 3}px rgba(0,0,0,0.45)` 
                      : `0 ${shadow}px ${shadow * 2}px rgba(0,0,0,0.35)`,
                    border: glassBorder ? `1px solid rgba(${glassRgb}, ${glassBorderOpacity / 100})` : 'none',
                    background: glassBorder ? `rgba(${glassRgb}, ${(glassBorderOpacity / 100) * 0.25})` : 'transparent',
                    backdropFilter: glassBorder && glassBorderBlur > 0 ? `blur(${glassBorderBlur}px)` : 'none',
                    WebkitBackdropFilter: glassBorder && glassBorderBlur > 0 ? `blur(${glassBorderBlur}px)` : 'none',
                    clipPath: glassBorder ? `inset(0 round ${radius}px)` : undefined,
                    WebkitClipPath: glassBorder ? `inset(0 round ${radius}px)` : undefined,
                    padding: glassBorder ? `${glassBorderWidth}px` : '0',
                    isolation: 'isolate',
                  } : {}}
                  onClick={(e) => { if (image) { e.stopPropagation(); setImageSelected(true); } }}
                  onPointerDown={image ? handlePointerDown : undefined}
                  onPointerMove={image ? handlePointerMove : undefined}
                  onPointerUp={image ? handlePointerUp : undefined}
                >
                  {/* Clipped screenshot content */}
                  <div className={`relative flex flex-col overflow-hidden w-full h-full ${image ? 'bg-[#18181b]' : ''}`} style={{ borderRadius: `${Math.max(0, radius - (glassBorder ? glassBorderWidth : 0))}px` }}>
                    {/* Image Noise & Grain Layer */}
                    {image && (noiseIntensity > 0 || grainIntensity > 0) && (noiseTarget === 'image' || noiseTarget === 'both') && (
                      <div className="absolute inset-0 pointer-events-none mix-blend-overlay z-20">
                        {noiseIntensity > 0 && (
                          <div className="absolute inset-0" style={{
                            opacity: noiseIntensity / 100,
                            backgroundImage: noiseTexture ? `url("${noiseTexture}")` : 'none',
                            backgroundRepeat: 'repeat',
                            mixBlendMode: 'overlay',
                          }} />
                        )}
                        {grainIntensity > 0 && (
                          <div className="absolute inset-0 mix-blend-soft-light" style={{
                            opacity: grainIntensity / 40,
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grainFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.55' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grainFilter)'/%3E%3C/svg%3E")`,
                          }} />
                        )}
                      </div>
                    )}

                    {image && showMacOsBar && (
                      <div 
                        className={`shrink-0 h-10 bg-[#1C1C1E] flex items-center px-4 gap-3 ${view === 'browser' ? 'border-b border-white/10' : ''}`}
                        style={{ borderRadius: glassBorder ? `${Math.max(0, radius - glassBorderWidth)}px ${Math.max(0, radius - glassBorderWidth)}px 0 0` : '0' }}
                      >
                        <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                        </div>
                        {view === 'browser' && (
                          <div className="flex-grow flex justify-center ml-2">
                            <div className="bg-black/20 rounded-md h-6 w-2/3 max-w-sm flex items-center justify-center text-xs text-white/50 border border-white/5 shadow-inner">
                              example.com
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {image ? (
                      <div 
                        className="relative overflow-hidden w-full h-full bg-[#18181b]" 
                        style={{ 
                          contain: 'paint', 
                          isolation: 'isolate',
                          backgroundImage: `url("${image}")`,
                          backgroundSize: 'contain',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                        }}
                      >
                        <img src={image} alt="Uploaded screenshot" draggable={false} className="max-w-full max-h-full object-contain block transition relative z-10" style={{
                          borderRadius: showMacOsBar 
                            ? `0 0 ${glassBorder ? Math.max(0, radius - glassBorderWidth) : radius}px ${glassBorder ? Math.max(0, radius - glassBorderWidth) : radius}px` 
                            : `${glassBorder ? Math.max(0, radius - glassBorderWidth) : radius}px`,
                          filter: getFilterStyle(),
                        }} />
                        
                        {/* Watermark Overlay on Screenshot */}
                        {watermark && watermarkTarget === 'screenshot' && (
                          <div 
                            className={`absolute pointer-events-none z-20 w-fit max-w-full inline-flex isolate ${
                              watermarkPosition === 'bottom-right' ? 'bottom-4 right-4' :
                              watermarkPosition === 'bottom-left' ? 'bottom-4 left-4' :
                              watermarkPosition === 'bottom-center' ? 'bottom-4 left-1/2 -translate-x-1/2' :
                              'top-4 right-4'
                            }`}
                          >
                            <div 
                              className="px-3.5 py-1.5 rounded-full text-[11px] font-medium tracking-wide inline-flex items-center gap-1.5 whitespace-nowrap overflow-hidden leading-none select-none shrink-0"
                              style={{
                                transform: watermarkScale !== 100 ? `scale(${watermarkScale / 100})` : undefined,
                                transformOrigin: watermarkPosition.includes('right') ? 'right center' : watermarkPosition.includes('left') ? 'left center' : 'center center',
                                background: `rgba(255, 255, 255, 0.18)`,
                                border: `1px solid rgba(${glassRgb}, ${glassBorder ? (glassBorderOpacity / 100) * 0.75 : 0.22})`,
                                backdropFilter: !isExporting && watermarkBlur > 0 ? `blur(${watermarkBlur}px)` : 'none',
                                WebkitBackdropFilter: !isExporting && watermarkBlur > 0 ? `blur(${watermarkBlur}px)` : 'none',
                                boxShadow: '0 2px 10px 0 rgba(0, 0, 0, 0.25)',
                                borderRadius: '9999px',
                                clipPath: 'inset(0 round 9999px)',
                                WebkitClipPath: 'inset(0 round 9999px)',
                                color: '#ffffff',
                                boxSizing: 'border-box',
                                isolation: 'isolate',
                              }}
                            >
                              <div className="shrink-0 flex items-center justify-center">
                                {renderPlatformIcon(watermarkPlatform, 11)}
                              </div>
                              <span className="leading-none">{watermarkPlatform === 'x' && !watermark.startsWith('@') ? `@${watermark}` : watermark}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <label className={`flex-grow flex flex-col items-center justify-center gap-4 text-white drop-shadow-md w-full h-full cursor-pointer transition relative z-10 rounded-xl ${background === 'transparent' ? 'border-2 border-dashed border-white/5 bg-black/20 backdrop-blur-md hover:bg-white/10 hover:border-white/5' : 'hover:bg-white/5'}`}>
                        <Upload size={48} className="opacity-70 text-zinc-400" />
                        <h2 className="text-xl font-semibold text-balance">Drop an image here</h2>
                        <p className="opacity-80 text-sm">Or paste from clipboard (Ctrl+V)</p>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    )}
                  </div>

                  {/* Selection Outline & Corner Handles (Directly on Screenshot with 0 gap) */}
                  {!isExporting && image && (
                    <div 
                      data-no-export="true"
                      className={`no-export absolute inset-0 pointer-events-none transition-opacity duration-200 z-50 ${isResizing || isRotating || imageSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                    >
                      {/* Outline box */}
                      <div 
                        className={`absolute inset-0 border-2 pointer-events-none shadow-sm transition-colors ${isLocked ? 'border-white/40 border-dashed' : 'border-white/20'}`} 
                        style={{ borderRadius: `${radius}px` }} 
                      />

                      {/* Locked Badge Pill */}
                      {isLocked && (
                        <div className="absolute top-2 right-2 bg-black/80 border border-white/20 text-white text-[10px] font-mono tabular-nums font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg z-50 pointer-events-none">
                          <Lock size={10} className="text-white" />
                          <span>LOCKED</span>
                        </div>
                      )}

                      {/* Corner Resize Handles & Rotation Knob (Only active when NOT locked) */}
                      {!isLocked && (
                        <>
                          <div 
                            className="absolute -top-2 -left-2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-white/10 pointer-events-auto cursor-nwse-resize hover:scale-125 active:scale-110 transition-transform z-50" 
                            onPointerDown={(e) => handleResizeDown(e, 'tl')} 
                            title="Drag to minimize / maximize size" 
                          />
                          <div 
                            className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-white/10 pointer-events-auto cursor-nesw-resize hover:scale-125 active:scale-110 transition-transform z-50" 
                            onPointerDown={(e) => handleResizeDown(e, 'tr')} 
                            title="Drag to minimize / maximize size" 
                          />
                          <div 
                            className="absolute -bottom-2 -left-2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-white/10 pointer-events-auto cursor-nesw-resize hover:scale-125 active:scale-110 transition-transform z-50" 
                            onPointerDown={(e) => handleResizeDown(e, 'bl')} 
                            title="Drag to minimize / maximize size" 
                          />
                          <div 
                            className="absolute -bottom-2 -right-2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-white/10 pointer-events-auto cursor-nwse-resize hover:scale-125 active:scale-110 transition-transform z-50" 
                            onPointerDown={(e) => handleResizeDown(e, 'br')} 
                            title="Drag to minimize / maximize size" 
                          />

                          {/* Top Rotation Stalk & Knob */}
                          <div className="absolute -top-9 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto z-50">
                            <div 
                              role="slider"
                              aria-label="Rotate Image drag handle"
                              aria-valuemin={0}
                              aria-valuemax={360}
                              aria-valuenow={rotation}
                              tabIndex={0}
                              className="w-6 h-6 rounded-full bg-white text-black shadow-lg border border-black/20 flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-115 transition-transform"
                              title="Drag to rotate (Hold Shift for 15° snap)"
                              onPointerDown={handleRotateDown}
                            >
                              <RotateCw size={12} className="text-black/80" aria-hidden="true" />
                            </div>
                            <div className="w-0.5 h-3 bg-white/50" />
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Snap guides */}
            {!isExporting && isDragging && pos.x === 0 && <div data-no-export="true" className="no-export absolute top-0 bottom-0 left-1/2 w-px bg-white/40 z-50 pointer-events-none drop-shadow-md" />}
            {!isExporting && isDragging && pos.y === 0 && <div data-no-export="true" className="no-export absolute left-0 right-0 top-1/2 h-px bg-white/40 z-50 pointer-events-none drop-shadow-md" />}
            
            {watermark && watermarkTarget === 'canvas' && (
              <div 
                className={`absolute pointer-events-none z-20 w-fit max-w-full inline-flex isolate ${
                  watermarkPosition === 'bottom-right' ? 'bottom-6 right-6' :
                  watermarkPosition === 'bottom-left' ? 'bottom-6 left-6' :
                  watermarkPosition === 'bottom-center' ? 'bottom-6 left-1/2 -translate-x-1/2' :
                  'top-6 right-6'
                }`}
              >
                <div 
                  className="px-4 py-2 rounded-full text-xs font-medium tracking-wide inline-flex items-center gap-1.5 whitespace-nowrap overflow-hidden leading-none select-none shrink-0"
                  style={{
                    transform: watermarkScale !== 100 ? `scale(${watermarkScale / 100})` : undefined,
                    transformOrigin: watermarkPosition.includes('right') ? 'right center' : watermarkPosition.includes('left') ? 'left center' : 'center center',
                    background: `rgba(255, 255, 255, 0.15)`,
                    border: `1px solid rgba(${glassRgb}, ${glassBorder ? (glassBorderOpacity / 100) * 0.75 : 0.22})`,
                    backdropFilter: watermarkBlur > 0 ? `blur(${watermarkBlur}px)` : 'none',
                    WebkitBackdropFilter: watermarkBlur > 0 ? `blur(${watermarkBlur}px)` : 'none',
                    boxShadow: '0 2px 10px 0 rgba(0, 0, 0, 0.25)',
                    borderRadius: '9999px',
                    clipPath: 'inset(0 round 9999px)',
                    WebkitClipPath: 'inset(0 round 9999px)',
                    color: '#ffffff',
                    boxSizing: 'border-box',
                    isolation: 'isolate',
                  }}
                >
                  <div className="shrink-0 flex items-center justify-center">
                    {renderPlatformIcon(watermarkPlatform, 12)}
                  </div>
                  <span className="leading-none">{watermarkPlatform === 'x' && !watermark.startsWith('@') ? `@${watermark}` : watermark}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Floating Viewport Zoom HUD Controls (Bottom Center) */}
        <div 
          data-no-export="true"
          className="no-export absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#1C1C1E]/90 border border-white/5 backdrop-blur-md rounded-lg px-2 py-1 shadow-2xl z-40"
        >
          <button
            onClick={() => zoomCanvasAtCenter(0.85)}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
            title="Zoom Out (Scroll Down)"
          >
            <ZoomOut size={14} />
          </button>
          <button
            onClick={resetViewport}
            className="px-2 py-1 text-[11px] font-mono tabular-nums font-medium text-zinc-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
            title="Reset Zoom to 100%"
          >
            {Math.round(viewportZoom * 100)}%
          </button>
          <button
            onClick={() => zoomCanvasAtCenter(1.15)}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
            title="Zoom In (Scroll Up)"
          >
            <ZoomIn size={14} />
          </button>
          <div className="w-px h-4 bg-white/15 mx-1" />
          <button
            onClick={resetViewport}
            className="px-2 py-1 text-[11px] font-medium text-white hover:text-zinc-200 hover:bg-white/5 rounded-md transition-colors"
            title="Reset View"
          >
            Reset
          </button>
        </div>
      </div>
    </main>

      {/* Right Sidebar - 3D Camera, Studio Presets & Collapsible Studio Controls */}
      <aside className="w-[300px] min-w-[300px] bg-panel border-l border-white/5 flex flex-col z-20 shadow-lg select-none h-full overflow-hidden">
        {/* Top Header Bar aligned with h-16 main header */}
        <div className="h-16 border-b border-white/5 px-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Orbit size={14} className="text-zinc-300" />
            <span className="text-xs font-semibold text-zinc-200 tracking-tight">Camera & Angles</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">3D Studio</span>
        </div>

        {/* Scrollable Content Container with clean symmetrical padding */}
        <div className="flex-1 overflow-y-auto [scrollbar-gutter:stable] p-3 pb-8 flex flex-col gap-3">
          {/* Section 1: 3D Camera & XYZ Orbit */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between w-full h-[26px] min-h-[26px] px-0.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider leading-none">
              <button
                onClick={() => toggleSection('perspectives')}
                className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors group cursor-pointer leading-none"
              >
                <ChevronDown size={13} className={`shrink-0 text-zinc-500 group-hover:text-zinc-300 transition-transform duration-200 ${expandedSections.perspectives ? 'rotate-0' : '-rotate-90'}`} />
                <span className="leading-none">3D Orbit & Tilt</span>
              </button>
              {(rotateX !== 0 || rotateY !== 0 || rotateZ !== 0) ? (
                <button 
                  onClick={reset3D}
                  aria-label="Reset 3D rotation to flat"
                  className="text-[10px] text-zinc-400 hover:text-white font-mono flex items-center gap-1 bg-white/[0.04] hover:bg-white/[0.08] px-1.5 py-0.5 rounded border border-white/[0.04] transition-colors leading-none cursor-pointer"
                >
                  <RefreshCw size={9} />
                  <span>Reset</span>
                </button>
              ) : (
                <span className="text-[10px] text-zinc-500 font-mono tabular-nums leading-none">0° Flat</span>
              )}
            </div>

            {expandedSections.perspectives && (
              <div className="p-3 rounded-xl bg-white/[0.015] border border-white/[0.04] flex flex-col gap-3 animate-in fade-in slide-in-from-top-1 duration-150">
                {/* Rotate X */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <label className="text-zinc-300 font-medium flex items-center gap-1.5">
                      <RotateCw size={12} className="text-zinc-400" />
                      <span>Pitch (X-Axis)</span>
                    </label>
                    <div className="flex items-center gap-1">
                      <input 
                        type="text"
                        inputMode="numeric"
                        aria-label="Pitch angle"
                        value={rotateX}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val)) setRotateX(Math.max(-60, Math.min(60, Math.round(val))));
                          else if (e.target.value === '' || e.target.value === '-') setRotateX(0);
                        }}
                        className="w-10 h-5 px-1 bg-white/[0.02] border border-white/5 rounded-md text-center text-[11px] font-mono tabular-nums text-zinc-300 focus:text-white focus:outline-none focus:border-white/20 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-[11px] text-zinc-400 font-mono">°</span>
                    </div>
                  </div>
                  <Slider 
                    min={-60} 
                    max={60} 
                    step={1} 
                    value={[rotateX]} 
                    onValueChange={(v) => {
                      setRotateX(Array.isArray(v) ? v[0] : v as number);
                      setPerspective('custom');
                    }} 
                  />
                </div>

                {/* Rotate Y */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <label className="text-zinc-300 font-medium flex items-center gap-1.5">
                      <RotateCcw size={12} className="text-zinc-400" />
                      <span>Yaw (Y-Axis)</span>
                    </label>
                    <div className="flex items-center gap-1">
                      <input 
                        type="text"
                        inputMode="numeric"
                        aria-label="Yaw angle"
                        value={rotateY}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val)) setRotateY(Math.max(-60, Math.min(60, Math.round(val))));
                          else if (e.target.value === '' || e.target.value === '-') setRotateY(0);
                        }}
                        className="w-10 h-5 px-1 bg-white/[0.02] border border-white/5 rounded-md text-center text-[11px] font-mono tabular-nums text-zinc-300 focus:text-white focus:outline-none focus:border-white/20 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-[11px] text-zinc-400 font-mono">°</span>
                    </div>
                  </div>
                  <Slider 
                    min={-60} 
                    max={60} 
                    step={1} 
                    value={[rotateY]} 
                    onValueChange={(v) => {
                      setRotateY(Array.isArray(v) ? v[0] : v as number);
                      setPerspective('custom');
                    }} 
                  />
                </div>

                {/* Rotate Z */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <label className="text-zinc-300 font-medium flex items-center gap-1.5">
                      <Compass size={12} className="text-zinc-400" />
                      <span>Roll (Z-Axis)</span>
                    </label>
                    <div className="flex items-center gap-1">
                      <input 
                        type="text"
                        inputMode="numeric"
                        aria-label="Roll angle"
                        value={rotateZ}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val)) setRotateZ(Math.max(-45, Math.min(45, Math.round(val))));
                          else if (e.target.value === '' || e.target.value === '-') setRotateZ(0);
                        }}
                        className="w-10 h-5 px-1 bg-white/[0.02] border border-white/5 rounded-md text-center text-[11px] font-mono tabular-nums text-zinc-300 focus:text-white focus:outline-none focus:border-white/20 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-[11px] text-zinc-400 font-mono">°</span>
                    </div>
                  </div>
                  <Slider 
                    min={-45} 
                    max={45} 
                    step={1} 
                    value={[rotateZ]} 
                    onValueChange={(v) => {
                      setRotateZ(Array.isArray(v) ? v[0] : v as number);
                      setPerspective('custom');
                    }} 
                  />
                </div>

                {/* Camera Depth */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <label className="text-zinc-300 font-medium flex items-center gap-1.5">
                      <Eye size={12} className="text-zinc-400" />
                      <span>Camera Depth</span>
                    </label>
                    <span className="text-zinc-400 font-mono tabular-nums text-[11px] bg-white/[0.03] px-1.5 py-0.5 rounded-md border border-white/[0.03]">{perspectiveDepth}px</span>
                  </div>
                  <Slider 
                    min={500} 
                    max={2500} 
                    step={50} 
                    value={[perspectiveDepth]} 
                    onValueChange={(v) => {
                      setPerspectiveDepth(Array.isArray(v) ? v[0] : v as number);
                      setPerspective('custom');
                    }} 
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Perspective Presets */}
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => toggleSection('themes')}
              className="flex items-center justify-between w-full h-[26px] min-h-[26px] px-0.5 text-[11px] font-semibold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors group cursor-pointer leading-none"
            >
              <div className="flex items-center gap-1.5">
                <ChevronDown size={13} className={`shrink-0 text-zinc-500 group-hover:text-zinc-300 transition-transform duration-200 ${expandedSections.themes ? 'rotate-0' : '-rotate-90'}`} />
                <span className="leading-none">Angles & Perspective</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono tabular-nums leading-none">{PERSPECTIVES.length} Angles</span>
            </button>

            {expandedSections.themes && (
              <div className="p-3 rounded-xl bg-white/[0.015] border border-white/[0.04] flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-1 duration-150">
                {PERSPECTIVES.map((p) => {
                  const isActive = perspective === p.id && rotateX === p.rx && rotateY === p.ry && rotateZ === p.rz;
                  return (
                    <button
                      key={p.id}
                      onClick={() => applyPerspectivePreset(p)}
                      className={`flex flex-col rounded-lg border transition-all duration-150 active:scale-[0.98] overflow-hidden group shadow-sm ${
                        isActive 
                          ? 'bg-white/10 border-white/20 ring-1 ring-white/10 shadow-md' 
                          : 'bg-white/[0.02] border-white/[0.04] hover:border-white/20 hover:bg-white/[0.05]'
                      }`}
                      title={p.desc}
                      aria-label={p.name}
                    >
                      {/* Clean Minimal Preview Box - Full Width */}
                      <div className="w-full h-24 flex items-center justify-center p-3 relative overflow-hidden bg-black/30">
                        {image ? (
                          <div 
                            className="w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                            style={{ transform: p.previewTransform || p.transform }}
                          >
                            <img 
                              src={image} 
                              alt={p.name} 
                              className="max-w-full max-h-full object-contain rounded shadow-lg border border-white/10" 
                            />
                          </div>
                        ) : (
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 ${isActive ? 'text-white' : 'text-zinc-500'}`}>
                            <p.icon size={16} aria-hidden="true" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 3: Window Chrome */}
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => toggleSection('templates')}
              className="flex items-center justify-between w-full h-[26px] min-h-[26px] px-0.5 text-[11px] font-semibold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors group cursor-pointer leading-none"
            >
              <div className="flex items-center gap-1.5">
                <ChevronDown size={13} className={`shrink-0 text-zinc-500 group-hover:text-zinc-300 transition-transform duration-200 ${expandedSections.templates ? 'rotate-0' : '-rotate-90'}`} />
                <span className="leading-none">Window Chrome</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono tabular-nums leading-none">4 Themes</span>
            </button>

            {expandedSections.templates && (
              <div className="p-3 rounded-xl bg-white/[0.015] border border-white/[0.04] flex flex-col gap-2 animate-in fade-in slide-in-from-top-1 duration-150">
                <button 
                  onClick={() => { setView('default'); setShowMacOsBar(true); setGlassBorder(false); }}
                  className={`flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all duration-150 active:scale-[0.98] ${
                    view === 'default' && showMacOsBar && !glassBorder 
                      ? 'bg-white/10 border-white/20 text-white shadow-sm ring-1 ring-white/10' 
                      : 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.05] hover:border-white/10 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="w-7 h-7 rounded-md bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0">
                    <Laptop size={14} className="text-white" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-white">Default macOS</span>
                    <span className="text-[10px] text-zinc-500">Standard window bar</span>
                  </div>
                </button>

                <button 
                  onClick={() => { setView('browser'); setShowMacOsBar(true); setGlassBorder(false); }}
                  className={`flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all duration-150 active:scale-[0.98] ${
                    view === 'browser' 
                      ? 'bg-white/10 border-white/20 text-white shadow-sm ring-1 ring-white/10' 
                      : 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.05] hover:border-white/10 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="w-7 h-7 rounded-md bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0">
                    <Globe size={14} className="text-zinc-300" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-white">Web Browser</span>
                    <span className="text-[10px] text-zinc-500">Safari URL address bar</span>
                  </div>
                </button>

                <button 
                  onClick={() => { setView('minimal'); setShowMacOsBar(false); setGlassBorder(false); }}
                  className={`flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all duration-150 active:scale-[0.98] ${
                    view === 'minimal' && !showMacOsBar && !glassBorder 
                    ? 'bg-white/10 border-white/20 text-white shadow-sm ring-1 ring-white/10' 
                    : 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.05] hover:border-white/10 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="w-7 h-7 rounded-md bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0">
                    <Square size={14} className="text-zinc-300" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-white">Minimal Frameless</span>
                    <span className="text-[10px] text-zinc-500">Zero chrome focus</span>
                  </div>
                </button>

                <button 
                  onClick={() => { 
                    setView('default'); 
                    setShowMacOsBar(true); 
                    setGlassBorder(true); 
                    setGlassBorderWidth(10); 
                    setGlassBorderOpacity(40); 
                    setPerspective('isometric-left');
                    setRotateX(15);
                    setRotateY(-20);
                    setRotateZ(2);
                    setPerspectiveDepth(1200);
                  }}
                  className={`flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all duration-150 active:scale-[0.98] ${
                    glassBorder 
                      ? 'bg-white/10 border-white/20 text-white shadow-sm ring-1 ring-white/10' 
                      : 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.05] hover:border-white/10 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="w-7 h-7 rounded-md bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0">
                    <Layers size={14} className="text-zinc-300" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-white">3D Frosted Glass</span>
                    <span className="text-[10px] text-zinc-500">Glass border + 3D angle</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Section 4: Studio Lighting & Manual Sliders */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between w-full h-[26px] min-h-[26px] px-0.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider leading-none">
              <button
                onClick={() => toggleSection('filters')}
                className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors group cursor-pointer leading-none"
              >
                <ChevronDown size={13} className={`shrink-0 text-zinc-500 group-hover:text-zinc-300 transition-transform duration-200 ${expandedSections.filters ? 'rotate-0' : '-rotate-90'}`} />
                <span className="leading-none">Studio Lighting</span>
              </button>
              {isCustomLighting ? (
                <button 
                  onClick={resetLighting}
                  aria-label="Reset lighting adjustments to default"
                  className="text-[10px] text-zinc-400 hover:text-white font-mono flex items-center gap-1 bg-white/[0.04] hover:bg-white/[0.08] px-1.5 py-0.5 rounded border border-white/[0.04] transition-colors leading-none cursor-pointer"
                >
                  <RefreshCw size={9} />
                  <span>Reset</span>
                </button>
              ) : (
                <span className="text-[10px] text-zinc-500 font-mono tabular-nums leading-none">Standard</span>
              )}
            </div>

            {expandedSections.filters && (
              <div className="p-3 rounded-xl bg-white/[0.015] border border-white/[0.04] flex flex-col gap-3.5 animate-in fade-in slide-in-from-top-1 duration-150">
                {/* Manual Adjustments Sliders */}
                <div className="flex flex-col gap-3">
                  {/* Brightness */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <label className="text-zinc-300 font-medium flex items-center gap-1.5">
                        <Sun size={12} className="text-zinc-400" />
                        <span>Brightness</span>
                      </label>
                      <span className="text-zinc-400 font-mono tabular-nums text-[11px] bg-white/[0.03] px-1.5 py-0.5 rounded-md border border-white/[0.03]">{brightness}%</span>
                    </div>
                    <Slider min={50} max={150} step={1} value={[brightness]} onValueChange={(v) => setBrightness(Array.isArray(v) ? v[0] : v as number)} />
                  </div>

                  {/* Contrast */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <label className="text-zinc-300 font-medium flex items-center gap-1.5">
                        <Sliders size={12} className="text-zinc-400" />
                        <span>Contrast</span>
                      </label>
                      <span className="text-zinc-400 font-mono tabular-nums text-[11px] bg-white/[0.03] px-1.5 py-0.5 rounded-md border border-white/[0.03]">{contrast}%</span>
                    </div>
                    <Slider min={50} max={150} step={1} value={[contrast]} onValueChange={(v) => setContrast(Array.isArray(v) ? v[0] : v as number)} />
                  </div>

                  {/* Saturation */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <label className="text-zinc-300 font-medium flex items-center gap-1.5">
                        <Droplet size={12} className="text-zinc-400" />
                        <span>Saturation</span>
                      </label>
                      <span className="text-zinc-400 font-mono tabular-nums text-[11px] bg-white/[0.03] px-1.5 py-0.5 rounded-md border border-white/[0.03]">{saturation}%</span>
                    </div>
                    <Slider min={0} max={200} step={1} value={[saturation]} onValueChange={(v) => setSaturation(Array.isArray(v) ? v[0] : v as number)} />
                  </div>

                  {/* Hue Shift / Tone */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <label className="text-zinc-300 font-medium flex items-center gap-1.5">
                        <Palette size={12} className="text-zinc-400" />
                        <span>Color Tone (Hue)</span>
                      </label>
                      <span className="text-zinc-400 font-mono tabular-nums text-[11px] bg-white/[0.03] px-1.5 py-0.5 rounded-md border border-white/[0.03]">{hueRotate}°</span>
                    </div>
                    <Slider min={0} max={360} step={1} value={[hueRotate]} onValueChange={(v) => setHueRotate(Array.isArray(v) ? v[0] : v as number)} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Export Quality & Format Panel (Modal) */}
      {showExportModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setShowExportModal(false)}
        >
          <div 
            className="bg-[#141417] border border-white/10 rounded-2xl w-full max-w-[380px] p-4.5 shadow-2xl flex flex-col gap-3.5 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Download size={15} className="text-zinc-300" />
                <h2 className="text-xs font-semibold text-white tracking-tight">Export Studio Image</h2>
              </div>
              <button 
                onClick={() => setShowExportModal(false)}
                className="w-6 h-6 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors active:scale-95"
                aria-label="Close Export Modal"
              >
                <X size={13} aria-hidden="true" />
              </button>
            </div>

            {/* Resolution / Quality Selection (4 in a row) */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-0.5">
                Resolution
              </span>
              <div className="relative grid grid-cols-4 gap-1.5 bg-white/[0.015] border border-white/[0.04] p-2 rounded-xl isolate">
                {(() => {
                  const scales = [1, 2, 3, 4];
                  const idx = scales.indexOf(exportScale);
                  return (
                    <div 
                      className="absolute top-2 bottom-2 w-[calc((100%-34px)/4)] bg-white/10 border border-white/20 rounded-lg shadow-sm transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none -z-10"
                      style={{
                        transform: `translateX(calc(${idx * 100}% + ${idx * 6}px))`,
                        left: '8px'
                      }}
                    />
                  );
                })()}
                {[
                  { val: 1, label: '1x', desc: '1080p' },
                  { val: 2, label: '2x', desc: '2K' },
                  { val: 3, label: '3x', desc: '4K' },
                  { val: 4, label: '4x', desc: '6K' }
                ].map((res) => {
                  const isSelected = exportScale === res.val;
                  return (
                    <button
                      key={res.val}
                      onClick={() => setExportScale(res.val)}
                      className="flex flex-col items-center justify-center p-2 rounded-lg text-center transition-colors duration-200 active:scale-95 cursor-pointer"
                    >
                      <span className={`text-xs font-mono leading-tight ${isSelected ? 'text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'}`}>
                        {res.label}
                      </span>
                      <span className="text-[9px] text-zinc-500 font-mono mt-0.5">
                        {res.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Format Selection (3 in a row) */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-0.5">
                Format
              </span>
              <div className="relative grid grid-cols-3 gap-1.5 bg-white/[0.015] border border-white/[0.04] p-2 rounded-xl isolate">
                {(() => {
                  const formats = ['png', 'jpeg', 'webp'];
                  const idx = formats.indexOf(exportFormat);
                  return (
                    <div 
                      className="absolute top-2 bottom-2 w-[calc((100%-28px)/3)] bg-white/10 border border-white/20 rounded-lg shadow-sm transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none -z-10"
                      style={{
                        transform: `translateX(calc(${idx * 100}% + ${idx * 6}px))`,
                        left: '8px'
                      }}
                    />
                  );
                })()}
                {[
                  { id: 'png', name: 'PNG', desc: 'Lossless' },
                  { id: 'jpeg', name: 'JPG', desc: 'Standard' },
                  { id: 'webp', name: 'WebP', desc: 'Compact' },
                ].map((fmt) => {
                  const isSelected = exportFormat === fmt.id;
                  return (
                    <button
                      key={fmt.id}
                      onClick={() => setExportFormat(fmt.id as any)}
                      className="flex flex-col items-center justify-center p-2 rounded-lg text-center transition-colors duration-200 active:scale-95 cursor-pointer"
                    >
                      <span className={`text-xs font-mono leading-tight ${isSelected ? 'text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'}`}>
                        {fmt.name}
                      </span>
                      <span className="text-[9px] text-zinc-500 font-mono mt-0.5">
                        {fmt.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filename Preview */}
            <div className="p-2.5 px-3 rounded-xl bg-white/[0.015] border border-white/[0.04] flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">Filename</span>
              <span className="font-mono tabular-nums text-zinc-300 text-[11px] font-medium bg-white/[0.03] px-2 py-0.5 rounded-md border border-white/[0.04]">
                noicess-XXXXXX.{exportFormat === 'jpeg' ? 'jpg' : exportFormat}
              </span>
            </div>

            {/* Footer Action Buttons */}
            <div className="flex items-center gap-2 pt-0.5">
              <button
                onClick={handleCopyClipboard}
                disabled={!image || isExporting}
                className="flex-1 h-8 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold flex items-center justify-center gap-1.5 text-zinc-200 hover:text-white transition-all active:scale-[0.98] disabled:opacity-40"
              >
                {copied ? <Check size={13} className="text-white" /> : <Copy size={13} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>

              <button
                onClick={async () => {
                  await handleExport();
                  setShowExportModal(false);
                }}
                disabled={!image || isExporting}
                className="flex-1 h-8 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-[0.98] disabled:opacity-40"
              >
                {isExporting ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                <span>{isExporting ? 'Exporting...' : `Download ${exportScale}x`}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
