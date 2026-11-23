import { useEffect, useState } from 'react';

// Text that "decodes" from random glyphs once the page intro starts (html.loaded).
const GLYPHS = '0123456789ABCDEF#$%&*+=<>/\\';

export function Scramble({ text, delay = 350, duration = 900 }: { text: string; delay?: number; duration?: number }) {
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let timer = 0;
    const run = () => {
      const start = performance.now() + delay;
      const tick = (now: number) => {
        const p = Math.max(0, Math.min(1, (now - start) / duration));
        const settled = Math.floor(p * text.length);
        setOut(
          [...text]
            .map((ch, i) => (ch === ' ' || i < settled ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
            .join(''),
        );
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const root = document.documentElement;
    if (root.classList.contains('loaded')) run();
    else {
      const mo = new MutationObserver(() => {
        if (root.classList.contains('loaded')) {
          mo.disconnect();
          run();
        }
      });
      mo.observe(root, { attributes: true, attributeFilter: ['class'] });
      timer = window.setTimeout(() => mo.disconnect(), 5000);
    }
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [text, delay, duration]);

  return (
    <span aria-label={text}>
      <span aria-hidden>{out}</span>
    </span>
  );
}
