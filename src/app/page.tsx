"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Upload, Download, Layers, Monitor, Image as ImageIcon, Sparkles, Filter, 
  ChevronDown, Maximize, Square, LayoutTemplate, Smartphone, RotateCw, Trash2, 
  Maximize2, Minimize2, ZoomIn, ZoomOut, Copy, Check, Sliders, Palette, 
  Wand2, Box, Eye, Sparkle, RefreshCw, Sun, Moon, Laptop, Globe, CheckCircle2,
  Loader2, Aperture, SlidersHorizontal, Droplets, Droplet, Tv, Radio, Film, 
  Focus, Pipette, Paintbrush, Flame, Zap, SunMedium, Type, Scan, Scaling, 
  AppWindow, Gauge, EyeOff, SlidersVertical, X
} from 'lucide-react';
import { toPng, toJpeg, toBlob } from 'html-to-image';
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const ASPECT_CATEGORIES = [
  {
    name: 'General & Photo',
    ratios: [
      { id: 'auto', aspect: 'auto', name: 'Auto Fit', desc: 'Freeform', icon: Maximize },
      { id: 'standard-1-1', aspect: '1/1', name: 'Square', desc: '1:1', icon: Square },
      { id: 'standard-4-3', aspect: '4/3', name: 'Classic', desc: '4:3', icon: ImageIcon },
      { id: 'standard-3-2', aspect: '3/2', name: 'Landscape', desc: '3:2', icon: ImageIcon },
    ]
  },
  {
    name: 'Social Posts',
    ratios: [
      { id: 'ig-post', aspect: '1/1', name: 'Instagram', desc: 'Post (1:1)', icon: Square },
      { id: 'ig-portrait', aspect: '4/5', name: 'IG Portrait', desc: 'Feed (4:5)', icon: LayoutTemplate },
      { id: 'tw-post', aspect: '16/9', name: 'Twitter (X)', desc: 'Post (16:9)', icon: Monitor },
      { id: 'li-post', aspect: '4/5', name: 'LinkedIn', desc: 'Post (4:5)', icon: LayoutTemplate },
    ]
  },
  {
    name: 'Stories & Video',
    ratios: [
      { id: 'tk-video', aspect: '9/16', name: 'TikTok', desc: 'Video (9:16)', icon: Smartphone },
      { id: 'ig-story', aspect: '9/16', name: 'IG Story', desc: 'Reels (9:16)', icon: Smartphone },
      { id: 'yt-thumb', aspect: '16/9', name: 'YouTube', desc: 'Video (16:9)', icon: Monitor },
      { id: 'yt-shorts', aspect: '9/16', name: 'YT Shorts', desc: 'Video (9:16)', icon: Smartphone },
    ]
  },
  {
    name: 'Banners & Covers',
    ratios: [
      { id: 'tw-header', aspect: '3/1', name: 'Twitter (X)', desc: 'Header (3:1)', icon: LayoutTemplate },
      { id: 'yt-banner', aspect: '16/9', name: 'YouTube', desc: 'Channel Art', icon: Monitor },
      { id: 'li-banner', aspect: '4/1', name: 'LinkedIn', desc: 'Banner (4:1)', icon: LayoutTemplate },
      { id: 'fb-cover', aspect: '2.62/1', name: 'Facebook', desc: 'Cover', icon: LayoutTemplate },
    ]
  }
];

const FLAT_RATIOS = ASPECT_CATEGORIES.flatMap(c => c.ratios);

const MACOS_BACKGROUNDS = [
  { name: 'Big Sur Dark', url: '/wallpapers/macos-big-sur-apple-layers-fluidic-colorful-dark-wwdc-2020-6016x6016-1432.jpg' },
  { name: 'Big Sur Light', url: '/wallpapers/macos-big-sur-apple-layers-fluidic-colorful-wwdc-stock-4096x2304-1455.jpg' },
  { name: 'Monterey Dark', url: '/wallpapers/macos-monterey-stock-black-dark-mode-layers-5k-6016x6016-5889.jpg' },
  { name: 'Monterey WWDC', url: '/wallpapers/macos-monterey-wwdc-21-stock-dark-mode-5k-6016x6016-5585.jpg' },
  { name: 'Sequoia', url: '/wallpapers/macos-sequoia-forest-3840x2160-24082.jpg' },
  { name: 'Tahoe Light', url: '/wallpapers/macos-tahoe-26-5120x2880-22675.jpg' },
  { name: 'Tahoe Dark', url: '/wallpapers/macos-tahoe-26-5k-6016x6016-22672.jpg' },
  { name: 'Abstract Waves', url: '/wallpapers/abstract-waves-3840x2160-26731.jpg' },
  { name: 'Blue Abstract', url: '/wallpapers/blue-abstract-3840x2160-24798.png' },
  { name: 'Iridescent', url: '/wallpapers/iridescent-spheres-3840x2160-26346.jpg' },
  { name: 'Golden', url: '/wallpapers/macos-27-golden-4480x3088-26625.png' },
  { name: 'Surface', url: '/wallpapers/microsoft-surface-3840x2160-26627.png' },
  { name: 'MacBook Abstract', url: '/wallpapers/wp14041666-macbook-abstract-wallpapers.jpg' },
  { name: 'Dark Green 8K', url: '/wallpapers/wp14135599-8k-mac-dark-green-wallpapers.jpg' },
  { name: 'Emerald Dark', url: '/wallpapers/wp14135646-8k-mac-dark-green-wallpapers.jpg' },
  { name: 'Dark macOS 4K', url: '/wallpapers/wp16202777-dark-4k-macos-wallpapers.webp' },
  { name: 'Apple Retina', url: '/wallpapers/wp8994371-apple-4k-retina-wallpapers.jpg' }
];

