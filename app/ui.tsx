const HUES: Record<string, string> = {
  ETH: '#878b93',
  WETH: '#878b93',
  USDC: '#686d74',
  cbBTC: '#f7931a',
  HOOK: '#5b5f66',
};

export function TokenIcon({ sym, size = 22 }: { sym: string; size?: number }) {
  if (sym === 'HOOK')
    return <img src="/cero-mark.png" width={size} height={size} alt="" aria-hidden className="tok-ico tok-img" />;
  const bg = HUES[sym] ?? `hsl(${[...sym].reduce((a, c) => a + c.charCodeAt(0) * 37, 0) % 360} 70% 55%)`;
  return (
    <span className="tok-ico" style={{ width: size, height: size, background: bg, fontSize: size * 0.42 }} aria-hidden>
      {sym.replace(/^cb/, '').slice(0, 1)}
    </span>
  );
}

export function Pair({ a, b }: { a: string; b: string }) {
  return (
    <span className="pair">
      <span className="pair-icons">
        <TokenIcon sym={a} />
        <TokenIcon sym={b} />
      </span>
      <b>
        {a}/{b}
      </b>
    </span>
  );
}

