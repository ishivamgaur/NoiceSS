import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionItemProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({ title, subtitle, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full h-[26px] min-h-[26px] px-0.5 text-[11px] font-semibold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors group cursor-pointer leading-none"
      >
        <div className="flex items-center gap-1.5">
          <ChevronDown 
            size={13} 
            className={cn(
              "shrink-0 text-zinc-500 group-hover:text-zinc-300 transition-transform duration-200",
              isOpen ? "rotate-0" : "-rotate-90"
            )} 
          />
          <span className="leading-none">{title}</span>
        </div>
        {subtitle && (
          <span className="text-[10px] text-zinc-500 font-mono tabular-nums leading-none">
            {subtitle}
          </span>
        )}
      </button>

      <div 
        className={cn(
          "grid transition-all duration-200 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="p-3 rounded-xl bg-white/[0.015] border border-white/[0.04] flex flex-col gap-2 animate-in fade-in duration-150 mt-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
