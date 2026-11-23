import { useEffect, useRef } from 'react';

// A slowly rotating 3D twisted torus drawn from line strands — a 3D take on the Hook swirl logo.
// Strands closer to the viewer are darker; the shape tilts towards the cursor.
const STRANDS = 34;
const STEPS = 140;
const R = 1;
const r = 0.42;
const TWIST = 3;

export function SwirlTorus() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const host = canvas.closest('.hero') as HTMLElement | null;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let size = 0;
    let raf = 0;
    let visible = true;
    let tx = 0;
    let ty = 0;
    let ax = 0;
    let ay = 0;

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      size = canvas.clientWidth;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // precompute strand points on the torus surface
    const strands: [number, number, number][][] = Array.from({ length: STRANDS }, (_, s) => {
      const v0 = (s / STRANDS) * Math.PI * 2;
      return Array.from({ length: STEPS + 1 }, (_, k) => {
        const u = (k / STEPS) * Math.PI * 2;
        const v = v0 + u * TWIST;
        const cx = (R + r * Math.cos(v)) * Math.cos(u);
        const cy = (R + r * Math.cos(v)) * Math.sin(u);
        const cz = r * Math.sin(v);
        return [cx, cy, cz];
      });
    });

    const draw = (ms: number) => {
      const t = ms / 1000;
      ax += (ty - ax) * 0.04;
      ay += (tx - ay) * 0.04;
      const rx = 1.05 + ax * 0.5 + Math.sin(t * 0.2) * 0.08;
      const ry = t * 0.12 + ay * 0.6;
      const rz = t * 0.05;
      const [sx, cxr] = [Math.sin(rx), Math.cos(rx)];
      const [sy, cyr] = [Math.sin(ry), Math.cos(ry)];
      const [sz, czr] = [Math.sin(rz), Math.cos(rz)];
      const scale = size * 0.3;
      const c = size / 2;
      ctx.clearRect(0, 0, size, size);
      ctx.lineWidth = 1;

      for (const pts of strands) {
        let prev: [number, number, number] | null = null;
        for (const [x0, y0, z0] of pts) {
          // rotate z, then x, then y
          let x = x0 * czr - y0 * sz;
          let y = x0 * sz + y0 * czr;
          let z = z0;
          const y1 = y * cxr - z * sx;
          const z1 = y * sx + z * cxr;
          y = y1;
          z = z1;
          const x2 = x * cyr + z * sy;
          const z2 = -x * sy + z * cyr;
          x = x2;
          z = z2;
          const persp = 3.2 / (3.2 - z);
          const px = c + x * scale * persp;
          const py = c + y * scale * persp;
          if (prev) {
            const depth = (z + prev[2]) / 2; // -1.4 .. 1.4
            const a = 0.05 + ((depth + 1.42) / 2.84) * 0.42;
            ctx.strokeStyle = `rgba(91, 113, 148, ${a.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(prev[0], prev[1]);
            ctx.lineTo(px, py);
            ctx.stroke();
          }
          prev = [px, py, z];
        }
      }
    };

    const loop = (ms: number) => {
      if (visible) draw(ms);
      raf = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / innerWidth - 0.5) * 1.4;
      ty = (e.clientY / innerHeight - 0.5) * 1.0;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    if (reduce) {
      draw(8000);
    } else {
      raf = requestAnimationFrame(loop);
      (host ?? window).addEventListener('pointermove', onMove as EventListener);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      (host ?? window).removeEventListener('pointermove', onMove as EventListener);
    };
  }, []);

  return <canvas ref={ref} className="swirl-torus" aria-hidden />;
}
