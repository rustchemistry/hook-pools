import { useMemo, useState } from 'react';
import { useBlockNumber } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { LINKS } from '../config';
import { Contracts } from '../components/Contracts';
import { Logo, XLogo } from '../components/icons';
import { ConnectButton } from './Wallet';
import { TradePanel } from './TradePanel';
import { OracleSim } from '../components/OracleSim';
import { FEED, GUARDS, MEME, POOLS, STOCKS, SURFACES } from './demo';
import { Pair, TokenIcon } from './ui';

const NAV = [
  ['Overview', 'overview'],
  ['Router', 'trade'],
  ['EVM Tokens', 'meme'],
  ['Oracle Guard', 'stocks'],
  ['Pools', 'pools'],
  ['Guard Checks', 'positions'],
  ['Contracts', 'contracts'],
  ['Developers', 'surfaces'],
] as const;

function Sidebar({ open, onNav }: { open: boolean; onNav: () => void }) {
  const [active, setActive] = useState('Overview');
  return (
    <aside className={open ? 'side open' : 'side'}>
      <a href="/" className="side-brand">
        <Logo size={32} />
        <span>
          <b>HOOK</b>
          <em>POOLS</em>
          <small>
            GUARD + ROUTER
            <br />
            ON EVM
          </small>
        </span>
      </a>
      <nav className="side-nav">
        {NAV.map(([label, id]) => (
          <button
            key={label}
            className={active === label ? 'on' : ''}
            onClick={() => {
              setActive(label);
              document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              onNav();
            }}
          >
            {label}
          </button>
        ))}
      </nav>
      <div className="side-box">
        <b>ETHEREUM MAINNET</b>
        <div>
          <span>
            <i className="dot-live" /> Chain ID
          </span>
          <b>{mainnet.id}</b>
        </div>
        <div>
          <span>Network</span>
          <b>Mainnet</b>
        </div>
        <div>
          <span>Gas Token</span>
          <b>ETH</b>
        </div>
      </div>
      <div className="side-arch">
        <b className="accent-txt">BUILT ON EVM</b>
        <span>ROUTES VIA UNISWAP V3 + V4</span>
        <em>ORACLE GUARD / V4 HOOK</em>
        <em>ANY-ASSET EVM ROUTER</em>
      </div>
      <small className="side-copy">© 2026 HOOK POOLS</small>
    </aside>
  );
}

function Topbar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="topbar">
      <button className="menu-btn" onClick={onMenu} aria-label="Open menu">
        ☰
      </button>
      <a href="/" className="top-logo" aria-label="Hook Pools home">
        <Logo size={24} />
      </a>
      <span className="crumbs">
        <b>HOOK / OS</b> <span>/</span> GUARD + ROUTER
      </span>
      <div className="top-actions">
        <a className="square-btn" href={LINKS.x} target="_blank" rel="noreferrer" aria-label="Hook Pools on X">
          <XLogo size={14} />
        </a>
        <span className="top-pill hide-sm">
          <i className="dot-live" /> Ethereum Mainnet
        </span>
        <span className="top-pill hide-md">CHAIN ID: {mainnet.id}</span>
        <ConnectButton />
      </div>
    </header>
  );
}

function Overview() {
  const { data: block } = useBlockNumber({ chainId: mainnet.id, watch: true });
  return (
    <section className="d-card hero-card" id="overview">
      <div className="d-eyebrow">
        <i className="dot-live" /> EVM · PREVIEW
      </div>
      <h1>
        ORACLE GUARD &amp; ROUTER. <em>FOR EVM.</em>
      </h1>
      <p>
        Buy any EVM token with any asset in one transaction, and trade tokenized stocks in pools that
        check every swap against an oracle.
      </p>
      <div className="d-actions">
        <a className="d-btn d-btn-solid" href="#trade">
          ROUTE A SWAP →
        </a>
        <a className="d-btn d-btn-outline" href="#meme">
          EVM TOKENS
        </a>
        <a className="d-btn d-btn-outline" href="#stocks">
          ORACLE GUARD
        </a>
      </div>
      <div className="kpis">
        <div>
          <span>HOOK ROUTER</span>
          <b>IN DEVELOPMENT</b>
          <em>ANY → EVM TOKEN</em>
        </div>
        <div>
          <span>ORACLE GUARD</span>
          <b>IN DEVELOPMENT</b>
          <em>UNISWAP V4 HOOK</em>
        </div>
        <div>
          <span>TARGET NETWORK</span>
          <b>ETHEREUM MAINNET</b>
          <em>CHAIN ID {mainnet.id}</em>
        </div>
        <div>
          <span>CHAIN HEAD</span>
          <b>{block ? 'LIVE' : 'SYNCING…'}</b>
          <em>BLOCK {block ? block.toLocaleString('en-US') : '—'}</em>
        </div>
      </div>
    </section>
  );
}

