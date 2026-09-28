"use client";

import { useEffect, useRef } from "react";

/* The NOICESS wordmark, drawn as a living dot field: text pixels are
   sampled once as particle homes; the cursor scatters them and the
   spring reforms the word on leave. */
export function LogoNoise() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, vx: 0, vy: 0, inside: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = wrap.clientWidth;
    const H = wrap.clientHeight;
    if (W === 0 || H === 0) return;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    // Sample the wordmark offscreen, dots will live on these pixels
    const off = document.createElement('canvas');
    off.width = W;
    off.height = H;
    const octx = off.getContext('2d', { willReadFrequently: true });
    let pts: { x: number; y: number; ox: number; oy: number; vx: number; vy: number; r: number; a: number }[] = [];
    if (octx) {
      octx.clearRect(0, 0, W, H);
      octx.fillStyle = '#ffffff';
      octx.font = `900 ${Math.round(H * 0.3)}px Arial, sans-serif`;
      octx.textBaseline = 'middle';
      const word = 'NOICESS';
      const tracking = Math.round(H * 0.14);
      const widths = word.split('').map((ch) => octx.measureText(ch).width);
      const totalW = widths.reduce((a, b) => a + b, 0) + tracking * (word.length - 1);
      let cx = 24;
      word.split('').forEach((ch, i) => {
        octx.fillText(ch, cx, H / 2 + 1);
        cx += widths[i] + tracking;
      });
      void totalW;
      const img = octx.getImageData(0, 0, W, H).data;
      const step = 1;
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          if (img[(y * W + x) * 4 + 3] > 200) {
            pts.push({
              x, y, ox: x, oy: y, vx: 0, vy: 0,
              r: Math.random() < 0.75 ? 1 : 1.5,
              a: 0.8 + Math.random() * 0.2,
            });
          }
        }
      }
    }
    // Fallback: plain grain field if sampling fails
    if (pts.length === 0) {
      pts = Array.from({ length: 450 }, () => {
        const x = Math.random() * W;
        const y = Math.random() * H;
        return { x, y, ox: x, oy: y, vx: 0, vy: 0, r: 1.5, a: 0.1 };
      });
    }

    let raf = 0;
    let running = true;
    const loop = () => {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      const m = mouseRef.current;
      for (const p of pts) {
        if (m.inside) {
          const dx = p.x - m.x;
          const dy = p.y - m.y;
          const d = Math.hypot(dx, dy);
          const R = 60;
          if (d < R && d > 0.01) {
            const proximity = (R - d) / R;
            const f = proximity * 0.25;
            p.vx += (dx / d) * f + m.vx * proximity * 0.15;
            p.vy += (dy / d) * f + m.vy * proximity * 0.15;
          }
        }
        // tight spring home = dots shimmer near home, word never breaks apart
        p.vx += (p.ox - p.x) * 0.03;
        p.vy += (p.oy - p.y) * 0.03;
        p.vx *= 0.8;
        p.vy *= 0.8;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -6) { p.x = -6; p.vx = 0; }
        if (p.x > W + 6) { p.x = W + 6; p.vx = 0; }
        if (p.y < -6) { p.y = -6; p.vy = 0; }
        if (p.y > H + 6) { p.y = H + 6; p.vy = 0; }
        ctx.globalAlpha = p.a;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(p.x, p.y, p.r, p.r);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const m = mouseRef.current;
      if (!m.inside) {
        m.x = x;
        m.y = y;
        m.vx = 0;
        m.vy = 0;
      } else {
        // smoothed cursor velocity -> dots inherit the flick momentum
        m.vx = m.vx * 0.7 + (x - m.x) * 0.3;
        m.vy = m.vy * 0.7 + (y - m.y) * 0.3;
        m.x = x;
        m.y = y;
      }
      m.inside = true;
      if (!running) { running = true; loop(); }
    };
    const onLeave = () => { mouseRef.current.inside = false; mouseRef.current.vx = 0; mouseRef.current.vy = 0; };
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', onLeave);
    loop();
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

export function Wordmark() {
  return (
    <div className="relative h-16 w-[300px] max-w-[48vw] shrink-0">
      <LogoNoise />
      <span className="sr-only">NoiceSS</span>
    </div>
  );
}
