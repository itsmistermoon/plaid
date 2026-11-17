import {
  createJSONStorage,
  persist,
  type StateStorage,
} from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';
import { dishes } from './menu';
import { advanceTour, type Tour, type TourStep, tourSteps } from './tour';

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
export interface Order {
  id: string;
  lines: Line[];
  status: OrderStatus;
}
export interface Table {
  number: number;
  occupied: boolean;
  orders: Order[];
  calls: CallKind[];
  /** Tip chosen on the Cuenta, as a percent of the bill. */
  tipPercent: number;
  /** People the Cuenta is split between: 1 is no split. */
  people: number;
}
/** What a Mesa starts with, and goes back to once it is charged. */
const freshBill = { tipPercent: 10, people: 1 };
export const cartTotal = (lines: Line[]) =>
  lines.reduce((total, line) => total + unitPrice(line) * line.qty, 0);
export const billTotal = (table: Table) =>
  table.orders.reduce((total, order) => total + cartTotal(order.lines), 0);
/** Adds a usual request to the kitchen note, or removes it if it is there. */
export const toggleNotePreset = (note: string, preset: string) => {
  const phrases = note
    .split(',')
    .map((phrase) => phrase.trim())
    .filter(Boolean);
  return (
    phrases.includes(preset)
      ? phrases.filter((phrase) => phrase !== preset)
      : [...phrases, preset]
  ).join(', ');
};
/** The tip for a bill, rounded to the peso. */
export const tipAmount = (subtotal: number, percent: number) =>
  Math.round((subtotal * percent) / 100);
/**
 * What each person pays when a bill is split evenly: whole pesos that add up
 * to the total, the first ones paying the peso that does not divide.
 */
export const splitShares = (total: number, people: number) =>
  Array.from(
    { length: people },
    (_, index) => Math.floor(total / people) + (index < total % people ? 1 : 0),
  );
/** What a Mesa pays: the bill, its tip, the total and each person's share. */
export const tableBill = (table: Table) => {
  const subtotal = billTotal(table);
  const tip = tipAmount(subtotal, table.tipPercent);
  const total = subtotal + tip;
  return {
    subtotal,
    tip,
    total,
    shares: splitShares(total, table.people),
  };
};
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
    ...freshBill,
  }));
/** A table held for a party: a day within the book's week, at one of its hours. */
export interface Reservation {
  id: string;
  table: number;
  /** Days from today: 0 is today, 1 is tomorrow, up to `reservationDays - 1`. */
  day: number;
  time: string;
  name: string;
}
/** How many days, starting today, the reservation book offers. */
export const reservationDays = 7;
/** The hours the reservation book offers. */
export const reservationSlots = ['13:00', '14:00', '20:00', '21:00', '22:00'];
const initialReservations = (): Reservation[] => [
  { id: 'r1', table: 11, day: 0, time: '20:00', name: 'Rojas' },
  { id: 'r2', table: 4, day: 0, time: '21:00', name: 'Soto' },
  { id: 'r3', table: 2, day: 1, time: '13:00', name: 'Vidal' },
];
/** Whether a Mesa is already held at that day and hour. */
export const isReserved = (
  reservations: Reservation[],
  { table, day, time }: Omit<Reservation, 'id' | 'name'>,
) =>
  reservations.some(
    (item) => item.table === table && item.day === day && item.time === time,
  );
/** Today's first reservation of a Mesa, if it has one. */
export const reservationToday = (reservations: Reservation[], table: number) =>
  reservations
    .filter((item) => item.table === table && item.day === 0)
    .sort((a, b) => a.time.localeCompare(b.time))[0];
/** Whose screen the visitor is looking at. */
export const views = ['comensal', 'garzon', 'cocina'] as const;
export type View = (typeof views)[number];
/** Pedidos of the whole floor that the Cocina still has to serve. */
export const pendingOrders = (tables: Table[]) =>
  tables.reduce(
    (sum, table) =>
      sum + table.orders.filter((order) => order.status !== 'servido').length,
    0,
  );
