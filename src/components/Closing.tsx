import { CHAIN, LINKS } from '../config';
import { CopyAddress } from './CopyAddress';
import { SwirlRings } from './SwirlRings';
import { ArrowRight, ArrowUpRight, Logo, XLogo } from './icons';

export function Cta() {
  return (
    <section className="section cta-wrap">
      <div className="container">
        <div className="cta reveal">
          <SwirlRings className="cta-swirl" />
          <div className="cta-inner">
            <span className="cta-kicker">06 · Built on EVM</span>
            <h2 className="h2">
              Safer pools for EVM.
              <br />
              Any EVM token.
            </h2>
            <p className="lead">
              Oracle-guarded pools and an any-asset router, built on EVM. HOOK launches on EVM with a HOOK/ETH
              pair.
            </p>
            <div className="actions">
              <a className="btn btn-white" href={LINKS.app}>
                Open App <ArrowRight />
              </a>
              <a className="btn btn-glass" href={LINKS.docs}>
                Explore Docs <ArrowUpRight />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#top" className="brand">
              <Logo size={34} />
              <span>
                <b>Hook Pools</b>
                <small>
                  Built for {CHAIN.name} mainnet (chain {CHAIN.id}) / independent protocol
                </small>
              </span>
            </a>
            <CopyAddress />
          </div>
          <nav className="footer-links">
            <a href={LINKS.app}>Trade</a>
            <a href="#markets">Pools</a>
            <a href={LINKS.ethereum} target="_blank" rel="noreferrer">
              EVM
            </a>
            <a href="#contracts">Contracts</a>
            <a href={LINKS.docs}>Developers</a>
            <a href={LINKS.x} target="_blank" rel="noreferrer" aria-label="X" className="footer-x">
              <XLogo size={14} />
            </a>
          </nav>
        </div>
        <p className="disclaimer">
          Hook Pools is an independent protocol built on EVM. It is not affiliated with, sponsored by, or endorsed
          by the Ethereum Foundation.
        </p>
      </div>
    </footer>
  );
}
