import { DollarSign, HandPlatter, Utensils } from 'lucide-react';
import { useId } from 'react';
import type { CallKind } from '../domain';

const sealIcons = { pago: DollarSign, pedido: Utensils, garzón: HandPlatter };

/** 14-point Sello of a Llamado, centered at (x, 153) inside the table. */
export function Seal({ kind, x }: { kind: CallKind; x: number }) {
  const Icon = sealIcons[kind];
  const gradient = useId().replace(/:/g, '');
  const points = Array.from({ length: 28 }, (_, i) => {
    const angle = (i * Math.PI) / 14 - Math.PI / 2;
    const radius = i % 2 === 0 ? 25 : 21;
    return `${x + Math.cos(angle) * radius},${153 + Math.sin(angle) * radius}`;
  }).join(' ');
  return (
    <g className="seal" data-kind={kind}>
      <defs>
        <radialGradient id={gradient} cx="35%" cy="25%" r="80%">
          <stop className="seal-light" />
          <stop offset="1" className="seal-dark" />
        </radialGradient>
      </defs>
      <polygon
        points={points}
        className="seal-face"
        fill={`url(#${gradient})`}
      />
      {/* Flat face of the modern theme; the original hides it. */}
      <circle className="seal-dot" cx={x} cy={153} r={15} />
      <g className="seal-glyph">
        <Icon
          x={x - 13}
          y={140}
          width={26}
          height={26}
          strokeWidth={3}
          className="seal-icon"
        />
      </g>
    </g>
  );
}

/** A standalone Sello, outside the table. */
export function SealBadge({ kind, label }: { kind: CallKind; label: string }) {
  return (
    <svg className="seal-badge" viewBox="72 125 56 56" role="img">
      <title>{label}</title>
      <Seal kind={kind} x={100} />
    </svg>
  );
}
