import { MCP_PERSPECTIVES, MCP_PRESETS } from './presets.js';
import type { WebsiteEmbedOptions } from './types.js';

/**
 * Generates self-contained 3D CSS / Tailwind HTML & React code
 * for embedding screenshot mockups directly into websites with ZERO server costs.
 */
export function generateWebsiteEmbed(options: WebsiteEmbedOptions): {
  htmlTailwind: string;
  reactTailwind: string;
  markdown: string;
} {
  const {
    imageSrc,
    altText = 'App Screenshot Mockup',
    preset = '3d-hero-angle',
    perspective = 'isometric-left',
    showMacOsBar = true,
    windowTitle = '',
    theme = 'dark',
  } = options;

  // Resolve perspective style
  const p = MCP_PERSPECTIVES.find((x) => x.id === perspective) || MCP_PERSPECTIVES[1];
  const cssTransform = p.cssTransform;

  // Resolve preset backdrop
  const foundPreset = MCP_PRESETS.find((x) => x.id === preset);
  const isDark = theme === 'dark';

  const windowBg = isDark ? 'bg-zinc-900/90' : 'bg-white/90';
  const headerBg = isDark ? 'bg-zinc-950/80 border-white/5' : 'bg-zinc-100/90 border-black/5';
  const textColor = isDark ? 'text-zinc-400' : 'text-zinc-500';

  // 1. HTML + Tailwind CSS (Universal for Astro, HTML, Vue, Svelte, Next.js)
  const htmlTailwind = `
<!-- NoiceSS 3D Mockup Embed (Pure Tailwind CSS - Zero Server Cost) -->
<div class="relative w-full max-w-4xl mx-auto p-4 sm:p-8 flex items-center justify-center [perspective:1400px]">
  <div 
    class="relative w-full rounded-2xl ${windowBg} border border-white/10 shadow-2xl transition-transform duration-500 ease-out hover:scale-[1.01]"
    style="transform: ${cssTransform}; transform-style: preserve-3d; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08);"
  >
    ${
      showMacOsBar
        ? `<!-- macOS Window Chrome Header -->
    <div class="flex items-center justify-between px-4 py-3 ${headerBg} border-b rounded-t-2xl">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]"></span>
        <span class="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]"></span>
        <span class="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]"></span>
      </div>
      ${windowTitle ? `<span class="text-xs font-medium ${textColor}">${windowTitle}</span>` : '<span class="text-xs opacity-0">...</span>'}
      <div class="w-12"></div>
    </div>`
        : ''
    }
    <!-- Screenshot Content -->
    <div class="overflow-hidden ${showMacOsBar ? 'rounded-b-2xl' : 'rounded-2xl'}">
      <img 
        src="${imageSrc}" 
        alt="${altText}" 
        class="w-full h-auto block object-cover" 
        loading="lazy"
      />
    </div>
  </div>
</div>
`.trim();

  // 2. React / Next.js Component
  const reactTailwind = `
import React from 'react';

interface NoiceMockupProps {
  src?: string;
  alt?: string;
  className?: string;
}

export function NoiceMockup({
  src = '${imageSrc}',
  alt = '${altText}',
  className = '',
}: NoiceMockupProps) {
  return (
    <div className={\`relative w-full max-w-4xl mx-auto p-4 sm:p-8 flex items-center justify-center [perspective:1400px] \${className}\`}>
      <div
        className="relative w-full rounded-2xl ${windowBg} border border-white/10 shadow-2xl transition-all duration-300 hover:scale-[1.01]"
        style={{
          transform: '${cssTransform}',
          transformStyle: 'preserve-3d',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        }}
      >
        ${
          showMacOsBar
            ? `{/* macOS Chrome Bar */}
        <div className="flex items-center justify-between px-4 py-3 ${headerBg} border-b rounded-t-2xl">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
          </div>
          ${windowTitle ? `<span className="text-xs font-medium ${textColor}">${windowTitle}</span>` : '<span className="text-xs opacity-0">...</span>'}
          <div className="w-12" />
        </div>`
            : ''
        }
        <div className="overflow-hidden ${showMacOsBar ? 'rounded-b-2xl' : 'rounded-2xl'}">
          <img
            src={src}
            alt={alt}
            className="w-full h-auto block object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
`.trim();

  // 3. Markdown snippet
  const markdown = `
<div align="center">
  <img src="${imageSrc}" alt="${altText}" style="border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); max-width: 100%;" />
</div>
`.trim();

  return { htmlTailwind, reactTailwind, markdown };
}
