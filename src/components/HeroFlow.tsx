import { useEffect, useRef } from 'react';

// Background for the hero: many route lines flow in from the left and converge on the router card,
// small "token" dots travel along them, and a single route leaves to the right.
type Curve = { y0: number; spread: number; phase: number; amp: number; alpha: number };
type Packet = { c: number; off: number; speed: number; sand: boolean };

const ACCENT = '91, 113, 148';
const SAND = '179, 157, 116';

export function HeroFlow() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const hero = canvas.parentElement!;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let tx = 0;
    let ty = 0;
    let mx = 0.5;
    let my = 0.5;
    let sx = 0.5;
    let sy = 0.5;
    let raf = 0;
    let visible = true;
    let curves: Curve[] = [];
    let packets: Packet[] = [];

    const build = () => {
      const n = w < 760 ? 22 : 42;
      curves = Array.from({ length: n }, (_, i) => ({
        y0: ((i + 0.5) / n) * h * 1.3 - h * 0.15,
        spread: (i / (n - 1) - 0.5) * 70,
        phase: Math.random() * Math.PI * 2,
        amp: 18 + Math.random() * 40,
        alpha: 0.08 + Math.random() * 0.16,
      }));
      packets = Array.from({ length: Math.round(n * 1.1) }, () => ({
        c: Math.floor(Math.random() * n),
        off: Math.random(),
        speed: 0.05 + Math.random() * 0.07,
        sand: Math.random() < 0.18,
      }));
    };

    const measure = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const hr = hero.getBoundingClientRect();
      w = hr.width;
      h = hr.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const card = hero.querySelector('.route-card');
      if (card) {
        const r = card.getBoundingClientRect();
        tx = r.left - hr.left + r.width * 0.5;
        ty = r.top - hr.top + r.height * 0.5;
      } else {
        tx = w * 0.72;
        ty = h * 0.45;
      }
      build();
    };

    const bez = (p0: number, p1: number, p2: number, p3: number, t: number) => {
      const u = 1 - t;
      return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
    };

    const draw = (ms: number) => {
      const t = ms / 1000;
      sx += (mx - sx) * 0.05;
      sy += (my - sy) * 0.05;
      const ox = (sx - 0.5) * 40;
      const oy = (sy - 0.5) * 30;
      const ex = tx + ox * 0.4;
      const ey = ty + oy * 0.4;
      ctx.clearRect(0, 0, w, h);

      const pts: [number, number, number, number, number, number, number, number][] = [];
      curves.forEach((c, i) => {
        const wave = Math.sin(t * 0.35 + c.phase) * c.amp;
        const x0 = -40;
        const y0 = c.y0 + oy * 0.6;
        const x1 = w * 0.3 + ox;
        const y1 = c.y0 + wave;
        const x2 = ex - w * 0.22;
        const y2 = ey + c.spread * 1.6 - wave * 0.4;
        const x3 = ex;
        const y3 = ey + c.spread * 0.15;
        pts[i] = [x0, y0, x1, y1, x2, y2, x3, y3];
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
        ctx.strokeStyle = `rgba(${ACCENT}, ${c.alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // the single route that leaves the router
      const out: [number, number][] = [-10, 0, 10].map((d) => [ey + d * 0.6, d]);
      out.forEach(([y, d], k) => {
        ctx.beginPath();
        ctx.moveTo(ex, y);
        ctx.bezierCurveTo(ex + w * 0.15, y + d * 2, w - w * 0.08, y + d * 3 + oy * 0.5, w + 40, y + d * 4 + oy);
        ctx.strokeStyle = `rgba(${SAND}, ${k === 1 ? 0.35 : 0.14})`;
        ctx.lineWidth = k === 1 ? 1.4 : 1;
        ctx.stroke();
      });

      // packets travelling into the router
      packets.forEach((p) => {
        const q = pts[p.c];
        if (!q) return;
        const s = (p.off + t * p.speed) % 1;
        const x = bez(q[0], q[2], q[4], q[6], s);
        const y = bez(q[1], q[3], q[5], q[7], s);
        const fade = Math.min(1, s * 6, (1 - s) * 5);
        ctx.beginPath();
        ctx.arc(x, y, p.sand ? 2 : 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.sand ? SAND : ACCENT}, ${0.75 * fade})`;
        ctx.fill();
      });

      // packets leaving on the output route
      for (let k = 0; k < 4; k++) {
        const s = (t * 0.18 + k / 4) % 1;
        const x = bez(ex, ex + w * 0.15, w - w * 0.08, w + 40, s);
        const y = bez(ey, ey, ey + oy * 0.5, ey + oy, s);
        const fade = Math.min(1, s * 8, (1 - s) * 4);
        ctx.beginPath();
        ctx.arc(x, y, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${SAND}, ${0.9 * fade})`;
        ctx.fill();
      }
    };

    const loop = (ms: number) => {
      if (visible) draw(ms);
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width;
      my = (e.clientY - r.top) / r.height;
      hero.style.setProperty('--hx', `${e.clientX - r.left}px`);
      hero.style.setProperty('--hy', `${e.clientY - r.top}px`);
      hero.style.setProperty('--ry', `${(mx - 0.5) * 12}deg`);
      hero.style.setProperty('--rx', `${(0.5 - my) * 9}deg`);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(hero);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(hero);
    if (reduce) {
      draw(4000);
    } else {
      raf = requestAnimationFrame(loop);
      hero.addEventListener('pointermove', onMove);
    }
    // re-measure once the intro animation has placed the card
    const t1 = setTimeout(measure, 1600);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      clearTimeout(t1);
      hero.removeEventListener('pointermove', onMove);
    };
  }, []);

  return <canvas ref={ref} className="hero-flow" aria-hidden />;
}
