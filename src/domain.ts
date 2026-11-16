import {
  createJSONStorage,
  persist,
  type StateStorage,
} from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';
import { dishes } from './menu';
import { advanceTour, type Tour, tourSteps } from './tour';

type Cart = Record<string, number>;
export type CallKind = 'pedido' | 'garzón' | 'pago';
export type OrderStatus = 'enviado' | 'confirmado' | 'servido';
interface Order {
  id: string;
  lines: { dishId: string; qty: number }[];
  status: OrderStatus;
}
interface Table {
  number: number;
  occupied: boolean;
  orders: Order[];
  calls: CallKind[];
}
export const cartTotal = (cart: Cart) =>
  dishes.reduce((total, dish) => total + dish.price * (cart[dish.id] ?? 0), 0);
export const billTotal = (table: Table) =>
  table.orders.reduce(
    (total, order) =>
      total +
      cartTotal(
        Object.fromEntries(order.lines.map((line) => [line.dishId, line.qty])),
      ),
    0,
  );
const initialTables = (): Table[] =>
  Array.from({ length: 12 }, (_, index) => ({
    number: index + 1,
    occupied: index === 6,
    orders: [],
    calls: [],
  }));
interface DemoState {
  view: 'comensal' | 'garzon';
  setView: (view: 'comensal' | 'garzon') => void;
  cart: Cart;
  tables: Table[];
  callWaiter: () => void;
  reset: () => void;
  chargeAndFree: (number: number) => void;
  requestBill: () => void;
  setQty: (id: string, qty: number) => void;
  sendOrder: () => void;
  confirmOrder: (table: number, id: string) => void;
  serveOrder: (table: number, id: string) => void;
  attendCall: (table: number, call: CallKind) => void;
  tour: Tour | null;
  /** Empieza el recorrido, lo retoma si estaba saltado o lo repite si ya terminó. */
  startTour: () => void;
  skipTour: () => void;
  endTour: () => void;
}
export const createDemoStore = (storage?: StateStorage) => {
  const store = createStore<DemoState>()(
    persist(
      (set) => ({
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
        cart: {},
        tables: initialTables(),
        reset: () =>
          set({
            view: 'comensal',
            cart: {},
            tables: initialTables(),
            tour: null,
          }),
        callWaiter: () =>
          set((state) => ({
            tables: state.tables.map((table) =>
              table.number === 7 && !table.calls.includes('garzón')
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
            ...(number === 7 ? { cart: {} } : {}),
          })),
        requestBill: () =>
          set((state) => ({
            tables: state.tables.map((table) =>
              table.number === 7 && !table.calls.includes('pago')
                ? { ...table, calls: [...table.calls, 'pago'] }
                : table,
            ),
          })),
        setQty: (id, qty) =>
          set((state) => {
            const dish = dishes.find((item) => item.id === id);
            if (!dish || dish.soldOut || !Number.isFinite(qty)) return state;
            qty = Math.floor(qty);
            const cart = { ...state.cart };
            if (qty <= 0) delete cart[id];
            else cart[id] = qty;
            return { cart };
          }),
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
            const lines = Object.entries(state.cart).map(([dishId, qty]) => ({
              dishId,
              qty,
            }));
            if (!lines.length) return state;
            const order: Order = {
              id: crypto.randomUUID(),
              lines,
              status: 'enviado',
            };
            return {
              cart: {},
              tables: state.tables.map((table) =>
                table.number === 7
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
        storage: createJSONStorage(() => storage ?? sessionStorage),
      },
    ),
  );
  // El recorrido sigue al dominio: tras cada cambio salta los pasos ya cumplidos.
  store.subscribe((state) => {
    if (!state.tour) return;
    const step = advanceTour(state.tour.step, state);
    if (step !== state.tour.step)
      store.setState({ tour: { ...state.tour, step } });
  });
  return store;
};
