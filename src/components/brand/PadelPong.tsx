"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Endless padel pong for the "Coming soon" page: an Optic Yellow ball rallies between two paddles.
 * Move the pointer (or finger) over the court to take over the left paddle.
 * Pauses when off-screen or in a background tab; shows a still frame with reduced motion.
 */
export function PadelPong({ label }: { label: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [rally, setRally] = useState(0);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const W = 960, H = 540; // logical size, scaled to the element
    const PAD_W = 14, PAD_H = 96, BALL = 12;
    const s = { bx: W / 2, by: H / 2, vx: 6.2, vy: 3.1, ly: H / 2, ry: H / 2, player: null as number | null, hits: 0, trail: [] as { x: number; y: number }[] };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = W * dpr;
      el.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      ctx.fill();
    };

    const draw = () => {
      // Court
      ctx.fillStyle = "#15171f";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth = 2;
      ctx.strokeRect(24, 24, W - 48, H - 48);
      ctx.beginPath();
      ctx.moveTo(24, H / 2);
      ctx.lineTo(W - 24, H / 2);
      ctx.stroke();
      // Net
      ctx.setLineDash([10, 10]);
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.beginPath();
      ctx.moveTo(W / 2, 24);
      ctx.lineTo(W / 2, H - 24);
      ctx.stroke();
      ctx.setLineDash([]);
      // Paddles: purple left, magenta right
      ctx.fillStyle = "#8412b5";
      roundRect(40, s.ly - PAD_H / 2, PAD_W, PAD_H, 7);
      ctx.fillStyle = "#e005c3";
      roundRect(W - 40 - PAD_W, s.ry - PAD_H / 2, PAD_W, PAD_H, 7);
      // Ball trail + ball (Optic Yellow)
      s.trail.forEach((p, i) => {
        ctx.fillStyle = `rgba(223,255,79,${(i / s.trail.length) * 0.35})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, (BALL / 2) * (i / s.trail.length), 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowColor = "rgba(223,255,79,0.8)";
      ctx.shadowBlur = 24;
      ctx.fillStyle = "#dfff4f";
      ctx.beginPath();
      ctx.arc(s.bx, s.by, BALL / 2 + 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const step = () => {
      s.trail.push({ x: s.bx, y: s.by });
      if (s.trail.length > 10) s.trail.shift();
      s.bx += s.vx;
      s.by += s.vy;
      if (s.by < 24 + BALL / 2 || s.by > H - 24 - BALL / 2) s.vy *= -1;

      // Paddles follow the ball (AI) – the player can take over the left one
      const follow = (y: number, target: number, speed: number) => y + Math.max(-speed, Math.min(speed, target - y));
      s.ly = s.player ?? follow(s.ly, s.vx < 0 ? s.by : H / 2, 7);
      s.ry = follow(s.ry, s.vx > 0 ? s.by : H / 2, 7);

      const hitLeft = s.vx < 0 && s.bx - BALL / 2 <= 40 + PAD_W && Math.abs(s.by - s.ly) < PAD_H / 2 + BALL / 2;
      const hitRight = s.vx > 0 && s.bx + BALL / 2 >= W - 40 - PAD_W && Math.abs(s.by - s.ry) < PAD_H / 2 + BALL / 2;
      if (hitLeft || hitRight) {
        const paddleY = hitLeft ? s.ly : s.ry;
        s.vx = -s.vx * 1.02;
        s.vx = Math.sign(s.vx) * Math.min(Math.abs(s.vx), 12);
        s.vy = ((s.by - paddleY) / (PAD_H / 2)) * 6 + (Math.random() - 0.5);
        s.hits += 1;
        setRally(s.hits);
      }
      // Missed (only possible when the player plays): serve again from the middle
      if (s.bx < -20 || s.bx > W + 20) {
        Object.assign(s, { bx: W / 2, by: H / 2, vx: s.bx < 0 ? 6.2 : -6.2, vy: 3.1, hits: 0, trail: [] });
        setRally(0);
      }
    };

    let raf = 0;
    let running = !reduce;
    const loop = () => {
      if (running) step();
      draw();
      raf = requestAnimationFrame(loop);
    };
    if (reduce) draw();
    else raf = requestAnimationFrame(loop);

    const io = new IntersectionObserver(([e]) => (running = !reduce && e.isIntersecting));
    io.observe(el);
    const onVis = () => (running = !reduce && !document.hidden);
    document.addEventListener("visibilitychange", onVis);

    const toY = (clientY: number) => {
      const r = el.getBoundingClientRect();
      return Math.max(24 + PAD_H / 2, Math.min(H - 24 - PAD_H / 2, ((clientY - r.top) / r.height) * H));
    };
    const onMove = (e: PointerEvent) => (s.player = toY(e.clientY));
    const onLeave = () => (s.player = null);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="relative">
      <canvas ref={canvas} role="img" aria-label={label} className="aspect-[16/9] w-full touch-none rounded-[24px] border border-fg/10" />
      <p className="pointer-events-none absolute right-5 top-4 font-display text-xl font-extrabold italic uppercase tabular-nums text-highlight-fg md:text-2xl" aria-hidden>
        Rally {rally}
      </p>
    </div>
  );
}
