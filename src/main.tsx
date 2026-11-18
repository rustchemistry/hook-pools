import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Hide the preloader once fonts are ready (at least ~0.7s after navigation), then start the hero intro.
let finished = false;
const finish = () => {
  if (finished) return;
  finished = true;
  const wait = Math.max(0, 700 - performance.now());
  setTimeout(() => {
    const pre = document.getElementById('preloader');
    pre?.classList.add('done');
    document.documentElement.classList.add('loaded');
    setTimeout(() => pre?.remove(), 700);
  }, wait);
};
(document.fonts?.ready ?? Promise.resolve()).then(finish);
setTimeout(finish, 2500);
