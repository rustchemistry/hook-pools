// Hook Router v1: quotes from two public aggregators, best one wins.
//
// Why two: in testing, KyberSwap started answering 429 after ~15 requests in a few minutes,
// while Velora (ParaSwap) kept answering. Their prices were within ~1 bp of each other on
// majors. One aggregator is a single point of failure; two in parallel is a fallback for free.
//
// Why not compare gas: the two APIs estimate gas very differently (for 1 ETH -> USDC, KyberSwap
// said ~1.19M gas, Velora ~198k), so "net of gas" would mostly measure whose estimate is worse.
// v1 compares output amounts; real gas comes from eth_estimateGas on the built transaction.
//
// No imports on purpose: the same file runs in the app and in scripts/quote-check.mjs.

export const NATIVE = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
export const CHAIN_ID = 1;

export type Token = { address: string; decimals: number; symbol?: string };
export type Source = 'kyberswap' | 'velora';

export type Quote = {
  source: Source;
  amountIn: bigint;
  amountOut: bigint;
  /** What the source needs later to build the transaction. */
  route: unknown;
  ms: number;
};

export type QuoteError = { source: Source; message: string };

export type BestQuote = {
  best: Quote;
  /** Every quote that came back, best first. */
  quotes: Quote[];
  errors: QuoteError[];
};

export type QuoteOptions = {
  /** KyberSwap rejects requests without a client id (403). */
  kyberClientId?: string;
  timeoutMs?: number;
  sources?: Source[];
};

const DEFAULTS = { kyberClientId: 'hook-pools', timeoutMs: 4000, sources: ['kyberswap', 'velora'] as Source[] };

export class NoQuoteError extends Error {
  constructor(public errors: QuoteError[]) {
    super('No aggregator returned a quote: ' + errors.map((e) => `${e.source}: ${e.message}`).join('; '));
  }
}

async function getJson(url: string, init: RequestInit, timeoutMs: number) {
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`HTTP ${res.status}${body?.message ? ` ${body.message}` : ''}`);
  return body;
}

export async function quoteKyber(tokenIn: Token, tokenOut: Token, amountIn: bigint, o: QuoteOptions = {}): Promise<Quote> {
  const t = Date.now();
  const q = new URLSearchParams({ tokenIn: tokenIn.address, tokenOut: tokenOut.address, amountIn: amountIn.toString() });
  const j = await getJson(
    `https://aggregator-api.kyberswap.com/ethereum/api/v1/routes?${q}`,
    { headers: { 'x-client-id': o.kyberClientId ?? DEFAULTS.kyberClientId } },
    o.timeoutMs ?? DEFAULTS.timeoutMs,
  );
  const s = j?.data?.routeSummary;
  if (!s?.amountOut) throw new Error(j?.message || 'no route');
  return { source: 'kyberswap', amountIn, amountOut: BigInt(s.amountOut), route: j.data, ms: Date.now() - t };
}

export async function quoteVelora(tokenIn: Token, tokenOut: Token, amountIn: bigint, o: QuoteOptions = {}): Promise<Quote> {
  const t = Date.now();
  const q = new URLSearchParams({
    srcToken: tokenIn.address,
    destToken: tokenOut.address,
    srcDecimals: String(tokenIn.decimals),
    destDecimals: String(tokenOut.decimals),
    amount: amountIn.toString(),
    side: 'SELL',
    network: String(CHAIN_ID),
    version: '6.2',
  });
  const j = await getJson(`https://api.paraswap.io/prices?${q}`, {}, o.timeoutMs ?? DEFAULTS.timeoutMs);
  const r = j?.priceRoute;
  if (!r?.destAmount) throw new Error(j?.error || 'no route');
  return { source: 'velora', amountIn, amountOut: BigInt(r.destAmount), route: r, ms: Date.now() - t };
}

const QUOTERS: Record<Source, typeof quoteKyber> = { kyberswap: quoteKyber, velora: quoteVelora };

/** Asks every source in parallel. Resolves with the largest output, or throws NoQuoteError. */
export async function quoteBest(tokenIn: Token, tokenOut: Token, amountIn: bigint, o: QuoteOptions = {}): Promise<BestQuote> {
  if (amountIn <= 0n) throw new Error('amountIn must be > 0');
  if (tokenIn.address.toLowerCase() === tokenOut.address.toLowerCase()) throw new Error('same token');
  const sources = o.sources ?? DEFAULTS.sources;
  const settled = await Promise.allSettled(sources.map((s) => QUOTERS[s](tokenIn, tokenOut, amountIn, o)));

  const quotes: Quote[] = [];
  const errors: QuoteError[] = [];
  settled.forEach((r, i) => {
    if (r.status === 'fulfilled') quotes.push(r.value);
    else errors.push({ source: sources[i], message: r.reason instanceof Error ? r.reason.message : String(r.reason) });
  });
  if (quotes.length === 0) throw new NoQuoteError(errors);
  quotes.sort((a, b) => (b.amountOut > a.amountOut ? 1 : b.amountOut < a.amountOut ? -1 : 0));
  return { best: quotes[0], quotes, errors };
}

/** Difference between the best and the runner-up, in bps of the runner-up. */
export function edgeBps(q: BestQuote): number | null {
  if (q.quotes.length < 2) return null;
  const [a, b] = q.quotes;
  return Number(((a.amountOut - b.amountOut) * 1_000_000n) / b.amountOut) / 100;
}
