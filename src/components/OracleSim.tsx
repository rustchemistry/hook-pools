import { useEffect, useRef } from 'react';

// Illustrative, client-side simulation of the Oracle Guard on an AAPLx/USDC pool.
// Nothing here is live data: prices are generated in the browser.
const N = 220; // samples on screen
const STEP_MS = 70; // one sample every STEP_MS
const LIMIT = 0.012; // 1.2% deviation limit
const BASE_FEE = 0.1; // %

type Sample = { oracle: number; pool: number; paused: boolean };

export function OracleSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ui = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = false;
    let last = 0;
    let acc = 0;
    let tick = 0;

    // simple generators
    let oracle = 336;
    let dev = 0;
    let shock = 0;
    let nextShock = 90 + Math.random() * 60;
    let sessionOpen = true;
    let nextSession = 260;
    const data: Sample[] = [];

    const step = () => {
      tick++;
      oracle *= 1 + Math.sin(tick / 37) * 0.00035 + Math.sin(tick / 11) * 0.00018 + (Math.random() - 0.5) * 0.0006;
      // pool deviation: mean-reverting noise + occasional shock that breaches the limit
      dev += -dev * 0.08 + (Math.random() - 0.5) * 0.0016;
      if (--nextShock <= 0) {
        shock = (Math.random() < 0.5 ? -1 : 1) * (LIMIT * (1.35 + Math.random() * 0.5));
        nextShock = 140 + Math.random() * 120;
      }
      shock *= 0.965;
      const d = dev + shock;
      const paused = Math.abs(d) > LIMIT;
      const prev = data[data.length - 1];
      // while paused, the pool price is frozen (no swaps execute)
      const pool = paused && prev ? prev.pool : oracle * (1 + d);
      data.push({ oracle, pool, paused });
      if (data.length > N + 2) data.shift();
      if (--nextSession <= 0) {
        sessionOpen = !sessionOpen;
        nextSession = sessionOpen ? 260 : 150;
      }
    };
    for (let i = 0; i < N; i++) step();

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const set = (k: string, v: string, cls?: string) => {
      const el = ui.current[k];
      if (!el) return;
      if (el.textContent !== v) el.textContent = v;
      if (cls !== undefined && el.dataset.state !== cls) el.dataset.state = cls;
    };

    const draw = (frac: number) => {
      ctx.clearRect(0, 0, w, h);
      const pts = data.slice(-N - 1);
      const vals = pts.flatMap((p) => [p.oracle * (1 + LIMIT * 1.6), p.oracle * (1 - LIMIT * 1.6), p.pool]);
      const hi = Math.max(...vals);
      const lo = Math.min(...vals);
      const pad = 18;
      const Y = (v: number) => pad + (1 - (v - lo) / (hi - lo)) * (h - pad * 2);
      const dx = (w - 18) / (N - 1);
      const X = (i: number) => (i - frac) * dx;

      // grid
      ctx.strokeStyle = 'rgba(15, 16, 18, 0.05)';
      ctx.lineWidth = 1;
      for (let g = 1; g < 5; g++) {
        const y = (h / 5) * g;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // paused regions
      ctx.fillStyle = 'rgba(179, 157, 116, 0.13)';
      let start = -1;
      pts.forEach((p, i) => {
        if (p.paused && start < 0) start = i;
        if ((!p.paused || i === pts.length - 1) && start >= 0) {
          ctx.fillRect(X(start), 0, X(i) - X(start), h);
          start = -1;
        }
      });

      // allowed band around the oracle price
      ctx.beginPath();
      pts.forEach((p, i) => (i ? ctx.lineTo(X(i), Y(p.oracle * (1 + LIMIT))) : ctx.moveTo(X(i), Y(p.oracle * (1 + LIMIT)))));
      for (let i = pts.length - 1; i >= 0; i--) ctx.lineTo(X(i), Y(pts[i].oracle * (1 - LIMIT)));
      ctx.closePath();
      ctx.fillStyle = 'rgba(91, 113, 148, 0.08)';
      ctx.fill();

      // oracle line
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      pts.forEach((p, i) => (i ? ctx.lineTo(X(i), Y(p.oracle)) : ctx.moveTo(X(i), Y(p.oracle))));
      ctx.strokeStyle = 'rgba(15, 16, 18, 0.5)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.setLineDash([]);

      // pool line, sand while paused
      for (let i = 1; i < pts.length; i++) {
        ctx.beginPath();
        ctx.moveTo(X(i - 1), Y(pts[i - 1].pool));
        ctx.lineTo(X(i), Y(pts[i].pool));
        ctx.strokeStyle = pts[i].paused ? '#b39d74' : '#5b7194';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // head marker
      const lastP = pts[pts.length - 1];
      const lx = X(pts.length - 1);
      const ly = Y(lastP.pool);
      ctx.beginPath();
      ctx.arc(lx, ly, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = lastP.paused ? '#b39d74' : '#5b7194';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(lx, ly, 9, 0, Math.PI * 2);
      ctx.strokeStyle = lastP.paused ? 'rgba(179, 157, 116, 0.35)' : 'rgba(91, 113, 148, 0.3)';
      ctx.stroke();

      // readouts
      const d = lastP.pool / lastP.oracle - 1;
      const sessionMult = sessionOpen ? 1 : 2;
      const fee = Math.min(1.5, (BASE_FEE + Math.abs(d) * 100 * 0.25) * sessionMult);
      set('oracle', `$${lastP.oracle.toFixed(2)}`);
      set('pool', `$${lastP.pool.toFixed(2)}`);
      set('dev', `${d >= 0 ? '+' : ''}${(d * 100).toFixed(2)}%`, Math.abs(d) > LIMIT ? 'warn' : 'ok');
      set('fee', `${fee.toFixed(2)}%`);
      set('session', sessionOpen ? 'Open' : 'Closed', sessionOpen ? 'ok' : 'warn');
      set('status', lastP.paused ? 'Paused · deviation' : 'Swaps active', lastP.paused ? 'warn' : 'ok');
      const bar = ui.current.feebar;
      if (bar) bar.style.transform = `scaleX(${fee / 1.5})`;
    };

    const loop = (ms: number) => {
      if (visible) {
        const dt = last ? Math.min(100, ms - last) : 0;
        acc += dt;
        while (acc >= STEP_MS) {
          step();
          acc -= STEP_MS;
        }
        draw(acc / STEP_MS);
      }
      last = ms;
      raf = requestAnimationFrame(loop);
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      draw(0);
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      last = 0;
    });
    io.observe(canvas);
    draw(0);
    if (!reduce) raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const bind = (k: string) => (el: HTMLElement | null) => {
    ui.current[k] = el;
  };

  return (
    <div className="sim reveal">
      <div className="sim-head">
        <div>
          <b>Oracle Guard</b>
          <span>AAPLx / USDC · guarded pool</span>
        </div>
        <span className="sim-tag">Simulation · illustrative</span>
      </div>
      <div className="sim-body">
        <div className="sim-chart">
          <canvas ref={canvasRef} aria-label="Simulated pool price following an oracle price, pausing when it deviates too far" role="img" />
          <div className="sim-legend">
            <span>
              <i className="lg-oracle" /> Oracle price
            </span>
            <span>
              <i className="lg-pool" /> Pool price
            </span>
            <span>
              <i className="lg-band" /> Deviation limit ±1.2%
            </span>
            <span>
              <i className="lg-pause" /> Circuit breaker
            </span>
          </div>
        </div>
        <dl className="sim-stats">
          <div>
            <dt>Status</dt>
            <dd className="sim-status" ref={bind('status')} data-state="ok">
              Swaps active
            </dd>
          </div>
          <div>
            <dt>Oracle price</dt>
            <dd ref={bind('oracle')}>—</dd>
          </div>
          <div>
            <dt>Pool price</dt>
            <dd ref={bind('pool')}>—</dd>
          </div>
          <div>
            <dt>Deviation</dt>
            <dd className="sim-flag" ref={bind('dev')} data-state="ok">
              —
            </dd>
          </div>
          <div>
            <dt>Market session</dt>
            <dd className="sim-flag" ref={bind('session')} data-state="ok">
              Open
            </dd>
          </div>
          <div>
            <dt>Dynamic fee</dt>
            <dd ref={bind('fee')}>—</dd>
            <span className="sim-feebar">
              <i ref={bind('feebar')} />
            </span>
          </div>
        </dl>
      </div>
    </div>
  );
}
