import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AccordionItem } from "@/components/ui/accordion";
import { Monitor, Camera, Zap, Download } from 'lucide-react';

export function Sidebar() {
  return (
    <div className="w-[320px] shrink-0 border-r border-white/10 bg-black/40 backdrop-blur-xl h-full overflow-hidden flex flex-col z-[150]">
      {/* Header Area */}
      <div className="p-4 border-b border-white/10 flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-white/10 border border-white/20 flex items-center justify-center">
          <Camera size={14} className="text-zinc-200" />
        </div>
        <h1 className="font-semibold text-sm tracking-tight text-white">NoiceSS Studio</h1>
      </div>

      {/* Main Tabs Panel */}
      <Tabs defaultValue="design" className="flex-1 overflow-hidden">
        
        {/* Navigation Tabs */}
        <div className="px-4 pt-3 pb-2">
          <TabsList className="w-full bg-white/[0.03] border border-white/[0.05] p-1 rounded-xl">
            <TabsTrigger value="design" className="flex-1 gap-1.5 py-1.5 rounded-lg data-[state=active]:bg-white/10 data-[state=active]:shadow-md">
              <Monitor size={14} />
              Design
            </TabsTrigger>
            <TabsTrigger value="effects" className="flex-1 gap-1.5 py-1.5 rounded-lg data-[state=active]:bg-white/10 data-[state=active]:shadow-md">
              <Zap size={14} />
              Effects
            </TabsTrigger>
            <TabsTrigger value="export" className="flex-1 gap-1.5 py-1.5 rounded-lg data-[state=active]:bg-white/10 data-[state=active]:shadow-md">
              <Download size={14} />
              Export
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-4 pb-20 custom-scrollbar">
          
          {/* DESIGN TAB */}
          <TabsContent value="design" className="flex flex-col gap-4 mt-2">
            
            <AccordionItem title="ASPECT RATIO" subtitle="16:9" defaultOpen>
              <div className="grid grid-cols-2 gap-2">
                <button className="h-8 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/10 text-xs text-zinc-300">16:9</button>
                <button className="h-8 rounded-lg border border-transparent bg-transparent hover:bg-white/5 text-xs text-zinc-400">4:3</button>
                <button className="h-8 rounded-lg border border-transparent bg-transparent hover:bg-white/5 text-xs text-zinc-400">1:1</button>
                <button className="h-8 rounded-lg border border-transparent bg-transparent hover:bg-white/5 text-xs text-zinc-400">Auto</button>
              </div>
            </AccordionItem>

            <AccordionItem title="CANVAS BACKGROUND" subtitle="Dark Green" defaultOpen>
              <div className="h-24 w-full rounded-lg bg-gradient-to-br from-green-900 to-black border border-white/10 mb-2" />
              <button className="w-full h-8 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white border border-white/10 transition-colors">
                Browse Wallpapers
              </button>
            </AccordionItem>

            <AccordionItem title="WINDOW CHROME" subtitle="Default macOS">
              <div className="flex flex-col gap-2 text-xs text-zinc-400">
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10 cursor-pointer">
                  <span className="text-white">Default macOS</span>
                  <div className="flex gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                  <span>Minimal Frameless</span>
                </div>
              </div>
            </AccordionItem>
          </TabsContent>

          {/* EFFECTS TAB */}
          <TabsContent value="effects" className="flex flex-col gap-4 mt-2">
            <AccordionItem title="3D PERSPECTIVE" subtitle="Flat 2D" defaultOpen>
              <p className="text-xs text-zinc-500 p-2">3D Controls will go here...</p>
            </AccordionItem>
            
            <AccordionItem title="STUDIO LIGHTING" subtitle="Custom" defaultOpen>
              <p className="text-xs text-zinc-500 p-2">Lighting sliders will go here...</p>
            </AccordionItem>
          </TabsContent>

          {/* EXPORT TAB */}
          <TabsContent value="export" className="flex flex-col gap-4 mt-2">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-3">
              <h3 className="text-sm font-medium text-white">Export Settings</h3>
              <p className="text-xs text-zinc-400">Configure your final output format and resolution.</p>
              <button className="w-full h-10 rounded-lg bg-white hover:bg-zinc-200 text-black text-sm font-semibold flex items-center justify-center gap-2 mt-2 transition-transform active:scale-95">
                <Download size={16} />
                Download Screenshot
              </button>
            </div>
          </TabsContent>

        </div>
      </Tabs>
    </div>
  );
}
