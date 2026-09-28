"use client";

import { useRef, useState } from "react";
import { PRESETS } from "@/lib/constants";
import { Frame } from "@/components/brand/frame";

export function GitHubIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}


function Screenshot() {
  return (
    <div className="bg-[#0a0a0c]">
      <div className="flex items-center gap-1.5 border-b border-white/[0.07] bg-white/[0.03] px-3 py-2">
        <span className="size-[7px] rounded-full bg-[#ff5f57]" />
        <span className="size-[7px] rounded-full bg-[#febc2e]" />
        <span className="size-[7px] rounded-full bg-[#28c840]" />
        <span className="ml-2 truncate font-mono text-[9px] text-zinc-500">noicess.fun</span>
      </div>
      <img
        src="/landing/studio-shot.webp"
        alt="The NoiceSS studio interface, showing canvas setup controls, 3D orbit sliders and angle presets"
        className="block w-full"
      />
    </div>
  );
}


export default function Mockup() {
  const [index, setIndex] = useState(2);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const raf = useRef(0);

  const c = PRESETS[index].config;

  const onMove = (e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => setTilt({ x: py * -7, y: px * 10 }));
  };

  return (
    <div
      className="flex w-full flex-col items-center gap-5"
      onPointerMove={onMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <div
        className="relative w-full max-w-[52rem] [perspective:1600px] motion-reduce:[perspective:none]"
        style={{
          transform: `rotateX(${c.rotateX + tilt.x}deg) rotateY(${c.rotateY + tilt.y}deg) rotateZ(${c.rotateZ}deg)`,
          transition: "transform 300ms cubic-bezier(0.2, 0, 0, 1)",
        }}
      >
        <div
          className="overflow-hidden rounded-2xl"
          style={
            c.background.startsWith("url(") || c.background.includes("gradient")
              ? {
                  backgroundImage: c.background,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  padding: "10% 9%",
                }
              : { backgroundColor: c.background, padding: "10% 9%" }
          }
        >
          <div className="relative overflow-hidden rounded-xl shadow-[0_28px_56px_-12px_rgba(0,0,0,0.9)]">
            <Screenshot />
            {c.glassBorder && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-xl border border-white/30"
                style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)" }}
              />
            )}
          </div>
        </div>
      </div>

      <div
        className="flex w-full max-w-[52rem] flex-wrap items-center justify-center gap-1.5"
        role="group"
        aria-label="Try a studio preset"
      >
        {PRESETS.map((p, i) => (
          <Frame key={p.id} tone={i === index ? "strong" : "quiet"}>
            <button
              onClick={() => setIndex(i)}
              aria-pressed={i === index}
              className={`shrink-0 whitespace-nowrap rounded-lg border border-transparent px-2.5 py-1.5 text-[11px] font-medium transition-all duration-200 active:scale-[0.96] ${
                i === index ? "bg-white/[0.09] text-white" : "bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-200"
              }`}
            >
              {p.name}
            </button>
          </Frame>
        ))}
      </div>
    </div>
  );
}
