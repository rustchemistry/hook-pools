// Central place for brand + onchain values. Fill these in when ready.
export const BRAND = 'Hook Pools';

/** Token contract address shown in the header/footer "CA" pill. Empty = "TBA". */
export const CONTRACT_ADDRESS = '';

/** Deployer address shown on the contracts panel. Empty = hidden. */
export const DEPLOYER_ADDRESS = '';

export const CHAIN = { name: 'Ethereum', id: 1 };
export const EXPLORER = 'https://etherscan.io/address/';

export const LINKS = {
  app: '/app',
  docs: '#',
  x: 'https://x.com/ceropools',
  ethereum: 'https://ethereum.org/en/developers/docs/evm/',
};

export const shortAddr = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;
