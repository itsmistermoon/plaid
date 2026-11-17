import { MousePointerClick } from 'lucide-react';
import type { ReactNode } from 'react';
import { lineKey, lineSummary } from '../demo/lines';
import { type CallKind, type Table, tableBill } from '../domain';
import { money } from '../format';
import { useExtraName, useT } from '../i18n';
import { Badge } from './Badge';
import { MoveMenu } from './MoveMenu';

/** What the Garzón sees and does on a table: Llamados, Pedidos and the Cuenta pinned at the bottom. */
export function TableDetail({
  table,
  heading,
  onAttend,
  onConfirm,
  onServe,
  onCharge,
  moveTargets,
  onMove,
  reservation,
}: {
  table: Table;
  heading: ReactNode;
  onAttend?: (call: CallKind) => void;
  onConfirm?: (orderId: string) => void;
  onServe?: (orderId: string) => void;
  onCharge?: () => void;
  /** The other Mesas this one can be moved to; without them there is no move menu. */
  moveTargets?: { number: number; occupied: boolean }[];
  onMove?: (to: number) => void;
  /** Today's reservation of the Mesa, already worded. */
  reservation?: string;
}) {
  const t = useT();
  const extraName = useExtraName();
  const { tip, total, shares } = tableBill(table);
  return (
    <>
      <div className="table-detail-scroll">
        {heading}
        <p className="muted">
          {table.occupied ? t('occupied') : t('free')}
          {reservation && ` · ${reservation}`}
        </p>
        <h4>{t('calls')}</h4>
        {table.calls.length ? (
          <ul className="side-list">
            {[...new Set(table.calls)].map((call) => (
              <li key={call} data-kind={call}>
                <span>{t('callLabels')[call]}</span>
                <button
                  type="button"
                  className="dark-button"
                  onClick={() => onAttend?.(call)}
                >
                  {t('attend')}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">{t('noCalls')}</p>
        )}
        <h4>{t('orders')}</h4>
        {table.orders.length ? (
          <ul className="table-orders">
            {table.orders.map((order, index) => (
              <li key={order.id} className="table-order">
                <div className="table-order-head">
                  <span className="table-order-title">
                    {t('orderN')(index + 1)}
                  </span>
                  <Badge variant={order.status}>
                    {t('statuses')[order.status]}
                  </Badge>
                  {order.status === 'enviado' && (
                    <button
                      type="button"
                      className="dark-button"
                      data-tour="servir"
                      onClick={() => onConfirm?.(order.id)}
                    >
                      {t('confirm')}
                    </button>
                  )}
                  {order.status === 'confirmado' && (
                    <button
                      type="button"
                      className="dark-button"
                      data-tour="servir"
                      onClick={() => onServe?.(order.id)}
                    >
                      {t('serve')}
                    </button>
                  )}
                </div>
                <ul className="table-order-lines">
                  {order.lines.map((line) => (
                    <li key={lineKey(line)}>{lineSummary(line, extraName)}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">{t('noOrders')}</p>
        )}
      </div>
      {/* The Cuenta and its action stay pinned at the bottom; long content scrolls above. */}
      <section className="table-detail-bill" aria-label={t('bill')}>
        <h4>{t('bill')}</h4>
        <p className="side-bill-line">
          <span>
            {t('tip')} {table.tipPercent}%
          </span>
          <span>{money(tip)}</span>
        </p>
        {/* The line keeps its place when the bill is not split. */}
        <p
          className="side-bill-line"
          data-hidden={shares.length < 2 || undefined}
        >
          <span>
            {t('splitBill')} {shares.length}
          </span>
          <span>
            {money(shares[0])} {t('each')}
          </span>
        </p>
        <p className="side-total">{money(total)}</p>
        {table.occupied && (
          <button
            type="button"
            className="light-button"
            data-tour="cobrar"
            onClick={onCharge}
          >
            {t('chargeAndFree')}
          </button>
        )}
        {table.occupied && moveTargets && (
          <MoveMenu targets={moveTargets} onMove={onMove} />
        )}
      </section>
    </>
  );
}

/** Empty state of the detail: no table has been chosen yet. */
export function TableDetailEmpty() {
  const t = useT();
  return (
    <div className="sidebar-empty">
      <MousePointerClick size={36} strokeWidth={1.5} aria-hidden="true" />
      <p>{t('pickTable')}</p>
    </div>
  );
}
