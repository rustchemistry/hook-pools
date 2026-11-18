// Protocol contracts on EVM. Paste real addresses into `address` once deployed —
// empty ones render as "IN DEVELOPMENT".
export type Category =
  | 'Router'
  | 'Oracle Guard'
  | 'Venue Adapters'
  | 'Fees & Config'
  | 'External';

export const CATEGORIES: Category[] = ['Router', 'Oracle Guard', 'Venue Adapters', 'Fees & Config', 'External'];

export const CONTRACTS: { name: string; category: Category; address: string }[] = [
  { name: 'HookRouter', category: 'Router', address: '' },
  { name: 'Quoter', category: 'Router', address: '' },
  { name: 'OracleGuardHook', category: 'Oracle Guard', address: '' },
  { name: 'OracleRegistry', category: 'Oracle Guard', address: '' },
  { name: 'SessionRegistry', category: 'Oracle Guard', address: '' },
  { name: 'DynamicFeeController', category: 'Oracle Guard', address: '' },
  { name: 'TokenPairAdapter', category: 'Venue Adapters', address: '' },
  { name: 'UniswapV3Adapter', category: 'Venue Adapters', address: '' },
  { name: 'UniswapV4Adapter', category: 'Venue Adapters', address: '' },
  { name: 'HookBuybackBurn', category: 'Fees & Config', address: '' },
  { name: 'ProtocolConfig', category: 'Fees & Config', address: '' },
  { name: 'Canonical WETH', category: 'External', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' },
  { name: 'Canonical USDC', category: 'External', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' },
];
