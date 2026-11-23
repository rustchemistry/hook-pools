// Decorative rotating rings that echo the swirl in the Hook logo.
export function SwirlRings({ className = '' }: { className?: string }) {
  const rings = Array.from({ length: 18 }, (_, i) => i);
  return (
    <svg className={`swirl ${className}`} viewBox="0 0 400 400" aria-hidden>
      <g className="swirl-spin">
        {rings.map((i) => (
          <ellipse
            key={i}
            cx="200"
            cy="200"
            rx={150 - i * 2.2}
            ry={92 - i * 1.1}
            transform={`rotate(${i * 10} 200 200)`}
          />
        ))}
      </g>
    </svg>
  );
}
