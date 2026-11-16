import { DollarSign, HandPlatter, Utensils } from 'lucide-react';
import { useId } from 'react';
import type { CallKind } from './domain';

const sealIcons = { pago: DollarSign, pedido: Utensils, garzón: HandPlatter };

function Seal({ kind, x }: { kind: CallKind; x: number }) {
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
      <Icon
        x={x - 13}
        y={140}
        width={26}
        height={26}
        strokeWidth={3}
        className="seal-icon"
      />
    </g>
  );
}

export function Table({
  number,
  occupied,
  calls,
}: {
  number: number;
  occupied: boolean;
  calls: CallKind[];
}) {
  const id = useId().replace(/:/g, '');
  const unique = [...new Set(calls)];
  return (
    <svg
      className="mesa"
      viewBox="0 0 200 200"
      aria-hidden="true"
      data-occupied={occupied}
    >
      <defs>
        <pattern
          id={`${id}checks`}
          width="28"
          height="28"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="28" height="28" className="cloth-base" />
          <path d="M0 0h14v28H0zM0 0h28v14H0z" className="cloth-band" />
          <path d="M0 0h14v14H0z" className="cloth-cross" />
          <path
            d="M2 0v28M6 0v28M10 0v28M14 0v28M18 0v28M22 0v28M26 0v28M0 2h28M0 6h28M0 10h28M0 14h28M0 18h28M0 22h28M0 26h28"
            className="cloth-thread"
          />
        </pattern>
        <filter id={`${id}grain`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency=".035 .38"
            numOctaves="3"
            seed="8"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <linearGradient id={`${id}wood`} x2="0" y2="1">
          <stop stopColor="#ddb585" />
          <stop offset=".5" stopColor="#ae7848" />
          <stop offset="1" stopColor="#79502e" />
        </linearGradient>
        <linearGradient id={`${id}plate`} x2="0" y2="1">
          <stop stopColor="#fffbd6" />
          <stop offset="1" stopColor="#c5b77d" />
        </linearGradient>
        <clipPath id={`${id}clip`}>
          <rect x="19" y="19" width="162" height="162" rx="23" />
        </clipPath>
      </defs>
      <rect
        className="table-shadow"
        x="19"
        y="22"
        width="162"
        height="162"
        rx="23"
      />
      <g clipPath={`url(#${id}clip)`}>
        <rect x="19" y="19" width="162" height="162" fill={`url(#${id}wood)`} />
        <rect
          className="grain"
          x="19"
          y="19"
          width="162"
          height="162"
          filter={`url(#${id}grain)`}
        />
        {/* El mantel es un rombo mayor que la mesa: el borde lo recorta en octágono. */}
        <path
          className="cloth-shadow"
          transform="translate(0 3)"
          d="M100 -25 225 100 100 225 -25 100Z"
        />
        <path
          className="cloth"
          d="M100 -28 228 100 100 228 -28 100Z"
          fill={`url(#${id}checks)`}
        />
        <path className="cloth-shine" d="M100 -26 226 100 100 226 -26 100Z" />
      </g>
      <rect
        className="table-outline"
        x="19"
        y="19"
        width="162"
        height="162"
        rx="23"
      />
      <g className="plate">
        <rect
          x="30"
          y="77"
          width="140"
          height="49"
          rx="2"
          fill={`url(#${id}plate)`}
        />
        <path d="M42 83H158Q158 89 164 89V114Q158 114 158 120H42Q42 114 36 114V89Q42 89 42 83Z" />
        <text x="100" y="107" textAnchor="middle">
          Mesa {occupied ? 'ocupada' : 'libre'}
        </text>
      </g>
      <g className="table-number">
        <circle cx="157" cy="44" r="14" />
        <text x="157" y="49" textAnchor="middle">
          {number}
        </text>
      </g>
      {unique.map((call, index) => (
        <Seal
          key={call}
          kind={call}
          x={100 + (index - (unique.length - 1) / 2) * 49}
        />
      ))}
    </svg>
  );
}
