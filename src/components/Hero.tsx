import { LINKS } from '../config';
import { CopyAddress } from './CopyAddress';
import { HeroFlow } from './HeroFlow';
import { LiveChain, RouterToasts, TokenChips } from './HeroLive';
import { Scramble } from './Scramble';
import { SwirlTorus } from './SwirlTorus';
import { ArrowRight, ArrowUpRight, BreakerIcon, ClockIcon, EthIcon, Logo, ShieldIcon } from './icons';

function RouteCard() {
  return (
    <div className="route-card" role="img" aria-label="Illustrative preview of the Hook Router: pay with ETH, receive HOOK">
      <div className="rc-head">
        <span className="rc-title">
          <Logo size={22} /> Hook Router
        </span>
        <span className="rc-tag">Illustrative</span>
      </div>

      <div className="rc-field">
        <span className="rc-label">You pay</span>
        <span className="rc-token">
          <EthIcon /> ETH
        </span>
      </div>
      <div className="rc-swap" aria-hidden>
        ↓
      </div>
      <div className="rc-field">
        <span className="rc-label">You receive</span>
        <span className="rc-token">
          <Logo size={22} /> HOOK
        </span>
      </div>

      <div className="rc-route" aria-hidden>
        <span>ETH</span>
        <i className="rc-line">
          <b />
        </i>
        <span>HOOK</span>
      </div>

      <ul className="rc-guard">
        <li>
          <ShieldIcon size={16} /> Oracle check <em />
        </li>
        <li>
          <ClockIcon size={16} /> Market sessions <em />
        </li>
        <li>
          <BreakerIcon size={16} /> Circuit breaker <em />
        </li>
      </ul>
    </div>
  );
}

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-glow" aria-hidden />
      <HeroFlow />
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="badge-pill">
            <i className="pulse" /> Built on EVM
          </span>
          <h1 className="h-display">
            <span className="ln">
              <span>Safer pools.</span>
            </span>
            <span className="ln">
              <span>Any token.</span>
            </span>
            <span className="ln">
              <span className="hl">
                <Scramble text="One route." />
              </span>
            </span>
          </h1>
          <p className="lead">
            Hook Pools builds oracle protection for EVM pools and a router that buys any EVM token with any
            asset you hold.
          </p>
          <div className="actions">
            <a className="btn btn-solid" href={LINKS.app}>
              Open App <ArrowRight />
            </a>
            <a className="btn btn-ghost" href={LINKS.ethereum} target="_blank" rel="noreferrer">
              EVM <ArrowUpRight />
            </a>
          </div>
          <CopyAddress />
          <LiveChain />
        </div>

        <div className="hero-visual">
          <SwirlTorus />
          <TokenChips />
          <div className="tilt">
            <RouteCard />
          </div>
          <RouterToasts />
        </div>
      </div>
    </section>
  );
}
