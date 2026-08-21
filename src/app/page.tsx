"use client";

import React, { useState, useRef, useCallback, useEffect, useMemo as reactUseMemo } from 'react';
import { toast } from 'sonner';
import { 
  Upload, Download, Layers, Monitor, Image as ImageIcon, Filter, 
  ChevronDown, Maximize, Square, LayoutTemplate, Smartphone, RotateCw, RotateCcw, Trash2, 
  Maximize2, Minimize2, ZoomIn, ZoomOut, Copy, Check, Sliders, Palette, 
  Wand2, Box, Orbit, Compass, Eye, RefreshCw, Sun, Moon, Laptop, Globe, CheckCircle2,
  Loader2, Aperture, SlidersHorizontal, Droplets, Droplet, Tv, Radio, Film, 
  Focus, Pipette, Paintbrush, Flame, Zap, SunMedium, Type, Scan, Scaling, 
  AppWindow, Gauge, EyeOff, SlidersVertical, X, Lock, Unlock, Bookmark, Save, Plus, Star, Camera, Undo2, Redo2,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Menu
} from 'lucide-react';

import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { PanelButton } from "@/components/ui/panel-button";

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
      background: 'url("/wallpapers/macos-sequoia.webp")',
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
      background: 'url("/wallpapers/dark-green-8k.webp")',
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
      background: 'url("/wallpapers/macos-monterey-dark.webp")',
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
      background: 'url("/wallpapers/blue-abstract.webp")',
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
      background: 'url("/wallpapers/macos-tahoe-light.webp")',
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
      background: 'url("/wallpapers/macos-big-sur-dark.webp")',
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
  const [customRatioW, setCustomRatioW] = useState<number | string>(16);
  const [customRatioH, setCustomRatioH] = useState<number | string>(9);
  const [showRatioMenu, setShowRatioMenu] = useState(false);
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const [showMacOsBar, setShowMacOsBar] = useState(false);
  const [showBrowserBar, setShowBrowserBar] = useState(false);
  const [browserUrl, setBrowserUrl] = useState('example.com');
  const [glassBorder, setGlassBorder] = useState(false);
  const [glassBorderWidth, setGlassBorderWidth] = useState(8);
  const [glassBorderBlur, setGlassBorderBlur] = useState(20);
  const [glassBorderColor, setGlassBorderColor] = useState('#ffffff');
  const [glassBorderOpacity, setGlassBorderOpacity] = useState(20);
  const [background, setBackground] = useState('url("/wallpapers/dark-green-8k.webp")');
  const [isStorageInitialized, setIsStorageInitialized] = useState(false);
  
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '255, 255, 255';
  };

  // Canvas Viewport Zoom & Pan (Figma-style smooth workspace navigation)
  const [viewportZoom, setViewportZoom] = useState(1);
  const [baseZoom, setBaseZoom] = useState(1);
  const [viewportPan, setViewportPan] = useState({ x: 0, y: 0 });
  const [isPanningWorkspace, setIsPanningWorkspace] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const workspacePanRef = useRef<{ startX: number, startY: number, initialPanX: number, initialPanY: number } | null>(null);

  const viewportZoomRef = useRef(viewportZoom);
  const lastDiscreteZoomTime = useRef<number>(0);
  viewportZoomRef.current = viewportZoom;
  const viewportPanRef = useRef(viewportPan);
  viewportPanRef.current = viewportPan;

  // Multi-touch tracking for native mobile pinch-to-zoom
  const activePointersRef = useRef<Map<number, { clientX: number, clientY: number }>>(new Map());
  const pinchRef = useRef<{ startDist: number, startZoom: number, startPanX: number, startPanY: number, centerX: number, centerY: number } | null>(null);

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
  const rotateRef = useRef<{ startAngle: number; startRotation: number; centerX: number; centerY: number } | null>(null);
  const pointerDownTargetRef = useRef<Node | null>(null);
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
  const [lightingTarget, setLightingTarget] = useState('image');
  
  const [filter, setFilter] = useState('none');
  const [imageBrightness, setImageBrightness] = useState(100);
  const [imageContrast, setImageContrast] = useState(100);
  const [imageSaturation, setImageSaturation] = useState(100);
  const [imageHueRotate, setImageHueRotate] = useState(0);
  const [imageFilter, setImageFilter] = useState('none');

  const resetLighting = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setHueRotate(0);
    setFilter('none');
    setImageBrightness(100);
    setImageContrast(100);
    setImageSaturation(100);
    setImageHueRotate(0);
    setImageFilter('none');
  };

  const isCustomLighting = brightness !== 100 || contrast !== 100 || saturation !== 100 || hueRotate !== 0 || filter !== 'none' || imageBrightness !== 100 || imageContrast !== 100 || imageSaturation !== 100 || imageHueRotate !== 0 || imageFilter !== 'none';

  // Mobile layout state
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
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
  const [watermarkOffsetX, setWatermarkOffsetX] = useState<number>(0);
  const [watermarkOffsetY, setWatermarkOffsetY] = useState<number>(0);
  const [watermarkScale, setWatermarkScale] = useState<number>(100);
  const [watermarkSelected, setWatermarkSelected] = useState(false);

  // --- History (Undo / Redo) ---
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const skipHistoryRecord = useRef(false);
  const historyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentConfigSnapshot = React.useMemo(() => ({
    background, padding, radius, shadow, bgBlur, aspectRatio, customRatioW, customRatioH,
    showMacOsBar, showBrowserBar, browserUrl, view, glassBorder, glassBorderWidth, glassBorderOpacity, glassBorderBlur, glassBorderColor,
    perspective, rotateX, rotateY, rotateZ, perspectiveDepth, brightness, contrast, saturation, hueRotate, filter,
    noiseIntensity, grainIntensity, noiseTarget, watermark, watermarkPlatform, watermarkPosition, watermarkTarget,
    watermarkOpacity, watermarkBlur, watermarkGlass, watermarkBorderWidth, watermarkBorderOpacity, watermarkOffsetX,
    watermarkOffsetY, watermarkScale, pos, rotation, scale, imageBlur, image, imageDimensions
  }), [
    background, padding, radius, shadow, bgBlur, aspectRatio, customRatioW, customRatioH,
    showMacOsBar, showBrowserBar, browserUrl, view, glassBorder, glassBorderWidth, glassBorderOpacity, glassBorderBlur, glassBorderColor,
    perspective, rotateX, rotateY, rotateZ, perspectiveDepth, brightness, contrast, saturation, hueRotate, filter,
    noiseIntensity, grainIntensity, noiseTarget, watermark, watermarkPlatform, watermarkPosition, watermarkTarget,
    watermarkOpacity, watermarkBlur, watermarkGlass, watermarkBorderWidth, watermarkBorderOpacity, watermarkOffsetX,
    watermarkOffsetY, watermarkScale, pos, rotation, scale, imageBlur, image, imageDimensions
  ]);

  useEffect(() => {
    if (skipHistoryRecord.current) return;
    
    if (historyTimeoutRef.current) clearTimeout(historyTimeoutRef.current);
    
    historyTimeoutRef.current = setTimeout(() => {
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        const lastConfig = newHistory[newHistory.length - 1];
        if (lastConfig && JSON.stringify(lastConfig) === JSON.stringify(currentConfigSnapshot)) {
          return prev;
        }
        setTimeout(() => setHistoryIndex(newHistory.length), 0);
        return [...newHistory, currentConfigSnapshot];
      });
    }, 400);
    
  }, [currentConfigSnapshot, historyIndex]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      skipHistoryRecord.current = true;
      if (historyTimeoutRef.current) clearTimeout(historyTimeoutRef.current);
      setTimeout(() => { skipHistoryRecord.current = false; }, 600);
      const prevConfig = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      handleApplyPreset(prevConfig);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      skipHistoryRecord.current = true;
      if (historyTimeoutRef.current) clearTimeout(historyTimeoutRef.current);
      setTimeout(() => { skipHistoryRecord.current = false; }, 600);
      const nextConfig = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      handleApplyPreset(nextConfig);
    }
  };

  const latestUndo = useRef(handleUndo);
  const latestRedo = useRef(handleRedo);
  latestUndo.current = handleUndo;
  latestRedo.current = handleRedo;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          latestRedo.current();
        } else {
          latestUndo.current();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        latestRedo.current();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  // -----------------------------
  
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
        if (s.background !== undefined) {
          let bg = s.background;
          const bgMap: Record<string, string> = {
            'abstract-waves.webp': 'abstract-waves.webp',
            'blue-abstract.webp': 'blue-abstract.webp',
            'iridescent-spheres.webp': 'iridescent-spheres.webp',
            'macos-golden.webp': 'macos-golden.webp',
            'macos-big-sur-dark.webp': 'macos-big-sur-dark.webp',
            'macos-big-sur-light.webp': 'macos-big-sur-light.webp',
            'macos-monterey-dark.webp': 'macos-monterey-dark.webp',
            'macos-monterey-wwdc.webp': 'macos-monterey-wwdc.webp',
            'macos-sequoia.webp': 'macos-sequoia.webp',
            'macos-tahoe-light.webp': 'macos-tahoe-light.webp',
            'macos-tahoe-dark.webp': 'macos-tahoe-dark.webp',
            'surface-abstract.webp': 'surface-abstract.webp',
            'macbook-abstract.webp': 'macbook-abstract.webp',
            'dark-green-8k.webp': 'dark-green-8k.webp',
            'emerald-dark.webp': 'emerald-dark.webp',
            'macos-dark-4k.webp': 'macos-dark-4k.webp',
            'apple-retina.webp': 'apple-retina.webp'
          };
          
          for (const [oldName, newName] of Object.entries(bgMap)) {
            if (bg.includes(oldName)) {
              bg = bg.replace(oldName, newName);
            }
          }
          setBackground(bg);
        }
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
        if (s.showBrowserBar !== undefined) setShowBrowserBar(s.showBrowserBar);
        if (s.browserUrl !== undefined) setBrowserUrl(s.browserUrl);
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

  // 2. Auto-save active studio state to localStorage on any state change with 500ms debounce
  useEffect(() => {
    if (!isStorageInitialized) return;

    if (!image) {
      try {
        localStorage.removeItem('noicess_studio_state');
      } catch (e) {}
      return;
    }

    const saveTimeout = setTimeout(() => {
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
          showBrowserBar,
          browserUrl,
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
    }, 500);

    return () => clearTimeout(saveTimeout);
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
    showBrowserBar,
    browserUrl,
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
    image,
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
    setShowBrowserBar(config.showBrowserBar ?? false);
    setBrowserUrl(config.browserUrl || 'example.com');
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
    setImageBrightness(100);
    setImageContrast(100);
    setImageSaturation(100);
    setImageHueRotate(0);
    setImageFilter('none');
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
    if (config.pos !== undefined) setPos(config.pos);
    if (config.rotation !== undefined) setRotation(config.rotation);
    if (config.scale !== undefined) setScale(config.scale);
    if (config.imageBlur !== undefined) setImageBlur(config.imageBlur);
    if (config.image !== undefined) setImage(config.image);
    if (config.imageDimensions !== undefined) setImageDimensions(config.imageDimensions);
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
  const [starCount, setStarCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('https://api.github.com/repos/ishivamgaur/noiceSS')
      .then(res => res.json())
      .then(data => {
        if (data && data.stargazers_count !== undefined) {
          setStarCount(data.stargazers_count);
        }
      })
      .catch(() => {});
  }, []);
  const [showExportModal, setShowExportModal] = useState(false);

  const [noiseTexture, setNoiseTexture] = useState<string>('');
  
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const size = 150;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');
    if (!ctx) return;
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
    setNoiseTexture(c.toDataURL('image/png'));
  }, []);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  const scaleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scaleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startScale = (e: React.PointerEvent<HTMLButtonElement>, delta: number) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setScale((s) => Math.min(Math.max(s + delta, 20), 300));
    scaleTimeoutRef.current = setTimeout(() => {
      scaleIntervalRef.current = setInterval(() => {
        setScale((s) => Math.min(Math.max(s + delta, 20), 300));
      }, 30); // 30ms interval for extremely smooth continuous scaling
    }, 300);
  };

  const stopScale = (e?: React.PointerEvent<HTMLButtonElement>) => {
    if (e && e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    if (scaleTimeoutRef.current) clearTimeout(scaleTimeoutRef.current);
    if (scaleIntervalRef.current) clearInterval(scaleIntervalRef.current);
  };

  const watermarkScaleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const watermarkScaleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startWatermarkScale = (e: React.PointerEvent<HTMLButtonElement>, delta: number) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setWatermarkScale((s) => Math.min(Math.max(s + delta, 25), 300));
    watermarkScaleTimeoutRef.current = setTimeout(() => {
      watermarkScaleIntervalRef.current = setInterval(() => {
        setWatermarkScale((s) => Math.min(Math.max(s + delta, 25), 300));
      }, 30);
    }, 300);
  };

  const stopWatermarkScale = (e?: React.PointerEvent<HTMLButtonElement>) => {
    if (e && e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    if (watermarkScaleTimeoutRef.current) clearTimeout(watermarkScaleTimeoutRef.current);
    if (watermarkScaleIntervalRef.current) clearInterval(watermarkScaleIntervalRef.current);
  };

  const watermarkNudgeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const watermarkNudgeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startWatermarkNudge = (e: React.PointerEvent<HTMLButtonElement>, dx: number, dy: number) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    if (dx !== 0) setWatermarkOffsetX((prev) => prev + dx);
    if (dy !== 0) setWatermarkOffsetY((prev) => prev + dy);
    watermarkNudgeTimeoutRef.current = setTimeout(() => {
      watermarkNudgeIntervalRef.current = setInterval(() => {
        if (dx !== 0) setWatermarkOffsetX((prev) => prev + dx);
        if (dy !== 0) setWatermarkOffsetY((prev) => prev + dy);
      }, 30);
    }, 300);
  };

  const stopWatermarkNudge = (e?: React.PointerEvent<HTMLButtonElement>) => {
    if (e && e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    if (watermarkNudgeTimeoutRef.current) clearTimeout(watermarkNudgeTimeoutRef.current);
    if (watermarkNudgeIntervalRef.current) clearInterval(watermarkNudgeIntervalRef.current);
  };

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

  // Cursor-Anchored Wheel Zoom & Pan for Canvas Workspace
  useEffect(() => {
    const workspace = workspaceRef.current;
    if (!workspace) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const currentZoom = viewportZoomRef.current;
      const currentPan = viewportPanRef.current;

      if (e.ctrlKey || e.metaKey) {
        // Pinch-to-zoom or Ctrl+Wheel
        let zoomAmount = 0;
        if (Math.abs(e.deltaY) > 50) {
          // Discrete mouse wheel: apply a fixed, extremely precise 10% step per tick
          zoomAmount = Math.sign(e.deltaY) * 0.1;
          lastDiscreteZoomTime.current = Date.now();
        } else {
          // Smooth trackpad: apply proportional scaling
          zoomAmount = e.deltaY * 0.002;
        }
        
        const newZoom = Math.min(Math.max(currentZoom * (1 - zoomAmount), 0.1), 5.0);
        
        const rect = workspace.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const pointX = (mouseX - currentPan.x) / currentZoom;
        const pointY = (mouseY - currentPan.y) / currentZoom;

        const newPanX = mouseX - pointX * newZoom;
        const newPanY = mouseY - pointY * newZoom;

        setViewportZoom(newZoom);
        setViewportPan({ x: newPanX, y: newPanY });
        
        // Update refs immediately so subsequent rapid wheel events within the same frame use correct math
        viewportZoomRef.current = newZoom;
        viewportPanRef.current = { x: newPanX, y: newPanY };
      } else {
        // Two-finger trackpad pan or Mouse wheel scroll
        const newPanX = currentPan.x - e.deltaX;
        const newPanY = currentPan.y - e.deltaY;
        setViewportPan({ x: newPanX, y: newPanY });
        viewportPanRef.current = { x: newPanX, y: newPanY };
      }
    };

    workspace.addEventListener('wheel', handleWheel, { passive: false });
    return () => workspace.removeEventListener('wheel', handleWheel);
  }, []);

  const handleWorkspacePointerDown = (e: React.PointerEvent) => {
    pointerDownTargetRef.current = e.target as Node;
    // Register pointer for multi-touch tracking
    activePointersRef.current.set(e.pointerId, { clientX: e.clientX, clientY: e.clientY });

    // Check if the event originated inside the screenshot image frame
    const isInsideScreenshotFrame = imageFrameRef.current?.contains(e.target as Node);
    
    // If two fingers are down, initiate pinch-to-zoom
    if (activePointersRef.current.size === 2) {
      const pts = Array.from(activePointersRef.current.values());
      const dist = Math.hypot(pts[0].clientX - pts[1].clientX, pts[0].clientY - pts[1].clientY);
      
      const centerX = (pts[0].clientX + pts[1].clientX) / 2;
      const centerY = (pts[0].clientY + pts[1].clientY) / 2;
      
      pinchRef.current = {
        startDist: dist,
        startZoom: viewportZoom,
        startPanX: viewportPan.x,
        startPanY: viewportPan.y,
        centerX,
        centerY
      };
      
      // Stop normal panning if it was active
      setIsPanningWorkspace(false);
      workspacePanRef.current = null;
      try { (workspaceRef.current as HTMLElement)?.setPointerCapture?.(e.pointerId); } catch {}
      return;
    }

    // Normal pan logic (1 finger or mouse)
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
      try { (workspaceRef.current as HTMLElement)?.setPointerCapture?.(e.pointerId); } catch {}
    }
  };

  const handleWorkspacePointerMove = (e: React.PointerEvent) => {
    // Update pointer position
    if (activePointersRef.current.has(e.pointerId)) {
      activePointersRef.current.set(e.pointerId, { clientX: e.clientX, clientY: e.clientY });
    }

    // Handle Pinch to Zoom
    if (activePointersRef.current.size === 2 && pinchRef.current) {
      const pts = Array.from(activePointersRef.current.values());
      const dist = Math.hypot(pts[0].clientX - pts[1].clientX, pts[0].clientY - pts[1].clientY);
      const scaleDelta = dist / pinchRef.current.startDist;
      
      let newZoom = pinchRef.current.startZoom * scaleDelta;
      newZoom = Math.max(0.1, Math.min(newZoom, 5)); // Clamp zoom between 10% and 500%
      
      // Calculate new pan to zoom around the pinch center (Figma style)
      if (workspaceRef.current) {
        const rect = workspaceRef.current.getBoundingClientRect();
        const pointerX = pinchRef.current.centerX - rect.left;
        const pointerY = pinchRef.current.centerY - rect.top;
        
        // Adjust pan to zoom into the pinch center
        const zoomRatio = newZoom / pinchRef.current.startZoom;
        const newPanX = pointerX - (pointerX - pinchRef.current.startPanX) * zoomRatio;
        const newPanY = pointerY - (pointerY - pinchRef.current.startPanY) * zoomRatio;
        
        setViewportZoom(newZoom);
        setViewportPan({ x: newPanX, y: newPanY });
      }
      return;
    }

    // Handle normal Pan
    if (isPanningWorkspace && workspacePanRef.current) {
      const dx = e.clientX - workspacePanRef.current.startX;
      const dy = e.clientY - workspacePanRef.current.startY;
      setViewportPan({
        x: workspacePanRef.current.initialPanX + dx,
        y: workspacePanRef.current.initialPanY + dy,
      });
    }
  };

  const handleWorkspacePointerUp = (e: React.PointerEvent) => {
    activePointersRef.current.delete(e.pointerId);
    
    // If we dropped below 2 fingers, end pinch
    if (activePointersRef.current.size < 2) {
      pinchRef.current = null;
    }

    if (isPanningWorkspace) {
      setIsPanningWorkspace(false);
      workspacePanRef.current = null;
    }
    
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {}
  };

  const handleSheetDrag = (e: React.PointerEvent<HTMLDivElement>, closeSetter: (v: boolean) => void) => {
    const el = e.currentTarget.parentElement?.parentElement;
    if (!el) return;
    const startY = e.clientY;
    let currentY = 0;
    
    const handleMove = (eMove: PointerEvent) => {
      currentY = Math.max(0, eMove.clientY - startY);
      el.style.transform = `translateY(${currentY}px)`;
      el.style.transition = 'none';
    };
    
    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      el.style.transition = 'transform 0.2s ease-out';
      if (currentY > 60) {
         closeSetter(false);
         setTimeout(() => { el.style.transform = ''; }, 300); // Reset after unmount
      } else {
         el.style.transform = '';
      }
    };
    
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  const getInitialZoom = () => {
    if (typeof window !== 'undefined') {
      const workspace = workspaceRef.current;
      
      if (workspace) {
        const workspaceW = workspace.clientWidth;
        const workspaceH = workspace.clientHeight;
        
        // Use getCanvasDimensions() directly to avoid waiting for DOM updates
        const dims = canvasDimensions;
        const canvasW = parseFloat(dims.width as string);
        const canvasH = parseFloat(dims.height as string);
        
        if (canvasW > 0 && canvasH > 0) {
          // Responsive padding: 48px on mobile, 80px on desktop
          const paddingX = window.innerWidth < 768 ? 48 : 80;
          const paddingY = window.innerWidth < 768 ? 48 : 80;
          const scaleW = (workspaceW - paddingX) / canvasW;
          const scaleH = (workspaceH - paddingY) / canvasH;
          
          return Math.max(0.1, Math.min(scaleW, scaleH, 1)); // Cap at 1.0x so it doesn't blow up on desktop
        }
      }
      
      // Fallback
      if (window.innerWidth < 768) {
        return Math.max(0.2, (window.innerWidth - 32) / 850);
      }
    }
    return 1;
  };

  const resetViewport = () => {
    const zoom = getInitialZoom();
    setBaseZoom(zoom);
    setViewportZoom(zoom);
    
    // Auto-center translation for transformOrigin: 0 0
    if (workspaceRef.current) {
      const w = workspaceRef.current.clientWidth;
      const h = workspaceRef.current.clientHeight;
      setViewportPan({
        x: (w - w * zoom) / 2,
        y: (h - h * zoom) / 2
      });
    } else {
      setViewportPan({ x: 0, y: 0 });
    }
  };

  useEffect(() => {
    resetViewport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-fit whenever aspect ratio or padding changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const t = setTimeout(() => {
        resetViewport();
      }, 50);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aspectRatio, customRatioW, customRatioH, image]);

  // Auto-fit when workspace container resizes
  useEffect(() => {
    const workspace = workspaceRef.current;
    if (!workspace) return;
    
    const observer = new ResizeObserver(() => {
      // Debounce slightly to prevent jerky zooming
      resetViewport();
    });
    
    observer.observe(workspace);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const viewportZoomTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const viewportZoomIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const zoomCanvasAtCenter = (delta: number) => {
    const workspace = workspaceRef.current;
    if (!workspace) return;
    const rect = workspace.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const currentZoom = viewportZoomRef.current;
    const currentPan = viewportPanRef.current;

    const pointX = (centerX - currentPan.x) / currentZoom;
    const pointY = (centerY - currentPan.y) / currentZoom;

    const newZoom = Math.min(Math.max(currentZoom + delta, 0.1), 5.0);
    const newPanX = centerX - pointX * newZoom;
    const newPanY = centerY - pointY * newZoom;

    setViewportZoom(newZoom);
    setViewportPan({ x: newPanX, y: newPanY });
    viewportZoomRef.current = newZoom;
    viewportPanRef.current = { x: newPanX, y: newPanY };
  };

  const startViewportZoom = (e: React.PointerEvent<HTMLButtonElement>, delta: number) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    zoomCanvasAtCenter(delta);
    viewportZoomTimeoutRef.current = setTimeout(() => {
      viewportZoomIntervalRef.current = setInterval(() => {
        zoomCanvasAtCenter(delta);
      }, 30);
    }, 300);
  };

  const stopViewportZoom = (e?: React.PointerEvent<HTMLButtonElement>) => {
    if (e && e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    if (viewportZoomTimeoutRef.current) clearTimeout(viewportZoomTimeoutRef.current);
    if (viewportZoomIntervalRef.current) clearInterval(viewportZoomIntervalRef.current);
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
      setScale(100);
      setPos({ x: 0, y: 0 });
      setAspectRatio('auto');
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
      const { toPng, toJpeg, toBlob } = await import('html-to-image');
      let dataUrl = '';
      
      // Calculate the optimal multiplier to preserve original image quality without loss
      let optimalMultiplier = multiplier;
      if (image && imageDimensions && imageDimensions.w) {
        // The image is rendered at a base width of 800px on the canvas.
        // We find the scale factor needed to make it match the original native resolution.
        const neededRatio = imageDimensions.w / 800;
        // Cap at 6x to prevent memory crashes on ridiculously large images
        optimalMultiplier = Math.min(Math.max(multiplier, neededRatio), 6);
      }

      const options = {
        cacheBust: true,
        pixelRatio: optimalMultiplier,
        quality: 1.0, // Maximum quality
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
      const memes = [
        "Pixel perfect 🤌",
        "Ship it 🚀",
        "LGTM 👍",
        "Design team is shaking",
        "Figma who? 🎨",
        "Absolute cinema 🎥",
        "Ready for Product Hunt 🚀",
        "CSS is my passion ✨",
        "That drop shadow though",
        "10x engineer vibes",
        "Ready for the README 📖",
        "CEO will love this 📈",
        "Noicesss! 🧊",
        "Clean code, clean UI",
        "Looks good on my machine 🤷‍♂️",
        "Another one 🔑",
        "Stunning ✨",
        "Exported faster than Webpack",
        "Too much sauce 🌶️",
        "Looks like a million bucks 💸"
      ];
      const randomMeme = memes[Math.floor(Math.random() * memes.length)];

      toast('Downloaded', {
        description: randomMeme,
        icon: '🎉',
        style: {
          background: 'rgba(20, 20, 20, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#fff',
        }
      });
    } catch (err) {
      console.error('Failed to export image', err);
      toast.error('Export Failed', { description: 'Something went wrong while exporting.' });
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
      const { toBlob } = await import('html-to-image');
      
      let optimalMultiplier = 3; // Enforce minimum 3x resolution for crisp clipboard copies
      if (image && imageDimensions && imageDimensions.w) {
        const neededRatio = imageDimensions.w / 800;
        optimalMultiplier = Math.min(Math.max(3, neededRatio), 6);
      }

      const blob = await toBlob(canvasRef.current, { 
        pixelRatio: optimalMultiplier, 
        cacheBust: true,
        filter: filterExportNodes,
      });
      if (blob && navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast('Copied', {
          icon: '✨',
          style: {
            background: 'rgba(20, 20, 20, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#fff',
          }
        });
      }
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
      toast.error('Copy Failed', { description: 'Could not copy image to clipboard.' });
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
    setWatermarkSelected(false);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setImageSelected(true);
    setWatermarkSelected(false);
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
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (err) {}
  };

  const [isDraggingWatermark, setIsDraggingWatermark] = useState(false);
  const [watermarkDragStart, setWatermarkDragStart] = useState({ x: 0, y: 0 });

  const handleWatermarkPointerDown = (e: React.PointerEvent) => {
    setIsDraggingWatermark(true);
    setWatermarkSelected(true);
    setImageSelected(false);
    setWatermarkDragStart({ 
      x: e.clientX - watermarkOffsetX, 
      y: e.clientY - watermarkOffsetY 
    });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    e.stopPropagation();
  };
  const handleWatermarkPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingWatermark) return;
    setWatermarkOffsetX(e.clientX - watermarkDragStart.x);
    setWatermarkOffsetY(e.clientY - watermarkDragStart.y);
    e.stopPropagation();
  };
  const handleWatermarkPointerUp = (e: React.PointerEvent) => {
    setIsDraggingWatermark(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    e.stopPropagation();
  };
  const handleWatermarkWheel = (e: React.WheelEvent) => {
    if (e.deltaY < 0) {
      setWatermarkScale((prev) => Math.min(300, prev + 5));
    } else {
      setWatermarkScale((prev) => Math.max(25, prev - 5));
    }
    e.stopPropagation();
  };

  const getLightingFilterStyle = (target: 'canvas' | 'image' = 'canvas') => {
    const activeFilter = target === 'image' ? imageFilter : filter;
    const selectedFilter = FILTERS.find(f => f.id === activeFilter);
    const parts: string[] = [];
    
    if (selectedFilter && selectedFilter.filterStyle !== 'none') {
      parts.push(selectedFilter.filterStyle);
    }

    const activeBrightness = target === 'image' ? imageBrightness : brightness;
    const activeContrast = target === 'image' ? imageContrast : contrast;
    const activeSaturation = target === 'image' ? imageSaturation : saturation;
    const activeHueRotate = target === 'image' ? imageHueRotate : hueRotate;

    if (activeBrightness !== 100) {
      parts.push(`brightness(${activeBrightness}%)`);
    }
    if (activeContrast !== 100) {
      parts.push(`contrast(${activeContrast}%)`);
    }
    if (activeSaturation !== 100) {
      parts.push(`saturate(${activeSaturation}%)`);
    }
    if (activeHueRotate !== 0) {
      parts.push(`hue-rotate(${activeHueRotate}deg)`);
    }
    
    return parts.length > 0 ? parts.join(' ') : '';
  };

  const safeCustomW = Number(customRatioW) || 1;
  const safeCustomH = Number(customRatioH) || 1;

  const activeRatioData = aspectRatio === 'custom'
    ? { id: 'custom', aspect: `${safeCustomW}/${safeCustomH}`, name: `Custom (${safeCustomW}:${safeCustomH})`, desc: `${safeCustomW}:${safeCustomH}`, icon: Scaling }
    : (FLAT_RATIOS.find(r => r.id === aspectRatio) || FLAT_RATIOS[0]);

  const aspectStyle = aspectRatio === 'custom'
    ? `${safeCustomW}/${safeCustomH}`
    : (activeRatioData.id === 'auto' 
        ? (imageDimensions.w && imageDimensions.h ? `${imageDimensions.w}/${imageDimensions.h}` : 'auto')
        : activeRatioData.aspect);
    
  const glassRgb = hexToRgb(glassBorderColor);
  const activePerspectiveTransform = (rotateX !== 0 || rotateY !== 0 || rotateZ !== 0)
    ? `perspective(${perspectiveDepth}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`
    : (PERSPECTIVES.find(p => p.id === perspective)?.transform || '');
  const bgUrlMatch = background.match(/^url\(['"]?(.*?)['"]?\)$/);
  const bgImageUrl = bgUrlMatch ? bgUrlMatch[1] : null;

  const canvasDimensions = reactUseMemo(() => {
    const defaultSize = 800;

    let finalW, finalH;

    if (aspectStyle === 'auto') {
      if (!image || !imageDimensions?.w || !imageDimensions?.h) {
        return { width: `${defaultSize}px`, height: '600px' };
      }
      // Auto Aspect Ratio logic: Canvas stays fixed, padding pushes image inward.
      const imageRatio = imageDimensions.w / imageDimensions.h;
      const decorationW = glassBorder ? 2 * glassBorderWidth + 2 : 0;
      const decorationH = (glassBorder ? 2 * glassBorderWidth + 2 : 0) + (showMacOsBar ? (showBrowserBar ? 52 : 40) : 0);
      
      if (imageRatio >= 1) {
        const innerW = defaultSize;
        const innerH = innerW / imageRatio;
        finalW = innerW + decorationW + 2 * padding;
        finalH = innerH + decorationH + 2 * padding;
      } else {
        const innerH = defaultSize;
        const innerW = innerH * imageRatio;
        finalW = innerW + decorationW + 2 * padding;
        finalH = innerH + decorationH + 2 * padding;
      }
    } else {
      // Fixed Aspect Ratio logic: Canvas size stays constant, padding only shrinks the image inward.
      const [wStr, hStr] = aspectStyle.split('/');
      const ratio = Number(wStr) / Number(hStr);

      if (ratio >= 1) {
        finalW = defaultSize;
        finalH = finalW / ratio;
      } else {
        finalH = defaultSize;
        finalW = finalH * ratio;
      }
    }

    return {
      width: `${finalW}px`,
      height: `${finalH}px`
    };
  }, [aspectStyle, image, imageDimensions, glassBorder, glassBorderWidth, showMacOsBar, showBrowserBar, padding]);

  const screenshotCardDimensions = reactUseMemo(() => {
    if (!image || !imageDimensions) return {};
    
    const canvasDims = canvasDimensions;
    if (!canvasDims.width || !canvasDims.height) return {};
    
    const canvasW = parseFloat(canvasDims.width as string);
    const canvasH = parseFloat(canvasDims.height as string);
    
    const baseW = canvasW - 2 * padding;
    const baseH = canvasH - 2 * padding;
    const availableW = Math.max(1, baseW * (scale / 100));
    const availableH = Math.max(1, baseH * (scale / 100));
    
    const decorationW = glassBorder ? 2 * glassBorderWidth + 2 : 0;
    const decorationH = (glassBorder ? 2 * glassBorderWidth + 2 : 0) + (showMacOsBar ? (showBrowserBar ? 52 : 40) : 0);
    
    const maxImageW = Math.max(1, availableW - decorationW);
    const maxImageH = Math.max(1, availableH - decorationH);
    
    const imageRatio = imageDimensions.w / imageDimensions.h;
    const availableImageRatio = maxImageW / maxImageH;
    
    let innerW, innerH;
    
    if (imageRatio > availableImageRatio) {
      innerW = maxImageW;
      innerH = innerW / imageRatio;
    } else {
      innerH = maxImageH;
      innerW = innerH * imageRatio;
    }
    
    const finalW = innerW + decorationW;
    const finalH = innerH + decorationH;
    
    return {
      width: `${finalW}px`,
      height: `${finalH}px`
    };
  }, [image, imageDimensions, canvasDimensions, padding, scale, glassBorder, glassBorderWidth, showMacOsBar, showBrowserBar]);
  return (
    <div className="flex flex-col md:flex-row h-[100dvh] w-[100dvw] overflow-hidden bg-bg-dark text-text-main font-sans antialiased">
      
      {/* Mobile Header (Only visible on mobile) */}
      <header className="md:hidden h-14 border-b border-white/5 bg-panel flex items-center justify-between px-4 shrink-0 z-40">
        <button onClick={() => setShowLeftSidebar(true)} className="text-zinc-400 hover:text-white p-2 -ml-2"><Menu size={20}/></button>
        <span className="font-bold text-sm tracking-[0.2em] text-white uppercase select-none drop-shadow-sm">NOICESS</span>
        <button onClick={() => setShowRightSidebar(true)} className="text-zinc-400 hover:text-white p-2 -mr-2"><SlidersHorizontal size={20}/></button>
      </header>

      {/* Mobile Overlay for Left Sidebar */}
      {showLeftSidebar && (
        <div className="md:hidden fixed inset-0 bg-black/60 z-[290] backdrop-blur-sm" onClick={() => setShowLeftSidebar(false)} />
      )}

      {/* Left Sidebar */}
      <aside className={`fixed md:relative flex z-[300] md:z-20 inset-y-0 left-0 w-[85vw] max-w-[300px] md:min-w-[300px] md:w-[300px] flex-col bg-panel border-r border-white/5 select-none h-full overflow-hidden transition-transform duration-300 ${showLeftSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        
        {/* Top Header Bar aligned with h-16 main header */}
        <div className="hidden md:flex h-16 border-b border-white/5 px-6 items-center shrink-0">
          <span className="font-bold text-base tracking-[0.2em] text-white uppercase select-none drop-shadow-sm">
            NOICESS
          </span>
        </div>
        
        {/* Mobile Sidebar Close Header */}
        <div className="md:hidden h-14 border-b border-white/5 px-4 flex items-center justify-between shrink-0">
          <span className="font-bold text-sm text-zinc-400 uppercase">Configuration</span>
          <button onClick={() => setShowLeftSidebar(false)} className="text-zinc-400 hover:text-white p-1"><X size={18}/></button>
        </div>

        {/* Sticky Tabs Header */}
        <div className="px-3 h-[61px] flex items-center border-b border-white/5 shrink-0">
          <div className="relative grid grid-cols-3 gap-1 bg-white/[0.02] p-1 h-[36px] rounded-lg border border-white/[0.04] w-full isolate">
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
              className={`h-full flex items-center justify-center text-xs font-medium rounded-md transition-colors duration-200 active:scale-95 cursor-pointer ${
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
              className={`h-full flex items-center justify-center text-xs font-medium rounded-md transition-colors duration-200 active:scale-95 cursor-pointer ${
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
              className={`h-full flex items-center justify-center text-xs font-medium rounded-md transition-colors duration-200 active:scale-95 cursor-pointer ${
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
        <div className="flex-1 overflow-y-auto overscroll-contain [scrollbar-gutter:stable] p-3 pb-8 flex flex-col">

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

                  {showMacOsBar && (
                    <div className="flex items-center justify-between py-0.5">
                      <label htmlFor="browser-bar-toggle" className="text-zinc-300 font-medium cursor-pointer">Browser Address Bar</label>
                      <Checkbox id="browser-bar-toggle" checked={showBrowserBar} onCheckedChange={(c) => setShowBrowserBar(c as boolean)} />
                    </div>
                  )}
                  
                  {showMacOsBar && showBrowserBar && (
                    <div className="flex flex-col gap-1.5 mt-1 mb-2">
                      <label htmlFor="browser-url-input" className="text-[11px] text-zinc-400 font-medium">Browser URL</label>
                      <input 
                        id="browser-url-input"
                        type="text" 
                        value={browserUrl}
                        onChange={(e) => setBrowserUrl(e.target.value)}
                        placeholder="example.com"
                        className="bg-white/[0.03] border border-white/[0.05] rounded-md px-2.5 py-1.5 text-xs text-zinc-300 w-full focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all placeholder:text-zinc-600"
                      />
                    </div>
                  )}
                  
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
                              onClick={() => {
                                setWatermarkPosition(pos.id as any);
                                setWatermarkOffsetX(0);
                                setWatermarkOffsetY(0);
                              }}
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
                                  className="absolute top-1 bottom-1 w-[calc((100%-8px)/3)] bg-white/10 border border-white/20 rounded-md shadow-sm ring-1 ring-white/10 transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none -z-10"
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
                        setBackground('CURRENT_IMAGE');
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
                <div className="p-2.5 rounded-xl bg-white/[0.015] border border-white/[0.04] flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-1 duration-150">
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
                  <label className="py-2 px-3 rounded-lg border border-white/[0.06] hover:border-white/20 flex items-center justify-center gap-2 cursor-pointer bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-150 active:scale-[0.98] text-xs font-medium text-zinc-300 hover:text-white mt-1">
                    <Upload size={13} />
                    <span>Upload Custom Wallpaper</span>
                    <input type="file" aria-label="Upload custom background image" accept="image/*" className="hidden" onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onload = (ev) => { if (ev.target?.result) setBackground(`url("${ev.target.result}")`); };
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }} />
                  </label>
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
                  
                  <div className="mt-1">
                    <label className="w-full py-2 px-3 rounded-lg border border-white/[0.06] hover:border-white/20 flex items-center justify-center gap-2 cursor-pointer bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-150 active:scale-[0.98] text-xs font-medium text-zinc-300 hover:text-white relative overflow-hidden">
                      <Pipette size={13} />
                      <span>Custom Color</span>
                      <input type="color" aria-label="Pick custom background color" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" onChange={(e) => setBackground(e.target.value)} />
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
                      const isSelected = (lightingTarget === 'image' ? imageFilter : filter) === f.id;
                      return (
                        <button
                          key={f.id}
                          onClick={() => { if (lightingTarget === 'canvas' || lightingTarget === 'both') setFilter(f.id); if (lightingTarget === 'image' || lightingTarget === 'both') setImageFilter(f.id); }}
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
        
        {/* Advanced SEO Content Block (Visually Hidden) */}
        <div className="sr-only">
          <h1>NoiceSS - Beautiful Screenshot Mockup Studio & 3D App Presentation Maker</h1>
          <h2>The Ultimate Noice Screenshot Editor for Product Hunt & App Stores</h2>
          <p>
            Create stunning, beautiful screenshot mockups with NoiceSS. Whether you need a sleek macOS frame, 
            a 3D isometric perspective, or a radiant glassmorphism backdrop, Noice SS has you covered. 
            Transform your standard images into a noice screenshot ready for social media, portfolios, and pitch decks.
          </p>
          <p>
            Features include custom aspect ratios, dark mode studio lighting, noise and grain filters, 
            and high-resolution webp exports. Rank your app on the App Store or Product Hunt with the perfect, noicess presentation.
            NoiceSS is 100% free and open-source. Contribute or star the project on GitHub: <a href="https://github.com/ishivamgaur/noiceSS" target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-2">https://github.com/ishivamgaur/noiceSS</a>.
          </p>
          <h3>Core Features & Keywords</h3>
          <ul>
            <li>noicess</li>
            <li>noice ss</li>
            <li>beautiful screenshot noice</li>
            <li>noice screenshot</li>
            <li>beautiful ss</li>
            <li>beautiful screenshot</li>
            <li>noice</li>
            <li>noice.ss</li>
            <li>noicess app</li>
            <li>noice ss web</li>
            <li>stunning screenshot</li>
            <li>aesthetic screenshot generator</li>
            <li>glassmorphism screenshot</li>
            <li>screenshot mockup generator</li>
            <li>3d app screenshot</li>
            <li>macOS frame mockup</li>
            <li>product presentation maker</li>
            <li>open source screenshot editor</li>
            <li>free mockup generator github</li>
            <li>premium screenshot mockup</li>
            <li>clean screenshot editor</li>
          </ul>
        </div>

        <header className="h-16 border-b border-white/5 bg-panel flex items-center justify-between px-3 md:px-6 z-[200] shrink-0 overflow-x-auto md:overflow-visible no-scrollbar gap-1">
          {/* Left Actions: Undo / Redo */}
          <div className="flex-1 flex items-center gap-1.5 md:gap-2">
            <button 
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="flex items-center justify-center w-[32px] h-[32px] md:w-[34px] md:h-[34px] rounded-lg border border-transparent hover:bg-white/[0.04] hover:border-white/5 text-zinc-400 hover:text-white transition-all active:scale-[0.96] disabled:opacity-30 disabled:hover:bg-transparent disabled:active:scale-100 disabled:cursor-not-allowed" 
              title="Undo" aria-label="Undo"
            >
              <Undo2 className="w-[14px] h-[14px] md:w-[15px] md:h-[15px]" />
            </button>
            <button 
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="flex items-center justify-center w-[32px] h-[32px] md:w-[34px] md:h-[34px] rounded-lg border border-transparent hover:bg-white/[0.04] hover:border-white/5 text-zinc-400 hover:text-white transition-all active:scale-[0.96] disabled:opacity-30 disabled:hover:bg-transparent disabled:active:scale-100 disabled:cursor-not-allowed" 
              title="Redo" aria-label="Redo"
            >
              <Redo2 className="w-[14px] h-[14px] md:w-[15px] md:h-[15px]" />
            </button>
          </div>

          {/* Center Hub: Aspect Ratio + Presets */}
          <div className="flex items-center justify-center gap-1.5 md:gap-2">
            {/* Aspect Ratio Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowRatioMenu(!showRatioMenu);
                  setShowPresetsMenu(false);
                }}
                className="flex items-center gap-1.5 md:gap-2.5 px-2.5 md:px-3.5 py-2 rounded-lg border border-white/5 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/5 text-[11px] sm:text-xs font-medium transition shadow-inner text-zinc-200 hover:text-white active:scale-[0.96]"
              >
                <div className="w-3.5 h-3.5 md:w-4 md:h-4 flex items-center justify-center text-white shrink-0">
                  {renderAspectBox(aspectStyle)}
                </div>
                <span className="font-semibold text-white hidden sm:inline">{activeRatioData.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${showRatioMenu ? 'rotate-180 text-white' : ''}`} />
              </button>

              {showRatioMenu && (
                <>
                  {/* Backdrop to close popover on outside click */}
                  <div 
                    className="fixed inset-0 z-[290] md:z-40 md:bg-transparent bg-black/60 backdrop-blur-sm md:backdrop-blur-none" 
                    onClick={() => setShowRatioMenu(false)} 
                  />

                  <div className="fixed md:absolute bottom-0 md:bottom-auto md:top-full left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:mt-2 md:w-[360px] md:max-w-[94vw] w-full bg-[#141417] border-t md:border border-white/10 rounded-t-2xl md:rounded-xl overflow-hidden shadow-2xl z-[300] md:z-50 animate-in slide-in-from-bottom-2 md:slide-in-from-top-2 fade-in duration-150">
                    <div className="max-h-[85vh] md:max-h-[480px] overflow-y-auto [scrollbar-gutter:stable] p-4 md:p-3 pb-6 flex flex-col gap-4 md:gap-3.5">
                      
                      {/* Mobile Sheet Handle */}
                      <div 
                        className="w-full h-8 -mt-2 -mb-2 flex items-center justify-center cursor-grab active:cursor-grabbing md:hidden shrink-0 touch-none"
                        onPointerDown={(e) => handleSheetDrag(e, setShowRatioMenu)}
                      >
                        <div className="w-12 h-1.5 bg-white/10 rounded-full" />
                      </div>

                      {/* Top Section: Custom Ratio */}
                      <div className="flex flex-col gap-1.5 shrink-0">
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
                                const raw = e.target.value;
                                if (raw === '') {
                                  setCustomRatioW('');
                                } else {
                                  const val = parseInt(raw);
                                  if (!isNaN(val)) setCustomRatioW(Math.max(1, val));
                                }
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
                                const raw = e.target.value;
                                if (raw === '') {
                                  setCustomRatioH('');
                                } else {
                                  const val = parseInt(raw);
                                  if (!isNaN(val)) setCustomRatioH(Math.max(1, val));
                                }
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
                              setScale(100);
                              setPos({ x: 0, y: 0 });
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
                                      onClick={() => { 
                                        setAspectRatio(r.id); 
                                        setShowRatioMenu(false); 
                                        setScale(100);
                                        setPos({ x: 0, y: 0 });
                                      }}
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
                className="flex items-center gap-1.5 md:gap-2.5 px-2.5 md:px-3.5 py-2 rounded-lg border border-white/5 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/5 text-[11px] sm:text-xs font-medium transition shadow-inner text-zinc-200 hover:text-white active:scale-[0.96]"
                title="Custom Presets & Studio Styles"
              >
                <Bookmark className="w-3.5 h-3.5 md:w-[13px] md:h-[13px] text-zinc-300" />
                <span className="font-semibold text-white hidden sm:inline">Presets</span>
                {customPresets.length > 0 && (
                  <span className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full bg-white/10 text-[9px] md:text-[10px] font-mono flex items-center justify-center text-zinc-300">
                    {customPresets.length}
                  </span>
                )}
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${showPresetsMenu ? 'rotate-180 text-white' : ''}`} />
              </button>

              {showPresetsMenu && (
                <>
                  {/* Backdrop to close popover on outside click */}
                  <div 
                    className="fixed inset-0 z-[290] md:z-40 md:bg-transparent bg-black/60 backdrop-blur-sm md:backdrop-blur-none" 
                    onClick={() => setShowPresetsMenu(false)} 
                  />

                  <div className="fixed md:absolute bottom-0 md:bottom-auto md:top-full left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:mt-2 md:w-[340px] md:max-w-[94vw] w-full bg-[#141417] border-t md:border border-white/10 rounded-t-2xl md:rounded-xl overflow-hidden shadow-2xl z-[300] md:z-50 animate-in slide-in-from-bottom-2 md:slide-in-from-top-2 fade-in duration-150">
                    <div className="max-h-[85vh] md:max-h-[460px] overflow-y-auto [scrollbar-gutter:stable] p-4 md:p-3 pb-6 flex flex-col gap-4 md:gap-3.5">
                      
                      {/* Mobile Sheet Handle */}
                      <div 
                        className="w-full h-8 -mt-2 -mb-2 flex items-center justify-center cursor-grab active:cursor-grabbing md:hidden shrink-0 touch-none"
                        onPointerDown={(e) => handleSheetDrag(e, setShowPresetsMenu)}
                      >
                        <div className="w-12 h-1.5 bg-white/10 rounded-full" />
                      </div>

                      {/* Section 1: Save Current Preset */}
                      <div className="flex flex-col gap-1.5 shrink-0">
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
                              disabled={!image}
                              className="h-7 px-2.5 rounded-md bg-white hover:bg-zinc-200 text-black text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors shadow-sm active:scale-95 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed disabled:active:scale-100"
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
          <div className="flex-1 flex items-center justify-end gap-1.5 md:gap-2">

            {/* Copy to Clipboard */}
            <button
              onClick={handleCopyClipboard}
              disabled={!image || isExporting}
              className="flex items-center gap-0 sm:gap-1.5 md:gap-1.5 px-2.5 sm:px-3 md:px-3.5 py-2 rounded-lg text-xs font-medium border border-white/5 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/5 text-zinc-200 hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.96]"
              title="Copy screenshot to clipboard"
            >
              {copied ? <Check className="w-[14px] h-[14px] sm:w-[13px] sm:h-[13px] md:w-3.5 md:h-3.5 text-white" /> : <Copy className="w-[14px] h-[14px] sm:w-[13px] sm:h-[13px] md:w-3.5 md:h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            {/* Clear Button */}
            <button 
              className="group flex items-center gap-0 sm:gap-1.5 md:gap-1.5 px-2.5 sm:px-3 md:px-3.5 py-2 rounded-lg text-xs font-medium border border-white/5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-zinc-400 disabled:hover:border-white/5 disabled:cursor-not-allowed active:scale-[0.96]" 
              onClick={() => { 
                setImage(null); 
                setImageSelected(false); 
                setRotation(0); 
                setPos({ x: 0, y: 0 }); 
                setWatermark(''); 
                handleApplyPreset({
                  background: 'url("/wallpapers/dark-green-8k.webp")',
                  showMacOsBar: false, view: 'default', perspective: 'front',
                  rotateX: 0, rotateY: 0, rotateZ: 0, perspectiveDepth: 1200,
                  glassBorder: true, glassBorderWidth: 4, glassBorderOpacity: 20, glassBorderBlur: 20,
                  padding: 64, radius: 16, shadow: 25, bgBlur: 0, filter: 'none',
                  noiseIntensity: 0, grainIntensity: 0, brightness: 100, contrast: 100, saturation: 100, hueRotate: 0,
                });
              }}
              disabled={!image}
              title="Clear Image"
            >
              <Trash2 className={`w-[14px] h-[14px] sm:w-[13px] sm:h-[13px] md:w-[13px] md:h-[13px] transition-colors ${image ? 'text-red-500/80 group-hover:text-red-500' : ''}`} />
              <span className="hidden sm:inline">Clear</span>
            </button>

            {/* High-End Export Modal Trigger Button */}
            <button 
              className="flex items-center gap-0 sm:gap-1.5 md:gap-2 px-2.5 sm:px-3 md:px-4 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-zinc-200 text-black shadow-lg shadow-white/10 hover:shadow-white/20 transition duration-150 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.96]" 
              onClick={() => setShowExportModal(true)} 
              disabled={!image}
              title="Export Settings"
            >
              <Download className="w-[14px] h-[14px] sm:w-[13px] sm:h-[13px] md:w-3.5 md:h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </header>
        {/* Top Control Bar */}

        {/* Canvas Workspace (Figma / Canva style zoom & pan viewport) */}
        <div 
          ref={workspaceRef}
          data-workspace-bg="true"
          className={`flex-grow overflow-hidden relative select-none touch-none ${isPanningWorkspace ? 'cursor-grabbing' : 'cursor-grab'}`}
          onPointerDown={handleWorkspacePointerDown}
          onPointerMove={handleWorkspacePointerMove}
          onPointerUp={handleWorkspacePointerUp}
          onClick={(e) => {
            const isInsideScreenshotFrame = pointerDownTargetRef.current && imageFrameRef.current?.contains(pointerDownTargetRef.current);
            if (!isInsideScreenshotFrame && (e.target === workspaceRef.current || (e.target as HTMLElement).getAttribute('data-workspace-bg') === 'true')) {
              setImageSelected(false);
              setWatermarkSelected(false);
            }
          }}
        >
          {/* Transformed Canvas Viewport */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              translate: `${viewportPan.x}px ${viewportPan.y}px`,
              scale: viewportZoom,
              transformOrigin: '0 0',
              transition: 'none',
            }}
          >
            {/* Flex container to center the canvas inside the scaled viewport */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-auto" data-workspace-bg="true">
              <div 
                ref={canvasRef}
                className={`relative flex items-center justify-center shadow-2xl shrink-0 overflow-hidden ${isPanningWorkspace ? 'cursor-grabbing' : 'cursor-grab'}`}
                onClick={(e) => {
                  const isInsideScreenshotFrame = pointerDownTargetRef.current && imageFrameRef.current?.contains(pointerDownTargetRef.current);
                  if (!isInsideScreenshotFrame) {
                    setImageSelected(false);
                    setWatermarkSelected(false);
                  }
                }}
            style={{
              aspectRatio: aspectStyle,
              ...canvasDimensions
            }}
          >
            {/* Background Layer (Strictly Clipped, 0 padding) */}
            <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
              <div 
                className="absolute inset-0 w-full h-full"
                style={{
                  ...(background === 'CURRENT_IMAGE'
                    ? { backgroundImage: image ? `url("${image}")` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }
                    : background.startsWith('url(') 
                    ? { backgroundImage: background, backgroundSize: 'cover', backgroundPosition: 'center' }
                    : { background: background }
                  ),
                  filter: `${getLightingFilterStyle('canvas')} ${bgBlur > 0 ? `blur(${bgBlur}px)` : ''}`.trim() || 'none',
                  transform: bgBlur > 0 ? `scale(${1 + (bgBlur / 100)})` : 'none',
                }}
              />

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
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none" style={!image ? { padding: `${padding}px` } : undefined}>
              {/* Image Frame inside content container */}
              <div 
                ref={imageFrameRef}
                className={`relative group z-10 pointer-events-auto ${isRotating || isDragging || isResizing ? 'transition-none' : 'transition duration-200 ease-out'} flex flex-col justify-center items-center ${scale <= 100 ? 'max-w-full max-h-full' : ''} ${!image ? 'w-full h-full' : ''} ${isDragging ? 'cursor-grabbing' : (image ? (isLocked ? 'cursor-default' : 'cursor-move') : 'cursor-default')}`}
                style={{
                  transform: `translate(${pos.x}px, ${pos.y}px) ${activePerspectiveTransform} ${rotation !== 0 ? `rotate(${rotation}deg)` : ''}`,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Floating controls have been moved to the workspace level */}

                {/* Screenshot Card Container */}
                <div 
                  className={`relative flex flex-col items-center ${scale <= 100 ? 'max-w-full max-h-full' : ''} ${!image ? 'w-full h-full' : ''} ${image && isDragging ? 'opacity-90 transition-none cursor-grabbing' : image ? 'cursor-grab' : ''}`}
                  style={image ? {
                    ...screenshotCardDimensions,
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
                  <div className={`relative flex flex-col items-center overflow-hidden max-w-full max-h-full ${!image ? 'w-full h-full' : ''} ${image ? 'w-full h-full' : ''}`} style={{ borderRadius: `${Math.max(0, radius - (glassBorder ? glassBorderWidth + 1 : 0))}px` }}>
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
                        className={`w-full shrink-0 ${showBrowserBar ? 'h-[52px]' : 'h-[40px]'} bg-[#1C1C1E] flex items-center justify-between px-[20px] relative overflow-hidden ${showBrowserBar ? 'border-b border-black/40' : ''}`}
                        style={{ borderRadius: glassBorder ? `${Math.max(0, radius - glassBorderWidth - 1)}px ${Math.max(0, radius - glassBorderWidth - 1)}px 0 0` : '0' }}
                      >
                        <div className="flex gap-[8px] shrink-0 w-[52px]">
                          <div className="w-[12px] h-[12px] rounded-full bg-[#ff5f56] border border-black/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] shrink-0" />
                          <div className="w-[12px] h-[12px] rounded-full bg-[#ffbd2e] border border-black/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] shrink-0" />
                          <div className="w-[12px] h-[12px] rounded-full bg-[#27c93f] border border-black/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] shrink-0" />
                        </div>
                        {showBrowserBar && (
                          <div className="flex-1 flex justify-center min-w-0 px-4">
                            <div className="w-full max-w-[400px] h-[28px] bg-[#2C2C2E] rounded-[6px] flex items-center justify-center text-[13px] text-white/70 border border-white/[0.06] shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] px-3 overflow-hidden pointer-events-none">
                              <Lock size={12} className="mr-1.5 opacity-50 shrink-0" />
                              <span className="truncate font-sans tracking-wide leading-none">{browserUrl}</span>
                            </div>
                          </div>
                        )}
                        <div className="shrink-0 w-[52px]"></div>
                      </div>
                    )}
                    
                    {image ? (
                      <div 
                        className="relative overflow-hidden flex items-center justify-center w-full h-full min-w-0 min-h-0" 
                        style={{ 
                          contain: 'paint', 
                          isolation: 'isolate',
                          borderRadius: showMacOsBar 
                            ? `0 0 ${glassBorder ? Math.max(0, radius - glassBorderWidth - 1) : radius}px ${glassBorder ? Math.max(0, radius - glassBorderWidth - 1) : radius}px` 
                            : `${glassBorder ? Math.max(0, radius - glassBorderWidth - 1) : radius}px`,
                        }}
                      >
                        <img src={image} alt="NoiceSS - Beautiful Screenshot Mockup Preview" draggable={false} className="w-full h-full object-contain block transition relative z-10" style={{
                          filter: `${getLightingFilterStyle('image')} ${imageBlur > 0 ? `blur(${imageBlur}px)` : ''}`.trim() || 'none',
                        }} />
                        
                        {/* Watermark Overlay on Screenshot */}
                        {watermark && watermarkTarget === 'screenshot' && (
                          <div 
                            className={`absolute z-20 w-fit max-w-full inline-flex isolate ${isDraggingWatermark ? 'cursor-grabbing' : 'cursor-grab'} pointer-events-auto ${
                              watermarkPosition === 'bottom-right' ? 'bottom-4 right-4' :
                              watermarkPosition === 'bottom-left' ? 'bottom-4 left-4' :
                              watermarkPosition === 'bottom-center' ? 'bottom-4 left-1/2' :
                              'top-4 right-4'
                            }`}
                            onPointerDown={handleWatermarkPointerDown}
                            onPointerMove={handleWatermarkPointerMove}
                            onPointerUp={handleWatermarkPointerUp}
                            onPointerLeave={handleWatermarkPointerUp}
                            onClick={(e) => e.stopPropagation()}
                            onWheel={handleWatermarkWheel}
                            style={{
                              transform: `translate(${watermarkPosition === 'bottom-center' ? `calc(-50% + ${watermarkOffsetX}px)` : `${watermarkOffsetX}px`}, ${watermarkOffsetY}px)`
                            }}
                          >
                            <div 
                              className="relative px-3.5 py-1.5 rounded-full text-[11px] font-medium tracking-wide inline-flex items-center gap-1.5 whitespace-nowrap overflow-hidden leading-none select-none shrink-0"
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
                              
                              {/* Selection Outline */}
                              {!isExporting && watermarkSelected && (
                                <div data-no-export="true" className="no-export absolute inset-0 border-[1.5px] border-white/70 rounded-full pointer-events-none shadow-[0_0_0_1px_rgba(0,0,0,0.1)] z-50" />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <label className={`group flex flex-col items-center justify-center gap-2 md:gap-4 text-white drop-shadow-md w-full h-full cursor-pointer transition-all relative z-10 rounded-xl p-4 text-center overflow-hidden ${background === 'transparent' ? 'border-2 border-dashed border-white/10 bg-black/20 backdrop-blur-md hover:bg-white/10 hover:border-white/20' : 'hover:bg-white/5'}`}>
                        <div className="p-3 rounded-full bg-white/5 group-hover:bg-white/10 transition-all duration-300 border border-white/5 group-hover:border-white/10 group-active:scale-95 shrink-0">
                          <Upload size={32} className="opacity-90 text-white drop-shadow-sm transition-transform duration-300 group-hover:-translate-y-1" strokeWidth={1.5} />
                        </div>
                        <div className="flex flex-col gap-1 items-center justify-center max-w-[95%] shrink overflow-hidden">
                          <h2 className="text-base md:text-lg font-bold tracking-tight text-white truncate w-full">Drop an image here</h2>
                          <p className="text-zinc-400 text-[10px] md:text-xs font-medium truncate w-full">Or paste from clipboard (Ctrl+V)</p>
                        </div>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>

                {/* Selection Outline & Corner Handles (Directly on Screenshot with 0 gap) */}
                {!isExporting && image && (
                  <div 
                    data-no-export="true"
                    className={`no-export absolute inset-0 pointer-events-none transition-opacity duration-200 z-50 ${isResizing || isRotating || imageSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                  >
                    <div 
                      className={`absolute -inset-[1px] border-[1.5px] pointer-events-none shadow-sm transition-colors ${isLocked ? 'border-white/50 border-dashed' : 'border-white/70'}`} 
                      style={{ borderRadius: `${radius + 1}px` }} 
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
                          className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white rounded-full shadow-md border-[1.5px] border-black/10 pointer-events-auto cursor-nwse-resize hover:scale-125 active:scale-110 transition-transform z-50" 
                          onPointerDown={(e) => handleResizeDown(e, 'tl')} 
                          title="Drag to minimize / maximize size" 
                        />
                        <div 
                          className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white rounded-full shadow-md border-[1.5px] border-black/10 pointer-events-auto cursor-nesw-resize hover:scale-125 active:scale-110 transition-transform z-50" 
                          onPointerDown={(e) => handleResizeDown(e, 'tr')} 
                          title="Drag to minimize / maximize size" 
                        />
                        <div 
                          className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white rounded-full shadow-md border-[1.5px] border-black/10 pointer-events-auto cursor-nesw-resize hover:scale-125 active:scale-110 transition-transform z-50" 
                          onPointerDown={(e) => handleResizeDown(e, 'bl')} 
                          title="Drag to minimize / maximize size" 
                        />
                        <div 
                          className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white rounded-full shadow-md border-[1.5px] border-black/10 pointer-events-auto cursor-nwse-resize hover:scale-125 active:scale-110 transition-transform z-50" 
                          onPointerDown={(e) => handleResizeDown(e, 'br')} 
                          title="Drag to minimize / maximize size" 
                        />

                        {/* Top Rotation Stalk & Knob */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto z-50">
                          <div 
                            role="slider"
                            aria-label="Rotate Image drag handle"
                            aria-valuemin={0}
                            aria-valuemax={360}
                            aria-valuenow={rotation}
                            tabIndex={0}
                            className="w-5 h-5 rounded-full bg-white text-black shadow-md border border-black/15 flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
                            title="Drag to rotate (Hold Shift for 15° snap)"
                            onPointerDown={handleRotateDown}
                          >
                            <RotateCw size={10} className="text-black/80" aria-hidden="true" />
                          </div>
                          <div className="w-[1.5px] h-3 bg-white/50" />
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Snap guides */}
            {!isExporting && isDragging && pos.x === 0 && <div data-no-export="true" className="no-export absolute top-0 bottom-0 left-1/2 w-px bg-white/40 z-50 pointer-events-none drop-shadow-md" />}
            {!isExporting && isDragging && pos.y === 0 && <div data-no-export="true" className="no-export absolute left-0 right-0 top-1/2 h-px bg-white/40 z-50 pointer-events-none drop-shadow-md" />}
            
            {watermark && watermarkTarget === 'canvas' && (
              <div 
                className={`absolute z-20 w-fit max-w-full inline-flex isolate ${isDraggingWatermark ? 'cursor-grabbing' : 'cursor-grab'} pointer-events-auto ${
                  watermarkPosition === 'bottom-right' ? 'bottom-6 right-6' :
                  watermarkPosition === 'bottom-left' ? 'bottom-6 left-6' :
                  watermarkPosition === 'bottom-center' ? 'bottom-6 left-1/2' :
                  'top-6 right-6'
                }`}
                onPointerDown={handleWatermarkPointerDown}
                onPointerMove={handleWatermarkPointerMove}
                onPointerUp={handleWatermarkPointerUp}
                onPointerLeave={handleWatermarkPointerUp}
                onClick={(e) => e.stopPropagation()}
                onWheel={handleWatermarkWheel}
                style={{
                  transform: `translate(${watermarkPosition === 'bottom-center' ? `calc(-50% + ${watermarkOffsetX}px)` : `${watermarkOffsetX}px`}, ${watermarkOffsetY}px)`
                }}
              >
                <div 
                  className="relative px-4 py-2 rounded-full text-xs font-medium tracking-wide inline-flex items-center gap-1.5 whitespace-nowrap overflow-hidden leading-none select-none shrink-0"
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
                  
                  {/* Selection Outline */}
                  {!isExporting && watermarkSelected && (
                    <div data-no-export="true" className="no-export absolute inset-0 border-[1.5px] border-white/70 rounded-full pointer-events-none shadow-[0_0_0_1px_rgba(0,0,0,0.1)] z-50" />
                  )}
                </div>
              </div>
            )}
          </div>
          </div>
        </div>

        {/* Floating Image Editor Controls (Top Center) */}
        {!isExporting && image && (imageSelected || isRotating) && (
          <div 
            data-no-export="true"
            className="no-export absolute top-6 md:top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-1.5 bg-[#1C1C1E]/95 backdrop-blur-md border border-white/10 rounded-xl px-2 sm:px-2.5 py-1.5 shadow-2xl z-[150] pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-200"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              title="Rotate 90°"
              onClick={() => setRotation((r) => (r + 90) % 360)}
            >
              <RotateCw className="w-4 h-4 sm:w-[15px] sm:h-[15px]" />
            </button>
            {isEditingRotation ? (
              <div className="flex items-center mx-1">
                <input
                  type="text"
                  inputMode="numeric"
                  autoFocus
                  className="w-10 sm:w-12 h-6 sm:h-7 px-1 bg-black/70 text-white border border-white/10 rounded-md text-center text-[10px] sm:text-xs font-mono tabular-nums focus:outline-none focus:ring-1 focus:ring-white/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                <span className="text-[10px] sm:text-[11px] font-mono tabular-nums text-white/50 ml-1">°</span>
              </div>
            ) : (
              <button 
                className="text-[10px] sm:text-xs font-mono tabular-nums font-semibold text-white/90 mx-1 px-1.5 sm:px-2 py-1 rounded-md bg-white/5 cursor-text hover:text-white hover:bg-white/10 hover:border-white/10 border border-transparent transition"
                title="Click to manually enter degree"
                onClick={() => {
                  setRotationInput(String(rotation));
                  setIsEditingRotation(true);
                }}
              >
                {rotation}°
              </button>
            )}
            <div className="w-px h-5 bg-white/10 mx-1" />
            <button
              className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors select-none"
              title="Minimize / Scale Down (-1%)"
              onPointerDown={(e) => startScale(e, -1)}
              onPointerUp={stopScale}
              onPointerLeave={stopScale}
              onPointerCancel={stopScale}
            >
              <Minimize2 className="w-4 h-4 sm:w-[15px] sm:h-[15px]" />
            </button>
            <button
              className="text-[10px] sm:text-xs font-mono tabular-nums font-semibold text-white/90 px-1.5 sm:px-2 py-1 mx-0.5 rounded-md bg-white/5 hover:text-white hover:bg-white/10 transition-colors"
              title="Click to reset size (100%)"
              onClick={() => setScale(100)}
            >
              {Math.round(scale)}%
            </button>
            <button
              className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors select-none"
              title="Maximize / Scale Up (+1%)"
              onPointerDown={(e) => startScale(e, 1)}
              onPointerUp={stopScale}
              onPointerLeave={stopScale}
              onPointerCancel={stopScale}
            >
              <Maximize2 className="w-4 h-4 sm:w-[15px] sm:h-[15px]" />
            </button>
            <div className="w-px h-5 bg-white/10 mx-1" />
            <button
              className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg transition-colors ${
                isLocked 
                  ? 'bg-white/20 text-white' 
                  : 'hover:bg-white/10 text-white/80 hover:text-white'
              }`}
              title={isLocked ? "Unlock Position (Currently Locked)" : "Lock Position on Canvas"}
              onClick={() => setIsLocked(!isLocked)}
            >
              {isLocked ? <Lock className="w-4 h-4 sm:w-[15px] sm:h-[15px] text-white" /> : <Unlock className="w-4 h-4 sm:w-[15px] sm:h-[15px]" />}
            </button>
            <div className="w-px h-5 bg-white/10 mx-1" />
            <button
              className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
              title="Remove image"
              onClick={() => { 
                setImage(null); 
                setImageSelected(false); 
                setRotation(0); 
                setPos({ x: 0, y: 0 }); 
                handleApplyPreset({
                  background: 'url("/wallpapers/dark-green-8k.webp")',
                  showMacOsBar: false, view: 'default', perspective: 'front',
                  rotateX: 0, rotateY: 0, rotateZ: 0, perspectiveDepth: 1200,
                  glassBorder: true, glassBorderWidth: 4, glassBorderOpacity: 20, glassBorderBlur: 20,
                  padding: 64, radius: 16, shadow: 25, bgBlur: 0, filter: 'none',
                  noiseIntensity: 0, grainIntensity: 0, brightness: 100, contrast: 100, saturation: 100, hueRotate: 0,
                });
              }}
            >
              <Trash2 className="w-4 h-4 sm:w-[15px] sm:h-[15px]" />
            </button>
          </div>
        )}

        {/* Floating Watermark Editor Controls (Top Center) */}
        {!isExporting && watermark && watermarkSelected && (
          <div 
            data-no-export="true"
            className="no-export absolute top-6 md:top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-1.5 bg-[#1C1C1E]/95 backdrop-blur-md border border-white/10 rounded-xl px-2 sm:px-2.5 py-1.5 shadow-2xl z-[150] pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-200"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors select-none"
              title="Scale Down (-5%)"
              onPointerDown={(e) => startWatermarkScale(e, -5)}
              onPointerUp={stopWatermarkScale}
              onPointerLeave={stopWatermarkScale}
              onPointerCancel={stopWatermarkScale}
            >
              <Minimize2 className="w-4 h-4 sm:w-[15px] sm:h-[15px]" />
            </button>
            <button
              className="text-[10px] sm:text-xs font-mono tabular-nums font-semibold text-white/90 px-1.5 sm:px-2 py-1 mx-0.5 rounded-md bg-white/5 hover:text-white hover:bg-white/10 transition-colors"
              title="Click to reset size (100%)"
              onClick={() => setWatermarkScale(100)}
            >
              {Math.round(watermarkScale)}%
            </button>
            <button
              className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors select-none"
              title="Scale Up (+5%)"
              onPointerDown={(e) => startWatermarkScale(e, 5)}
              onPointerUp={stopWatermarkScale}
              onPointerLeave={stopWatermarkScale}
              onPointerCancel={stopWatermarkScale}
            >
              <Maximize2 className="w-4 h-4 sm:w-[15px] sm:h-[15px]" />
            </button>
            <div className="w-px h-5 bg-white/10 mx-1" />
            <div className="flex gap-0.5">
              <button 
                className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-md hover:bg-white/10 text-white/80 hover:text-white transition-colors" 
                onPointerDown={(e) => startWatermarkNudge(e, 0, -1)}
                onPointerUp={stopWatermarkNudge}
                onPointerLeave={stopWatermarkNudge}
                onPointerCancel={stopWatermarkNudge}
                title="Nudge Up (1px)"
              >
                <ArrowUp className="w-3.5 h-3.5 sm:w-[14px] sm:h-[14px]" />
              </button>
              <button 
                className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-md hover:bg-white/10 text-white/80 hover:text-white transition-colors" 
                onPointerDown={(e) => startWatermarkNudge(e, 0, 1)}
                onPointerUp={stopWatermarkNudge}
                onPointerLeave={stopWatermarkNudge}
                onPointerCancel={stopWatermarkNudge}
                title="Nudge Down (1px)"
              >
                <ArrowDown className="w-3.5 h-3.5 sm:w-[14px] sm:h-[14px]" />
              </button>
              <button 
                className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-md hover:bg-white/10 text-white/80 hover:text-white transition-colors" 
                onPointerDown={(e) => startWatermarkNudge(e, -1, 0)}
                onPointerUp={stopWatermarkNudge}
                onPointerLeave={stopWatermarkNudge}
                onPointerCancel={stopWatermarkNudge}
                title="Nudge Left (1px)"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-[14px] sm:h-[14px]" />
              </button>
              <button 
                className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-md hover:bg-white/10 text-white/80 hover:text-white transition-colors" 
                onPointerDown={(e) => startWatermarkNudge(e, 1, 0)}
                onPointerUp={stopWatermarkNudge}
                onPointerLeave={stopWatermarkNudge}
                onPointerCancel={stopWatermarkNudge}
                title="Nudge Right (1px)"
              >
                <ArrowRight className="w-3.5 h-3.5 sm:w-[14px] sm:h-[14px]" />
              </button>
            </div>
            <div className="w-px h-5 bg-white/10 mx-1" />
            <button
              className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
              title="Remove watermark"
              onClick={() => { setWatermark(''); setWatermarkSelected(false); setWatermarkOffsetX(0); setWatermarkOffsetY(0); }}
            >
              <Trash2 className="w-4 h-4 sm:w-[15px] sm:h-[15px]" />
            </button>
          </div>
        )}

        {/* Floating Viewport Zoom HUD Controls (Bottom Center) */}
        <div 
          data-no-export="true"
          className="no-export absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#1C1C1E]/90 border border-white/5 backdrop-blur-md rounded-lg px-2 py-1 shadow-2xl z-40 pointer-events-auto"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            onPointerDown={(e) => startViewportZoom(e, -0.01)}
            onPointerUp={stopViewportZoom}
            onPointerLeave={stopViewportZoom}
            onPointerCancel={stopViewportZoom}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/10 text-zinc-300 hover:text-white transition-colors select-none"
            title="Zoom Out (-1%)"
          >
            <ZoomOut size={14} />
          </button>
          <button
            onClick={resetViewport}
            className="px-2 py-1 text-[11px] font-mono tabular-nums font-medium text-zinc-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
            title="Reset Zoom to 100%"
          >
            {Math.round((viewportZoom / baseZoom) * 100)}%
          </button>
          <button
            onPointerDown={(e) => startViewportZoom(e, 0.01)}
            onPointerUp={stopViewportZoom}
            onPointerLeave={stopViewportZoom}
            onPointerCancel={stopViewportZoom}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/10 text-zinc-300 hover:text-white transition-colors select-none"
            title="Zoom In (+1%)"
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

      {/* Mobile Overlay for Right Sidebar */}
      {showRightSidebar && (
        <div className="md:hidden fixed inset-0 bg-black/60 z-[290] backdrop-blur-sm" onClick={() => setShowRightSidebar(false)} />
      )}

      {/* Right Sidebar - 3D Camera, Studio Presets & Collapsible Studio Controls */}
      <aside className={`fixed md:relative flex z-[300] md:z-20 inset-y-0 right-0 w-[85vw] max-w-[300px] md:min-w-[300px] md:w-[300px] bg-panel border-l border-white/5 flex-col shadow-lg select-none h-full overflow-hidden transition-transform duration-300 ${showRightSidebar ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
        
        {/* Top Header Bar aligned with h-16 main header */}
        <div className="hidden md:flex h-16 border-b border-white/5 px-6 items-center justify-end shrink-0 gap-3">
          {/* GitHub Star Button (Minimal) */}
          <a 
            href="https://github.com/ishivamgaur/noiceSS" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-white/5 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/10 text-xs font-medium transition text-zinc-200 hover:text-white active:scale-[0.96]"
            title="Star NOICESS on GitHub"
          >
            <Star size={13} className={starCount !== null ? "fill-yellow-500 text-yellow-500" : ""} />
            <span>Star</span>
            {starCount !== null && (
              <>
                <span className="w-px h-3 bg-white/20 mx-0.5"></span>
                <span className="font-mono tabular-nums">{starCount}</span>
              </>
            )}
          </a>
          {/* X (Twitter) Button */}
          <a 
            href="https://twitter.com/ishivgaur" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center w-[34px] h-[34px] rounded-lg border border-white/5 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/10 transition text-zinc-200 hover:text-white active:scale-[0.96]"
            title="Follow on X"
          >
            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
        </div>
        
        {/* Mobile Sidebar Close Header */}
        <div className="md:hidden h-14 border-b border-white/5 px-4 flex items-center justify-between shrink-0">
          <span className="font-bold text-sm text-zinc-400 uppercase">Studio</span>
          <button onClick={() => setShowRightSidebar(false)} className="text-zinc-400 hover:text-white p-1"><X size={18}/></button>
        </div>

        {/* Sticky Camera Header */}
        <div className="px-3 h-[61px] flex items-center border-b border-white/5 shrink-0">
          <div className="relative flex items-center justify-center gap-2 bg-white/[0.02] h-[36px] rounded-lg border border-white/[0.04] w-full">
            <Camera size={15} className="text-white" />
            <span className="text-[12px] font-bold text-white uppercase tracking-[0.1em] leading-none mt-[1px]">Camera & Angles</span>
          </div>
        </div>

        {/* Scrollable Content Container with clean symmetrical padding */}
        <div className="flex-1 overflow-y-auto overscroll-contain [scrollbar-gutter:stable] p-3 pb-8 flex flex-col gap-3">
          {/* Section 1: 3D Camera & XYZ Orbit */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between w-full h-[26px] min-h-[26px] px-0.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider leading-none">
              <button
                onClick={() => toggleSection('perspectives')}
                className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors group cursor-pointer leading-none"
              >
                <ChevronDown size={13} className={`shrink-0 text-zinc-500 group-hover:text-zinc-300 transition-transform duration-200 ${expandedSections.perspectives ? 'rotate-0' : '-rotate-90'}`} />
                <span className="leading-none">3D ORBIT & TILT</span>
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
                <span className="leading-none">ANGLES & PERSPECTIVE</span>
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
                          ? 'bg-white/15 border-white ring-1 ring-white/30 shadow-md' 
                          : 'bg-white/[0.02] border-white/[0.04] hover:border-white/20 hover:bg-white/[0.05]'
                      }`}
                      title={p.desc}
                      aria-label={p.name}
                    >
                      {/* Clean Minimal Preview Box - Dynamic Aspect Ratio */}
                      <div 
                        className="w-full flex items-center justify-center relative overflow-hidden bg-black/30"
                        style={{
                          aspectRatio: aspectStyle === 'auto' ? '4/3' : aspectStyle,
                        }}
                      >
                        {image ? (
                          <div 
                            className="w-full h-full flex items-center justify-center overflow-hidden shadow-sm relative"
                            style={{ 
                              padding: `${(padding / parseFloat(canvasDimensions.width as string)) * 100}%`,
                            }}
                          >
                            {/* Background Layer with Blur */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                              <div 
                                className="absolute inset-0 w-full h-full"
                                style={{
                                  ...(background === 'CURRENT_IMAGE'
                                    ? { backgroundImage: image ? `url("${image}")` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }
                                    : background.startsWith('url(') 
                                    ? { backgroundImage: background, backgroundSize: 'cover', backgroundPosition: 'center' }
                                    : { background: background }),
                                  filter: bgBlur > 0 ? `blur(${bgBlur / 4}px)` : 'none',
                                  transform: bgBlur > 0 ? `scale(${1 + (bgBlur / 100)})` : 'none',
                                }}
                              />
                            </div>
                            
                            <div 
                              className="flex items-center justify-center transition-transform duration-300 w-full h-full z-10"
                              style={{ 
                                transform: p.previewTransform || p.transform,
                                transformStyle: 'preserve-3d',
                              }}
                            >
                                {/* Miniaturized Screenshot Card */}
                                <div 
                                  className="relative flex flex-col"
                                  style={{
                                    maxWidth: 'none',
                                    maxHeight: 'none',
                                    width: `${scale}%`,
                                    height: aspectStyle === 'auto' ? 'auto' : `${scale}%`,
                                    borderRadius: `${radius / 4}px`,
                                    boxShadow: 'none',
                                    border: 'none',
                                    background: 'transparent',
                                    backdropFilter: 'none',
                                    WebkitBackdropFilter: 'none',
                                    padding: '0',
                                    filter: imageBlur > 0 ? `blur(${imageBlur / 4}px)` : 'none',
                                    isolation: 'isolate'
                                  }}
                                >
                                  <div className={`relative flex flex-col overflow-hidden w-full h-full`} style={{ borderRadius: `${radius / 4}px` }}>
                                    {showMacOsBar && (
                                      <div className={`shrink-0 bg-[#1C1C1E] flex items-center px-1.5 py-0.5 gap-0.5 ${view === 'browser' ? 'border-b border-white/10' : ''}`}>
                                        <div className="w-[3px] h-[3px] rounded-full bg-[#ff5f56]" />
                                        <div className="w-[3px] h-[3px] rounded-full bg-[#ffbd2e]" />
                                        <div className="w-[3px] h-[3px] rounded-full bg-[#27c93f]" />
                                      </div>
                                    )}
                                    <img 
                                      src={image} 
                                      alt={p.name} 
                                      className="w-full h-full object-contain block"
                                    />
                                  </div>
                                </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* Background Layer with Blur (Actual Selected Background) */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                              <div 
                                className="absolute inset-0 w-full h-full"
                                style={{
                                  ...(background === 'CURRENT_IMAGE'
                                    ? { backgroundImage: image ? `url("${image}")` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }
                                    : background.startsWith('url(') 
                                    ? { backgroundImage: background, backgroundSize: 'cover', backgroundPosition: 'center' }
                                    : { background: background }),
                                  filter: bgBlur > 0 ? `blur(${bgBlur / 4}px)` : 'none',
                                  transform: bgBlur > 0 ? `scale(${1 + (bgBlur / 100)})` : 'none',
                                }}
                              />
                            </div>
                            
                            {/* 3D Transformed Mock Card */}
                            <div 
                              className="flex items-center justify-center transition-transform duration-300 w-full h-full z-10"
                              style={{ 
                                transform: p.previewTransform || p.transform,
                                transformStyle: 'preserve-3d',
                              }}
                            >
                                <div 
                                  className="relative flex flex-col w-[75%] rounded-sm overflow-hidden shadow-2xl border border-white/20 bg-white/5 backdrop-blur-sm"
                                  style={{ aspectRatio: aspectStyle === 'auto' ? '16/9' : aspectStyle }}
                                >
                                  {showMacOsBar && (
                                    <div className="shrink-0 bg-[#1C1C1E] flex items-center px-1.5 py-0.5 gap-0.5">
                                      <div className="w-[3px] h-[3px] rounded-full bg-[#ff5f56]" />
                                      <div className="w-[3px] h-[3px] rounded-full bg-[#ffbd2e]" />
                                      <div className="w-[3px] h-[3px] rounded-full bg-[#27c93f]" />
                                    </div>
                                  )}
                                  <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon size={16} className="text-white/20" />
                                  </div>
                                </div>
                            </div>

                            {/* Overlay Icon */}
                            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                              <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/20 shadow-lg ${isActive ? 'text-white' : 'text-zinc-300 group-hover:text-white transition-colors'}`}>
                                <p.icon size={16} aria-hidden="true" />
                              </div>
                            </div>
                          </>
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
                <span className="leading-none">WINDOW CHROME</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono tabular-nums leading-none">4 Themes</span>
            </button>

            {expandedSections.templates && (
              <div className="p-3 rounded-xl bg-white/[0.015] border border-white/[0.04] flex flex-col gap-2 animate-in fade-in slide-in-from-top-1 duration-150">
                <button 
                  onClick={() => { setView('default'); setShowMacOsBar(true); setShowBrowserBar(false); setGlassBorder(false); }}
                  className={`flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all duration-150 active:scale-[0.98] ${
                    view === 'default' && showMacOsBar && !showBrowserBar && !glassBorder 
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
                  onClick={() => { setView('browser'); setShowMacOsBar(true); setShowBrowserBar(true); setGlassBorder(false); }}
                  className={`flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all duration-150 active:scale-[0.98] ${
                    view === 'browser' || showBrowserBar
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
                  onClick={() => { setView('minimal'); setShowMacOsBar(false); setShowBrowserBar(false); setGlassBorder(false); }}
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
                    <span className="text-[10px] text-zinc-500">Clean rounded image only</span>
                  </div>
                </button>

                <button 
                  onClick={() => { 
                    setView('default'); 
                    setShowMacOsBar(true); 
                    setShowBrowserBar(false);
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
                <span className="leading-none">STUDIO LIGHTING</span>
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
                {/* Application Layer Target */}
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-2 font-medium">Lighting Target</label>
                  <div className="relative grid grid-cols-2 gap-1 bg-white/[0.02] p-1 rounded-lg border border-white/[0.04] isolate">
                    {(() => {
                      const targets = ['canvas', 'image'];
                      const idx = targets.indexOf(lightingTarget);
                      return (
                        <div 
                          className="absolute top-1 bottom-1 w-[calc((100%-8px)/2)] bg-white/10 border border-white/20 rounded-md shadow-sm ring-1 ring-white/10 transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none -z-10"
                          style={{
                            transform: `translateX(calc(${idx * 100}% + ${idx * 4}px))`,
                            left: '4px'
                          }}
                        />
                      );
                    })()}
                    {['canvas', 'image'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setLightingTarget(t)}
                        className={`py-1 text-[11px] font-medium capitalize rounded-md transition-colors duration-200 active:scale-95 text-center cursor-pointer ${
                          lightingTarget === t 
                            ? 'text-white font-semibold' 
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Manual Adjustments Sliders */}
                <div className="flex flex-col gap-3">
                  {/* Brightness */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <label className="text-zinc-300 font-medium flex items-center gap-1.5">
                        <Sun size={12} className="text-zinc-400" />
                        <span>Brightness</span>
                      </label>
                      <span className="text-zinc-400 font-mono tabular-nums text-[11px] bg-white/[0.03] px-1.5 py-0.5 rounded-md border border-white/[0.03]">{lightingTarget === 'image' ? imageBrightness : brightness}%</span>
                    </div>
                    <Slider min={50} max={150} step={1} value={[lightingTarget === 'image' ? imageBrightness : brightness]} onValueChange={(v) => { const val = Array.isArray(v) ? v[0] : v as number; if (lightingTarget === 'canvas' || lightingTarget === 'both') setBrightness(val); if (lightingTarget === 'image' || lightingTarget === 'both') setImageBrightness(val); }} />
                  </div>

                  {/* Contrast */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <label className="text-zinc-300 font-medium flex items-center gap-1.5">
                        <Sliders size={12} className="text-zinc-400" />
                        <span>Contrast</span>
                      </label>
                      <span className="text-zinc-400 font-mono tabular-nums text-[11px] bg-white/[0.03] px-1.5 py-0.5 rounded-md border border-white/[0.03]">{lightingTarget === 'image' ? imageContrast : contrast}%</span>
                    </div>
                    <Slider min={50} max={150} step={1} value={[lightingTarget === 'image' ? imageContrast : contrast]} onValueChange={(v) => { const val = Array.isArray(v) ? v[0] : v as number; if (lightingTarget === 'canvas' || lightingTarget === 'both') setContrast(val); if (lightingTarget === 'image' || lightingTarget === 'both') setImageContrast(val); }} />
                  </div>

                  {/* Saturation */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <label className="text-zinc-300 font-medium flex items-center gap-1.5">
                        <Droplet size={12} className="text-zinc-400" />
                        <span>Saturation</span>
                      </label>
                      <span className="text-zinc-400 font-mono tabular-nums text-[11px] bg-white/[0.03] px-1.5 py-0.5 rounded-md border border-white/[0.03]">{lightingTarget === 'image' ? imageSaturation : saturation}%</span>
                    </div>
                    <Slider min={0} max={200} step={1} value={[lightingTarget === 'image' ? imageSaturation : saturation]} onValueChange={(v) => { const val = Array.isArray(v) ? v[0] : v as number; if (lightingTarget === 'canvas' || lightingTarget === 'both') setSaturation(val); if (lightingTarget === 'image' || lightingTarget === 'both') setImageSaturation(val); }} />
                  </div>

                  {/* Hue Shift / Tone */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <label className="text-zinc-300 font-medium flex items-center gap-1.5">
                        <Palette size={12} className="text-zinc-400" />
                        <span>Color Tone (Hue)</span>
                      </label>
                      <span className="text-zinc-400 font-mono tabular-nums text-[11px] bg-white/[0.03] px-1.5 py-0.5 rounded-md border border-white/[0.03]">{lightingTarget === 'image' ? imageHueRotate : hueRotate}°</span>
                    </div>
                    <Slider min={0} max={360} step={1} value={[lightingTarget === 'image' ? imageHueRotate : hueRotate]} onValueChange={(v) => { const val = Array.isArray(v) ? v[0] : v as number; if (lightingTarget === 'canvas' || lightingTarget === 'both') setHueRotate(val); if (lightingTarget === 'image' || lightingTarget === 'both') setImageHueRotate(val); }} />
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
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[300] flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setShowExportModal(false)}
        >
          <div 
            className="bg-[#141417] border border-white/10 rounded-2xl w-full max-w-[380px] p-4 md:p-4.5 shadow-2xl flex flex-col gap-3.5 animate-in zoom-in-95 duration-150"
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
