import type { ReactNode } from 'react';
import { OracleSim } from './OracleSim';
import {
  ArrowRight,
  BreakerIcon,
  CheckIcon,
  ClockIcon,
  FlameIcon,
  GaugeIcon,
  LayersIcon,
  Logo,
  RouteIcon,
  ShieldIcon,
} from './icons';

export function Kicker({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div className="kicker">
      <span>{n}</span>
      {children}
    </div>
  );
}

const tickerItems = [
  'Oracle Guard',
  'Any asset → any EVM token',
  'Circuit breaker',
  'Market sessions',
  'Dynamic fees',
  'Uniswap v4 hook',
  'HOOK/ETH',
  'Fees buy back & burn $HOOK',
  'Built on EVM',
];

export function Ticker() {
  return (
    <div className="ticker" aria-hidden>
      <div className="ticker-track">
        {[...tickerItems, ...tickerItems].map((t, i) => (
          <span key={i}>
            <i />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Stats() {
  return (
    <div className="container">
      <div className="stats reveal">
        <div className="stat">
          <span>Products</span>
          <b>Oracle Guard + Router</b>
        </div>
        <div className="stat">
          <span>Ecosystem</span>
          <b>EVM / ETH</b>
        </div>
        <div className="stat">
          <span>Routes</span>
          <b className="accent">Any asset → any EVM token</b>
        </div>
      </div>
    </div>
  );
}

const ecoItems: [ReactNode, string][] = [
  [<ShieldIcon key="s" />, 'Oracle guard for EVM pools'],
  [<RouteIcon key="r" />, 'Router for any EVM token'],
  [<LayersIcon key="l" />, 'Routes through Uniswap v3 + v4'],
  [<FlameIcon key="f" />, 'Fees buy back & burn $HOOK'],
];

export function Ecosystem() {
  return (
    <section className="section" id="ecosystem">
      <div className="container eco">
        <div className="eco-head reveal">
          <Kicker n="01">What we build</Kicker>
          <span className="tagline">Built on EVM</span>
          <h2 className="h2">
            Two tools.
            <br />
            <span className="hl">One ecosystem.</span>
          </h2>
          <p className="lead">
            Hook Pools adds what EVM DeFi is still missing: an oracle guard that protects pools from stale or
            manipulated prices, and a router that lets anyone buy an EVM token with whatever they hold.
          </p>
        </div>
        <ul className="eco-grid reveal stagger">
          {ecoItems.map(([icon, text], i) => (
            <li key={text} className="spot">
              <span className="tile-ico">{icon}</span>
              <span className="eco-n">0{i + 1}</span>
              <b>{text}</b>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const markets = [
  {
    icon: <ShieldIcon size={22} />,
    tag: 'Reference price',
    title: 'Oracle check',
    body: 'Every swap in a guarded pool is compared against trusted oracle feeds before it executes.',
    meta: 'Oracle / freshness',
  },
  {
    icon: <ClockIcon size={22} />,
    tag: 'Stock tokens',
    title: 'Market sessions',
    body: 'When the underlying stock market is closed, guarded pools widen fees and cap trade size.',
    meta: 'Session / schedule',
  },
  {
    icon: <BreakerIcon size={22} />,
    tag: 'Deviation limit',
    title: 'Circuit breaker',
    body: 'If the pool price drifts too far from the oracle, swaps pause until the price is back in range.',
    meta: 'Deviation / pause',
  },
  {
    icon: <GaugeIcon size={22} />,
    tag: 'LP protection',
    title: 'Dynamic fees',
    body: 'Fees rise with price deviation and volatility, so LPs are not drained by arbitrage on stale prices.',
    meta: 'Fee curve / volatility',
  },
];

export function Markets() {
  return (
    <section className="section" id="markets">
      <div className="container">
        <div className="section-head center reveal">
          <Kicker n="02">Oracle Guard</Kicker>
          <h2 className="h2">Protection for every pool.</h2>
          <p className="lead">A Uniswap v4 hook for EVM pools.</p>
        </div>
        <OracleSim />
        <div className="cards reveal stagger">
          {markets.map((m) => (
            <article key={m.title} className="card spot">
              <div className="card-top">
                <span className="tile-ico">{m.icon}</span>
                <span className="card-tag">{m.tag}</span>
              </div>
              <h3>{m.title}</h3>
              <p>{m.body}</p>
              <div className="card-foot">
                <span>{m.meta}</span>
                <a href="#routing" className="link">
                  Learn more <ArrowRight size={12} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const routes = [
  ['01', 'EVM pools', 'Token pairs', 'Source'],
  ['02', 'ETH hub', 'Quote asset', 'Hop'],
  ['03', 'Uniswap v3 pools', 'Concentrated', 'Venue'],
  ['04', 'Hook guarded', 'Oracle-checked', 'Pool'],
  ['05', 'Uniswap v4', 'Fallback', 'Venue'],
];

const steps = [
  'route.quote(anyIn, tokenOut)',
  "find the token's main pair on EVM",
  'hop through ETH / USDC if needed',
  'check oracle guard state',
  'return one executable transaction',
];

function RouterDiagram() {
  return (
    <svg className="router-diagram" viewBox="0 0 360 200" aria-hidden>
      <g className="flow">
        <path d="M74 40 C 120 40, 120 100, 150 100" />
        <path d="M74 100 H 150" />
        <path d="M74 160 C 120 160, 120 100, 150 100" />
        <path d="M250 100 H 300" />
      </g>
      <g className="flow-dots">
        <circle r="3">
          <animateMotion dur="2.6s" repeatCount="indefinite" path="M74 40 C 120 40, 120 100, 150 100" />
        </circle>
        <circle r="3">
          <animateMotion dur="2.6s" begin="0.9s" repeatCount="indefinite" path="M74 160 C 120 160, 120 100, 150 100" />
        </circle>
        <circle r="3">
          <animateMotion dur="1.6s" repeatCount="indefinite" path="M250 100 H 300" />
        </circle>
      </g>
      {[
        ['ETH', 40],
        ['USDC', 100],
        ['cbBTC', 160],
      ].map(([t, y]) => (
        <g key={t as string} className="node">
          <rect x="8" y={(y as number) - 15} width="66" height="30" rx="15" />
          <text x="41" y={(y as number) + 4.5}>
            {t}
          </text>
        </g>
      ))}
      <g className="node core">
        <rect x="150" y="66" width="100" height="68" rx="16" />
        <foreignObject x="188" y="76" width="24" height="24">
          <Logo size={24} />
        </foreignObject>
        <text x="200" y="120">Hook Router</text>
      </g>
      <g className="node out">
        <rect x="300" y="85" width="54" height="30" rx="15" />
        <text x="327" y="104.5">Token</text>
      </g>
    </svg>
  );
}

export function Routing() {
  return (
    <section className="section" id="routing">
      <div className="container">
        <div className="dark-block">
          <div className="route-split">
            <div className="reveal">
              <Kicker n="03">EVM router</Kicker>
              <h2 className="h2">
                Any token.
                <br />
                <span className="hl">Any asset.</span>
              </h2>
              <p className="lead">
                EVM tokens trade against different pairs: ETH, USDC or a tokenized stock. The Hook Router lets you
                pay with whatever you hold and finds the path through Uniswap pools in one transaction.
              </p>
              <ul className="check-list">
                {['Any asset in', 'One transaction', 'Slippage + deadline checks', 'Guard-checked routes'].map((t) => (
                  <li key={t}>
                    <CheckIcon size={14} /> {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="router-panel reveal">
              <div className="rp-head">
                <b>
                  <Logo size={20} /> Hook Router
                </b>
                <span>Illustrative interface / no live metrics</span>
              </div>
              <div className="rp-stats">
                {[
                  ['Routes', 'Any → token'],
                  ['Venue', 'Uniswap'],
                  ['Hub', 'ETH'],
                  ['Guard', 'Oracle'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <span>{k}</span>
                    <b>{v}</b>
                  </div>
                ))}
              </div>
              <RouterDiagram />
              <div className="route-table" role="table" aria-label="Liquidity sources">
                <div className="rt-row rt-head" role="row">
                  <span>ID</span>
                  <span>Liquidity source</span>
                  <span>Policy</span>
                  <span>Type</span>
                </div>
                {routes.map(([id, src, pol, type]) => (
                  <div key={id} className="rt-row" role="row">
                    <span className="dim">{id}</span>
                    <span>{src}</span>
                    <span className="accent">{pol}</span>
                    <span className="dim">{type}</span>
                  </div>
                ))}
              </div>
              <ol className="steps">
                {steps.map((s, i) => (
                  <li key={s}>
                    <span className="step-n">{i + 1}</span>
                    <code>{s}</code>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const Arrow = () => (
  <div className="flow-arrow" aria-hidden>
    <ArrowRight size={16} />
  </div>
);

export function Architecture() {
  return (
    <section className="section" id="architecture">
      <div className="container">
        <div className="arch-head reveal">
          <div>
            <Kicker n="04">How it works</Kicker>
            <h2 className="h2">
              Built on EVM.
              <br />
              <span className="hl">Fees back to $HOOK.</span>
            </h2>
          </div>
          <p className="lead">
            Hook sits on top of existing EVM liquidity. Guard hooks run on Uniswap v4, routes settle through Uniswap
            and other EVM pools, and a share of Hook fees buys back and burns $HOOK.
          </p>
        </div>

        <div className="flow reveal stagger">
          <div className="flow-node">Users / Apps</div>
          <Arrow />
          <div className="flow-node hl">
            <Logo size={28} />
            Hook Router
          </div>
          <Arrow />
          <div className="flow-stack">
            <div className="flow-node">
              EVM pools<small>Token pairs</small>
            </div>
            <div className="flow-node">
              Guarded pools<small>Oracle hook</small>
            </div>
            <div className="flow-node">
              Uniswap v3 pools<small>Concentrated</small>
            </div>
          </div>
          <Arrow />
          <div className="flow-node burn">
            <FlameIcon size={22} />
            Fees → buy back &amp; burn $HOOK
          </div>
        </div>
      </div>
    </section>
  );
}