const GRADIENTS = [
  'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)',
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(to top, #0ba360 0%, #3cba92 100%)',
  'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
  'linear-gradient(to right, #ff758c 0%, #ff7eb3 100%)',
  'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
  'linear-gradient(to right, #f78ca0 0%, #f9748f 19%, #fd868c 60%, #fe9a8b 100%)',
  'linear-gradient(to top, #30cfd0 0%, #330867 100%)',
  'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)',
  'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
  'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)',
];

const SOLID_COLORS = [
  { name: 'Transparent', value: 'transparent' },
  { name: 'Pitch Black', value: '#000000' },
  { name: 'Obsidian', value: '#0f0f11' },
  { name: 'Slate Dark', value: '#18181b' },
  { name: 'Pure White', value: '#ffffff' },
  { name: 'Warm Cream', value: '#fef3c7' },
  { name: 'Crimson', value: '#ef4444' },
  { name: 'Sapphire', value: '#3b82f6' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Amethyst', value: '#8b5cf6' },
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
    icon: Sparkles,
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
    id: 'obsidian',
    name: 'Obsidian Dark',
    desc: 'Dark 8K Green + Glass',
    icon: Moon,
    config: {
      background: 'url("/wallpapers/wp14135599-8k-mac-dark-green-wallpapers.jpg")',
      showMacOsBar: true,
      view: 'default',
      perspective: 'isometric-left',
      glassBorder: false,
      padding: 64,
      radius: 16,
      shadow: 35,
      bgBlur: 0,
      filter: 'none',
      noiseIntensity: 15,
      grainIntensity: 0,
    }
  },
  {
    id: 'liquid-glass',
    name: 'Liquid Glass',
    desc: 'Iridescent Waves + Frost',
    icon: Droplet,
    config: {
      background: 'url("/wallpapers/abstract-waves-3840x2160-26731.jpg")',
      showMacOsBar: true,
      view: 'default',
      perspective: 'front',
      glassBorder: true,
      glassBorderWidth: 10,
      glassBorderOpacity: 30,
      padding: 72,
      radius: 20,
      shadow: 30,
      bgBlur: 10,
      filter: 'none',
      noiseIntensity: 0,
      grainIntensity: 0,
    }
  },
  {
    id: 'safari-browser',
    name: 'Safari Browser',
    desc: 'Browser bar + Clean Flat',
    icon: Globe,
    config: {
      background: 'url("/wallpapers/blue-abstract-3840x2160-24798.png")',
      showMacOsBar: true,
      view: 'browser',
      perspective: 'front',
      glassBorder: false,
      padding: 56,
      radius: 12,
      shadow: 25,
      bgBlur: 0,
      filter: 'none',
      noiseIntensity: 0,
      grainIntensity: 0,
    }
  },
  {
    id: 'cyber-neon',
    name: 'Cyberpunk Neon',
    desc: 'High Contrast + 3D Tilt',
    icon: Zap,
    config: {
      background: 'url("/wallpapers/wp16202777-dark-4k-macos-wallpapers.webp")',
      showMacOsBar: true,
      view: 'default',
      perspective: 'isometric-left',
      glassBorder: true,
      glassBorderWidth: 6,
      glassBorderOpacity: 40,
      padding: 80,
      radius: 18,
      shadow: 45,
      bgBlur: 0,
      filter: 'contrast',
      noiseIntensity: 35,
      grainIntensity: 20,
    }
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    desc: 'Frameless + Soft Diffusion',
    icon: Sparkle,
    config: {
      background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
      showMacOsBar: false,
      view: 'minimal',
      perspective: 'front',
      glassBorder: false,
      padding: 48,
      radius: 14,
      shadow: 20,
      bgBlur: 0,
      filter: 'none',
      noiseIntensity: 0,
      grainIntensity: 0,
    }
  },
  {
    id: 'golden-hour',
    name: 'Golden Sunset',
    desc: 'Warm glow + Deep shadow',
    icon: Sun,
    config: {
      background: 'url("/wallpapers/macos-27-golden-4480x3088-26625.png")',
      showMacOsBar: true,
      view: 'default',
      perspective: 'subtle',
      glassBorder: false,
      padding: 68,
      radius: 16,
      shadow: 40,
      bgBlur: 5,
      filter: 'warm',
      noiseIntensity: 10,
      grainIntensity: 0,
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
  { id: 'cyberpunk', name: 'Cyber Neon', desc: 'Ultra Vivid Glow', filterStyle: 'saturate(180%) hue-rotate(280deg) contrast(140%)', icon: Sparkles },
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
  const [rotation, setRotation] = useState(0);
  const [padding, setPadding] = useState(64);
  const [radius, setRadius] = useState(16);
  const [shadow, setShadow] = useState(25);
  const [scale, setScale] = useState(100);
  const [aspectRatio, setAspectRatio] = useState('auto');
  const [customWidth, setCustomWidth] = useState<number>(1920);
  const [customHeight, setCustomHeight] = useState<number>(1080);
  const [showRatioMenu, setShowRatioMenu] = useState(false);
  const [showMacOsBar, setShowMacOsBar] = useState(false);
  const [glassBorder, setGlassBorder] = useState(false);
  const [glassBorderWidth, setGlassBorderWidth] = useState(8);
  const [glassBorderColor, setGlassBorderColor] = useState('#ffffff');
  const [glassBorderOpacity, setGlassBorderOpacity] = useState(20);
  
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
  
  const [filter, setFilter] = useState('none');
  const [view, setView] = useState('default');
  const [perspective, setPerspective] = useState('front');
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [rotateZ, setRotateZ] = useState(0);
  const [perspectiveDepth, setPerspectiveDepth] = useState(1200);

  const [watermark, setWatermark] = useState('');
  const [watermarkPlatform, setWatermarkPlatform] = useState<'x' | 'github' | 'instagram' | 'linkedin' | 'globe' | 'none'>('x');
  const [watermarkPosition, setWatermarkPosition] = useState<'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right'>('bottom-right');
  const [watermarkTarget, setWatermarkTarget] = useState<'screenshot' | 'canvas'>('screenshot');
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(65);
  
  // Collapsible sidebar accordion sections
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
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
  
  // Export states
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [exportScale, setExportScale] = useState<number>(2);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  
  const [background, setBackground] = useState('url("/wallpapers/abstract-waves-3840x2160-26731.jpg")');

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
    if (e.button === 1 || isSpacePressed || e.target === workspaceRef.current || (e.target as HTMLElement).getAttribute('data-workspace-bg') === 'true') {
      setIsPanningWorkspace(true);
      workspacePanRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        initialPanX: viewportPan.x,
        initialPanY: viewportPan.y,
      };
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
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
    let baseFilter = selectedFilter ? selectedFilter.filterStyle : 'none';
    if (imageBlur > 0) {
      baseFilter = baseFilter === 'none' ? `blur(${imageBlur}px)` : `${baseFilter} blur(${imageBlur}px)`;
    }
    return baseFilter;
  };

  const activeRatioData = aspectRatio === 'custom'
    ? { id: 'custom', aspect: `${customWidth}/${customHeight}`, name: `Custom (${customWidth}×${customHeight})`, desc: `${customWidth}×${customHeight}`, icon: Scaling }
    : (FLAT_RATIOS.find(r => r.id === aspectRatio) || FLAT_RATIOS[0]);

  const aspectStyle = aspectRatio === 'custom'
    ? `${customWidth}/${customHeight}`
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
    <div className="flex h-screen w-screen overflow-hidden bg-bg-dark text-text-main font-sans">
      
      {/* Left Sidebar */}
      <aside className="w-[300px] min-w-[300px] flex flex-col bg-panel border-r border-border overflow-y-auto p-4 gap-5 z-20 shadow-lg">
        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 bg-black/40 p-1 rounded-xl border border-white/5 relative">
          <button 
            className={`py-2 text-xs font-semibold rounded-lg transition-all text-center ${leftTab === 'layout' ? 'bg-blue-600/20 text-blue-400 shadow-sm border border-blue-500/30' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'}`}
            onClick={() => setLeftTab('layout')}
          >
            Layout
          </button>
          <button 
            className={`py-2 text-xs font-semibold rounded-lg transition-all text-center ${leftTab === 'background' ? 'bg-blue-600/20 text-blue-400 shadow-sm border border-blue-500/30' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'}`}
            onClick={() => setLeftTab('background')}
          >
            Backdrop
          </button>
          <button 
            className={`py-2 text-xs font-semibold rounded-lg transition-all text-center ${leftTab === 'effects' ? 'bg-blue-600/20 text-blue-400 shadow-sm border border-blue-500/30' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'}`}
            onClick={() => setLeftTab('effects')}
          >
            Effects
          </button>
        </div>

        {/* Tab 1: Layout & Frame */}
        {leftTab === 'layout' && (
          <div className="animate-in fade-in slide-in-from-left-2 duration-200 flex flex-col gap-5">
            <div>
              <h3 className="text-xs uppercase tracking-wider text-text-muted mb-3 font-semibold flex items-center justify-between">
                <span>Canvas Setup</span>
                <span className="text-[10px] text-accent lowercase font-mono">{activeRatioData.name}</span>
              </h3>
              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <label className="text-text-main font-medium">Padding</label>
                    <span className="text-text-muted font-mono">{padding}px</span>
                  </div>
                  <Slider min={0} max={120} step={1} value={[padding]} onValueChange={(v) => setPadding(Array.isArray(v) ? v[0] : v as number)} />
                </div>
                
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <label className="text-text-main font-medium">Image Size</label>
                    <span className="text-text-muted font-mono">{Math.round(scale)}%</span>
                  </div>
                  <Slider min={20} max={300} step={1} value={[scale]} onValueChange={(v) => setScale(Array.isArray(v) ? v[0] : v as number)} />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <label className="text-text-main font-medium">Rotation</label>
                    <div className="flex items-center gap-1">
                      <input 
                        type="text" 
                        inputMode="numeric"
                        value={rotation} 
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val)) setRotation(((Math.round(val) % 360) + 360) % 360);
                          else if (e.target.value === '') setRotation(0);
                        }}
                        className="w-12 h-6 px-1 bg-black/40 border border-border rounded text-center text-xs font-mono text-text-muted focus:text-white focus:outline-none focus:border-accent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-xs text-text-muted">°</span>
                    </div>
                  </div>
                  <Slider min={0} max={360} step={1} value={[rotation]} onValueChange={(v) => setRotation(Array.isArray(v) ? v[0] : v as number)} />
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <h3 className="text-xs uppercase tracking-wider text-text-muted mb-3 font-semibold">Frame & Window</h3>
              <div className="flex flex-col gap-4 text-xs">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <Checkbox checked={showMacOsBar} onCheckedChange={(c) => setShowMacOsBar(c as boolean)} />
                  <span className="text-text-main font-medium">macOS Titlebar</span>
                </label>
                
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <Checkbox checked={glassBorder} onCheckedChange={(c) => setGlassBorder(c as boolean)} />
                  <span className="text-text-main font-medium">Frosted Glass Border</span>
                </label>
                
                {glassBorder && (
                  <div className="flex flex-col gap-3 bg-black/20 p-3 rounded-xl border border-white/5">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <label className="text-text-muted font-medium">Border Width</label>
                        <span className="text-text-muted font-mono">{glassBorderWidth}px</span>
                      </div>
                      <Slider min={2} max={32} step={1} value={[glassBorderWidth]} onValueChange={(v) => setGlassBorderWidth(Array.isArray(v) ? v[0] : v as number)} />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <label className="text-text-muted font-medium">Border Opacity</label>
                        <span className="text-text-muted font-mono">{glassBorderOpacity}%</span>
                      </div>
                      <Slider min={5} max={100} step={1} value={[glassBorderOpacity]} onValueChange={(v) => setGlassBorderOpacity(Array.isArray(v) ? v[0] : v as number)} />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-text-muted font-medium">Border Tint</label>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full border border-white/20 shadow-inner" style={{ backgroundColor: glassBorderColor }} />
                        <input type="color" value={glassBorderColor} onChange={(e) => setGlassBorderColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 opacity-0 absolute" />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <label className="text-text-main font-medium">Border Radius</label>
                    <span className="text-text-muted font-mono">{radius}px</span>
                  </div>
                  <Slider min={0} max={40} step={1} value={[radius]} onValueChange={(v) => setRadius(Array.isArray(v) ? v[0] : v as number)} />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <label className="text-text-main font-medium">Drop Shadow</label>
                    <span className="text-text-muted font-mono">{shadow}px</span>
                  </div>
                  <Slider min={0} max={60} step={1} value={[shadow]} onValueChange={(v) => setShadow(Array.isArray(v) ? v[0] : v as number)} />
                </div>
              </div>
            </div>

            {/* Watermark & Social Badge Section */}
            <div className="border-t border-border pt-4">
              <h3 className="text-xs uppercase tracking-wider text-text-muted mb-3 font-semibold">Watermark & Badge</h3>
              <div className="flex flex-col gap-3.5 text-xs">
                {/* Platform selector */}
                <div>
                  <label className="text-xs text-text-muted font-medium mb-1.5 block">Platform Icon</label>
                  <div className="grid grid-cols-6 gap-1 bg-black/30 p-1 rounded-lg border border-white/5">
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
                        className={`py-1 text-[11px] font-medium rounded transition-colors flex items-center justify-center ${watermarkPlatform === p.id ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'}`}
                        title={p.id.toUpperCase()}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Handle / Text Input */}
                <div>
                  <label className="text-xs text-text-muted font-medium mb-1.5 block">Username / Handle</label>
                  <Input 
                    type="text" 
                    placeholder="e.g. ishivgaur or yourname" 
                    value={watermark} 
                    onChange={(e) => setWatermark(e.target.value)}
                    className="bg-black/30 text-xs border-border text-white"
                  />
                </div>

                {watermark && (
                  <>
                    {/* Placement Target */}
                    <div>
                      <label className="text-xs text-text-muted font-medium mb-1.5 block">Overlay Placement</label>
                      <div className="grid grid-cols-2 gap-1 bg-black/30 p-1 rounded-lg border border-white/5">
                        <button
                          onClick={() => setWatermarkTarget('screenshot')}
                          className={`py-1 text-[11px] font-medium rounded transition-colors ${watermarkTarget === 'screenshot' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm font-semibold' : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'}`}
                        >
                          On Screenshot
                        </button>
                        <button
                          onClick={() => setWatermarkTarget('canvas')}
                          className={`py-1 text-[11px] font-medium rounded transition-colors ${watermarkTarget === 'canvas' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm font-semibold' : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'}`}
                        >
                          On Canvas
                        </button>
                      </div>
                    </div>

                    {/* Position Selector */}
                    <div>
                      <label className="text-xs text-text-muted font-medium mb-1.5 block">Position</label>
                      <div className="grid grid-cols-4 gap-1 bg-black/30 p-1 rounded-lg border border-white/5">
                        {[
                          { id: 'bottom-right', label: 'B-Right' },
                          { id: 'bottom-center', label: 'B-Center' },
                          { id: 'bottom-left', label: 'B-Left' },
                          { id: 'top-right', label: 'T-Right' }
                        ].map((pos) => (
                          <button
                            key={pos.id}
                            onClick={() => setWatermarkPosition(pos.id as any)}
                            className={`py-1 text-[10px] font-medium rounded transition-colors ${watermarkPosition === pos.id ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm font-semibold' : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'}`}
                          >
                            {pos.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Opacity Slider */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <label className="text-text-muted font-medium">Watermark Opacity</label>
                        <span className="text-text-muted font-mono">{watermarkOpacity}%</span>
                      </div>
                      <Slider min={10} max={100} step={1} value={[watermarkOpacity]} onValueChange={(v) => setWatermarkOpacity(Array.isArray(v) ? v[0] : v as number)} />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Backgrounds */}
        {leftTab === 'background' && (
          <div className="animate-in fade-in slide-in-from-left-2 duration-200 flex flex-col gap-5">
            {/* Background Blur */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <label className="text-text-main font-semibold">Background Blur</label>
                <span className="text-text-muted font-mono bg-white/10 px-1.5 py-0.5 rounded text-[11px] font-medium">{bgBlur}px</span>
              </div>
              <Slider min={0} max={50} step={1} value={[bgBlur]} onValueChange={(v) => setBgBlur(Array.isArray(v) ? v[0] : v as number)} />
              
              <div className="grid grid-cols-4 gap-1 mt-2">
                {[
                  { val: 0, label: 'Off' },
                  { val: 12, label: 'Soft' },
                  { val: 24, label: 'Medium' },
                  { val: 40, label: 'Frosted' }
                ].map((p) => (
                  <button
                    key={p.val}
                    onClick={() => setBgBlur(p.val)}
                    className={`py-1 text-[10px] font-mono rounded transition-colors ${bgBlur === p.val ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'bg-black/30 text-zinc-400 hover:text-white hover:bg-white/[0.06]'}`}
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
                  className="mt-2 w-full py-1.5 px-2.5 rounded-lg border border-blue-500/30 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles size={12} />
                  <span>Use Screenshot as Blurred Backdrop</span>
                </button>
              )}
            </div>

            <div className="border-t border-border pt-4">
              <h3 className="text-xs uppercase tracking-wider text-text-muted mb-2.5 font-semibold">Wallpapers</h3>
              <div className="grid grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1">
                {MACOS_BACKGROUNDS.map((bg, idx) => {
                  const bgUrl = `url("${bg.url}")`;
                  return (
                    <div 
                      key={idx} 
                      title={bg.name}
                      className={`aspect-square rounded-lg cursor-pointer border-2 hover:scale-105 transition-all shadow-sm ${background === bgUrl ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-transparent hover:border-white/20'}`}
                      style={{ background: bgUrl, backgroundSize: 'cover', backgroundPosition: 'center' }}
                      onClick={() => setBackground(bgUrl)}
                    />
                  );
                })}
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <h3 className="text-xs uppercase tracking-wider text-text-muted mb-2.5 font-semibold">Gradients</h3>
              <div className="grid grid-cols-4 gap-2">
                {GRADIENTS.map((bg, idx) => (
                  <div 
                    key={idx} 
                    className={`aspect-square rounded-lg cursor-pointer border-2 hover:scale-105 transition-all shadow-sm ${background === bg ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-transparent hover:border-white/20'}`}
                    style={{ background: bg }}
                    onClick={() => setBackground(bg)}
                  />
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <h3 className="text-xs uppercase tracking-wider text-text-muted mb-2.5 font-semibold">Solid Colors</h3>
              <div className="grid grid-cols-5 gap-2">
                {SOLID_COLORS.map((col, idx) => (
                  <div 
                    key={idx}
                    title={col.name}
                    className={`aspect-square rounded-lg cursor-pointer border-2 hover:scale-105 transition-all flex items-center justify-center ${background === col.value ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-border hover:border-white/20'}`}
                    style={{ background: col.value === 'transparent' ? 'repeating-conic-gradient(#333 0% 25%, #222 0% 50%) 50% / 10px 10px' : col.value }}
                    onClick={() => setBackground(col.value)}
                  />
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-2.5">
                <label className="py-2 px-3 rounded-lg border border-border hover:border-blue-500/50 flex items-center justify-center gap-2 cursor-pointer bg-white/[0.03] hover:bg-white/[0.08] transition-colors text-xs font-medium text-zinc-300 hover:text-white relative overflow-hidden">
                  <Pipette size={13} />
                  <span>Custom Color</span>
                  <input type="color" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" onChange={(e) => setBackground(e.target.value)} />
                </label>
                <label className="py-2 px-3 rounded-lg border border-border hover:border-blue-500/50 flex items-center justify-center gap-2 cursor-pointer bg-white/[0.03] hover:bg-white/[0.08] transition-colors text-xs font-medium text-zinc-300 hover:text-white">
                  <Upload size={13} />
                  <span>Upload Image</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const reader = new FileReader();
                      reader.onload = (ev) => { if (ev.target?.result) setBackground(`url("${ev.target.result}")`); };
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }} />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Effects */}
        {leftTab === 'effects' && (
          <div className="animate-in fade-in slide-in-from-left-2 duration-200 flex flex-col gap-5">
            <div>
              <h3 className="text-xs uppercase tracking-wider text-text-muted mb-3 font-semibold">Texture & Noise</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <label className="text-text-main font-medium">Digital Pixel Noise</label>
                    <span className="text-text-muted font-mono">{noiseIntensity}%</span>
                  </div>
                  <Slider min={0} max={100} step={1} value={[noiseIntensity]} onValueChange={(v) => setNoiseIntensity(Array.isArray(v) ? v[0] : v as number)} />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <label className="text-text-main font-medium">Film Grain</label>
                    <span className="text-text-muted font-mono">{grainIntensity}%</span>
                  </div>
                  <Slider min={0} max={100} step={1} value={[grainIntensity]} onValueChange={(v) => setGrainIntensity(Array.isArray(v) ? v[0] : v as number)} />
                </div>

                <div>
                  <label className="text-xs text-text-muted block mb-2 font-medium">Noise Target</label>
                  <div className="grid grid-cols-3 gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
                    {['canvas', 'image', 'both'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setNoiseTarget(t)}
                        className={`py-1 text-[11px] font-medium capitalize rounded transition-colors ${noiseTarget === t ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm font-semibold' : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <h3 className="text-xs uppercase tracking-wider text-text-muted mb-3 font-semibold">Focus & Blur</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <label className="text-text-main font-medium">Backdrop Blur</label>
                    <span className="text-text-muted font-mono">{bgBlur}px</span>
                  </div>
                  <Slider min={0} max={50} step={1} value={[bgBlur]} onValueChange={(v) => setBgBlur(Array.isArray(v) ? v[0] : v as number)} />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <label className="text-text-main font-medium">Image Blur</label>
                    <span className="text-text-muted font-mono">{imageBlur}px</span>
                  </div>
                  <Slider min={0} max={20} step={1} value={[imageBlur]} onValueChange={(v) => setImageBlur(Array.isArray(v) ? v[0] : v as number)} />
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <h3 className="text-xs uppercase tracking-wider text-text-muted mb-3 font-semibold">Preset Filters</h3>
              <div className="grid grid-cols-2 gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={`flex flex-col text-left p-2.5 rounded-lg border transition-all ${filter === f.id ? 'bg-blue-600/15 border-blue-500 text-white shadow-sm' : 'bg-black/20 border-border text-zinc-400 hover:bg-white/[0.04] hover:border-white/20 hover:text-white'}`}
                  >
                    <span className="text-xs font-semibold text-white">{f.name}</span>
                    <span className="text-[10px] opacity-70 mt-0.5">{f.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Studio Workspace */}
      <main className="flex-grow flex flex-col bg-bg-dark h-full relative overflow-hidden">
        {/* Top Control Bar */}
        <header className="h-16 border-b border-border bg-panel flex items-center justify-between px-6 z-30 shrink-0">
          <div className="flex items-center">
            <span className="font-bold text-sm tracking-[0.22em] text-white uppercase select-none">
              NOICESS
            </span>
          </div>

          {/* Aspect Ratio Selector */}
          <div className="relative">
            <button
              onClick={() => setShowRatioMenu(!showRatioMenu)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-border bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 text-xs font-medium transition-all shadow-inner text-zinc-200 hover:text-white"
            >
              <div className="w-4 h-4 flex items-center justify-center text-blue-400 shrink-0">
                {renderAspectBox(aspectStyle)}
              </div>
              <span className="font-semibold text-white">{activeRatioData.name}</span>
              <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-200 ${showRatioMenu ? 'rotate-180' : ''}`} />
            </button>

            {showRatioMenu && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 bg-[#1C1C1E] border border-white/10 rounded-2xl p-2.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                
                {/* Minimal Custom Dimensions Row */}
                <div className="flex items-center gap-2 p-2 bg-black/40 rounded-xl border border-white/10 mb-2.5">
                  <input
                    type="number"
                    min={100}
                    max={8000}
                    value={customWidth}
                    onChange={(e) => {
                      setCustomWidth(Math.max(1, parseInt(e.target.value) || 1));
                      setAspectRatio('custom');
                    }}
                    className="w-16 h-7 px-2 bg-black/60 border border-white/10 rounded-lg text-center text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                    placeholder="1920"
                  />
                  <span className="text-zinc-500 text-xs font-mono">×</span>
                  <input
                    type="number"
                    min={100}
                    max={8000}
                    value={customHeight}
                    onChange={(e) => {
                      setCustomHeight(Math.max(1, parseInt(e.target.value) || 1));
                      setAspectRatio('custom');
                    }}
                    className="w-16 h-7 px-2 bg-black/60 border border-white/10 rounded-lg text-center text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                    placeholder="1080"
                  />
                  <button
                    onClick={() => {
                      setAspectRatio('custom');
                      setShowRatioMenu(false);
                    }}
                    className="flex-1 h-7 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    Apply
                  </button>
                </div>

                {/* Clean Standard Ratios Grid */}
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'auto', name: 'Auto Fit', ratio: 'auto' },
                    { id: 'standard-1-1', name: '1:1 Square', ratio: '1/1' },
                    { id: 'tw-post', name: '16:9 Landscape', ratio: '16/9' },
                    { id: 'tk-video', name: '9:16 Portrait', ratio: '9/16' },
                    { id: 'ig-portrait', name: '4:5 Feed', ratio: '4/5' },
                    { id: 'standard-4-3', name: '4:3 Classic', ratio: '4/3' },
                    { id: 'standard-3-2', name: '3:2 Landscape', ratio: '3/2' },
                    { id: 'tw-header', name: '3:1 Banner', ratio: '3/1' },
                  ].map((r) => {
                    const isSelected = aspectRatio === r.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => { setAspectRatio(r.id); setShowRatioMenu(false); }}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-all border ${
                          isSelected 
                            ? 'bg-blue-600 text-white font-semibold shadow-sm border-blue-500' 
                            : 'bg-white/[0.02] border-white/5 text-zinc-300 hover:bg-white/[0.06] hover:text-white hover:border-white/10'
                        }`}
                      >
                        <div className={`w-4 h-4 flex items-center justify-center shrink-0 ${isSelected ? 'text-white' : 'text-blue-400'}`}>
                          {renderAspectBox(r.ratio)}
                        </div>
                        <span className="truncate">{r.name}</span>
                      </button>
                    );
                  })}
                </div>

              </div>
            )}
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-3">
            {/* Copy to Clipboard */}
            <button
              onClick={handleCopyClipboard}
              disabled={!image || isExporting}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border border-border bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 text-zinc-200 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
              title="Copy screenshot to clipboard"
            >
              {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            {/* Clear Button */}
            <button 
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border border-border text-zinc-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95" 
              onClick={() => { setImage(null); setImageSelected(false); setRotation(0); setPos({ x: 0, y: 0 }); }} 
              disabled={!image}
            >
              <Trash2 size={13} />
              <span>Clear</span>
            </button>

            {/* High-End Export Modal Trigger Button */}
            <button 
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95" 
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
          className={`flex-grow flex items-center justify-center overflow-hidden relative select-none ${isSpacePressed || isPanningWorkspace ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
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
              className="relative flex items-center justify-center shadow-2xl shrink-0"
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
                    <img 
                      src={bgImageUrl} 
                      alt="" 
                      draggable={false}
                      className="w-full h-full object-cover pointer-events-none"
                      style={{
                        filter: `blur(${bgBlur}px)`,
                        transform: 'scale(1.25)',
                        transformOrigin: 'center center',
                      }}
                    />
                  </div>
                ) : (
                  <div 
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{
                      background: background,
                      filter: `blur(${bgBlur}px)`,
                      transform: 'scale(1.25)',
                      transformOrigin: 'center center',
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
                className={`relative group z-10 pointer-events-auto ${isRotating || isDragging || isResizing ? 'transition-none' : 'transition-all duration-200 ease-out'} flex flex-col justify-center items-center ${!image ? 'w-full h-full' : ''}`}
                style={{
                  transform: `translate(${pos.x}px, ${pos.y}px) ${activePerspectiveTransform} ${rotation !== 0 ? `rotate(${rotation}deg)` : ''} scale(${scale / 100})`,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Floating image controls (Unclipped, attached directly to frame) */}
                {!isExporting && image && (imageSelected || isRotating) && (
                  <div 
                    data-no-export="true"
                    className="no-export absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-[#1C1C1E] border border-white/15 rounded-lg px-2 py-1 shadow-2xl z-[70] pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-200"
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
                          className="w-12 h-6 px-1 bg-black/70 text-white border border-blue-500 rounded text-center text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                        <span className="text-[11px] font-mono text-white/50 ml-0.5">°</span>
                      </div>
                    ) : (
                      <button 
                        className="text-[11px] font-mono font-medium text-white/80 px-1.5 py-0.5 rounded bg-white/5 cursor-text hover:text-white hover:bg-white/10 hover:border-white/20 border border-transparent transition-all"
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
                      className="text-[11px] font-mono font-medium text-white/70 px-1.5 py-0.5 rounded bg-white/5 hover:text-white hover:bg-white/10 transition-colors"
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
                      className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
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
                    backdropFilter: glassBorder && !isExporting ? 'blur(20px)' : 'none',
                    padding: glassBorder ? `${glassBorderWidth}px` : '0',
                  } : {}}
                  onClick={(e) => { if (image) { e.stopPropagation(); setImageSelected(true); } }}
                  onPointerDown={image ? handlePointerDown : undefined}
                  onPointerMove={image ? handlePointerMove : undefined}
                  onPointerUp={image ? handlePointerUp : undefined}
                >
                  {/* Clipped screenshot content */}
                  <div className="relative flex flex-col overflow-hidden w-full h-full" style={{ borderRadius: `${Math.max(0, radius - (glassBorder ? glassBorderWidth : 0))}px` }}>
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
                      <div className="relative">
                        <img src={image} alt="Uploaded screenshot" draggable={false} className="max-w-full max-h-full object-contain block transition-all relative z-10" style={{
                          borderRadius: showMacOsBar 
                            ? `0 0 ${glassBorder ? Math.max(0, radius - glassBorderWidth) : radius}px ${glassBorder ? Math.max(0, radius - glassBorderWidth) : radius}px` 
                            : `${glassBorder ? Math.max(0, radius - glassBorderWidth) : radius}px`,
                          filter: getFilterStyle(),
                        }} />
                        
                        {/* Watermark Overlay on Screenshot */}
                        {watermark && watermarkTarget === 'screenshot' && (
                          <div 
                            className={`absolute pointer-events-none z-20 transition-all ${
                              watermarkPosition === 'bottom-right' ? 'bottom-3 right-3' :
                              watermarkPosition === 'bottom-left' ? 'bottom-3 left-3' :
                              watermarkPosition === 'bottom-center' ? 'bottom-3 left-1/2 -translate-x-1/2' :
                              'top-3 right-3'
                            }`}
                          >
                            <div 
                              className="px-3.5 py-1.5 rounded-full text-[11px] font-medium tracking-wide flex items-center gap-1.5 transition-all shadow-md"
                              style={{
                                background: `rgba(255, 255, 255, ${(watermarkOpacity / 100) * 0.25})`,
                                border: `1px solid rgba(255, 255, 255, ${watermarkOpacity / 100})`,
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                color: '#ffffff',
                              }}
                            >
                              {renderPlatformIcon(watermarkPlatform, 11)}
                              <span>{watermarkPlatform === 'x' && !watermark.startsWith('@') ? `@${watermark}` : watermark}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <label className={`flex-grow flex flex-col items-center justify-center gap-4 text-white drop-shadow-md w-full h-full cursor-pointer transition-all relative z-10 rounded-2xl ${background === 'transparent' ? 'border-2 border-dashed border-white/20 bg-black/20 backdrop-blur-md hover:bg-white/10 hover:border-accent/50' : 'hover:bg-white/5'}`}>
                        <Upload size={48} className="opacity-70 text-accent" />
                        <h2 className="text-xl font-semibold">Drop an image here</h2>
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
                      <div className="absolute inset-0 border-2 border-blue-500/90 pointer-events-none shadow-sm" style={{ borderRadius: `${radius}px` }} />

                      {/* Corner Resize Handles */}
                      <div 
                        className="absolute -top-2 -left-2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-blue-500 pointer-events-auto cursor-nwse-resize hover:scale-125 active:scale-110 transition-transform z-50" 
                        onPointerDown={(e) => handleResizeDown(e, 'tl')} 
                        title="Drag to minimize / maximize size" 
                      />
                      <div 
                        className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-blue-500 pointer-events-auto cursor-nesw-resize hover:scale-125 active:scale-110 transition-transform z-50" 
                        onPointerDown={(e) => handleResizeDown(e, 'tr')} 
                        title="Drag to minimize / maximize size" 
                      />
                      <div 
                        className="absolute -bottom-2 -left-2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-blue-500 pointer-events-auto cursor-nesw-resize hover:scale-125 active:scale-110 transition-transform z-50" 
                        onPointerDown={(e) => handleResizeDown(e, 'bl')} 
                        title="Drag to minimize / maximize size" 
                      />
                      <div 
                        className="absolute -bottom-2 -right-2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-blue-500 pointer-events-auto cursor-nwse-resize hover:scale-125 active:scale-110 transition-transform z-50" 
                        onPointerDown={(e) => handleResizeDown(e, 'br')} 
                        title="Drag to minimize / maximize size" 
                      />

                      {/* Top Rotation Stalk & Knob */}
                      <div className="absolute -top-9 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto z-50">
                        <div 
                          className="w-6 h-6 rounded-full bg-white text-black shadow-lg border border-black/20 flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-115 transition-transform"
                          title="Drag to rotate (Hold Shift for 15° snap)"
                          onPointerDown={handleRotateDown}
                        >
                          <RotateCw size={12} className="text-black/80" />
                        </div>
                        <div className="w-0.5 h-3 bg-blue-500" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Snap guides */}
            {!isExporting && isDragging && pos.x === 0 && <div data-no-export="true" className="no-export absolute top-0 bottom-0 left-1/2 w-px bg-blue-500/70 z-50 pointer-events-none drop-shadow-md" />}
            {!isExporting && isDragging && pos.y === 0 && <div data-no-export="true" className="no-export absolute left-0 right-0 top-1/2 h-px bg-blue-500/70 z-50 pointer-events-none drop-shadow-md" />}
            
            {watermark && watermarkTarget === 'canvas' && (
              <div 
                className={`absolute pointer-events-none z-20 transition-all ${
                  watermarkPosition === 'bottom-right' ? 'bottom-6 right-6' :
                  watermarkPosition === 'bottom-left' ? 'bottom-6 left-6' :
                  watermarkPosition === 'bottom-center' ? 'bottom-6 left-1/2 -translate-x-1/2' :
                  'top-6 right-6'
                }`}
              >
                <div 
                  className="px-4 py-2 rounded-full text-xs font-medium tracking-wide flex items-center gap-1.5 transition-all shadow-md"
                  style={{
                    background: `rgba(255, 255, 255, ${(watermarkOpacity / 100) * 0.25})`,
                    border: `1px solid rgba(255, 255, 255, ${watermarkOpacity / 100})`,
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    color: '#ffffff',
                  }}
                >
                  {renderPlatformIcon(watermarkPlatform, 12)}
                  <span>{watermarkPlatform === 'x' && !watermark.startsWith('@') ? `@${watermark}` : watermark}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Floating Viewport Zoom HUD Controls (Bottom Center) */}
        <div 
          data-no-export="true"
          className="no-export absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#1C1C1E]/90 border border-white/15 backdrop-blur-md rounded-xl px-2 py-1 shadow-2xl z-40"
        >
          <button
            onClick={() => zoomCanvasAtCenter(0.85)}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
            title="Zoom Out (Scroll Down)"
          >
            <ZoomOut size={14} />
          </button>
          <button
            onClick={resetViewport}
            className="px-2 py-1 text-[11px] font-mono font-medium text-zinc-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
            title="Reset Zoom to 100%"
          >
            {Math.round(viewportZoom * 100)}%
          </button>
          <button
            onClick={() => zoomCanvasAtCenter(1.15)}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
            title="Zoom In (Scroll Up)"
          >
            <ZoomIn size={14} />
          </button>
          <div className="w-px h-4 bg-white/15 mx-1" />
          <button
            onClick={resetViewport}
            className="px-2 py-1 text-[11px] font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-600/10 rounded-md transition-colors"
            title="Reset View"
          >
            Reset
          </button>
        </div>
      </div>
    </main>

      {/* Right Sidebar - 3D Camera, Studio Presets & Collapsible Studio Controls */}
      <aside className="w-[320px] min-w-[320px] bg-panel border-l border-border flex flex-col p-4 gap-4 overflow-y-auto z-20 shadow-lg select-none">
        
        {/* Accordion 1: 3D Angles & XYZ Orbit */}
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => toggleSection('perspectives')}
            className="flex items-center justify-between w-full py-1 text-xs uppercase tracking-wider font-semibold text-text-main hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <Box size={14} className="text-blue-400" />
              <span>3D Camera & XYZ Angles</span>
            </div>
            <div className="flex items-center gap-2">
              {(rotateX !== 0 || rotateY !== 0 || rotateZ !== 0) && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  Custom
                </span>
              )}
              <ChevronDown size={14} className={`text-text-muted transition-transform duration-200 ${expandedSections.perspectives ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {expandedSections.perspectives && (
            <div className="flex flex-col gap-3.5 pt-1 animate-in fade-in slide-in-from-top-1 duration-150">
              {/* Perspective Quick Preset Chips */}
              <div className="grid grid-cols-4 gap-1.5">
                {PERSPECTIVES.map((p) => {
                  const isActive = perspective === p.id && rotateX === p.rx && rotateY === p.ry && rotateZ === p.rz;
                  return (
                    <button
                      key={p.id}
                      onClick={() => applyPerspectivePreset(p)}
                      className={`py-1.5 px-1 rounded-lg text-center border transition-all text-[11px] font-medium flex flex-col items-center gap-1 ${
                        isActive 
                          ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-sm' 
                          : 'bg-black/30 border-white/5 hover:border-white/20 text-zinc-400 hover:text-white'
                      }`}
                      title={p.desc}
                    >
                      <p.icon size={13} className={isActive ? 'text-blue-400' : 'text-zinc-400'} />
                      <span className="truncate w-full text-[10px]">{p.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* XYZ Controls Box */}
              <div className="flex flex-col gap-3 bg-black/25 p-3 rounded-xl border border-white/5">
                {/* Rotate X (Tilt / Pitch) */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <label className="text-text-muted font-medium flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-400/80" />
                      <span>X-Axis (Pitch / Tilt)</span>
                    </label>
                    <div className="flex items-center gap-1">
                      <input 
                        type="text"
                        inputMode="numeric"
                        value={rotateX}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val)) setRotateX(Math.max(-60, Math.min(60, Math.round(val))));
                          else if (e.target.value === '' || e.target.value === '-') setRotateX(0);
                        }}
                        className="w-10 h-5 px-1 bg-black/50 border border-white/10 rounded text-center text-[11px] font-mono text-zinc-300 focus:text-white focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-[10px] text-text-muted">°</span>
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

                {/* Rotate Y (Pan / Yaw) */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <label className="text-text-muted font-medium flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-400/80" />
                      <span>Y-Axis (Yaw / Angle)</span>
                    </label>
                    <div className="flex items-center gap-1">
                      <input 
                        type="text"
                        inputMode="numeric"
                        value={rotateY}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val)) setRotateY(Math.max(-60, Math.min(60, Math.round(val))));
                          else if (e.target.value === '' || e.target.value === '-') setRotateY(0);
                        }}
                        className="w-10 h-5 px-1 bg-black/50 border border-white/10 rounded text-center text-[11px] font-mono text-zinc-300 focus:text-white focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-[10px] text-text-muted">°</span>
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

                {/* Rotate Z (Roll) */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <label className="text-text-muted font-medium flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-400/80" />
                      <span>Z-Axis (Roll / Skew)</span>
                    </label>
                    <div className="flex items-center gap-1">
                      <input 
                        type="text"
                        inputMode="numeric"
                        value={rotateZ}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val)) setRotateZ(Math.max(-45, Math.min(45, Math.round(val))));
                          else if (e.target.value === '' || e.target.value === '-') setRotateZ(0);
                        }}
                        className="w-10 h-5 px-1 bg-black/50 border border-white/10 rounded text-center text-[11px] font-mono text-zinc-300 focus:text-white focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-[10px] text-text-muted">°</span>
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

                {/* Perspective Depth */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <label className="text-text-muted font-medium">Camera Depth</label>
                    <span className="text-text-muted font-mono text-[11px]">{perspectiveDepth}px</span>
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

                {/* Reset 3D Button */}
                {(rotateX !== 0 || rotateY !== 0 || rotateZ !== 0) && (
                  <button
                    onClick={reset3D}
                    className="w-full py-1 px-2 text-[11px] font-medium text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 flex items-center justify-center gap-1.5 transition-colors mt-0.5"
                  >
                    <RefreshCw size={12} />
                    <span>Reset 3D to Flat (0, 0, 0)</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Accordion 2: Studio Themes */}
        <div className="border-t border-border pt-4 flex flex-col gap-3">
          <button 
            onClick={() => toggleSection('themes')}
            className="flex items-center justify-between w-full py-1 text-xs uppercase tracking-wider font-semibold text-text-main hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-blue-400" />
              <span>Studio Themes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-400 font-mono">{PRESETS.length} Themes</span>
              <ChevronDown size={14} className={`text-text-muted transition-transform duration-200 ${expandedSections.themes ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {expandedSections.themes && (
            <div className="flex flex-col gap-2.5 pt-1 animate-in fade-in slide-in-from-top-1 duration-150">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setBackground(preset.config.background);
                    setShowMacOsBar(preset.config.showMacOsBar);
                    setView(preset.config.view);
                    const foundP = PERSPECTIVES.find(p => p.id === preset.config.perspective);
                    if (foundP) applyPerspectivePreset(foundP);
                    else {
                      setPerspective(preset.config.perspective);
                      setRotateX(0); setRotateY(0); setRotateZ(0); setPerspectiveDepth(1200);
                    }
                    setGlassBorder(preset.config.glassBorder);
                    if (preset.config.glassBorderWidth) setGlassBorderWidth(preset.config.glassBorderWidth);
                    if (preset.config.glassBorderOpacity) setGlassBorderOpacity(preset.config.glassBorderOpacity);
                    setPadding(preset.config.padding);
                    setRadius(preset.config.radius);
                    setShadow(preset.config.shadow);
                    if (preset.config.bgBlur !== undefined) setBgBlur(preset.config.bgBlur);
                    setFilter(preset.config.filter);
                    setNoiseIntensity(preset.config.noiseIntensity);
                    setGrainIntensity(preset.config.grainIntensity);
                  }}
                  className="flex flex-col rounded-xl border border-white/5 bg-black/30 hover:bg-white/[0.04] hover:border-white/20 text-left transition-all overflow-hidden group shadow-sm"
                >
                  {/* Full-width High-Fidelity Preview Box */}
                  <div 
                    className="w-full h-24 flex items-center justify-center relative overflow-hidden p-3"
                    style={{
                      background: preset.config.background.startsWith('url(') ? preset.config.background : preset.config.background,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {/* Simulated scaled mockup */}
                    {image ? (
                      <div 
                        className="w-3/4 h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                        style={{
                          transform: preset.config.perspective === 'isometric-left' ? 'perspective(200px) rotateX(15deg) rotateY(-20deg)' : 'none'
                        }}
                      >
                        <img 
                          src={image} 
                          alt={preset.name} 
                          className="max-w-full max-h-full object-contain rounded shadow-lg border border-white/10" 
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                        <preset.icon size={13} className="text-white" />
                        <span className="text-xs font-semibold text-white">{preset.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-[#141416]/90 border-t border-white/5">
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {preset.name}
                      </span>
                      <span className="text-[10px] text-text-muted opacity-80 truncate">{preset.desc}</span>
                    </div>
                    <span className="text-[10px] font-medium text-blue-400 bg-blue-600/10 px-2 py-0.5 rounded border border-blue-500/20 group-hover:bg-blue-600/20 transition-colors shrink-0">
                      Apply
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Accordion 3: Window Templates */}
        <div className="border-t border-border pt-4 flex flex-col gap-3">
          <button 
            onClick={() => toggleSection('templates')}
            className="flex items-center justify-between w-full py-1 text-xs uppercase tracking-wider font-semibold text-text-main hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <LayoutTemplate size={14} className="text-blue-400" />
              <span>Window Templates</span>
            </div>
            <ChevronDown size={14} className={`text-text-muted transition-transform duration-200 ${expandedSections.templates ? 'rotate-180' : ''}`} />
          </button>

          {expandedSections.templates && (
            <div className="flex flex-col gap-2 pt-1 animate-in fade-in slide-in-from-top-1 duration-150">
              <button 
                onClick={() => { setView('default'); setShowMacOsBar(true); setGlassBorder(false); }}
                className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${view === 'default' && showMacOsBar && !glassBorder ? 'bg-blue-600/15 border-blue-500 text-white' : 'bg-black/30 border-white/5 hover:border-white/20 text-zinc-300'}`}
              >
                <div className="w-9 h-9 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center shrink-0">
                  <Laptop size={16} className="text-blue-400" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-white">Default macOS Studio</span>
                  <span className="text-[10px] text-text-muted">Window dots + clean frame</span>
                </div>
              </button>

              <button 
                onClick={() => { setView('browser'); setShowMacOsBar(true); setGlassBorder(false); }}
                className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${view === 'browser' ? 'bg-blue-600/15 border-blue-500 text-white' : 'bg-black/30 border-white/5 hover:border-white/20 text-zinc-300'}`}
              >
                <div className="w-9 h-9 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center shrink-0">
                  <Globe size={16} className="text-green-400" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-white">Web Browser</span>
                  <span className="text-[10px] text-text-muted">Safari bar with address URL</span>
                </div>
              </button>

              <button 
                onClick={() => { setView('minimal'); setShowMacOsBar(false); setGlassBorder(false); }}
                className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${view === 'minimal' && !showMacOsBar && !glassBorder ? 'bg-blue-600/15 border-blue-500 text-white' : 'bg-black/30 border-white/5 hover:border-white/20 text-zinc-300'}`}
              >
                <div className="w-9 h-9 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center shrink-0">
                  <Square size={16} className="text-purple-400" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-white">Minimalist</span>
                  <span className="text-[10px] text-text-muted">Zero chrome, frameless focus</span>
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
                className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${glassBorder ? 'bg-blue-600/15 border-blue-500 text-white' : 'bg-black/30 border-white/5 hover:border-white/20 text-zinc-300'}`}
              >
                <div className="w-9 h-9 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center shrink-0">
                  <Sparkles size={16} className="text-amber-400" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-white">3D Frosted Glass</span>
                  <span className="text-[10px] text-text-muted">Glass border + 3D isometric tilt</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Accordion 4: Color Grading & Filters */}
        <div className="border-t border-border pt-4 flex flex-col gap-3">
          <button 
            onClick={() => toggleSection('filters')}
            className="flex items-center justify-between w-full py-1 text-xs uppercase tracking-wider font-semibold text-text-main hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-blue-400" />
              <span>Color Profiles</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-400 font-mono">{FILTERS.length} Profiles</span>
              <ChevronDown size={14} className={`text-text-muted transition-transform duration-200 ${expandedSections.filters ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {expandedSections.filters && (
            <div className="grid grid-cols-2 gap-2 pt-1 animate-in fade-in slide-in-from-top-1 duration-150">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`flex flex-col p-2 rounded-xl border text-left transition-all group ${filter === f.id ? 'bg-blue-600/15 border-blue-500 ring-1 ring-blue-500/30 text-white shadow-md' : 'bg-black/30 border-white/5 hover:border-white/20 text-zinc-400 hover:text-zinc-200'}`}
                >
                  {/* Miniature Filter Preview Box */}
                  <div className="w-full h-14 rounded-lg bg-[#141416] border border-white/5 flex items-center justify-center overflow-hidden mb-1.5 relative p-1 shadow-inner">
                    {image ? (
                      <img 
                        src={image} 
                        alt={f.name} 
                        className="max-w-full max-h-full object-contain rounded"
                        style={{ filter: f.filterStyle }}
                      />
                    ) : (
                      <div 
                        className="w-10 h-7 rounded bg-gradient-to-r from-blue-400 to-indigo-600"
                        style={{ filter: f.filterStyle }}
                      />
                    )}
                  </div>

                  <span className="text-[11px] font-semibold text-white truncate">{f.name}</span>
                  <span className="text-[9px] text-text-muted opacity-70 truncate">{f.desc}</span>
                </button>
              ))}
            </div>
          )}
        </div>

      </aside>

      {/* Export Quality & Format Panel (Modal) */}
      {showExportModal && (
        <div 
          className="fixed inset-0 bg-black/75 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowExportModal(false)}
        >
          <div 
            className="bg-[#18181B] border border-white/15 rounded-2xl w-full max-w-md p-6 shadow-2xl flex flex-col gap-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <Download size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Export Studio Image</h2>
                  <p className="text-[11px] text-text-muted">Choose your resolution and format</p>
                </div>
              </div>
              <button 
                onClick={() => setShowExportModal(false)}
                className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Resolution / Quality Selection */}
            <div>
              <label className="text-xs font-semibold text-white/90 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
                <Gauge size={13} className="text-blue-400" /> Select Quality & Resolution
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { val: 1, label: '1x Standard', desc: '720p / 1080p Web', badge: 'Fast' },
                  { val: 2, label: '2x Retina', desc: '2K QHD (Crisp)', badge: 'Default' },
                  { val: 3, label: '3x Ultra HD', desc: '4K High Density', badge: 'Crisp' },
                  { val: 4, label: '4x Master', desc: '6K Maximum Detail', badge: 'Ultra' }
                ].map((res) => (
                  <button
                    key={res.val}
                    onClick={() => setExportScale(res.val)}
                    className={`flex flex-col p-3 rounded-xl border text-left transition-all relative ${exportScale === res.val ? 'bg-blue-600/15 border-blue-500 ring-1 ring-blue-500/30 text-white shadow-md' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/[0.04] hover:border-white/20 hover:text-white'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{res.label}</span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${exportScale === res.val ? 'bg-blue-600 text-white font-semibold' : 'bg-white/10 text-zinc-400'}`}>{res.badge}</span>
                    </div>
                    <span className="text-[10px] opacity-75 font-mono">{res.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Format Selection */}
            <div>
              <label className="text-xs font-semibold text-white/90 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
                <ImageIcon size={13} className="text-blue-400" /> File Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'png', name: 'PNG', desc: 'Lossless & Crisp' },
                  { id: 'jpeg', name: 'JPG', desc: 'Lightweight' },
                  { id: 'webp', name: 'WebP', desc: 'Modern Web' },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => setExportFormat(fmt.id as any)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${exportFormat === fmt.id ? 'bg-blue-600/15 border-blue-500 ring-1 ring-blue-500/30 text-white shadow-md' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/[0.04] hover:border-white/20 hover:text-white'}`}
                  >
                    <span className="text-xs font-bold text-white">{fmt.name}</span>
                    <span className="text-[9px] opacity-70 mt-0.5">{fmt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Random Filename Preview */}
            <div className="bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs">
              <span className="text-text-muted font-medium">Output Filename:</span>
              <span className="font-mono text-white/90 font-medium bg-white/5 px-2 py-0.5 rounded border border-white/5">
                noicess-XXXXXX.{exportFormat === 'jpeg' ? 'jpg' : exportFormat}
              </span>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleCopyClipboard}
                disabled={!image || isExporting}
                className="flex-1 py-2.5 rounded-xl border border-white/10 bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold flex items-center justify-center gap-2 text-zinc-200 hover:text-white transition-colors disabled:opacity-40"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                <span>{copied ? 'Copied Image!' : 'Copy to Clipboard'}</span>
              </button>

              <button
                onClick={async () => {
                  await handleExport();
                  setShowExportModal(false);
                }}
                disabled={!image || isExporting}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold flex items-center justify-center gap-2 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-500/45 transition-all active:scale-95 disabled:opacity-40"
              >
                {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                <span>{isExporting ? 'Generating...' : `Download ${exportScale}x`}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
