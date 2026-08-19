import React from 'react';
import { cn } from "@/lib/utils";

interface PanelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  icon?: React.ReactNode;
  tooltip?: string;
}

export function PanelButton({ 
  className, 
  active, 
  icon, 
  children,
  tooltip,
  ...props 
}: PanelButtonProps) {
  return (
    <button
      title={tooltip}
      aria-label={tooltip}
      className={cn(
        "flex items-center justify-center w-[32px] h-[32px] md:w-[34px] md:h-[34px] rounded-lg border transition-all active:scale-[0.96] disabled:opacity-30 disabled:hover:bg-transparent disabled:active:scale-100 disabled:cursor-not-allowed",
        active 
          ? "bg-white/10 border-white/20 text-white shadow-sm" 
          : "border-transparent text-zinc-400 hover:bg-white/[0.04] hover:border-white/5 hover:text-white",
        className
      )}
      {...props}
    >
      {icon || children}
    </button>
  );
}
