import { useMemo, useState } from 'react';
import { useBalance, useConnection, useReadContracts } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { erc20Abi, formatUnits } from 'viem';
import { TOKENS, type TokenSymbol } from './wagmi';
import { MEME, POOLS } from './demo';
import { ConnectButton, useWalletModal } from './Wallet';
import { Pair, TokenIcon } from './ui';

const SYMBOLS = Object.keys(TOKENS) as TokenSymbol[];
const ERC20 = SYMBOLS.filter((s) => TOKENS[s].address);

function useBalances() {
  const { address } = useConnection();
  const eth = useBalance({ address, chainId: mainnet.id, query: { enabled: !!address } });
  const erc = useReadContracts({
    contracts: ERC20.map((s) => ({
      address: TOKENS[s].address as `0x${string}`,
      abi: erc20Abi,
      functionName: 'balanceOf' as const,
      args: [address!] as const,
      chainId: mainnet.id,
    })),
    query: { enabled: !!address },
  });
  const out: Partial<Record<TokenSymbol, number>> = {};
  if (eth.data) out.ETH = +formatUnits(eth.data.value, 18);
  ERC20.forEach((s, i) => {
    const r = erc.data?.[i];
    if (r?.status === 'success') out[s] = +formatUnits(r.result as bigint, TOKENS[s].decimals);
  });
  return out;
}

const fmt = (n: number | undefined) => (n === undefined ? '0' : n === 0 ? '0' : n < 0.0001 ? '<0.0001' : n.toLocaleString('en-US', { maximumFractionDigits: 4 }));

