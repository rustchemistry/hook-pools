import { createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { baseAccount, injected, walletConnect } from 'wagmi/connectors';

// Optional: set VITE_WC_PROJECT_ID (cloud.reown.com) to enable WalletConnect / mobile QR.
const wcProjectId = import.meta.env.VITE_WC_PROJECT_ID as string | undefined;

export const config = createConfig({
  chains: [mainnet],
  connectors: [
    injected(),
    baseAccount({ appName: 'Hook Pools' }),
    ...(wcProjectId ? [walletConnect({ projectId: wcProjectId, showQrModal: true })] : []),
  ],
  transports: { [mainnet.id]: http() },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}

// Canonical Ethereum mainnet tokens (real addresses).
export const TOKENS = {
  ETH: { symbol: 'ETH', name: 'Ether', decimals: 18, address: undefined },
  WETH: { symbol: 'WETH', name: 'Wrapped Ether', decimals: 18, address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' },
  USDC: { symbol: 'USDC', name: 'USD Coin', decimals: 6, address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' },
  cbBTC: { symbol: 'cbBTC', name: 'Coinbase BTC', decimals: 8, address: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf' },
} as const;

export type TokenSymbol = keyof typeof TOKENS;
