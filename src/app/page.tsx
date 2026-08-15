"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Download, Layers, Monitor, Image as ImageIcon, Sparkles, Filter, ChevronDown, Maximize, Square, LayoutTemplate, Smartphone, RotateCw, Trash2, Maximize2, Minimize2, ZoomIn, ZoomOut } from 'lucide-react';
import { toPng } from 'html-to-image';
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  { name: 'Surface', url: '/wallpapers/microsoft-surface-3840x2160-26627.png' }
];

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

  // Drag state
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
  const [watermark, setWatermark] = useState('');
  const [leftTab, setLeftTab] = useState<'design' | 'background'>('design');
  
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
      // Sharp black or white speckles
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

  useEffect(() => {
    const workspace = workspaceRef.current;
    if (!workspace) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        // Smaller delta multiplier for smoother zoom on trackpads
        const delta = e.deltaY * -0.15;
        setScale(s => Math.min(Math.max(s + delta, 10), 250));
      }
    };

    workspace.addEventListener('wheel', handleWheel, { passive: false });
    return () => workspace.removeEventListener('wheel', handleWheel);
  }, []);

  useEffect(() => {
    if (!isResizing) return;
    
    const handleMove = (e: PointerEvent) => {
      const state = resizeRef.current;
      if (!state) return;
      
      const currentDistance = Math.hypot(e.clientX - state.centerX, e.clientY - state.centerY);
      const scaleRatio = currentDistance / state.startDistance;
      let newScale = Math.round(state.startScale * scaleRatio);
      
      // Clamp between 20% and 300%
      newScale = Math.min(Math.max(newScale, 20), 300);

      // Snap near 100%
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

  useEffect(() => {
    if (!isRotating) return;

    const handleMove = (e: PointerEvent) => {
      const state = rotateRef.current;
      if (!state) return;
      const currentAngle = Math.atan2(e.clientY - state.centerY, e.clientX - state.centerX) * (180 / Math.PI);
      const diff = currentAngle - state.startAngle;
      let newRot = Math.round(state.startRotation + diff);
      newRot = ((newRot % 360) + 360) % 360;

      // Smart snap to 0, 90, 180, 270 degrees
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

  const handleExport = useCallback(async () => {
    if (canvasRef.current === null) return;
    try {
      const dataUrl = await toPng(canvasRef.current, { cacheBust: true });
      const link = document.createElement('a');
      link.download = 'screenshot-studio.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
    }
  }, [canvasRef]);

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
    let baseFilter = 'none';
    switch (filter) {
      case 'grayscale': baseFilter = 'grayscale(100%)'; break;
      case 'contrast': baseFilter = 'contrast(150%)'; break;
      case 'sepia': baseFilter = 'sepia(100%)'; break;
    }
    if (imageBlur > 0) {
      baseFilter = baseFilter === 'none' ? `blur(${imageBlur}px)` : `${baseFilter} blur(${imageBlur}px)`;
    }
    return baseFilter;
  };

  const backgrounds = [
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
  ];

  const activeRatioData = FLAT_RATIOS.find(r => r.id === aspectRatio) || FLAT_RATIOS[0];
  const aspectStyle = activeRatioData.id === 'auto' 
    ? (imageDimensions.w && imageDimensions.h ? `${imageDimensions.w}/${imageDimensions.h}` : 'auto')
    : activeRatioData.aspect;
    
  const glassRgb = hexToRgb(glassBorderColor);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-dark text-text-main font-sans">
      
      {/* Left Sidebar */}
      <aside className="w-[280px] min-w-[280px] flex flex-col bg-panel border-r border-border overflow-y-auto p-5 gap-6">
        <div className="flex bg-black/20 p-1 rounded-lg relative mb-1">
          <div 
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white/10 border border-white/5 rounded-md transition-all duration-300 ease-out shadow-sm"
            style={{ transform: leftTab === 'design' ? 'translateX(0)' : 'translateX(100%)' }}
          />
          <button 
            className={`flex-1 py-1.5 text-xs font-medium text-center relative z-10 transition-colors ${leftTab === 'design' ? 'text-white' : 'text-text-muted hover:text-white/70'}`}
            onClick={() => setLeftTab('design')}
          >
            Design & Layout
          </button>
          <button 
            className={`flex-1 py-1.5 text-xs font-medium text-center relative z-10 transition-colors ${leftTab === 'background' ? 'text-white' : 'text-text-muted hover:text-white/70'}`}
            onClick={() => setLeftTab('background')}
          >
            Background
          </button>
        </div>

        {leftTab === 'background' ? (
          <>
            <div>
              <h3 className="text-xs uppercase tracking-wider text-text-muted mb-3 font-semibold">Background Colors</h3>
              <div className="grid grid-cols-3 gap-2">
                {backgrounds.map((bg, idx) => (
                  <div 
                    key={idx} 
                    className={`aspect-square rounded-md cursor-pointer border-2 hover:opacity-80 transition-opacity ${background === bg ? 'border-accent' : 'border-transparent'}`}
                    style={{ background: bg, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    onClick={() => setBackground(bg)}
                  />
                ))}
                
                <label className="aspect-square rounded-md cursor-pointer border-2 border-border hover:border-accent flex items-center justify-center relative overflow-hidden transition-colors bg-white/5">
                  <span className="text-[10px] text-text-muted font-medium z-10 pointer-events-none drop-shadow-md">Color</span>
                  <input 
                    type="color" 
                    className="absolute inset-[-10px] w-[150%] h-[150%] cursor-pointer opacity-0"
                    onChange={(e) => setBackground(e.target.value)}
                  />
                </label>
                
                <label className="aspect-square rounded-md cursor-pointer border-2 border-border hover:border-accent flex items-center justify-center text-[10px] text-text-muted font-medium transition-colors bg-white/5">
                  Image
                  <input 
                    type="file" 
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          if (ev.target?.result) setBackground(`url("${ev.target.result}")`);
                        };
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-wider text-text-muted mb-3 font-semibold">macOS Wallpapers</h3>
              <div className="grid grid-cols-4 gap-2">
                {MACOS_BACKGROUNDS.map((bg, idx) => {
                  const bgUrl = `url("${bg.url}")`;
                  return (
                    <div 
                      key={idx} 
                      title={bg.name}
                      className={`aspect-square rounded-md cursor-pointer border-2 hover:opacity-80 transition-opacity ${background === bgUrl ? 'border-accent border-solid' : 'border-transparent'}`}
                      style={{ background: bgUrl, backgroundSize: 'cover', backgroundPosition: 'center' }}
                      onClick={() => setBackground(bgUrl)}
                    />
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col gap-6">
            <div>
              <h3 className="text-xs uppercase tracking-wider text-text-muted mb-3 font-semibold">Canvas Setup</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2.5">
                    <label>Padding</label>
                    <span className="text-text-muted">{padding}px</span>
                  </div>
                  <Slider min={0} max={120} step={1} value={[padding]} onValueChange={(v) => setPadding(Array.isArray(v) ? v[0] : v as number)} />
                </div>
                
                <div>
                  <div className="flex items-center justify-between text-sm mb-2.5">
                    <label>Image Size</label>
                    <span className="text-text-muted">{Math.round(scale)}%</span>
                  </div>
                  <Slider min={20} max={300} step={1} value={[scale]} onValueChange={(v) => setScale(Array.isArray(v) ? v[0] : v as number)} />
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2.5">
                    <label>Rotation</label>
                    <div className="flex items-center gap-1">
                      <input 
                        type="text" 
                        inputMode="numeric"
                        value={rotation} 
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val)) {
                            setRotation(((Math.round(val) % 360) + 360) % 360);
                          } else if (e.target.value === '') {
                            setRotation(0);
                          }
                        }}
                        className="w-12 h-6 px-1 bg-black/30 border border-border rounded text-center text-xs text-text-muted focus:text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-xs text-text-muted">°</span>
                    </div>
                  </div>
                  <Slider min={0} max={360} step={1} value={[rotation]} onValueChange={(v) => setRotation(Array.isArray(v) ? v[0] : v as number)} />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-wider text-text-muted mb-3 font-semibold">Window Frame</h3>
              <div className="flex flex-col gap-4 text-sm">
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox checked={showMacOsBar} onCheckedChange={(c) => setShowMacOsBar(c as boolean)} />
                  macOS Titlebar
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer mt-1">
                  <Checkbox checked={glassBorder} onCheckedChange={(c) => setGlassBorder(c as boolean)} />
                  Glass Border
                </label>
                
                {glassBorder && (
                  <div className="flex flex-col gap-4 pl-7 mt-1 pt-3 border-t border-white/5">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2.5">
                        <label>Glass Width</label>
                        <span className="text-text-muted">{glassBorderWidth}px</span>
                      </div>
                      <Slider min={2} max={40} step={1} value={[glassBorderWidth]} onValueChange={(v) => setGlassBorderWidth(Array.isArray(v) ? v[0] : v as number)} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2.5">
                        <label>Opacity</label>
                        <span className="text-text-muted">{glassBorderOpacity}%</span>
                      </div>
                      <Slider min={0} max={100} step={1} value={[glassBorderOpacity]} onValueChange={(v) => setGlassBorderOpacity(Array.isArray(v) ? v[0] : v as number)} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <label>Border Color</label>
                        <input 
                          type="color" 
                          value={glassBorderColor}
                          onChange={(e) => setGlassBorderColor(e.target.value)}
                          className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent" 
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm mb-2.5">
                    <label>Radius</label>
                    <span className="text-text-muted">{radius}px</span>
                  </div>
                  <Slider min={0} max={40} step={1} value={[radius]} onValueChange={(v) => setRadius(Array.isArray(v) ? v[0] : v as number)} />
                </div>
                
                <div>
                  <div className="flex items-center justify-between text-sm mb-2.5">
                    <label>Shadow</label>
                    <span className="text-text-muted">{shadow}px</span>
                  </div>
                  <Slider min={0} max={100} step={1} value={[shadow]} onValueChange={(v) => setShadow(Array.isArray(v) ? v[0] : v as number)} />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xs uppercase tracking-wider text-text-muted mb-3 font-semibold">Effects & Branding</h3>
              <div className="flex flex-col gap-4 text-sm">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2.5">
                    <label>Image Blur</label>
                    <span className="text-text-muted">{imageBlur}px</span>
                  </div>
                  <Slider min={0} max={20} step={1} value={[imageBlur]} onValueChange={(v) => setImageBlur(Array.isArray(v) ? v[0] : v as number)} />
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2.5">
                    <label>BG Blur</label>
                    <span className="text-text-muted">{bgBlur}px</span>
                  </div>
                  <Slider min={0} max={40} step={1} value={[bgBlur]} onValueChange={(v) => setBgBlur(Array.isArray(v) ? v[0] : v as number)} />
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2.5">
                    <label>Digital Noise</label>
                    <span className="text-text-muted">{noiseIntensity}%</span>
                  </div>
                  <Slider min={0} max={100} step={1} value={[noiseIntensity]} onValueChange={(v) => setNoiseIntensity(Array.isArray(v) ? v[0] : v as number)} />
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2.5">
                    <label>Film Grain</label>
                    <span className="text-text-muted">{grainIntensity}%</span>
                  </div>
                  <Slider min={0} max={100} step={1} value={[grainIntensity]} onValueChange={(v) => setGrainIntensity(Array.isArray(v) ? v[0] : v as number)} />
                </div>
                
                {(noiseIntensity > 0 || grainIntensity > 0) && (
                  <div className="flex items-center gap-3 mt-1">
                    <label className="text-xs text-text-muted whitespace-nowrap">Apply textures to:</label>
                    <Select value={noiseTarget} onValueChange={(v) => setNoiseTarget(v || 'both')}>
                      <SelectTrigger className="h-8 bg-black/20 border-border text-xs">
                        <SelectValue placeholder="Target" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="both">Both</SelectItem>
                        <SelectItem value="canvas">Background</SelectItem>
                        <SelectItem value="image">Image Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="flex flex-col gap-2 mt-2">
                  <label className="text-xs text-text-muted">Watermark text</label>
                  <Input 
                    type="text" 
                    placeholder="@username"
                    value={watermark}
                    onChange={(e) => setWatermark(e.target.value)}
                    className="bg-black/20 border-border"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Area */}
      <main className="flex-grow flex flex-col relative">
        {/* Topbar */}
        <header className="h-[60px] min-h-[60px] flex items-center justify-between px-6 bg-panel border-b border-border z-30">
          <div className="relative">
            <button 
              onClick={() => setShowRatioMenu(!showRatioMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-black/20 hover:bg-white/5 text-sm transition-colors text-text-main shadow-sm"
            >
              {(() => {
                const active = FLAT_RATIOS.find(r => r.id === aspectRatio) || FLAT_RATIOS[0];
                return (
                  <>
                    <div className="w-4 h-4 flex items-center justify-center">
                      {active.id === 'auto' ? (
                        <Maximize size={14} className="text-text-muted" />
                      ) : (
                        <div 
                          className="border-[1.5px] border-text-muted/80 rounded-[2px]"
                          style={{ 
                            aspectRatio: active.aspect,
                            ...(Number(active.aspect.split('/')[0]) >= Number(active.aspect.split('/')[1]) 
                              ? { width: '14px', maxHeight: '14px' } 
                              : { height: '14px', maxWidth: '14px' })
                          }}
                        />
                      )}
                    </div>
                    {active.name}
                    <ChevronDown size={14} className="opacity-50 ml-1" />
                  </>
                );
              })()}
            </button>
            
            {showRatioMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowRatioMenu(false)} />
                <div className="absolute top-full left-0 mt-2 w-[380px] bg-panel border border-border rounded-xl shadow-2xl p-3 z-50 flex flex-col gap-4 origin-top-left transition-all">
                  {ASPECT_CATEGORIES.map(category => (
                    <div key={category.name}>
                      <h4 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">{category.name}</h4>
                      <div className="grid grid-cols-3 gap-1.5">
                        {category.ratios.map(ratio => {
                          const isActive = aspectRatio === ratio.id;
                          return (
                            <button
                              key={ratio.name}
                              onClick={() => { setAspectRatio(ratio.id); setShowRatioMenu(false); }}
                              className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg border text-center transition-colors ${isActive ? 'bg-white/10 border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'bg-black/20 border-border hover:bg-white/5 text-text-main'}`}
                            >
                              <div className="w-6 h-6 flex items-center justify-center mb-0.5">
                                {ratio.id === 'auto' ? (
                                  <Maximize size={16} className={isActive ? 'text-white' : 'text-text-muted'} />
                                ) : (
                                  <div 
                                    className={`border-2 rounded-[3px] transition-colors ${isActive ? 'border-white bg-white/20' : 'border-text-muted/50 bg-white/5'}`}
                                    style={{ 
                                      aspectRatio: ratio.aspect,
                                      ...(Number(ratio.aspect.split('/')[0]) >= Number(ratio.aspect.split('/')[1]) 
                                        ? { width: '18px', maxHeight: '18px' } 
                                        : { height: '18px', maxWidth: '18px' })
                                    }}
                                  />
                                )}
                              </div>
                              <span className="text-[11px] font-medium leading-none">{ratio.name}</span>
                              {ratio.desc && <span className="text-[9px] text-text-muted opacity-70 leading-none mt-0.5">{ratio.desc}</span>}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          
          <div className="flex gap-3">
            <button 
              className="px-4 py-2 rounded-lg text-sm font-medium border border-border text-text-main hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
              onClick={() => setImage(null)} 
              disabled={!image}
            >
              Clear
            </button>
            <button 
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-accent hover:bg-accent-hover text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
              onClick={handleExport} 
              disabled={!image}
            >
              <Download size={16} />
              Export Image
            </button>
          </div>
        </header>

        {/* Canvas Workspace */}
        <div 
          ref={workspaceRef}
          className="flex-grow flex items-center justify-center p-10 overflow-auto relative"
        >
          <div 
            ref={canvasRef}
            className="relative flex items-center justify-center shadow-2xl"
            onClick={() => setImageSelected(false)}
            style={{
              padding: `${padding}px`,
              aspectRatio: aspectStyle,
              ...(aspectStyle !== 'auto' ? (
                Number(aspectStyle.split('/')[0]) >= Number(aspectStyle.split('/')[1])
                  ? { width: '800px', maxHeight: '800px' }
                  : { height: '800px', maxWidth: '800px' }
              ) : (image ? { width: '800px', maxHeight: '800px' } : { width: '800px', height: '600px' }))
            }}
          >
            {/* 1. Strictly Clipped Canvas Viewport (Background + Image Content) */}
            <div className="absolute inset-0 overflow-hidden z-0 flex items-center justify-center pointer-events-none" style={{ padding: `${padding}px` }}>
              {/* Background Layer */}
              <div 
                className="absolute pointer-events-none z-0"
                style={{
                  top: bgBlur > 0 ? '-50px' : '0',
                  left: bgBlur > 0 ? '-50px' : '0',
                  right: bgBlur > 0 ? '-50px' : '0',
                  bottom: bgBlur > 0 ? '-50px' : '0',
                  ...(background.startsWith('url(') 
                    ? { backgroundImage: background, backgroundSize: 'cover', backgroundPosition: 'center' }
                    : { background: background }
                  ),
                  filter: bgBlur > 0 ? `blur(${bgBlur}px)` : 'none',
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

              {/* Image Frame inside clipped viewport (Will never bleed outside canvas) */}
              <div 
                ref={imageFrameRef}
                className={`relative group z-10 pointer-events-auto ${isRotating || isDragging || isResizing ? 'transition-none' : 'transition-all duration-200 ease-out'} flex flex-col justify-center items-center ${!image ? 'w-full h-full' : ''}`}
                style={{
                  transform: `translate(${pos.x}px, ${pos.y}px) ${view === '3d' ? 'perspective(1200px) rotateX(15deg) rotateY(-20deg) rotateZ(2deg)' : ''} ${rotation !== 0 ? `rotate(${rotation}deg)` : ''} scale(${scale / 100})`,
                  transformStyle: 'preserve-3d',
                }}
              >
                <div 
                  className={`relative flex flex-col overflow-hidden ${!image ? 'w-full h-full' : ''} ${image && isDragging ? 'opacity-90 transition-none cursor-grabbing' : image ? 'cursor-grab' : ''}`}
                  style={image ? {
                    borderRadius: `${radius}px`,
                    boxShadow: view === '3d' 
                      ? `20px 20px ${shadow * 3}px rgba(0,0,0,0.4)` 
                      : `0 ${shadow}px ${shadow * 2}px rgba(0,0,0,0.3)`,
                    border: glassBorder ? `1px solid rgba(${glassRgb}, ${glassBorderOpacity / 100})` : 'none',
                    background: glassBorder ? `rgba(${glassRgb}, ${(glassBorderOpacity / 100) * 0.25})` : 'transparent',
                    backdropFilter: glassBorder ? 'blur(20px)' : 'none',
                    padding: glassBorder ? `${glassBorderWidth}px` : '0',
                  } : {}}
                  onClick={(e) => { if (image) { e.stopPropagation(); setImageSelected(true); } }}
                  onPointerDown={image ? handlePointerDown : undefined}
                  onPointerMove={image ? handlePointerMove : undefined}
                  onPointerUp={image ? handlePointerUp : undefined}
                >
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
                    <img src={image} alt="Uploaded screenshot" draggable={false} className="max-w-full max-h-full object-contain block transition-all relative z-10" style={{
                      borderRadius: showMacOsBar 
                        ? `0 0 ${glassBorder ? Math.max(0, radius - glassBorderWidth) : radius}px ${glassBorder ? Math.max(0, radius - glassBorderWidth) : radius}px` 
                        : `${glassBorder ? Math.max(0, radius - glassBorderWidth) : radius}px`,
                      filter: getFilterStyle(),
                    }} />
                  ) : (
                    <label className={`flex-grow flex flex-col items-center justify-center gap-4 text-white drop-shadow-md w-full h-full cursor-pointer transition-all relative z-10 rounded-2xl ${background === 'transparent' ? 'border-2 border-dashed border-white/20 bg-black/20 backdrop-blur-md hover:bg-white/10 hover:border-accent/50' : 'hover:bg-white/5'}`}>
                      <Upload size={48} className="opacity-70" />
                      <h2 className="text-xl font-semibold">Drop an image here</h2>
                      <p className="opacity-80">Or paste from clipboard (Ctrl+V)</p>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Unclipped Controls & Handles Layer (Can freely float outside canvas boundaries) */}
            {/* Snap guides */}
            {isDragging && pos.x === 0 && <div className="absolute top-0 bottom-0 left-1/2 w-px bg-accent/70 z-50 pointer-events-none drop-shadow-md" />}
            {isDragging && pos.y === 0 && <div className="absolute left-0 right-0 top-1/2 h-px bg-accent/70 z-50 pointer-events-none drop-shadow-md" />}
            
            <div 
              className={`relative z-30 pointer-events-none ${isRotating || isDragging || isResizing ? 'transition-none' : 'transition-all duration-200 ease-out'} flex flex-col justify-center items-center ${!image ? 'w-full h-full' : ''}`}
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px) ${view === '3d' ? 'perspective(1200px) rotateX(15deg) rotateY(-20deg) rotateZ(2deg)' : ''} ${rotation !== 0 ? `rotate(${rotation}deg)` : ''} scale(${scale / 100})`,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Ghost matching bounding box to position handles accurately */}
              <div 
                className={`relative flex flex-col pointer-events-none ${!image ? 'w-full h-full' : ''}`}
                style={image ? {
                  borderRadius: `${radius}px`,
                  padding: glassBorder ? `${glassBorderWidth}px` : '0',
                } : {}}
              >
                {image && showMacOsBar && <div className="h-10 opacity-0 pointer-events-none" />}
                {image && (
                  <img src={image} alt="" draggable={false} className="max-w-full max-h-full object-contain block opacity-0 pointer-events-none" />
                )}

                {/* Floating image controls (Unclipped) */}
                {image && (imageSelected || isRotating) && (
                  <div 
                    className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-[#1C1C1E] border border-white/15 rounded-lg px-2 py-1 shadow-2xl z-[70] pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-200"
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
                          className="w-12 h-6 px-1 bg-black/70 text-white border border-accent rounded text-center text-xs font-mono focus:outline-none focus:ring-1 focus:ring-accent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                
                {/* Resize & Rotate handles (Unclipped) */}
                {image && (
                  <div className={`absolute inset-0 pointer-events-none transition-opacity duration-200 z-50 ${isResizing || isRotating || imageSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    {/* Outline box */}
                    <div className="absolute inset-0 border-2 border-accent/60 pointer-events-none rounded-lg shadow-sm" />

                    {/* Corner Resize Handles (Exclusively for Minimize / Maximize) */}
                    <div 
                      className="absolute -top-2 -left-2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-accent pointer-events-auto cursor-nwse-resize hover:scale-125 active:scale-110 transition-transform z-50" 
                      onPointerDown={(e) => handleResizeDown(e, 'tl')} 
                      title="Drag to minimize / maximize size" 
                    />
                    <div 
                      className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-accent pointer-events-auto cursor-nesw-resize hover:scale-125 active:scale-110 transition-transform z-50" 
                      onPointerDown={(e) => handleResizeDown(e, 'tr')} 
                      title="Drag to minimize / maximize size" 
                    />
                    <div 
                      className="absolute -bottom-2 -left-2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-accent pointer-events-auto cursor-nesw-resize hover:scale-125 active:scale-110 transition-transform z-50" 
                      onPointerDown={(e) => handleResizeDown(e, 'bl')} 
                      title="Drag to minimize / maximize size" 
                    />
                    <div 
                      className="absolute -bottom-2 -right-2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-accent pointer-events-auto cursor-nwse-resize hover:scale-125 active:scale-110 transition-transform z-50" 
                      onPointerDown={(e) => handleResizeDown(e, 'br')} 
                      title="Drag to minimize / maximize size" 
                    />

                    {/* Top Rotation Stalk & Knob (Dedicated Rotation Control) */}
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto z-50">
                      <div 
                        className="w-6 h-6 rounded-full bg-white text-black shadow-lg border border-black/20 flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-115 transition-transform"
                        title="Drag to rotate (Hold Shift for 15° snap)"
                        onPointerDown={handleRotateDown}
                      >
                        <RotateCw size={12} className="text-black/80" />
                      </div>
                      <div className="w-0.5 h-3 bg-accent/80" />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {watermark && (
              <div className="absolute bottom-8 font-medium text-white/80 drop-shadow-lg text-sm tracking-wide z-10 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                {watermark}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Right Sidebar - Variants & Filters */}
      <aside className="w-[260px] min-w-[260px] bg-panel border-l border-border flex flex-col p-5 gap-6 overflow-y-auto">
        <div>
          <h3 className="text-xs uppercase tracking-wider text-text-muted mb-3 font-semibold">Templates & Views</h3>
          <div className="flex flex-col gap-2">
            <button 
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${view === 'default' ? 'bg-white/10 border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 'bg-transparent border border-border text-text-main hover:bg-white/5'}`}
              onClick={() => { setView('default'); setShowMacOsBar(true); setGlassBorder(false); setPadding(64); setRadius(16); setShadow(25); }}
            >
              <Layers size={16} /> Default View
            </button>
            <button 
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${view === 'browser' ? 'bg-white/10 border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 'bg-transparent border border-border text-text-main hover:bg-white/5'}`}
              onClick={() => { setView('browser'); setShowMacOsBar(true); setGlassBorder(false); setPadding(64); setRadius(16); setShadow(25); }}
            >
              <Monitor size={16} /> Web Browser
            </button>
            <button 
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${view === 'minimal' ? 'bg-white/10 border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 'bg-transparent border border-border text-text-main hover:bg-white/5'}`}
              onClick={() => { setView('minimal'); setShowMacOsBar(false); setGlassBorder(false); setPadding(32); setRadius(0); setShadow(0); }}
            >
              <ImageIcon size={16} /> Minimalist
            </button>
            <button 
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${view === '3d' ? 'bg-white/10 border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 'bg-transparent border border-border text-text-main hover:bg-white/5'}`}
              onClick={() => { setView('3d'); setShowMacOsBar(true); setGlassBorder(true); setPadding(80); setRadius(16); setShadow(35); }}
            >
              <Sparkles size={16} /> 3D Tilted View
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-wider text-text-muted mb-3 font-semibold">Image Filters</h3>
          <div className="flex flex-col gap-2">
            <button 
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${filter === 'none' ? 'bg-white/10 border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 'bg-transparent border border-border text-text-main hover:bg-white/5'}`}
              onClick={() => setFilter('none')}
            >
              <Filter size={16} /> None
            </button>
            <button 
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${filter === 'grayscale' ? 'bg-white/10 border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 'bg-transparent border border-border text-text-main hover:bg-white/5'}`}
              onClick={() => setFilter('grayscale')}
            >
              <Filter size={16} /> Grayscale
            </button>
            <button 
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${filter === 'contrast' ? 'bg-white/10 border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 'bg-transparent border border-border text-text-main hover:bg-white/5'}`}
              onClick={() => setFilter('contrast')}
            >
              <Filter size={16} /> High Contrast
            </button>
            <button 
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${filter === 'sepia' ? 'bg-white/10 border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 'bg-transparent border border-border text-text-main hover:bg-white/5'}`}
              onClick={() => setFilter('sepia')}
            >
              <Filter size={16} /> Sepia
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
