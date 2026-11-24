import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './wagmi';
import { WalletProvider } from './Wallet';
import { Dapp } from './Dapp';
import '../styles.css';
import './app.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletProvider>
          <Dapp />
        </WalletProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
);
