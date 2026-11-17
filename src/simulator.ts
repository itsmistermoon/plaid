import {
  type CallKind,
  type createDemoStore,
  findVisitorTable,
  type Table,
  visitorTable,
} from './domain';

/** Cap on open Llamados at the Mesas de relleno: the floor looks alive without getting saturated. */
const maxFillerCalls = 4;
const fillerKinds: CallKind[] = ['pedido', 'garzón', 'pago'];

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
  const next: Table = !chosen.occupied
    ? { ...chosen, occupied: true, calls: ['pedido'] }
    : first
      ? { ...chosen, occupied: first !== 'pago', calls: rest }
      : {
          ...chosen,
          calls: [fillerKinds[Math.floor(random() * fillerKinds.length)]],
        };
  return tables.map((table) => (table.number === chosen.number ? next : table));
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
        if (state.view === 'comensal') {
          const order = findVisitorTable(state.tables).orders.find(
            (item) => item.status !== 'servido',
          );
          if (order?.status === 'enviado')
            state.confirmOrder(visitorTable, order.id);
          else if (order?.status === 'confirmado')
            state.serveOrder(visitorTable, order.id);
        }
        store.setState({
          tables: fillerStep(store.getState().tables, clock.random),
        });
        schedule();
      },
      3000 + Math.floor(clock.random() * 2001),
    );
  };
  schedule();
  return () => clock.clearTimeout(timer);
}
