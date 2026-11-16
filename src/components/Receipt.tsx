import { Minus, Plus } from 'lucide-react';
import { type ReactNode, useLayoutEffect, useRef } from 'react';
import { money } from '../format';
import { useT } from '../i18n';

export interface ReceiptLine {
  key: string;
  name: string;
  qty: ReactNode;
  price: number;
  extras?: { name: string; price: number }[];
  note?: string;
}

const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Boleta de papel con bordes dentados y columnas fijas plato, cantidad y
 * precio. Cada vez que cambia lo impreso, el papel sale de la ranura como en
 * una impresora: avanza lo que creció, o un tirón corto si solo cambió una cifra.
 */
export function Receipt({
  lines,
  total,
  caption,
  children,
}: {
  lines: ReceiptLine[];
  total: number;
  caption: string;
  children?: ReactNode;
}) {
  const t = useT();
  const paper = useRef<HTMLDivElement>(null);
  const height = useRef(0);
  const printed = JSON.stringify([
    total,
    lines.map(({ key, name, price, extras, note }) => [
      key,
      name,
      price,
      extras,
      note,
    ]),
  ]);
  useLayoutEffect(() => {
    const el = paper.current;
    if (!el) return;
    const next = el.offsetHeight;
    const feed = height.current ? Math.max(next - height.current, 14) : next;
    height.current = next;
    if (reducedMotion()) return;
    el.animate(
      [{ transform: `translateY(${-feed}px)` }, { transform: 'translateY(0)' }],
      {
        duration: Math.min(900, 220 + feed * 2.5),
        easing: 'steps(12, end)',
      },
    );
  }, [printed]);
  return (
    <div className="receipt">
      <span className="receipt-slot" aria-hidden="true" />
      <div className="receipt-feed">
        <div className="receipt-paper" ref={paper}>
          <table>
            <caption className="sr-only">{caption}</caption>
            <colgroup>
              <col />
              <col className="receipt-qty" />
              <col className="receipt-price" />
            </colgroup>
            <thead className="sr-only">
              <tr>
                <th scope="col">{t('dish')}</th>
                <th scope="col">{t('quantity')}</th>
                <th scope="col">{t('price')}</th>
              </tr>
            </thead>
            {lines.map((line) => (
              <tbody key={line.key}>
                <tr>
                  <th scope="row">{line.name}</th>
                  <td>{line.qty}</td>
                  <td>{money(line.price)}</td>
                </tr>
                {!!line.extras?.length && (
                  <tr className="receipt-plus">
                    <td colSpan={3}>
                      <span aria-hidden="true">+</span>
                    </td>
                  </tr>
                )}
                {line.extras?.map((extra) => (
                  <tr key={extra.name} className="receipt-extra">
                    <th scope="row">{extra.name}</th>
                    <td />
                    <td>{money(extra.price)}</td>
                  </tr>
                ))}
                {line.note && (
                  <tr className="receipt-note">
                    <td colSpan={3}>“{line.note}”</td>
                  </tr>
                )}
              </tbody>
            ))}
          </table>
          <p className="receipt-total">
            {t('total')}: {money(total)}
          </p>
          {children}
        </div>
      </div>
    </div>
  );
}

/** Botones −/+ de una línea de la boleta. */
export function Stepper({
  name,
  qty,
  onChange,
}: {
  name: string;
  qty: number;
  onChange: (qty: number) => void;
}) {
  const t = useT();
  return (
    <span className="stepper">
      <button
        type="button"
        aria-label={t('removeOneOf')(name)}
        onClick={() => onChange(qty - 1)}
      >
        <Minus aria-hidden="true" strokeWidth={3} />
      </button>
      <output>x{qty}</output>
      <button
        type="button"
        aria-label={t('addOneOf')(name)}
        onClick={() => onChange(qty + 1)}
      >
        <Plus aria-hidden="true" strokeWidth={3} />
      </button>
    </span>
  );
}
