import { useStore } from 'zustand';
import { Navbar, PendingCalls } from '../components/Navbar';
import { KitchenTicket, TicketRail } from '../components/TicketRail';
import { type OrderStatus, pendingOrders } from '../domain';
import { useT } from '../i18n';
import { store } from './store';

const statuses: OrderStatus[] = ['enviado', 'confirmado', 'servido'];

/** The Cocina: every Pedido of the floor on a rail per status. */
export function Cocina() {
  const { tables, confirmOrder, serveOrder } = useStore(store);
  const t = useT();
  const tickets = tables.flatMap((table) =>
    table.orders.map((order, index) => ({
      table: table.number,
      number: index + 1,
      order,
    })),
  );
  return (
    <div className="screen" data-surface="cocina">
      <Navbar
        title={t('kitchen')}
        end={
          <PendingCalls>
            {t('pendingTickets')(pendingOrders(tables))}
          </PendingCalls>
        }
      />
      <div className="board kitchen">
        {statuses.map((status) => {
          const hanging = tickets.filter(
            (ticket) => ticket.order.status === status,
          );
          return (
            <TicketRail key={status} status={status} count={hanging.length}>
              {hanging.map(({ table, number, order }) => (
                <KitchenTicket
                  key={order.id}
                  table={table}
                  number={number}
                  order={order}
                  onAdvance={() =>
                    (status === 'enviado' ? confirmOrder : serveOrder)(
                      table,
                      order.id,
                    )
                  }
                />
              ))}
            </TicketRail>
          );
        })}
      </div>
    </div>
  );
}
