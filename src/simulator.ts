import {
  type CallKind,
  type createDemoStore,
  findVisitorTable,
  type Table,
  visitorTable,
} from './domain';

/** Tope de llamados abiertos en las mesas de relleno: la sala se ve viva sin saturarse. */
const maxFillerCalls = 4;
const fillerKinds: CallKind[] = ['pedido', 'garzón', 'pago'];

/**
 * Un paso de las mesas de relleno sobre una mesa al azar:
 * una mesa libre se ocupa y manda un pedido; una con llamados ve atendido el
 * más antiguo (y se libera si era el pago); una ocupada sin llamados manda uno
 * nuevo de cualquier tipo. Con la sala al tope solo se atienden llamados.
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