function Feed() {
  const items = [...FEED, ...FEED];
  return (
    <div className="d-card feed">
      <span className="feed-label">
        <i className="dot-live" /> PROTOCOL FEED
      </span>
      <div className="feed-track">
        <div className="feed-inner">
          {items.map(([sym, tag, addr], i) => (
            <span key={i} className="feed-item">
              <b>{sym}</b> <em>{tag}</em> <span>{addr}</span>
            </span>
          ))}
        </div>
      </div>
      <span className="feed-net hide-md">ETHEREUM MAINNET · {mainnet.id}</span>
    </div>
  );
}

const FEATURES = [
  ['⇆', 'ROUTER', 'ANY-ASSET ROUTER', 'Buy any EVM token with ETH, USDC or cbBTC, routed through Uniswap in one transaction.', 'pink'],
  ['◈', 'GUARD', 'ORACLE CHECK', 'Every swap in a guarded pool is compared to oracle feeds before it executes.', 'violet'],
  ['▣', 'STOCKS', 'MARKET SESSIONS', 'Stock pools widen fees and cap size while the underlying market is closed.', 'orange'],
  ['◆', 'FEES', 'DYNAMIC FEES', 'Fees rise with price deviation so LPs are not drained by stale-price arbitrage.', 'amber'],
  ['⬡', 'BURN', 'BUY BACK & BURN', 'A share of Hook fees buys back and burns $HOOK.', 'rose'],
];

function Features() {
  return (
    <div className="features">
      {FEATURES.map(([ico, tag, title, body, tone]) => (
        <a key={title} className="d-card feature" href="#pools">
          <div className="f-top">
            <span className="f-ico">{ico}</span>
            <span className={`f-tag ${tone}`}>{tag}</span>
          </div>
          <b>{title}</b>
          <p>{body}</p>
          <span className="f-foot">
            EXPLORE <span>→</span>
          </span>
        </a>
      ))}
    </div>
  );
}

const FILTERS = ['All', 'EVM', 'Uniswap', 'Guarded'] as const;

