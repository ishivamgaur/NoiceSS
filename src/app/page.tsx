"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Download, Layers, Monitor, Image as ImageIcon, Sparkles, Filter } from 'lucide-react';
import { toPng } from 'html-to-image';

export default function StudioPage() {
  const [image, setImage] = useState<string | null>(null);
  const [padding, setPadding] = useState(64);
  const [radius, setRadius] = useState(16);
  const [shadow, setShadow] = useState(25);
  const [scale, setScale] = useState(100);
  const [aspectRatio, setAspectRatio] = useState('auto');
  const [showMacOsBar, setShowMacOsBar] = useState(true);
  const [glassBorder, setGlassBorder] = useState(false);
  const [noiseEffect, setNoiseEffect] = useState(false);
  
  const [background, setBackground] = useState('linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)');
  
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.items) {
        for (let i = 0; i < e.clipboardData.items.length; i++) {
          if (e.clipboardData.items[i].type.indexOf('image') !== -1) {
            const blob = e.clipboardData.items[i].getAsFile();
            if (blob) {
              const reader = new FileReader();
              reader.onload = (e) => setImage(e.target?.result as string);
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
      reader.onload = (e) => setImage(e.target?.result as string);
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

  const backgrounds = [
    'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)',
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(to top, #0ba360 0%, #3cba92 100%)',
    '#0d0d0f',
    '#ffffff',
    'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop")',
    'url("https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2670&auto=format&fit=crop")',
    'url("https://images.unsplash.com/photo-1542435503-91dce5315f51?q=80&w=2574&auto=format&fit=crop")',
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-dark text-text-main font-sans">
      
      {/* Left Sidebar */}
      <aside className="w-[280px] min-w-[280px] flex flex-col bg-panel border-r border-border overflow-y-auto p-5 gap-6">
        <div>
          <h3 className="text-xs uppercase tracking-wider text-text-muted mb-3 font-semibold">Canvas Setup</h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm">
              <label>Padding</label>
              <span className="text-text-muted">{padding}px</span>
            </div>
            <input type="range" min="0" max="120" value={padding} onChange={(e) => setPadding(Number(e.target.value))} className="w-full accent-accent cursor-pointer" />
            
            <div className="flex items-center justify-between text-sm mt-2">
              <label>Scale</label>
              <span className="text-text-muted">{scale}%</span>
            </div>
            <input type="range" min="50" max="150" value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-full accent-accent cursor-pointer" />
          </div>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-wider text-text-muted mb-3 font-semibold">Window Frame</h3>
          <div className="flex flex-col gap-3 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={showMacOsBar} onChange={(e) => setShowMacOsBar(e.target.checked)} className="accent-accent w-4 h-4" />
              macOS Titlebar
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={glassBorder} onChange={(e) => setGlassBorder(e.target.checked)} className="accent-accent w-4 h-4" />
              Glass Border Effect
            </label>

            <div className="flex items-center justify-between text-sm mt-3">
              <label>Border Radius</label>
              <span className="text-text-muted">{radius}px</span>
            </div>
            <input type="range" min="0" max="40" value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-full accent-accent cursor-pointer" />

            <div className="flex items-center justify-between text-sm mt-2">
              <label>Shadow</label>
              <span className="text-text-muted">{shadow}px</span>
            </div>
            <input type="range" min="0" max="100" value={shadow} onChange={(e) => setShadow(Number(e.target.value))} className="w-full accent-accent cursor-pointer" />
          </div>
        </div>
        
        <div>
          <h3 className="text-xs uppercase tracking-wider text-text-muted mb-3 font-semibold">Effects</h3>
          <div className="flex flex-col gap-3 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={noiseEffect} onChange={(e) => setNoiseEffect(e.target.checked)} className="accent-accent w-4 h-4" />
              Add Film Grain / Noise
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-wider text-text-muted mb-3 font-semibold">Backgrounds</h3>
          <div className="grid grid-cols-3 gap-2">
            {backgrounds.map((bg, idx) => (
              <div 
                key={idx} 
                className={`aspect-square rounded-md cursor-pointer border-2 hover:opacity-80 transition-opacity ${background === bg ? 'border-accent' : 'border-transparent'}`}
                style={{ background: bg, backgroundSize: 'cover', backgroundPosition: 'center' }}
                onClick={() => setBackground(bg)}
              />
            ))}
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-grow flex flex-col relative">
        {/* Topbar */}
        <header className="h-[60px] min-h-[60px] flex items-center justify-between px-6 bg-panel border-b border-border">
          <div className="flex gap-2">
            {['auto', '1:1', '16:9', '4:3', '3:2'].map(ratio => (
              <button 
                key={ratio} 
                className={`px-3 py-1.5 rounded text-sm transition-colors ${aspectRatio === ratio ? 'bg-white/10 text-white border-white/20' : 'text-text-muted border-transparent hover:bg-white/5'} border`}
                onClick={() => setAspectRatio(ratio)}
              >
                {ratio}
              </button>
            ))}
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
        <div className="flex-grow flex items-center justify-center p-10 overflow-auto relative">
          {image ? (
            <div 
              ref={canvasRef}
              className="relative flex items-center justify-center overflow-hidden transition-all duration-200 ease-out shadow-2xl"
              style={{
                background: background,
                padding: `${padding}px`,
                transform: `scale(${scale / 100})`,
                aspectRatio: aspectRatio === 'auto' ? 'auto' : aspectRatio.replace(':', '/'),
                width: aspectRatio !== 'auto' ? '800px' : 'auto',
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            >
              {noiseEffect && (
                <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-overlay" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }} />
              )}
              
              <div 
                className="relative flex flex-col overflow-hidden transition-all"
                style={{
                  borderRadius: `${radius}px`,
                  boxShadow: `0 ${shadow}px ${shadow * 2}px rgba(0,0,0,0.3)`,
                  border: glassBorder ? '1px solid rgba(255,255,255,0.2)' : 'none',
                  background: glassBorder ? 'rgba(255,255,255,0.05)' : '#000',
                  backdropFilter: glassBorder ? 'blur(20px)' : 'none',
                  padding: glassBorder ? '8px' : '0'
                }}
              >
                {showMacOsBar && (
                  <div className="h-8 bg-white/10 backdrop-blur-md flex items-center px-3 gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  </div>
                )}
                <img src={image} alt="Uploaded screenshot" className="max-w-full max-h-full object-contain block" style={{
                  borderRadius: showMacOsBar ? `0 0 ${radius}px ${radius}px` : `${radius}px`
                }} />
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center gap-4 text-text-muted w-full h-full border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-accent hover:bg-accent/5 transition-all">
              <Upload size={48} className="opacity-50" />
              <h2 className="text-xl font-semibold text-text-main">Drop an image here</h2>
              <p>Or paste from clipboard (Ctrl+V)</p>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          )}
        </div>
      </main>

      {/* Right Sidebar - Variants */}
      <aside className="w-[260px] min-w-[260px] bg-panel border-l border-border flex flex-col p-5 gap-4 overflow-y-auto">
        <h3 className="text-xs uppercase tracking-wider text-text-muted font-semibold">Templates & Views</h3>
        
        <div className="flex flex-col gap-2">
          <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm bg-transparent border border-border text-text-main hover:bg-white/5 transition-colors">
            <Layers size={16} /> Default View
          </button>
          <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm bg-transparent border border-border text-text-main hover:bg-white/5 transition-colors">
            <Monitor size={16} /> Web Browser
          </button>
          <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm bg-transparent border border-border text-text-main hover:bg-white/5 transition-colors">
            <ImageIcon size={16} /> Minimalist
          </button>
          <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm bg-transparent border border-border text-text-main hover:bg-white/5 transition-colors">
            <Sparkles size={16} /> 3D Tilted View
          </button>
        </div>

        <h3 className="text-xs uppercase tracking-wider text-text-muted font-semibold mt-4">Image Filters</h3>
        <div className="flex flex-col gap-2">
          <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm bg-transparent border border-border text-text-main hover:bg-white/5 transition-colors">
            <Filter size={16} /> None
          </button>
          <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm bg-transparent border border-border text-text-main hover:bg-white/5 transition-colors">
            <Filter size={16} /> Grayscale
          </button>
          <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm bg-transparent border border-border text-text-main hover:bg-white/5 transition-colors">
            <Filter size={16} /> High Contrast
          </button>
          <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm bg-transparent border border-border text-text-main hover:bg-white/5 transition-colors">
            <Filter size={16} /> Sepia
          </button>
        </div>
      </aside>
    </div>
  );
}
