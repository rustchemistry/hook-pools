import { useMemo, useState } from 'react';
import { CATEGORIES, CONTRACTS, type Category } from '../contracts';
import { CHAIN, DEPLOYER_ADDRESS, EXPLORER, shortAddr } from '../config';
import { useCopy } from './CopyAddress';
import { ArrowUpRight, CheckIcon, CopyIcon, SearchIcon } from './icons';
import { Kicker } from './Sections';

export function Contracts({ variant = 'section' }: { variant?: 'section' | 'panel' }) {
  const [cat, setCat] = useState<Category | 'All'>('All');
  const [q, setQ] = useState('');
  const { copied, copy } = useCopy();

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return CONTRACTS.filter(
      (c) =>
        (cat === 'All' || c.category === cat) &&
        (!needle ||
          c.name.toLowerCase().includes(needle) ||
          c.category.toLowerCase().includes(needle) ||
          c.address.toLowerCase().includes(needle)),
    );
  }, [cat, q]);

  const deployed = CONTRACTS.filter((c) => c.address).length;
  const tabs: (Category | 'All')[] = ['All', ...CATEGORIES];
  const count = (t: Category | 'All') =>
    t === 'All' ? CONTRACTS.length : CONTRACTS.filter((c) => c.category === t).length;

  const panel = (
        <div className="contracts" id={variant === 'panel' ? 'contracts' : undefined}>
          <div className="contracts-head">
            <div className="term-ico">&gt;_</div>
            <div>
              <div className="ch-title">
                SMART CONTRACTS
                <span className="badge">
                  {deployed}/{CONTRACTS.length} DEPLOYED
                </span>
              </div>
              <div className="ch-sub">
                {CHAIN.name} Mainnet (Chain ID: {CHAIN.id})
              </div>
            </div>
            {DEPLOYER_ADDRESS && (
              <a className="deployer" href={EXPLORER + DEPLOYER_ADDRESS} target="_blank" rel="noreferrer">
                DEPLOYER: <b>{shortAddr(DEPLOYER_ADDRESS)}</b> <ArrowUpRight size={11} />
              </a>
            )}
          </div>

          <div className="contracts-tools">
            <div className="tabs" role="tablist">
              {tabs.map((t) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={cat === t}
                  className={cat === t ? 'tab on' : 'tab'}
                  onClick={() => setCat(t)}
                >
                  {t === 'All' ? 'All Contracts' : t} ({count(t)})
                </button>
              ))}
            </div>
            <label className="search">
              <SearchIcon />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, role, address…"
                aria-label="Search contracts"
              />
            </label>
          </div>

          <ul className="contract-list">
            {list.map((c) => (
              <li key={c.name} className="contract">
                <span className={c.address ? 'dot' : 'dot pending'} />
                <span className="c-name">{c.name}</span>
                <span className="c-cat">{c.category}</span>
                {c.address ? (
                  <>
                    <code className="c-addr">{c.address}</code>
                    <button className="icon-btn" onClick={() => copy(c.address)} aria-label={`Copy ${c.name} address`}>
                      {copied === c.address ? <CheckIcon /> : <CopyIcon />}
                    </button>
                    <a
                      className="icon-btn go"
                      href={EXPLORER + c.address}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`View ${c.name} on explorer`}
                    >
                      <ArrowUpRight />
                    </a>
                  </>
                ) : (
                  <code className="c-addr pending">
                    <i className="dev-dot" /> IN DEVELOPMENT
                  </code>
                )}
              </li>
            ))}
            {!list.length && <li className="empty">No contracts match “{q}”.</li>}
          </ul>
        </div>
  );

  if (variant === 'panel') return panel;

  return (
    <section className="section contracts-section" id="contracts">
      <div className="container contracts-grid">
        <div className="contracts-intro reveal">
          <Kicker n="05">Onchain deployments</Kicker>
          <h2 className="h2">
            Protocol contracts.
            <br />
            <span className="hl">Guard + router on EVM.</span>
          </h2>
          <p className="lead">
            Contracts for the Hook Router and Oracle Guard on EVM. Addresses appear here as they are deployed and
            verified.
          </p>
        </div>

        {panel}
      </div>
    </section>
  );
}
