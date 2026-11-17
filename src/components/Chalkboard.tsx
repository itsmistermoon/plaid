import { useId } from 'react';
import { money } from '../format';
import { useDishText, useT } from '../i18n';
import type { Dish } from '../menu';

/** Today's specials and sold-out dishes: a chalkboard in the Plaid theme, a plain card in Slate. */
export function Chalkboard({
  specials,
  soldOut,
  onOpen,
}: {
  specials: Dish[];
  soldOut: Dish[];
  onOpen: (dish: Dish) => void;
}) {
  const t = useT();
  const text = useDishText();
  const titleId = useId();
  return (
    <section className="chalkboard" aria-labelledby={titleId}>
      {/* Roughens the chalk strokes in the Plaid theme; Slate does not use it. */}
      <svg className="chalk-defs" aria-hidden="true" focusable="false">
        <filter id="chalk-rough" x="-2%" y="-10%" width="104%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            result="grain"
          />
          <feDisplacementMap in="SourceGraphic" in2="grain" scale="1.6" />
        </filter>
      </svg>
      <div className="chalk-surface">
        <h2 className="chalk-title" id={titleId}>
          {t('specialsTitle')}
        </h2>
        <ul className="specials" data-tour="elegir hoy">
          {specials.map((dish) => (
            <li key={dish.id}>
              <button
                type="button"
                className="special"
                aria-label={t('seeDetailOf')(dish.name)}
                onClick={() => onOpen(dish)}
              >
                <span className="special-name">{dish.name}</span>
                <span className="special-price">{money(dish.price)}</span>
                <span className="special-text">{text(dish)}</span>
              </button>
            </li>
          ))}
        </ul>
        {soldOut.length > 0 && (
          <>
            <h3 className="chalk-sub">{t('soldOutToday')}</h3>
            <ul className="chalk-sold">
              {soldOut.map((dish) => (
                <li key={dish.id}>{dish.name}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
