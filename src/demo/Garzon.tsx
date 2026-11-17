import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@ui-sdk/react/dialog';
import { type ReactNode, useRef, useState } from 'react';
import { useStore } from 'zustand';
import { Navbar, PendingCalls } from '../components/Navbar';
import { TableButton } from '../components/Table';
import { TableDetail, TableDetailEmpty } from '../components/TableDetail';
import { type Table as Mesa, visitorTable } from '../domain';
import { useT } from '../i18n';
import { store } from './store';
import { useMedia } from './useMedia';

/** A table's detail wired to the demo state. */
function StoreTableDetail({
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
    />
  );
}

/** On phones the detail is a bottom sheet: a dialog that traps focus and closes with Esc. */
function TableSheet({
  table,
  onClose,
  opener,
}: {
  table: Mesa | undefined;
  onClose: () => void;
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
        end={<PendingCalls>{t('pendingCalls')(pending)}</PendingCalls>}
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
              <StoreTableDetail
                table={table}
                onCharged={close}
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