interface DemoState {
  view: View;
  setView: (view: View) => void;
  cart: Line[];
  tables: Table[];
  callWaiter: () => void;
  reset: () => void;
  chargeAndFree: (number: number) => void;
  /** The Comensal's tip and split, shared with the Garzón's view of the Mesa. */
  setTipPercent: (percent: number) => void;
  setPeople: (people: number) => void;
  requestBill: () => void;
  setQty: (item: LineItem, qty: number) => void;
  addToCart: (item: LineItem, qty: number) => void;
  sendOrder: () => void;
  confirmOrder: (table: number, id: string) => void;
  serveOrder: (table: number, id: string) => void;
  attendCall: (table: number, call: CallKind) => void;
  /**
   * Moves a Mesa's Pedidos and Llamados to another one and frees the origin:
   * a free destination takes them over, an occupied one adds them to its own.
   */
  moveTable: (from: number, to: number) => void;
  /** Puts the given Mesas back as they were, to undo a move. */
  restoreTables: (snapshot: Table[]) => void;
  reservations: Reservation[];
  /** Writes a reservation in the book, unless the Mesa is taken at that hour. */
  reserve: (reservation: Omit<Reservation, 'id'>) => void;
  cancelReservation: (id: string) => void;
  tour: Tour | null;
  /** Starts the tour, resumes it if skipped, or repeats it if finished. */
  startTour: () => void;
  skipTour: () => void;
  /** Marks the step about a button as tried, so the tour moves on. */
  seeTour: (step: TourStep) => void;
  endTour: () => void;
}
export const createDemoStore = (storage?: StateStorage) => {
  const store = createStore<DemoState>()(
    persist(
      (set, get) => ({
        tour: null,
        startTour: () =>
          set((state) => {
            const resuming = state.tour && state.tour.step < tourSteps.length;
            const tour = {
              step: resuming ? (state.tour?.step ?? 0) : 0,
              skipped: false,
              seen: resuming ? (state.tour?.seen ?? []) : [],
            };
            return {
              tour: {
                ...tour,
                step: advanceTour(tour.step, { ...state, tour }),
              },
            };
          }),
        skipTour: () =>
          set((state) => ({
            tour: state.tour && { ...state.tour, skipped: true },
          })),
        seeTour: (step) =>
          set((state) =>
            !state.tour || state.tour.seen.includes(step)
              ? state
              : { tour: { ...state.tour, seen: [...state.tour.seen, step] } },
          ),
        endTour: () => set({ tour: null }),
        reservations: initialReservations(),
        reserve: (reservation) =>
          set((state) =>
            !reservation.name.trim() ||
            isReserved(state.reservations, reservation)
              ? state
              : {
                  reservations: [
                    ...state.reservations,
                    {
                      ...reservation,
                      name: reservation.name.trim(),
                      id: crypto.randomUUID(),
                    },
                  ],
                },
          ),
        cancelReservation: (id) =>
          set((state) => ({
            reservations: state.reservations.filter((item) => item.id !== id),
          })),
        view: 'comensal',
        setView: (view) => set({ view }),
        cart: [],
        tables: initialTables(),
        reset: () =>
          set({
            view: 'comensal',
            cart: [],
            tables: initialTables(),
            reservations: initialReservations(),
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
                ? {
                    ...table,
                    occupied: false,
                    orders: [],
                    calls: [],
                    ...freshBill,
                  }
                : table,
            ),
            ...(number === visitorTable ? { cart: [] } : {}),
          })),
        setTipPercent: (tipPercent) =>
          set((state) => ({
            tables: state.tables.map((table) =>
              table.number === visitorTable ? { ...table, tipPercent } : table,
            ),
          })),
        setPeople: (people) =>
          set((state) => ({
            tables: state.tables.map((table) =>
              table.number === visitorTable ? { ...table, people } : table,
            ),
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
        moveTable: (from, to) =>
          set((state) => {
            const origin = state.tables.find((table) => table.number === from);
            if (!origin?.occupied || from === to) return state;
            return {
              tables: state.tables.map((table) =>
                table.number === from
                  ? {
                      ...table,
                      occupied: false,
                      orders: [],
                      calls: [],
                      ...freshBill,
                    }
                  : table.number === to
                    ? {
                        ...table,
                        ...(table.occupied
                          ? {}
                          : {
                              tipPercent: origin.tipPercent,
                              people: origin.people,
                            }),
                        occupied: true,
                        orders: [...table.orders, ...origin.orders],
                        calls: [...new Set([...table.calls, ...origin.calls])],
                      }
                    : table,
              ),
            };
          }),
        restoreTables: (snapshot) =>
          set((state) => ({
            tables: state.tables.map(
              (table) =>
                snapshot.find((saved) => saved.number === table.number) ??
                table,
            ),
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
        version: 3,
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
