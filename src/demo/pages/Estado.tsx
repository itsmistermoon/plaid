import { Check, ConciergeBell, ReceiptText, Repeat } from 'lucide-react';
import { useStore } from 'zustand';
import { findVisitorTable } from '../../domain';
import { useExtraName, useT } from '../../i18n';
import { lineSummary } from '../lines';
import type { Go } from '../pages';
import { store } from '../store';

const statusLabels = ['enviado', 'confirmado', 'servido'] as const;

export function Estado({ go }: { go: Go }) {
  const { tables, callWaiter, addToCart } = useStore(store);
  const t = useT();
  const extraName = useExtraName();
  const mesa = findVisitorTable(tables);
  return (
    <section className="card status" aria-label={t('orderStatus')}>
      <ol className="orders">
        {mesa.orders.map((order, index) => {
          const step = statusLabels.indexOf(order.status);
          return (
            <li key={order.id}>
              <div className="order-head">
                <h3>{t('orderN')(index + 1)}</h3>
                <button
                  type="button"
                  className="dark-button"
                  aria-label={t('repeatOrderN')(index + 1)}
                  onClick={() => {
                    for (const line of order.lines) addToCart(line, line.qty);
                    go('carrito');
                  }}
                >
                  <Repeat aria-hidden="true" />
                  {t('repeat')}
                </button>
              </div>
              <p className="order-lines">
                {order.lines
                  .map((line) => lineSummary(line, extraName))
                  .join(' · ')}
              </p>
              <ol className="steps" aria-label={t('progress')}>
                {statusLabels.map((label, i) => (
                  <li
                    key={label}
                    data-state={i < step ? 'done' : i === step ? 'now' : 'next'}
                    aria-current={i === step ? 'step' : undefined}
                  >
                    <span className="step-dot" aria-hidden="true">
                      {i <= step ? <Check strokeWidth={4} /> : i + 1}
                    </span>
                    {t('statuses')[label]}
                  </li>
                ))}
              </ol>
            </li>
          );
        })}
      </ol>
      <div className="status-actions mobile-only">
        <button
          type="button"
          className="dark-button"
          disabled={mesa.calls.includes('garzón')}
          onClick={callWaiter}
        >
          <ConciergeBell aria-hidden="true" />
          {mesa.calls.includes('garzón') ? t('waiterComing') : t('callWaiter')}
        </button>
        <button
          type="button"
          className="light-button"
          data-tour="cuenta"
          onClick={() => go('cuenta')}
        >
          <ReceiptText aria-hidden="true" />
          {t('bill')}
        </button>
      </div>
    </section>
  );
}
