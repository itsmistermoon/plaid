import {
  type CallKind,
  type createDemoStore,
  findVisitorTable,
  type Order,
  type Table,
  visitorTable,
} from './domain';
import { dishes } from './menu';

/** Cap on open Llamados at the Mesas de relleno: the floor looks alive without getting saturated. */
const maxFillerCalls = 4;
/** Cap on the Pedidos of a Mesa de relleno: the Cocina's rail stays readable. */
const maxFillerOrders = 2;
const fillerKinds: CallKind[] = ['pedido', 'garzón', 'pago'];
const orderable = dishes.filter((dish) => !dish.soldOut);

/** A Pedido of a Mesa de relleno: one or two random dishes. */
const fillerOrder = (random: () => number): Order => {
  const pick = () => orderable[Math.floor(random() * orderable.length)].id;
  return {
    id: crypto.randomUUID(),
    status: 'enviado',
    lines: [...new Set([pick(), pick()])].map((dishId) => ({
      dishId,
      qty: 1 + Math.floor(random() * 2),
      extras: [],
      note: '',
    })),
  };
};
const withOrder = (table: Table, random: () => number): Table =>
  table.orders.length < maxFillerOrders
    ? { ...table, orders: [...table.orders, fillerOrder(random)] }
    : table;

/**
 * One step of the Mesas de relleno on a random table: a free table becomes
 * occupied and sends a Pedido; one with Llamados has its oldest attended
 * (and is freed if it was the payment); an occupied one without Llamados
 * sends a new one of any kind. With the floor at the cap, only Llamados are attended.
 */
export function fillerStep(tables: Table[], random: () => number): Table[] {
  const filler = tables.filter((table) => table.number !== visitorTable);
  const open = filler.reduce((sum, table) => sum + table.calls.length, 0);
  const pool =
    open >= maxFillerCalls
      ? filler.filter((table) => table.calls.length)
      : filler;
  const chosen = pool[Math.floor(random() * pool.length)];
  if (!chosen) return tables;
  const [first, ...rest] = chosen.calls;
  let next: Table;
  if (!chosen.occupied)
    next = withOrder(
      { ...chosen, occupied: true, calls: ['pedido'], orders: [] },
      random,
    );
  else if (first === 'pago')
    next = { ...chosen, occupied: false, calls: [], orders: [] };
  else if (first) next = { ...chosen, calls: rest };
  else {
    const kind = fillerKinds[Math.floor(random() * fillerKinds.length)];
    next = { ...chosen, calls: [kind] };
    if (kind === 'pedido') next = withOrder(next, random);
  }
  return tables.map((table) => (table.number === chosen.number ? next : table));
}

/**
 * One step of the simulated Cocina: the first Pedido of a Mesa de relleno
 * that is not served yet moves one status forward.
 */
export function kitchenStep(tables: Table[]): Table[] {
  const table = tables.find(
    (item) =>
      item.number !== visitorTable &&
      item.orders.some((order) => order.status !== 'servido'),
  );
  const pending = table?.orders.find((order) => order.status !== 'servido');
  if (!table || !pending) return tables;
  return tables.map((item) =>
    item === table
      ? {
          ...item,
          orders: item.orders.map((order) =>
            order === pending
              ? {
                  ...order,
                  status: order.status === 'enviado' ? 'confirmado' : 'servido',
                }
              : order,
          ),
        }
      : item,
  );
}

export function startSimulator(
  store: ReturnType<typeof createDemoStore>,
  clock: {
    random: () => number;
    setTimeout: typeof setTimeout;
    clearTimeout: typeof clearTimeout;
  },
) {
  let timer: ReturnType<typeof setTimeout>;
  const schedule = () => {
    timer = clock.setTimeout(
      () => {
        const state = store.getState();
        // The Garzón simulado works Mesa 7 only while the visitor is the Comensal.
        if (state.view === 'comensal') {
          const order = findVisitorTable(state.tables).orders.find(
            (item) => item.status !== 'servido',
          );
          if (order?.status === 'enviado')
            state.confirmOrder(visitorTable, order.id);
          else if (order?.status === 'confirmado')
            state.serveOrder(visitorTable, order.id);
        }
        // In the Cocina view the visitor moves the Pedidos of every Mesa.
        const tables = fillerStep(store.getState().tables, clock.random);
        store.setState({
          tables: state.view === 'cocina' ? tables : kitchenStep(tables),
        });
        schedule();
      },
      3000 + Math.floor(clock.random() * 2001),
    );
  };
  schedule();
  return () => clock.clearTimeout(timer);
}
