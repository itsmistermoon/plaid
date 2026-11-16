import { useId } from 'react';

type Call = 'pedido' | 'garzón' | 'pago';

export function Table({
  number,
  occupied,
  calls,
}: {
  number: number;
  occupied: boolean;
  calls: Call[];
}) {
  const id = useId().replace(/:/g, '');
  const unique = [...new Set(calls)];
  return (
    <svg className="mesa" viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <pattern
          id={`${id}checks`}
          width="28"
          height="28"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="28" height="28" fill="#c3e187" />
          <path d="M0 0h14v28H0zM0 0h28v14H0z" fill="#4e9a28" opacity=".68" />
          <path d="M0 0h14v14H0z" fill="#24731f" opacity=".52" />
          <path
            d="M2 0v28M6 0v28M10 0v28M14 0v28M18 0v28M22 0v28M26 0v28M0 2h28M0 6h28M0 10h28M0 14h28M0 18h28M0 22h28M0 26h28"
            stroke="#e7f4bb"
            strokeWidth=".45"
            opacity=".4"
          />
        </pattern>
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
        x="19"
        y="22"
        width="162"
        height="162"
        rx="23"
        fill="#16271c"
        opacity=".5"
      />
      <g clipPath={`url(#${id}clip)`}>
        <rect x="19" y="19" width="162" height="162" fill={`url(#${id}wood)`} />
        <path d="M100 0 200 100 100 200 0 100Z" fill={`url(#${id}checks)`} />
      </g>
      <rect
        x="19"
        y="19"
        width="162"
        height="162"
        rx="23"
        fill="none"
        stroke="#553e29"
        strokeWidth="1.5"
      />
      <g className="table-plate">
        <rect
          x="30"
          y="77"
          width="140"
          height="49"
          rx="2"
          fill={`url(#${id}plate)`}
        />
        <path
          d="M42 83H158Q158 89 164 89V114Q158 114 158 120H42Q42 114 36 114V89Q42 89 42 83Z"
          fill="none"
          stroke="#ad9d68"
        />
        <text x="100" y="107" textAnchor="middle">
          Mesa {occupied ? 'ocupada' : 'libre'}
        </text>
      </g>
      <circle
        cx="157"
        cy="44"
        r="14"
        fill="#263e2b"
        stroke="#d5e6b1"
        strokeWidth="1.5"
      />
      <text x="157" y="49" textAnchor="middle" className="table-number">
        {number}
      </text>
      {unique.map((call, index) => {
        const x = 100 + (index - (unique.length - 1) / 2) * 49;
        const points = Array.from({ length: 28 }, (_, i) => {
          const angle = (i * Math.PI) / 14 - Math.PI / 2;
          const radius = i % 2 === 0 ? 23 : 19;
          return `${x + Math.cos(angle) * radius},${153 + Math.sin(angle) * radius}`;
        }).join(' ');
        return (
          <g key={call} className="seal" data-kind={call}>
            <defs>
              <radialGradient id={`${id}${call}`} cx="35%" cy="25%" r="80%">
                <stop className="seal-light" />
                <stop offset="1" className="seal-dark" />
              </radialGradient>
            </defs>
            <polygon
              points={points}
              fill={`url(#${id}${call})`}
              stroke="#ffffff88"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <svg
              aria-hidden="true"
              x={x - 12}
              y="141"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {call === 'pago' ? (
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              ) : call === 'pedido' ? (
                <path d="M3 2v7a4 4 0 0 0 4 4h1V2M5 2v7M7 13v9M15 22V2c4 0 6 4 6 8v3h-6" />
              ) : (
                <>
                  <path d="M2 20h20M4 18a8 8 0 0 1 16 0M12 10V7M10 7h4" />
                  <path d="M3 18h18" />
                </>
              )}
            </svg>
          </g>
        );
      })}
    </svg>
  );
}
