import { useEffect } from 'react';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Architecture, Ecosystem, Markets, Routing, Stats, Ticker } from './components/Sections';
import { Contracts } from './components/Contracts';
import { Cta, Footer } from './components/Closing';

export default function App() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Scroll progress bar + compact nav, and a cursor-following light on .spot cards.
  useEffect(() => {
    const root = document.documentElement;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = root.scrollHeight - innerHeight;
        root.style.setProperty('--progress', String(max > 0 ? scrollY / max : 0));
        root.classList.toggle('scrolled', scrollY > 12);
      });
    };
    const onMove = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest?.('.spot') as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('pointermove', onMove, { passive: true });
    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="progress" aria-hidden />
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Ticker />
        <Ecosystem />
        <Markets />
        <Routing />
        <Architecture />
        <Contracts />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
