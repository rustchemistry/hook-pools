import { useEffect, useState } from 'react';
import { CheckIcon, EthIcon, Logo, RouteIcon, ShieldIcon } from './icons';

const RPC = 'https://ethereum-rpc.publicnode.com';

async function rpc(method: string): Promise<bigint> {
  const res = await fetch(RPC, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params: [] }),
  });
  const json = await res.json();
  return BigInt(json.result);
}

/** Real Ethereum mainnet head + gas price, read straight from a public RPC. Hidden if the RPC is unreachable. */
export function LiveChain() {
  const [block, setBlock] = useState<bigint | null>(null);
  const [gas, setGas] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const [b, g] = await Promise.all([rpc('eth_blockNumber'), rpc('eth_gasPrice')]);
        if (!alive) return;
        setBlock(b);
        setGas(Number(g) / 1e9);
        setFailed(false);
      } catch {
        if (alive) setFailed(true);
      }
    };
    load();
    const t = setInterval(load, 12000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  if (failed && block === null) return null;
  return (
    <div className="live-chain" aria-live="off">
      <span className="lc-dot" />
      <span>Ethereum mainnet</span>
      <span className="lc-sep" />
      <span>
        Block{' '}
        <b key={block?.toString()} className="lc-flip">
          {block ? `#${block.toLocaleString('en-US')}` : '…'}
        </b>
      </span>
      <span className="lc-sep" />
      <span>
        Gas <b>{gas === null ? '…' : `${gas < 1 ? gas.toFixed(2) : gas.toFixed(1)} gwei`}</b>
      </span>
      <span className="lc-live">Live</span>
    </div>
  );
}

const TOASTS = [
  { icon: <RouteIcon size={15} />, title: 'Quote found', sub: 'ETH → HOOK' },
  { icon: <ShieldIcon size={15} />, title: 'Oracle check passed', sub: 'Price within limit' },
  { icon: <Logo size={15} />, title: 'Route ready', sub: 'One transaction' },
  { icon: <CheckIcon size={15} />, title: 'Guard-checked', sub: 'Slippage + deadline set' },
];

/** Illustrative router events that appear and fade next to the router card. */
export function RouterToasts() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % TOASTS.length), 2600);
    return () => clearInterval(t);
  }, []);
  const a = TOASTS[i];
  const b = TOASTS[(i + 2) % TOASTS.length];
  return (
    <>
      <div key={`a${i}`} className="toast toast-a" aria-hidden>
        <span className="toast-ico">{a.icon}</span>
        <span>
          <b>{a.title}</b>
          <small>{a.sub}</small>
        </span>
      </div>
      <div key={`b${i}`} className="toast toast-b" aria-hidden>
        <span className="toast-ico">{b.icon}</span>
        <span>
          <b>{b.title}</b>
          <small>{b.sub}</small>
        </span>
      </div>
    </>
  );
}

const CHIPS = [
  { sym: 'ETH', cls: 'chip-a' },
  { sym: 'USDC', cls: 'chip-b' },
  { sym: 'cbBTC', cls: 'chip-c' },
  { sym: 'AAPLx', cls: 'chip-d' },
];

/** Token badges floating around the swirl. */
export function TokenChips() {
  return (
    <>
      {CHIPS.map(({ sym, cls }) => (
        <span key={sym} className={`float-chip ${cls}`} aria-hidden>
          {sym === 'ETH' ? <EthIcon size={18} /> : <i>{sym.replace(/^cb/, '').slice(0, 1)}</i>}
          {sym}
        </span>
      ))}
    </>
  );
}
