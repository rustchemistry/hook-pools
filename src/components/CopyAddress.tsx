import { useState } from 'react';
import { CONTRACT_ADDRESS, EXPLORER } from '../config';
import { ArrowUpRight, CheckIcon, CopyIcon } from './icons';

export function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setTimeout(() => setCopied(null), 1400);
    } catch {
      /* clipboard unavailable */
    }
  };
  return { copied, copy };
}

export function CopyAddress({ className = '' }: { className?: string }) {
  const { copied, copy } = useCopy();
  const addr = CONTRACT_ADDRESS;

  return (
    <div className={`ca-pill ${className}`}>
      <span className="ca-tag">CA</span>
      {addr ? (
        <>
          <a className="ca-addr" href={EXPLORER + addr} target="_blank" rel="noreferrer">
            {addr} <ArrowUpRight size={11} />
          </a>
          <button className="icon-btn" onClick={() => copy(addr)} aria-label="Copy contract address">
            {copied === addr ? <CheckIcon /> : <CopyIcon />}
          </button>
        </>
      ) : (
        <span className="ca-addr ca-tba">TBA / launching on EVM · HOOK/ETH</span>
      )}
    </div>
  );
}
