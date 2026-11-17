import { type ReactNode, useId } from 'react';
import { lineKey, lineSummary } from '../demo/lines';
import type { Order, OrderStatus } from '../domain';
import { useExtraName, useT } from '../i18n';
import { Badge } from './Badge';

/**
 * A rail of the Cocina: the Pedidos in one status hang from it as tickets,
 * in a row that scrolls sideways when they do not fit.
 */
export function TicketRail({
  status,
  count,
  children,
}: {
  status: OrderStatus;
  count: number;
  children: ReactNode;
}) {
  const t = useT();
  const id = useId();
  return (
    <section className="rail" aria-labelledby={id}>
      <h3 className="rail-title" id={id}>
        {t('statuses')[status]}
        <Badge variant={status}>{count}</Badge>
      </h3>
      <span className="rail-bar" aria-hidden="true" />
      {count ? (
        <ul className="rail-tickets">{children}</ul>
      ) : (
        <p className="muted rail-empty">{t('noTickets')}</p>
      )}
    </section>
  );
}

/** A Pedido as the Cocina sees it: its Mesa, its lines and the next step. */
export function KitchenTicket({
  table,
  number,
  order,
  onAdvance,
}: {
  table: number;
  /** Position of the Pedido within its Mesa, from 1. */
  number: number;
  order: Order;
  onAdvance?: () => void;
}) {
  const t = useT();
  const extraName = useExtraName();
  const action =
    order.status === 'enviado'
      ? t('confirm')
      : order.status === 'confirmado'
        ? t('serve')
        : null;
  return (
    <li className="ticket" data-status={order.status}>
      <p className="ticket-head">
        <strong>{t('tableN')(table)}</strong>
        <span>{t('orderN')(number)}</span>
      </p>
      <ul className="ticket-lines">
        {order.lines.map((line) => (
          <li key={lineKey(line)}>{lineSummary(line, extraName)}</li>
        ))}
      </ul>
      {action ? (
        <button
          type="button"
          className="light-button"
          aria-label={t('ticketAction')(action, table, number)}
          onClick={onAdvance}
        >
          {action}
        </button>
      ) : (
        <p className="ticket-done">
          <Badge variant="servido">{t('statuses').servido}</Badge>
        </p>
      )}
    </li>
  );
}
