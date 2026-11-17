import { Minus, Plus } from 'lucide-react';
import type { ReactNode } from 'react';
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

/**
 * Paper receipt with a toothed bottom edge and fixed dish, quantity and
 * price columns, coming out of a printer slot.
 */
export function Receipt({
  lines,
  total,
  caption,
  tip,
  shares = [],
  children,
}: {
  lines: ReceiptLine[];
  /** The figure to pay, tip included. */
  total: number;
  caption: string;
  /** Printed as one more line when its amount is not zero. */
  tip?: { percent: number; amount: number };
  /** What each person pays when the bill is split: printed as tear-off stubs. */
  shares?: number[];
  children?: ReactNode;
}) {
  const t = useT();
  return (
    <div className="receipt">
      <span className="receipt-slot" aria-hidden="true" />
      <div className="receipt-feed">
        <div className="receipt-paper">
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
            {!!tip?.amount && (
              <tbody className="receipt-tip">
                <tr>
                  <th scope="row">{t('tip')}</th>
                  <td>{tip.percent}%</td>
                  <td>{money(tip.amount)}</td>
                </tr>
              </tbody>
            )}
          </table>
          <p className="receipt-total">
            {t('total')}: {money(total)}
          </p>
          {shares.length > 1 && (
            <ul
              className="receipt-stubs"
              aria-label={t('splitInto')(shares.length)}
            >
              {shares.map((share, index) => (
                <li key={index}>
                  <span>
                    {index + 1}/{shares.length}
                  </span>
                  <strong>{money(share)}</strong>
                </li>
              ))}
            </ul>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

/** −/+ buttons of a receipt line. */
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

/**
 * Action column next to the receipt: repeats the total, the most important
 * figure, and keeps the primary action always in view.
 */
export function ReceiptActions({
  total,
  shares,
  children,
}: {
  total: number;
  /** A split bill: the line under the total says what each person pays. */
  shares?: number[];
  children: ReactNode;
}) {
  const t = useT();
  return (
    <div className="receipt-actions">
      <p className="receipt-actions-total">
        <span>{t('total')}</span>
        <strong>{money(total)}</strong>
        {/* The line keeps its place when the bill is not split. */}
        {shares && (
          <small data-hidden={shares.length < 2 || undefined}>
            {t('perPerson')}: {money(shares[0])}
          </small>
        )}
      </p>
      {children}
    </div>
  );
}

/** A choice of the action column with its visible label. */
export function ReceiptOption({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="receipt-option">
      <span aria-hidden="true">{label}</span>
      {children}
    </div>
  );
}
