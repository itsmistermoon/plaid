import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@ui-sdk/react/dialog';
import {
  Armchair,
  Check,
  ConciergeBell,
  ReceiptText,
  Utensils,
} from 'lucide-react';
import { type ReactNode, useRef, useState } from 'react';
import { useStore } from 'zustand';
import { CommandPalette } from '../components/CommandPalette';
import { Navbar, PendingCalls } from '../components/Navbar';
import { showOrderToast } from '../components/OrderToast';
import { ReservationBookButton } from '../components/ReservationBook';
import { TableButton } from '../components/Table';
import { TableDetail, TableDetailEmpty } from '../components/TableDetail';
import {
  type CallKind,
  type Table as Mesa,
  reservationToday,
  visitorTable,
} from '../domain';
import { useT } from '../i18n';
import { store } from './store';
import { useMedia } from './useMedia';

/** A table's detail wired to the demo state. */
function StoreTableDetail({
  table,
  heading,
  onCharged,
  onMoved,
}: {
  table: Mesa;
  heading: ReactNode;
  onCharged: () => void;
  /** The detail follows the Pedidos to their new Mesa, and back on undo. */
  onMoved: (to: number) => void;
}) {
  const {
    tables,
    confirmOrder,
    serveOrder,
    attendCall,
    chargeAndFree,
    moveTable,
    restoreTables,
    reservations,
  } = useStore(store);
  const booked = reservationToday(reservations, table.number);
  const t = useT();
  const move = (to: number) => {
    const target = tables.find((item) => item.number === to);
    if (!target) return;
    moveTable(table.number, to);
    onMoved(to);
    showOrderToast(
      'confirmado',
      t(target.occupied ? 'merged' : 'transferred')(table.number, to),
      {
        label: t('undo'),
        onAction: () => {
          restoreTables([table, target]);
          onMoved(table.number);
        },
      },
    );
  };
  return (
    <TableDetail
      table={table}
      heading={heading}
      onAttend={(call) => attendCall(table.number, call)}
      onConfirm={(id) => confirmOrder(table.number, id)}
      onServe={(id) => serveOrder(table.number, id)}
      onCharge={() => {
        chargeAndFree(table.number);
        onCharged();
      }}
      reservation={booked && t('reservedToday')(booked.time, booked.name)}
      moveTargets={tables.filter((item) => item.number !== table.number)}
      onMove={move}
    />
  );
}

/** On phones the detail is a bottom sheet: a dialog that traps focus and closes with Esc. */
function TableSheet({
  table,
  onClose,
  onMoved,
  opener,
}: {
  table: Mesa | undefined;
  onClose: () => void;
  onMoved: (to: number) => void;
  /** The grid table that opened the sheet: focus returns there when it closes. */
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
          <StoreTableDetail
            table={table}
            onCharged={onClose}
            onMoved={onMoved}
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
  const { tables, reservations, reserve, cancelReservation, seeTour } =
    useStore(store);
  const t = useT();
  const phone = useMedia('(max-width: 760px)');
  const [selected, setSelected] = useState<number | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const table = tables.find((item) => item.number === selected);
  const pending = tables.reduce((sum, item) => sum + item.calls.length, 0);
  const close = () => setSelected(null);
  const { attendCall, confirmOrder, serveOrder, chargeAndFree } =
    store.getState();
  // What the palette offers: first what is waiting on the floor, then every Mesa.
  const name = (item: Mesa) => t('tableN')(item.number);
  const actions = tables.flatMap((item) => [
    ...[...new Set(item.calls)].map((call) => ({
      value: `attend:${item.number}:${call}`,
      label: `${name(item)} · ${t('attend')} · ${t('callLabels')[call]}`,
      icon: <ConciergeBell />,
    })),
    ...item.orders.flatMap((order, index) =>
      order.status === 'servido'
        ? []
        : [
            {
              value: `${order.status}:${item.number}:${order.id}`,
              label: `${name(item)} · ${t(order.status === 'enviado' ? 'confirm' : 'serve')} · ${t('orderN')(index + 1)}`,
              icon: order.status === 'enviado' ? <Check /> : <Utensils />,
            },
          ],
    ),
    ...(item.occupied
      ? [
          {
            value: `charge:${item.number}`,
            label: `${name(item)} · ${t('chargeAndFree')}`,
            icon: <ReceiptText />,
          },
        ]
      : []),
  ]);
  const run = (value: string) => {
    const [action, number, detail] = value.split(':');
    const mesa = Number(number);
    if (action === 'attend') attendCall(mesa, detail as CallKind);
    if (action === 'enviado') confirmOrder(mesa, detail);
    if (action === 'confirmado') serveOrder(mesa, detail);
    if (action === 'charge') chargeAndFree(mesa);
    setSelected(action === 'charge' ? null : mesa);
  };
  return (
    <div className="screen" data-surface="garzon">
      <Navbar
        start={
          <div className="navbar-tools">
            <CommandPalette
              title={t('paletteTitle')}
              placeholder={t('paletteHint')}
              groups={[
                { label: t('paletteActions'), items: actions },
                {
                  label: t('tables'),
                  items: tables.map((item) => ({
                    value: `open:${item.number}`,
                    label: `${name(item)} · ${t(item.occupied ? 'occupied' : 'free')}`,
                    icon: <Armchair />,
                  })),
                },
              ]}
              onRun={run}
              onOpen={() => seeTour('buscar')}
            />
            <ReservationBookButton
              reservations={reservations}
              tables={tables.map((item) => item.number)}
              onReserve={reserve}
              onCancel={cancelReservation}
              onOpen={() => seeTour('reservar')}
            />
          </div>
        }
        title={t('floor')}
        end={<PendingCalls>{t('pendingCalls')(pending)}</PendingCalls>}
      />
      <div className="screen-body">
        {phone ? (
          <TableSheet
            table={table}
            onClose={close}
            onMoved={setSelected}
            opener={() => opener.current}
          />
        ) : (
          <aside
            className="sidebar table-detail"
            aria-label={t('tableDetail')}
            data-open={table ? true : undefined}
          >
            {table ? (
              <StoreTableDetail
                table={table}
                onCharged={close}
                onMoved={setSelected}
                heading={
                  <div className="table-detail-head">
                    <h3>{t('tableN')(table.number)}</h3>
                  </div>
                }
              />
            ) : (
              <TableDetailEmpty />
            )}
          </aside>
        )}
        <div className="board">
          <ul className="tables" aria-label={t('tables')}>
            {tables.map((item) => (
              <li key={item.number}>
                <TableButton
                  number={item.number}
                  occupied={item.occupied}
                  calls={item.calls}
                  reserved={reservationToday(reservations, item.number)?.time}
                  pressed={selected === item.number}
                  tour={
                    item.number === visitorTable ? 'servir cobrar' : undefined
                  }
                  onClick={(event) => {
                    opener.current = event.currentTarget;
                    setSelected(item.number);
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
