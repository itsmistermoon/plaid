import { afterEach, beforeEach, expect, it, vi } from 'vitest';

beforeEach(() => sessionStorage.clear());

import { billTotal, cartTotal, createDemoStore, tipAmount } from './domain';
import { startSimulator } from './simulator';

it('actualiza el carrito y su total al cambiar cantidades', () => {
  const store = createDemoStore();
  store.getState().setQty({ dishId: 'chacarero' }, 2);
  store.getState().setQty({ dishId: 'empanada' }, 1);
  expect(cartTotal(store.getState().cart)).toBe(16700);
  store.getState().setQty({ dishId: 'chacarero' }, 0);
  expect(cartTotal(store.getState().cart)).toBe(2900);
});

it('no agrega un plato agotado al carrito', () => {
  const store = createDemoStore();
  store.getState().setQty({ dishId: 'chemilico' }, 1);
  expect(store.getState().cart).toEqual([]);
});

it('los agregados suman su precio a cada unidad', () => {
  const store = createDemoStore();
  store
    .getState()
    .addToCart({ dishId: 'chacarero', extras: ['palta', 'queso'] }, 2);
  expect(cartTotal(store.getState().cart)).toBe((6900 + 1200 + 900) * 2);
});

it('separa en líneas distintas el mismo plato con otros agregados o nota', () => {
  const store = createDemoStore();
  const { addToCart } = store.getState();
  addToCart({ dishId: 'chacarero' }, 1);
  addToCart({ dishId: 'chacarero', extras: ['palta'] }, 1);
  addToCart({ dishId: 'chacarero', note: 'sin ají' }, 1);
  addToCart({ dishId: 'chacarero', extras: ['palta'] }, 2);
  expect(store.getState().cart).toEqual([
    { dishId: 'chacarero', extras: [], note: '', qty: 1 },
    { dishId: 'chacarero', extras: ['palta'], note: '', qty: 3 },
    { dishId: 'chacarero', extras: [], note: 'sin ají', qty: 1 },
  ]);
});

it('normaliza agregados y nota para reconocer la misma línea', () => {
  const store = createDemoStore();
  const { addToCart } = store.getState();
  addToCart(
    { dishId: 'italiano', extras: ['huevo', 'palta'], note: ' poco pan ' },
    1,
  );
  addToCart(
    {
      dishId: 'italiano',
      extras: ['palta', 'huevo', 'nada'],
      note: 'poco pan',
    },
    1,
  );
  expect(store.getState().cart).toEqual([
    {
      dishId: 'italiano',
      extras: ['palta', 'huevo'],
      note: 'poco pan',
      qty: 2,
    },
  ]);
});

it('el pedido conserva los agregados y la nota de cada línea', () => {
  const store = createDemoStore();
  store
    .getState()
    .addToCart({ dishId: 'lomo', extras: ['huevo'], note: 'bien cocido' }, 1);
  store.getState().sendOrder();
  const table = store.getState().tables[6];
  expect(table.orders[0].lines).toEqual([
    { dishId: 'lomo', extras: ['huevo'], note: 'bien cocido', qty: 1 },
  ]);
  expect(billTotal(table)).toBe(13400 + 1000);
});

it('envía el carrito como pedido y llamado de la Mesa 7', () => {
  const store = createDemoStore();
  store.getState().setQty({ dishId: 'chacarero' }, 2);
  store.getState().sendOrder();
  const state = store.getState();
  expect(state.cart).toEqual([]);
  expect(state.tables[6].orders).toMatchObject([
    { status: 'enviado', lines: [{ dishId: 'chacarero', qty: 2 }] },
  ]);
  expect(state.tables[6].calls).toEqual(['pedido']);
});

