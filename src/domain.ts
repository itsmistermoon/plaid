import {
  createJSONStorage,
  persist,
  type StateStorage,
} from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';
import { dishes } from './menu';
import { advanceTour, type Tour, tourSteps } from './tour';

/** What is ordered: a dish with its extras and its kitchen note. */
export interface LineItem {
  dishId: string;
  extras?: string[];
  note?: string;
}
/** A line of the Carrito or of a Pedido. */
export interface Line {
  dishId: string;
  extras: string[];
  note: string;
  qty: number;
}
const dishById = (id: string) => dishes.find((dish) => dish.id === id);
/** Valid extras in Carta order and the note without extra whitespace. */
const normalize = ({ dishId, extras = [], note = '' }: LineItem) => ({
  dishId,
  extras: (dishById(dishId)?.extras ?? [])
    .filter((extra) => extras.includes(extra.id))
    .map((extra) => extra.id),
  note: note.trim(),
});
const sameItem = (a: LineItem, b: LineItem) =>
  a.dishId === b.dishId &&
  a.note === b.note &&
  a.extras?.join() === b.extras?.join();
/** Price of one unit of the line: the dish plus its extras. */
export const unitPrice = ({ dishId, extras = [] }: LineItem) => {
  const dish = dishById(dishId);
  return (
    (dish?.price ?? 0) +
    (dish?.extras ?? [])
      .filter((extra) => extras.includes(extra.id))
      .reduce((sum, extra) => sum + extra.price, 0)
  );
};
export type CallKind = 'pedido' | 'garzón' | 'pago';
export type OrderStatus = 'enviado' | 'confirmado' | 'servido';
interface Order {
  id: string;
  lines: Line[];
  status: OrderStatus;
}
export interface Table {
  number: number;
  occupied: boolean;
  orders: Order[];
  calls: CallKind[];
}
export const cartTotal = (lines: Line[]) =>
  lines.reduce((total, line) => total + unitPrice(line) * line.qty, 0);
export const billTotal = (table: Table) =>
  table.orders.reduce((total, order) => total + cartTotal(order.lines), 0);
/** Mesa 7: the visitor's table, the demo's Comensal. */
export const visitorTable = 7;
/** Mesa 7 within the floor. */
export const findVisitorTable = <T extends { number: number }>(tables: T[]) =>
  tables.find((table) => table.number === visitorTable) as T;
const initialTables = (): Table[] =>
  Array.from({ length: 12 }, (_, index) => ({
    number: index + 1,
    occupied: index + 1 === visitorTable,
    orders: [],
    calls: [],
  }));
interface DemoState {
  view: 'comensal' | 'garzon';
  setView: (view: 'comensal' | 'garzon') => void;
  cart: Line[];
  tables: Table[];
  callWaiter: () => void;
  reset: () => void;
  chargeAndFree: (number: number) => void;
  requestBill: () => void;
  setQty: (item: LineItem, qty: number) => void;
  addToCart: (item: LineItem, qty: number) => void;
  sendOrder: () => void;
  confirmOrder: (table: number, id: string) => void;
  serveOrder: (table: number, id: string) => void;
  attendCall: (table: number, call: CallKind) => void;
  tour: Tour | null;
  /** Starts the tour, resumes it if skipped, or repeats it if finished. */
  startTour: () => void;
  skipTour: () => void;
  endTour: () => void;
}
export const createDemoStore = (storage?: StateStorage) => {
  const store = createStore<DemoState>()(
    persist(
      (set, get) => ({
        tour: null,
        startTour: () =>
          set((state) => {
            const step =
              state.tour && state.tour.step < tourSteps.length
                ? state.tour.step
                : 0;
            return {
              tour: { step: advanceTour(step, state), skipped: false },
            };
          }),
        skipTour: () =>
          set((state) => ({
            tour: state.tour && { ...state.tour, skipped: true },
          })),
        endTour: () => set({ tour: null }),
        view: 'comensal',
        setView: (view) => set({ view }),
        cart: [],
        tables: initialTables(),
        reset: () =>
          set({
            view: 'comensal',
            cart: [],
            tables: initialTables(),
            tour: null,
          }),
        callWaiter: () =>
          set((state) => ({
            tables: state.tables.map((table) =>
              table.number === visitorTable && !table.calls.includes('garzón')
                ? { ...table, calls: [...table.calls, 'garzón'] }
                : table,
            ),
          })),
        chargeAndFree: (number) =>
          set((state) => ({
            tables: state.tables.map((table) =>
              table.number === number
                ? { ...table, occupied: false, orders: [], calls: [] }
                : table,
            ),
            ...(number === visitorTable ? { cart: [] } : {}),
          })),
        requestBill: () =>
          set((state) => ({
            tables: state.tables.map((table) =>
              table.number === visitorTable && !table.calls.includes('pago')
                ? { ...table, calls: [...table.calls, 'pago'] }
                : table,
            ),
          })),
        setQty: (item, qty) =>
          set((state) => {
            const dish = dishById(item.dishId);
            if (!dish || dish.soldOut || !Number.isFinite(qty)) return state;
            const line = { ...normalize(item), qty: Math.floor(qty) };
            const index = state.cart.findIndex((other) =>
              sameItem(other, line),
            );
            if (line.qty <= 0)
              return { cart: state.cart.filter((_, i) => i !== index) };
            if (index < 0) return { cart: [...state.cart, line] };
            return {
              cart: state.cart.map((other, i) => (i === index ? line : other)),
            };
          }),
        addToCart: (item, qty) => {
          const current = get().cart.find((line) =>
            sameItem(line, normalize(item)),
          );
          get().setQty(item, (current?.qty ?? 0) + qty);
        },
        confirmOrder: (number, id) =>
          set((state) => ({
            tables: state.tables.map((table) =>
              table.number === number
                ? {
                    ...table,
                    orders: table.orders.map((order) =>
                      order.id === id && order.status === 'enviado'
                        ? { ...order, status: 'confirmado' }
                        : order,
                    ),
                  }
                : table,
            ),
          })),
        serveOrder: (number, id) =>
          set((state) => ({
            tables: state.tables.map((table) =>
              table.number === number
                ? {
                    ...table,
                    orders: table.orders.map((order) =>
                      order.id === id && order.status === 'confirmado'
                        ? { ...order, status: 'servido' }
                        : order,
                    ),
                  }
                : table,
            ),
          })),
        attendCall: (number, call) =>
          set((state) => ({
            tables: state.tables.map((table) => {
              if (table.number !== number) return table;
              const index = table.calls.indexOf(call);
              return index < 0
                ? table
                : {
                    ...table,
                    calls: table.calls.filter((_, i) => i !== index),
                  };
            }),
          })),
        sendOrder: () =>
          set((state) => {
            const lines = state.cart;
            if (!lines.length) return state;
            const order: Order = {
              id: crypto.randomUUID(),
              lines,
              status: 'enviado',
            };
            return {
              cart: [],
              tables: state.tables.map((table) =>
                table.number === visitorTable
                  ? {
                      ...table,
                      occupied: true,
                      orders: [...table.orders, order],
                      calls: [...table.calls, 'pedido'],
                    }
                  : table,
              ),
            };
          }),
      }),
      {
        name: 'plaid-demo',
        version: 1,
        storage: createJSONStorage(() => storage ?? sessionStorage),
      },
    ),
  );
  // The tour follows the domain: after every change it skips the steps already done.
  store.subscribe((state) => {
    if (!state.tour) return;
    const step = advanceTour(state.tour.step, state);
    if (step !== state.tour.step)
      store.setState({ tour: { ...state.tour, step } });
  });
  return store;
};
