import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useBalance, useConnect, useConnection, useConnectors, useDisconnect, useSwitchChain } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { formatUnits } from 'viem';
import { shortAddr } from '../config';

const WalletCtx = createContext<{ open: () => void }>({ open: () => {} });
export const useWalletModal = () => useContext(WalletCtx);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  return (
    <WalletCtx.Provider value={{ open: () => setOpen(true) }}>
      {children}
      {isOpen && <WalletModal onClose={() => setOpen(false)} />}
    </WalletCtx.Provider>
  );
}

function WalletModal({ onClose }: { onClose: () => void }) {
  const connectors = useConnectors();
  const { mutate: connect, isPending, variables, error } = useConnect();
  const { isConnected } = useConnection();

  useEffect(() => {
    if (isConnected) onClose();
  }, [isConnected, onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Hide the generic "Injected" entry when EIP-6963 wallets were discovered.
  const discovered = connectors.filter((c) => c.type === 'injected' && c.id !== 'injected');
  const list = connectors.filter((c) => !(c.id === 'injected' && discovered.length));

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Connect wallet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <span>
            <img src="/cero-mark.png" width={18} height={18} alt="" className="modal-logo" /> CONNECT WALLET
          </span>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <p className="modal-sub">Hook Pools runs on Ethereum Mainnet (chain {mainnet.id}).</p>
        <div className="wallet-list">
          {list.map((c) => {
            const pending = isPending && variables?.connector === c;
            const generic = c.id === 'injected';
            const missing = generic && !(window as { ethereum?: unknown }).ethereum;
            const tag = pending ? 'CONNECTING…' : missing ? 'NOT INSTALLED' : c.type === 'injected' ? 'DETECTED' : '';
            return (
              <button key={c.uid} className="wallet-opt" onClick={() => connect({ connector: c, chainId: mainnet.id })} disabled={isPending || missing}>
                {c.icon ? <img src={c.icon} alt="" /> : <span className="wallet-ico">{c.name.slice(0, 1)}</span>}
                <span>{generic ? 'Browser Wallet' : c.name}</span>
                <em className={missing ? 'off' : ''}>{tag}</em>
              </button>
            );
          })}
        </div>
        {error && <p className="modal-err">{error.message.split('\n')[0]}</p>}
        <p className="modal-foot">By connecting you agree this is a preview interface. No transactions are sent until Hook contracts are live.</p>
      </div>
    </div>
  );
}

export function ConnectButton({ block = false }: { block?: boolean }) {
  const { open } = useWalletModal();
  const { address, isConnected, chainId } = useConnection();
  const { mutate: disconnect } = useDisconnect();
  const { mutate: switchChain, isPending } = useSwitchChain();
  const [menu, setMenu] = useState(false);

  if (!isConnected || !address)
    return (
      <button className={block ? 'd-btn d-btn-solid block' : 'd-btn d-btn-solid'} onClick={open}>
        <i className="dot-live" /> CONNECT WALLET
      </button>
    );

  if (chainId !== mainnet.id)
    return (
      <button className={block ? 'd-btn d-btn-warn block' : 'd-btn d-btn-warn'} onClick={() => switchChain({ chainId: mainnet.id })}>
        {isPending ? 'SWITCHING…' : 'SWITCH TO ETHEREUM'}
      </button>
    );

  if (block) return null;

  return (
    <div className="acct">
      <button className="d-btn d-btn-outline" onClick={() => setMenu((m) => !m)}>
        <i className="dot-live" /> {shortAddr(address)}
      </button>
      {menu && (
        <div className="acct-menu" onMouseLeave={() => setMenu(false)}>
          <EthBalance />
          <a href={`https://etherscan.io/address/${address}`} target="_blank" rel="noreferrer">
            View on Etherscan ↗
          </a>
          <button onClick={() => navigator.clipboard?.writeText(address)}>Copy address</button>
          <button
            onClick={() => {
              disconnect();
              setMenu(false);
            }}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}

function EthBalance() {
  const { address } = useConnection();
  const { data } = useBalance({ address, chainId: mainnet.id });
  return (
    <div className="acct-bal">
      <span>BALANCE</span>
      <b>{data ? `${(+formatUnits(data.value, data.decimals)).toFixed(4)} ETH` : '…'}</b>
    </div>
  );
}