it('permite al garzón confirmar, servir y atender el llamado', () => {
  const store = createDemoStore();
  store.getState().setQty({ dishId: 'empanada' }, 1);
  store.getState().sendOrder();
  const id = store.getState().tables[6].orders[0].id;
  store.getState().confirmOrder(7, id);
  expect(store.getState().tables[6].orders[0].status).toBe('confirmado');
  store.getState().serveOrder(7, id);
  store.getState().attendCall(7, 'pedido');
  expect(store.getState().tables[6].orders[0].status).toBe('servido');
  expect(store.getState().tables[6].calls).toEqual([]);
});

it('comparte la vista activa y conserva el pedido al alternarla', () => {
  const store = createDemoStore();
  store.getState().setQty({ dishId: 'empanada' }, 1);
  store.getState().sendOrder();
  store.getState().setView('garzon');
  expect(store.getState().view).toBe('garzon');
  expect(store.getState().tables[6].calls).toEqual(['pedido']);
});

it('recupera el pedido al crear el store con la misma sesión', () => {
  let saved = '';
  const storage = {
    getItem: () => saved || null,
    setItem: (_key: string, value: string) => {
      saved = value;
    },
    removeItem: () => {
      saved = '';
    },
  };
  const first = createDemoStore(storage);
  first.getState().setQty({ dishId: 'empanada' }, 1);
  first.getState().sendOrder();
  const second = createDemoStore(storage);
  expect(second.getState().tables[6].calls).toEqual(['pedido']);
});

it('suma los pedidos y registra el llamado de pago', () => {
  const store = createDemoStore();
  store.getState().setQty({ dishId: 'empanada' }, 2);
  store.getState().sendOrder();
  store.getState().setQty({ dishId: 'chacarero' }, 1);
  store.getState().sendOrder();
  store.getState().requestBill();
  expect(billTotal(store.getState().tables[6])).toBe(12700);
  expect(store.getState().tables[6].calls).toContain('pago');
});

it('cobra y libera la mesa, borrando pedidos y llamados', () => {
  const store = createDemoStore();
  store.getState().setQty({ dishId: 'empanada' }, 1);
  store.getState().sendOrder();
  store.getState().requestBill();
  store.getState().chargeAndFree(7);
  expect(store.getState().tables[6]).toMatchObject({
    occupied: false,
    orders: [],
    calls: [],
  });
});

it('llama al garzón y reinicia toda la sesión', () => {
  const store = createDemoStore();
  store.getState().callWaiter();
  expect(store.getState().tables[6].calls).toContain('garzón');
  store.getState().setQty({ dishId: 'empanada' }, 2);
  store.getState().setView('garzon');
  store.getState().reset();
  expect(store.getState()).toMatchObject({
    view: 'comensal',
    cart: [],
    tables: createDemoStore().getInitialState().tables,
  });
});

afterEach(() => vi.useRealTimers());

it('el garzón simulado confirma y sirve dentro de intervalos de 3 a 5 segundos', () => {
  vi.useFakeTimers();
  const store = createDemoStore();
  store.getState().setQty({ dishId: 'empanada' }, 1);
  store.getState().sendOrder();
  const stop = startSimulator(store, {
    random: () => 0,
    setTimeout,
    clearTimeout,
  });
  vi.advanceTimersByTime(2999);
  expect(store.getState().tables[6].orders[0].status).toBe('enviado');
  vi.advanceTimersByTime(1);
  expect(store.getState().tables[6].orders[0].status).toBe('confirmado');
  vi.advanceTimersByTime(3000);
  expect(store.getState().tables[6].orders[0].status).toBe('servido');
  stop();
});

it('pausa el simulador en la vista del garzón y lo reanuda al volver', () => {
  vi.useFakeTimers();
  const store = createDemoStore();
  store.getState().setQty({ dishId: 'empanada' }, 1);
  store.getState().sendOrder();
  const stop = startSimulator(store, {
    random: () => 0,
    setTimeout,
    clearTimeout,
  });
  store.getState().setView('garzon');
  vi.advanceTimersByTime(9000);
  expect(store.getState().tables[6].orders[0].status).toBe('enviado');
  store.getState().setView('comensal');
  vi.advanceTimersByTime(3000);
  expect(store.getState().tables[6].orders[0].status).toBe('confirmado');
  stop();
});

