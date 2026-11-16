import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@ui-sdk/react/dialog';
import { type ReactNode, useRef, useState } from 'react';
import { useStore } from 'zustand';
import { Navbar } from '../components/Navbar';
import { Table } from '../components/Table';
import { billTotal, type Table as Mesa, visitorTable } from '../domain';
import { money } from '../format';
import { useExtraName, useT } from '../i18n';
import { lineKey, lineSummary } from './lines';
import { store } from './store';
import { useMedia } from './useMedia';

/** Lo que el garzón ve y hace sobre una mesa: llamados, pedidos y cuenta. */
function TableDetail({
  table,
  heading,
  onCharged,
}: {
  table: Mesa;
  heading: ReactNode;
  onCharged: () => void;
}) {
  const { confirmOrder, serveOrder, attendCall, chargeAndFree } =
    useStore(store);
  const t = useT();
  const extraName = useExtraName();
  return (
    <>
      {heading}
      <p className="muted">{table.occupied ? t('occupied') : t('free')}</p>
      <h4>{t('calls')}</h4>
      {table.calls.length ? (
        <ul className="side-list">
          {[...new Set(table.calls)].map((call) => (
            <li key={call} data-kind={call}>
              <span>{t('callLabels')[call]}</span>
              <button
                type="button"
                className="dark-button"
                onClick={() => attendCall(table.number, call)}
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
        <ul className="side-list">
          {table.orders.map((order, index) => (
            <li key={order.id}>
              <span>
                {t('orderN')(index + 1)}
                {order.lines.map((line) => (
                  <small key={lineKey(line)}>
                    {lineSummary(line, extraName)}
                  </small>
                ))}
                <small>{t('statuses')[order.status]}</small>
              </span>
              {order.status === 'enviado' && (
                <button
                  type="button"
                  className="dark-button"
                  data-tour="servir"
                  onClick={() => confirmOrder(table.number, order.id)}
                >
                  {t('confirm')}
                </button>
              )}
              {order.status === 'confirmado' && (
                <button
                  type="button"
                  className="dark-button"
                  data-tour="servir"
                  onClick={() => serveOrder(table.number, order.id)}
                >
                  {t('serve')}
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted">{t('noOrders')}</p>
      )}
      <h4>{t('bill')}</h4>
      <p className="side-total">{money(billTotal(table))}</p>
      {table.occupied && (
        <button
          type="button"
          className="light-button"
          data-tour="cobrar"
          onClick={() => {
            chargeAndFree(table.number);
            onCharged();
          }}
        >
          {t('chargeAndFree')}
        </button>
      )}
    </>
  );
}

/** En el teléfono el detalle es una hoja inferior: un diálogo que atrapa el foco y se cierra con Esc. */
function TableSheet({
  table,
  onClose,
  opener,
}: {
  table: Mesa | undefined;
  onClose: () => void;
  /** La mesa de la grilla que abrió la hoja: ahí vuelve el foco al cerrarla. */
  opener: () => HTMLElement | null;
}) {
  const t = useT();
  return (
    <Dialog
      open={!!table}
      modal="trap-focus"
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent
        className="sidebar table-detail"
        data-open
        finalFocus={opener}
        render={<aside />}
      >
        {table && (
          <TableDetail
            table={table}
            onCharged={onClose}
            heading={
              <div className="table-detail-head">
                <DialogTitle render={(props) => <h3 {...props} />}>
                  {t('tableN')(table.number)}
                </DialogTitle>
                <DialogClose className="dark-button mobile-only">
                  {t('closeDetail')}
                </DialogClose>
              </div>
            }
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export function Garzon() {
  const tables = useStore(store, (state) => state.tables);
  const t = useT();
  const phone = useMedia('(max-width: 760px)');
  const [selected, setSelected] = useState<number | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const table = tables.find((item) => item.number === selected);
  const pending = tables.reduce((sum, item) => sum + item.calls.length, 0);
  const close = () => setSelected(null);
  return (
    <div className="screen" data-surface="garzon">
      <Navbar
        title={t('floor')}
        end={
          <span className="pending" role="status">
            {t('pendingCalls')(pending)}
          </span>
        }
      />
      <div className="screen-body">
        {phone ? (
          <TableSheet
            table={table}
            onClose={close}
            opener={() => opener.current}
          />
        ) : (
          <aside
            className="sidebar table-detail"
            aria-label={t('tableDetail')}
            data-open={table ? true : undefined}
          >
            {table ? (
              <TableDetail
                table={table}
                onCharged={close}
                heading={
                  <div className="table-detail-head">
                    <h3>{t('tableN')(table.number)}</h3>
                  </div>
                }
              />
            ) : (
              <p className="muted">{t('pickTable')}</p>
            )}
          </aside>
        )}
        <div className="board">
          <ul className="tables" aria-label={t('tables')}>
            {tables.map((item) => (
              <li key={item.number}>
                <button
                  className="table-button"
                  data-occupied={item.occupied}
                  type="button"
                  aria-pressed={selected === item.number}
                  data-tour={
                    item.number === visitorTable ? 'servir cobrar' : undefined
                  }
                  onClick={(event) => {
                    opener.current = event.currentTarget;
                    setSelected(item.number);
                  }}
                >
                  <Table
                    number={item.number}
                    occupied={item.occupied}
                    calls={item.calls}
                  />
                  <span className="sr-only">
                    {t('tableSummary')(item.number, item.occupied)}
                    {item.calls.length
                      ? `, ${t('callsSummary')}: ${[...new Set(item.calls)]
                          .map((call) => t('callLabels')[call])
                          .join(', ')}`
                      : ''}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