function TokenSelect({ value, onChange, exclude }: { value: TokenSymbol; onChange: (s: TokenSymbol) => void; exclude?: TokenSymbol }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="tok-select">
      <button className="tok-btn" onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open}>
        <TokenIcon sym={value} /> {value} <span className="caret">▾</span>
      </button>
      {open && (
        <ul className="tok-menu" role="listbox" onMouseLeave={() => setOpen(false)}>
          {SYMBOLS.filter((s) => s !== exclude).map((s) => (
            <li key={s}>
              <button
                role="option"
                aria-selected={s === value}
                onClick={() => {
                  onChange(s);
                  setOpen(false);
                }}
              >
                <TokenIcon sym={s} /> <b>{s}</b> <span>{TOKENS[s].name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ActionButton({ amount, label }: { amount: string; label: string }) {
  const { isConnected, chainId } = useConnection();
  if (!isConnected || chainId !== mainnet.id) return <ConnectButton block />;
  if (!amount || +amount <= 0)
    return (
      <button className="d-btn d-btn-solid block" disabled>
        ENTER AMOUNT
      </button>
    );
  return (
    <button className="d-btn d-btn-solid block" disabled title="Hook Pools contracts are not deployed yet">
      {label} · CONTRACTS PENDING
    </button>
  );
}

function PumpSelect({ value, onChange }: { value: string; onChange: (s: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="tok-select">
      <button className="tok-btn" onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open}>
        <TokenIcon sym={value} /> {value} <span className="caret">▾</span>
      </button>
      {open && (
        <ul className="tok-menu" role="listbox" onMouseLeave={() => setOpen(false)}>
          {MEME.map((m) => (
            <li key={m.sym}>
              <button
                role="option"
                aria-selected={m.sym === value}
                onClick={() => {
                  onChange(m.sym);
                  setOpen(false);
                }}
              >
                <TokenIcon sym={m.sym} /> <b>{m.sym}</b> <span>{m.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Swap() {
  const [from, setFrom] = useState<TokenSymbol>('ETH');
  const [to, setTo] = useState(MEME[0].sym);
  const pump = MEME.find((m) => m.sym === to) ?? MEME[0];
  const path = from === pump.quote ? [from, to] : [from, pump.quote, to];
  const [amount, setAmount] = useState('');
  const [slip, setSlip] = useState('0.5%');
  const bal = useBalances();

  const pick = (pct: number) => {
    const b = bal[from];
    if (b) setAmount(String(+(b * pct).toFixed(6)));
  };

  return (
    <div className="trade-body">
      <div className="tb-head">
        <span className="accent-txt">⌁ HOOK ROUTER</span>
        <span className="pill">ANY → EVM TOKEN</span>
      </div>

      <label className="tb-label">YOU PAY</label>
      <div className="tok-box">
        <TokenSelect value={from} onChange={setFrom} />
        <input inputMode="decimal" placeholder="0.0" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))} aria-label="Amount to pay" />
      </div>
      <div className="tb-row">
        <span className="dim">Balance: {fmt(bal[from])} {from}</span>
        <div className="chips">
          {[0.25, 0.5, 0.75, 1].map((p) => (
            <button key={p} className="chip" onClick={() => pick(p)}>
              {p === 1 ? 'MAX' : `${p * 100}%`}
            </button>
          ))}
        </div>
      </div>

      <div className="flip" aria-hidden>
        ↓
      </div>

      <div className="tb-row">
        <label className="tb-label">EVM TOKEN (EST.)</label>
        <span className="dim">Launch pair: {pump.sym}/{pump.quote}</span>
      </div>
      <div className="tok-box">
        <PumpSelect value={to} onChange={setTo} />
        <input readOnly placeholder="0.0" value="" aria-label="Estimated amount received" />
      </div>

      <div className="details">
        <div>
          <span>Planned route</span>
          <span className="route">{path.map((p, i) => (i ? <em key={p}> → {p}</em> : <b key={p}>{p}</b>))}</span>
        </div>
        <div>
          <span>Venue</span>
          <span className="accent-txt">{pump.venue} · Uniswap</span>
        </div>
        <div>
          <span>Slippage Tolerance</span>
          <span className="chips">
            {['0.1%', '0.5%', '1.0%'].map((s) => (
              <button key={s} className={s === slip ? 'chip on' : 'chip'} onClick={() => setSlip(s)}>
                {s}
              </button>
            ))}
          </span>
        </div>
        <div>
          <span>Estimated Network Cost</span>
          <span className="accent-txt">—</span>
        </div>
      </div>
      <ActionButton amount={amount} label="SWAP" />
    </div>
  );
}

function Deposit() {
  const pools = POOLS.filter((p) => p.depositable);
  const [idx, setIdx] = useState(0);
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const pool = pools[idx] ?? pools[0];
  const bal = useBalances();
  const balOf = (s: string) => (s in TOKENS ? fmt(bal[s as TokenSymbol]) : '0');

  return (
    <div className="trade-body">
      <div className="tb-head">
        <span className="accent-txt">＋ GUARDED LIQUIDITY</span>
        <span className="pill">ORACLE GUARD</span>
      </div>
      <label className="tb-label">POOL</label>
      <div className="pool-pick">
        {pools.map((p, i) => (
          <button key={p.a + p.b + p.type} className={i === idx ? 'pool-opt on' : 'pool-opt'} onClick={() => setIdx(i)}>
            <Pair a={p.a} b={p.b} />
            <span className="dim">{p.fee}</span>
          </button>
        ))}
      </div>
      {[
        [pool.a, a, setA],
        [pool.b, b, setB],
      ].map(([sym, val, set]) => (
        <div key={sym as string}>
          <div className="tb-row">
            <label className="tb-label">DEPOSIT {sym as string}</label>
            <span className="dim">Balance: {balOf(sym as string)}</span>
          </div>
          <div className="tok-box">
            <span className="tok-btn static">
              <TokenIcon sym={sym as string} /> {sym as string}
            </span>
            <input
              inputMode="decimal"
              placeholder="0.0"
              value={val as string}
              onChange={(e) => (set as (v: string) => void)(e.target.value.replace(/[^0-9.]/g, ''))}
              aria-label={`Deposit ${sym}`}
            />
          </div>
        </div>
      ))}
      <div className="details">
        <div>
          <span>Guard</span>
          <span className="accent-txt">ORACLE + SESSION</span>
        </div>
        <div>
          <span>Fee model</span>
          <span>{pool.fee}</span>
        </div>
        <div>
          <span>Pool state</span>
          <span>{pool.state}</span>
        </div>
      </div>
      <ActionButton amount={a || b} label="ADD LIQUIDITY" />
    </div>
  );
}

function Positions() {
  const { isConnected } = useConnection();
  const { open } = useWalletModal();
  return (
    <div className="trade-body">
      <div className="tb-head">
        <span className="accent-txt">◈ ON-CHAIN POSITIONS</span>
        <span className="pill">0 ACTIVE</span>
      </div>
      <div className="empty-state">
        <div className="es-ico">◆</div>
        {isConnected ? (
          <>
            <b>No positions found</b>
            <p>This wallet has no guarded LP positions on EVM yet.</p>
          </>
        ) : (
          <>
            <b>Connect Wallet</b>
            <p>Connect a wallet on Ethereum Mainnet to load your guarded LP positions.</p>
            <button className="d-btn d-btn-solid block" onClick={open}>
              ＋ CONNECT WALLET FIRST
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function TradePanel() {
  const [tab, setTab] = useState<'Router' | 'Guarded LP' | 'Positions'>('Router');
  const body = useMemo(() => (tab === 'Router' ? <Swap /> : tab === 'Guarded LP' ? <Deposit /> : <Positions />), [tab]);

  return (
    <div className="d-card trade" id="trade">
      <div className="d-tabs">
        {(['Router', 'Guarded LP', 'Positions'] as const).map((t) => (
          <button key={t} className={t === tab ? 'on' : ''} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>
      {body}
    </div>
  );
}
