import { type MouseEvent, useId } from 'react';
import type { CallKind } from '../domain';
import { useT } from '../i18n';
import { Seal } from './Seal';

export function Table({
  number,
  occupied,
  calls,
  reserved,
}: {
  number: number;
  occupied: boolean;
  calls: CallKind[];
  /** Hour of today's reservation: a free Mesa says so on its plate. */
  reserved?: string;
}) {
  const t = useT();
  const id = useId().replace(/:/g, '');
  const unique = [...new Set(calls)];
  const held = !occupied && reserved;
  // A reservation weaves its own thread into the cloth, like an open call.
  const threads = [...unique, ...(held ? ['reserva'] : [])];
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
          <g className="cloth-band">
            <path d="M0 0h14v28H0z" className="cloth-warp" />
            <path d="M0 0h28v14H0z" className="cloth-weft" />
          </g>
          <path d="M0 0h14v14H0z" className="cloth-cross" />
          <path
            d="M2 0v28M6 0v28M10 0v28M14 0v28M18 0v28M22 0v28M26 0v28M0 2h28M0 6h28M0 10h28M0 14h28M0 18h28M0 22h28M0 26h28"
            className="cloth-thread"
          />
        </pattern>
        {/* Each open call weaves a thread of its color into the cloth, in
            the warp and in the weft, through the light squares. */}
        <pattern
          id={`${id}calls`}
          width="28"
          height="28"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          {threads.map((call, index) => {
            const at = 21 + (index - (threads.length - 1) / 2) * 4;
            return (
              <path
                key={call}
                className="cloth-call"
                data-kind={call}
                d={`M${at} 0v28M0 ${at}h28`}
              />
            );
          })}
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
          <stop style={{ stopColor: 'var(--table-wood-top)' }} />
          <stop offset=".5" style={{ stopColor: 'var(--table-wood-mid)' }} />
          <stop offset="1" style={{ stopColor: 'var(--table-wood-bottom)' }} />
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
        <rect
          className="wood"
          x="19"
          y="19"
          width="162"
          height="162"
          fill={`url(#${id}wood)`}
        />
        <rect
          className="grain"
          x="19"
          y="19"
          width="162"
          height="162"
          filter={`url(#${id}grain)`}
        />
        {/* The tablecloth is a diamond larger than the table: the edge clips it into an octagon. */}
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
        {threads.length > 0 && (
          <path
            className="cloth-calls"
            d="M100 -28 228 100 100 228 -28 100Z"
            fill={`url(#${id}calls)`}
          />
        )}
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
          {occupied
            ? t('plateOccupied')
            : held
              ? t('plateReserved')(held)
              : t('plateFree')}
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

/** Tappable table of the Garzón's grid, with its summary for screen readers. */
export function TableButton({
  number,
  occupied,
  calls,
  reserved,
  pressed,
  tour,
  onClick,
}: {
  number: number;
  occupied: boolean;
  calls: CallKind[];
  reserved?: string;
  pressed?: boolean;
  tour?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  const t = useT();
  const unique = [...new Set(calls)];
  return (
    <button
      className="table-button"
      data-occupied={occupied}
      type="button"
      aria-pressed={pressed ?? false}
      data-tour={tour}
      onClick={onClick}
    >
      <Table
        number={number}
        occupied={occupied}
        calls={calls}
        reserved={reserved}
      />
      <span className="sr-only">
        {t('tableSummary')(number, occupied)}
        {!occupied && reserved ? `, ${t('plateReserved')(reserved)}` : ''}
        {unique.length
          ? `, ${t('callsSummary')}: ${unique.map((call) => t('callLabels')[call]).join(', ')}`
          : ''}
      </span>
    </button>
  );
}