it('las mesas de relleno generan llamados sin tocar la Mesa 7', () => {
  vi.useFakeTimers();
  const store = createDemoStore();
  const stop = startSimulator(store, {
    random: () => 0,
    setTimeout,
    clearTimeout,
  });
  vi.advanceTimersByTime(3000);
  expect(store.getState().tables[0]).toMatchObject({
    occupied: true,
    calls: ['pedido'],
  });
  expect(store.getState().tables[6].calls).toEqual([]);
  stop();
});

/** Reproducible randomness: a linear congruential generator with a fixed seed. */
const seeded = (seed: number) => () => {
  seed = (seed * 1103515245 + 12345) % 2 ** 31;
  return seed / 2 ** 31;
};
const fillerCalls = (store: ReturnType<typeof createDemoStore>) =>
  store
    .getState()
    .tables.filter((table) => table.number !== 7)
    .flatMap((table) => table.calls);

it.each([1, 2, 3])(
  'las mesas de relleno mandan llamados de los tres tipos (semilla %s)',
  (seed) => {
    vi.useFakeTimers();
    const store = createDemoStore();
    const stop = startSimulator(store, {
      random: seeded(seed),
      setTimeout,
      clearTimeout,
    });
    const seen = new Set<string>();
    for (let tick = 0; tick < 60; tick++) {
      vi.advanceTimersByTime(5000);
      for (const call of fillerCalls(store)) seen.add(call);
    }
    expect([...seen].sort()).toEqual(['garzón', 'pago', 'pedido']);
    stop();
  },
);

it.each([0, 0.5, 0.99, 1, 2, 3])(
  'la sala no se satura: los llamados de relleno se atienden solos (azar %s)',
  (value) => {
    vi.useFakeTimers();
    const store = createDemoStore();
    const stop = startSimulator(store, {
      random: value < 1 ? () => value : seeded(value),
      setTimeout,
      clearTimeout,
    });
    const history: string[] = [];
    for (let tick = 0; tick < 100; tick++) {
      vi.advanceTimersByTime(5000);
      expect(fillerCalls(store).length).toBeLessThanOrEqual(4);
      history.push(JSON.stringify(store.getState().tables));
    }
    // The floor keeps changing: it does not get stuck in a full state.
    expect(new Set(history.slice(-20)).size).toBeGreaterThan(1);
    stop();
  },
);

it('el reinicio también se conserva al recargar la sesión', () => {
  const store = createDemoStore();
  store.getState().setQty({ dishId: 'empanada' }, 1);
  store.getState().sendOrder();
  store.getState().requestBill();
  store.getState().reset();
  const reloaded = createDemoStore();
  expect(reloaded.getState().tables[6]).toMatchObject({
    occupied: true,
    orders: [],
    calls: [],
  });
  expect(reloaded.getState().cart).toEqual([]);
});

it.each([0, 0.3, 0.5, 0.99])(
  'las mesas de relleno nunca tocan la Mesa 7 (azar %s, varios ticks)',
  (value) => {
    vi.useFakeTimers();
    const store = createDemoStore();
    const mesa7 = store.getState().tables[6];
    const stop = startSimulator(store, {
      random: () => value,
      setTimeout,
      clearTimeout,
    });
    for (let tick = 0; tick < 20; tick++) {
      vi.advanceTimersByTime(5000);
      expect(store.getState().tables[6]).toEqual(mesa7);
    }
    stop();
  },
);

it('rounds the tip to the peso', () => {
  expect(tipAmount(20900, 10)).toBe(2090);
  expect(tipAmount(3333, 15)).toBe(500);
  expect(tipAmount(20900, 0)).toBe(0);
});
