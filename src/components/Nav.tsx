import { LINKS } from '../config';
import { ArrowRight, Logo, XLogo } from './icons';

const items = [
  ['Products', '#ecosystem'],
  ['Oracle Guard', '#markets'],
  ['Router', '#routing'],
  ['How it works', '#architecture'],
  ['Contracts', '#contracts'],
];

export function Nav() {
  return (
    <header className="nav">
      <div className="nav-pill">
        <a href="#top" className="brand">
          <Logo size={30} />
          <span>
            <b>Hook Pools</b>
            <small>Guard + Router</small>
          </span>
        </a>
        <nav className="nav-links">
          {items.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <a className="square-btn" href={LINKS.x} target="_blank" rel="noreferrer" aria-label="Hook Pools on X">
            <XLogo size={15} />
          </a>
          <a className="btn btn-solid btn-sm" href={LINKS.app}>
            Open App <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </header>
  );
}
