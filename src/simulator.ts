import type { createDemoStore } from './domain';

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
          const order = state.tables[6].orders.find(
            (item) => item.status !== 'servido',
          );
          if (order?.status === 'enviado') state.confirmOrder(7, order.id);
          else if (order?.status === 'confirmado')
            state.serveOrder(7, order.id);
        }
        const filler = state.tables.filter(
          (table) => table.number !== 7 && !table.calls.includes('garzón'),
        );
        const chosen = filler[Math.floor(clock.random() * filler.length)];
        if (chosen)
          store.setState({
            tables: store.getState().tables.map((table) =>
              table.number === chosen.number
                ? {
                    ...table,
                    occupied: true,
                    calls: [...table.calls, 'garzón'],
                  }
                : table,
            ),
          });
        schedule();
      },
      3000 + Math.floor(clock.random() * 2001),
    );
  };
  schedule();
  return () => clock.clearTimeout(timer);
}
