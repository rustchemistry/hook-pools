# Hook Pools

Oracle-guarded Uniswap v4 pools and a router for EVM tokens.

- **Oracle Guard**: a Uniswap v4 hook that checks every swap against an oracle price. Stale or bad oracle prices pause the pool. Outside the allowed band, a swap must leave the pool closer to the oracle than it found it.
- **Hook Router**: buy any EVM token with the asset you hold, in one transaction (planned).

Status: in development. Nothing is deployed to mainnet.

## Repository

```
/              landing page + app (Vite, React, TypeScript)
  src/         landing page
  src/app/     app at /app (wagmi, viem)
contracts/     Foundry project (Solidity 0.8.26, Cancun)
  src/hooks/   OracleGuardHook
  src/oracle/  OracleRegistry
  test/        unit, fuzz and fork tests
```

## Site

```
npm install
npm run dev
```

## Contracts

```
cd contracts
forge install foundry-rs/forge-std uniswap/v4-periphery
forge test
```

Fork tests read the real Chainlink ETH/USD feed and run only with `ETH_RPC_URL` set.