function PoolDiscovery() {
  const [f, setF] = useState<(typeof FILTERS)[number]>('All');
  const [q, setQ] = useState('');
  const rows = POOLS.filter(
    (p) => (f === 'All' || p.kind === f) && `${p.a}/${p.b} ${p.type}`.toLowerCase().includes(q.trim().toLowerCase()),
  );
  return (
    <section className="d-card" id="pools">
      <div className="card-head">
        <div className="head-left">
          <b>POOLS THE ROUTER USES</b>
          <div className="seg">
            {FILTERS.map((x) => (
              <button key={x} className={x === f ? 'on' : ''} onClick={() => setF(x)}>
                {x}
              </button>
            ))}
          </div>
        </div>
        <label className="d-search">
          ⌕
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by pair or token…" aria-label="Filter pools" />
        </label>
      </div>
      <div className="table-wrap">
        <table className="d-table">
          <thead>
            <tr>
              <th>POOL</th>
              <th>TYPE</th>
              <th>LIQUIDITY</th>
              <th>24H VOLUME</th>
              <th>FEE MODEL</th>
              <th>STATE</th>
              <th className="r">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.a + p.b + p.type}>
                <td>
                  <Pair a={p.a} b={p.b} />
                </td>
                <td>
                  <span className={`type-tag ${p.kind.toLowerCase()}`}>{p.type}</span>
                </td>
                <td>{p.liquidity}</td>
                <td>{p.volume}</td>
                <td>{p.fee}</td>
                <td className="accent-txt strong">{p.state}</td>
                <td className="r">
                  {p.depositable ? (
                    <a className="row-btn" href="#trade">
                      ＋ Deposit
                    </a>
                  ) : (
                    <span className="row-btn off">＋ Unavailable</span>
                  )}
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={7} className="empty-row">
                  No pools match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const routeFrom = (from: string, quote: string, sym: string) =>
  (from === quote ? [from, sym] : [from, quote, sym]).join(' → ');

function MemeMarkets() {
  return (
    <section className="d-card" id="meme">
      <div className="card-head">
        <div>
          <b>EVM TOKENS</b>
          <p>Any token on EVM, reachable from any asset through the Hook Router</p>
        </div>
        <span className="pill">CHAIN {mainnet.id}</span>
      </div>
      <div className="table-wrap">
        <table className="d-table">
          <thead>
            <tr>
              <th>TOKEN</th>
              <th>LAUNCH PAIR</th>
              <th>ROUTE FROM ETH</th>
              <th>STATUS</th>
              <th>VENUE</th>
            </tr>
          </thead>
          <tbody>
            {MEME.map((m) => (
              <tr key={m.sym}>
                <td>
                  <span className="tok-cell">
                    <TokenIcon sym={m.sym} size={26} />
                    <span>
                      <b>{m.sym}</b>
                      <small>{m.name}</small>
                    </span>
                  </span>
                </td>
                <td className="strong">
                  {m.sym}/{m.quote}
                </td>
                <td className="dim">{routeFrom('ETH', m.quote, m.sym)}</td>
                <td>
                  <span className={m.live ? 'phase' : 'phase bonding'}>{m.status}</span>
                </td>
                <td className="accent-txt strong">{m.venue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function StockTokens() {
  return (
    <section className="d-card" id="stocks">
      <div className="card-head">
        <div>
          <b>ORACLE GUARD · STOCK TOKENS</b>
          <p>Oracle-guarded tokenized stocks with session protection and dynamic fee dampeners</p>
        </div>
        <div className="chips">
          <span className="pill">{STOCKS.length} PLANNED MARKETS</span>
        </div>
      </div>
      <div className="table-wrap">
        <table className="d-table">
          <thead>
            <tr>
              <th>ASSET</th>
              <th>CONTRACT</th>
              <th>ORACLE PRICE</th>
              <th>UNDERLYING</th>
              <th>SECTOR</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {STOCKS.map((s) => (
              <tr key={s.sym}>
                <td>
                  <span className="tok-cell">
                    <span className="stock-ico">
                      {s.sym.slice(0, 2)}
                      <i>STOCK</i>
                    </span>
                    <span>
                      <b>{s.sym}</b>
                      <small>{s.name}</small>
                    </span>
                  </span>
                </td>
                <td className="dim">pending</td>
                <td>
                  <b>—</b>
                  <small className="sub">Oracle feed at launch</small>
                </td>
                <td>
                  —
                  <small className="sub">
                    {s.sym} (x1.0)
                  </small>
                </td>
                <td className="sector">{s.sector}</td>
                <td>
                  <span className={s.active ? 'status on' : 'status'}>● {s.active ? 'ACTIVE' : 'PLANNED'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function EventsAndSurfaces() {
  return (
    <div>
      <section className="d-card" id="surfaces">
        <div className="card-head">
          <b>CONTRACTS WE ARE BUILDING</b>
          <span className="pill">PLANNED</span>
        </div>
        <ul className="surfaces">
          {SURFACES.map(([name, tag]) => (
            <li key={name}>
              <i className="dot-live" />
              <span>{name}</span>
              <em>{tag}</em>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function PositionLayer() {
  return (
    <section className="d-card pos-layer" id="positions">
      <div>
        <div className="d-eyebrow accent-txt">ORACLE GUARD / EVERY SWAP</div>
        <h2>EVERY SWAP, CHECKED.</h2>
        <p>
          Before a guarded pool executes a swap, the OracleGuardHook runs these checks. If one fails, the fee goes
          up or the swap pauses until the price is back in range.
        </p>
      </div>
      <div className="guards">
        {GUARDS.map((g) => (
          <div key={g}>
            <span>{g}</span>
            <em>CHECK</em>
          </div>
        ))}
      </div>
    </section>
  );
}

function DappFooter() {
  return (
    <footer className="d-footer">
      <a href="/" className="side-brand small">
        <Logo size={24} />
        <span>
          <b>HOOK POOLS</b>
          <small>ETHEREUM MAINNET · CHAIN ID {mainnet.id}</small>
        </span>
      </a>
      <p>
        Hook Pools contracts are in development; market figures appear here once they are deployed. Wallet, balances and
        block height are read live from Ethereum Mainnet. Hook Pools is an independent protocol on EVM and is not affiliated with,
        sponsored by, or endorsed by the Ethereum Foundation.
      </p>
      <nav>
        <a href="/">Landing</a>
        <a href="#contracts">Contracts</a>
        <a href={LINKS.docs}>SDK</a>
        <a href={LINKS.docs}>API</a>
        <a href="#meme">EVM Tokens</a>
      </nav>
    </footer>
  );
}

export function Dapp() {
  const [menu, setMenu] = useState(false);
  const closeMenu = useMemo(() => () => setMenu(false), []);
  return (
    <div className="dapp">
      <Sidebar open={menu} onNav={closeMenu} />
      {menu && <div className="side-scrim" onClick={closeMenu} />}
      <div className="d-main">
        <Topbar onMenu={() => setMenu(true)} />
        <div className="preview-bar">
          <b>PREVIEW</b> Hook Pools contracts are in development. Wallet &amp; balances are live on Ethereum mainnet.
        </div>
        <main className="d-content">
          <Overview />
          <Feed />
          <div className="trade-grid">
            <OracleSim />
            <TradePanel />
          </div>
          <Features />
          <PoolDiscovery />
          <MemeMarkets />
          <StockTokens />
          <EventsAndSurfaces />
          <PositionLayer />
          <Contracts variant="panel" />
        </main>
        <DappFooter />
      </div>
    </div>
  );
}
