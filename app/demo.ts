// Planned markets. No figures are shown until Hook Pools contracts are deployed —
// fill liquidity / volume from an indexer or onchain reads once live.

export type Pool = {
  a: string;
  b: string;
  type: string;
  kind: 'EVM' | 'Uniswap' | 'Guarded';
  liquidity: string;
  volume: string;
  fee: string;
  state: string;
  depositable: boolean;
};

export const POOLS: Pool[] = [
  { a: 'HOOK', b: 'ETH', type: 'EVM · LAUNCH PAIR', kind: 'EVM', liquidity: '—', volume: '—', fee: 'Dynamic', state: 'LAUNCHING SOON', depositable: false },
  { a: 'WETH', b: 'USDC', type: 'Uniswap v3 · HUB', kind: 'Uniswap', liquidity: '—', volume: '—', fee: '0.30%', state: 'ROUTING AT LAUNCH', depositable: false },
  { a: 'cbBTC', b: 'WETH', type: 'Uniswap v3 · HUB', kind: 'Uniswap', liquidity: '—', volume: '—', fee: '0.30%', state: 'ROUTING AT LAUNCH', depositable: false },
  { a: 'AAPLx', b: 'USDC', type: 'Hook Guard · STOCK', kind: 'Guarded', liquidity: '—', volume: '—', fee: 'Base + deviation', state: 'IN DEVELOPMENT', depositable: true },
  { a: 'NVDAx', b: 'USDC', type: 'Hook Guard · STOCK', kind: 'Guarded', liquidity: '—', volume: '—', fee: 'Base + deviation', state: 'IN DEVELOPMENT', depositable: true },
  { a: 'TSLAx', b: 'USDC', type: 'Hook Guard · STOCK', kind: 'Guarded', liquidity: '—', volume: '—', fee: 'Base + deviation', state: 'IN DEVELOPMENT', depositable: true },
];

// Tokens the router will reach at launch, with the pair each one trades against.
export const MEME = [
  { sym: 'HOOK', name: 'Hook Pools', quote: 'ETH', status: 'Launching soon', live: false, venue: 'EVM' },
];

export const STOCKS: { sym: string; name: string; sector: string; active: boolean }[] = [
  { sym: 'AAPL', name: 'Apple', sector: 'Technology', active: false },
  { sym: 'AMD', name: 'AMD', sector: 'Technology', active: false },
  { sym: 'AMZN', name: 'Amazon', sector: 'Consumer Cyclical', active: false },
  { sym: 'BA', name: 'Boeing', sector: 'Industrials', active: false },
  { sym: 'COIN', name: 'Coinbase', sector: 'Financial Services', active: false },
  { sym: 'GOOGL', name: 'Alphabet', sector: 'Technology', active: false },
  { sym: 'META', name: 'Meta Platforms', sector: 'Technology', active: false },
  { sym: 'MSFT', name: 'Microsoft', sector: 'Technology', active: false },
  { sym: 'NFLX', name: 'Netflix', sector: 'Communication Services', active: false },
  { sym: 'NVDA', name: 'NVIDIA', sector: 'Technology', active: false },
  { sym: 'PLTR', name: 'Palantir', sector: 'Technology', active: false },
  { sym: 'TSLA', name: 'Tesla', sector: 'Consumer Cyclical', active: false },
];

export const FEED = [
  ['ETH', 'CANONICAL', 'NATIVE'],
  ['WETH', 'CANONICAL', '0xC02a…6Cc2'],
  ['USDC', 'CANONICAL', '0xA0b8…eB48'],
  ['cbBTC', 'CANONICAL', '0xcbB7…33Bf'],
  ['AAPLx', 'ORACLE GUARDED', 'planned'],
  ['NVDAx', 'ORACLE GUARDED', 'planned'],
];

export const SURFACES = [
  ['HookRouter', 'ANY → EVM TOKEN'],
  ['Quoter', 'MULTI-HOP QUOTES'],
  ['OracleGuardHook', 'CIRCUIT BREAKER'],
  ['DynamicFeeController', 'DEVIATION FEES'],
  ['TokenPairAdapter', 'LAUNCH PAIRS'],
  ['HookBuybackBurn', 'FEES → BURN $HOOK'],
];

export const GUARDS = [
  'Oracle price',
  'Oracle freshness',
  'Pool price',
  'Price deviation',
  'Market session',
  'Trade size cap',
  'Liquidity',
  'Current fee',
  'Risk state',
];
