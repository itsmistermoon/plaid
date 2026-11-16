import { afterEach, beforeEach, expect, it, vi } from 'vitest';

beforeEach(() => sessionStorage.clear());

import { billTotal, cartTotal, createDemoStore } from './domain';
import { startSimulator } from './simulator';

it('actualiza el carrito y su total al cambiar cantidades', () => {
  const store = createDemoStore();
  store.getState().setQty('chacarero', 2);
  store.getState().setQty('empanada', 1);
  expect(cartTotal(store.getState().cart)).toBe(16700);
  store.getState().setQty('chacarero', 0);
  expect(cartTotal(store.getState().cart)).toBe(2900);
});

it('no agrega un plato agotado al carrito', () => {
  const store = createDemoStore();
  store.getState().setQty('chemilico', 1);
  expect(store.getState().cart).toEqual({});
});

it('envía el carrito como pedido y llamado de la Mesa 7', () => {
  const store = createDemoStore();
  store.getState().setQty('chacarero', 2);
  store.getState().sendOrder();
  const state = store.getState();
  expect(state.cart).toEqual({});
  expect(state.tables[6].orders).toMatchObject([
    { status: 'enviado', lines: [{ dishId: 'chacarero', qty: 2 }] },
  ]);
  expect(state.tables[6].calls).toEqual(['pedido']);
});

it('permite al garzón confirmar, servir y atender el llamado', () => {
  const store = createDemoStore();
  store.getState().setQty('empanada', 1);
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
  store.getState().setQty('empanada', 1);
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
  first.getState().setQty('empanada', 1);
  first.getState().sendOrder();
  const second = createDemoStore(storage);
  expect(second.getState().tables[6].calls).toEqual(['pedido']);
});

it('suma los pedidos y registra el llamado de pago', () => {
  const store = createDemoStore();
  store.getState().setQty('empanada', 2);
  store.getState().sendOrder();
  store.getState().setQty('chacarero', 1);
  store.getState().sendOrder();
  store.getState().requestBill();
  expect(billTotal(store.getState().tables[6])).toBe(12700);
  expect(store.getState().tables[6].calls).toContain('pago');
});

it('cobra y libera la mesa, borrando pedidos y llamados', () => {
  const store = createDemoStore();
  store.getState().setQty('empanada', 1);
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
  store.getState().setQty('empanada', 2);
  store.getState().setView('garzon');
  store.getState().reset();
  expect(store.getState()).toMatchObject({
    view: 'comensal',
    cart: {},
    tables: createDemoStore().getInitialState().tables,
  });
});

afterEach(() => vi.useRealTimers());

it('el garzón simulado confirma y sirve dentro de intervalos de 3 a 5 segundos', () => {
  vi.useFakeTimers();
  const store = createDemoStore();
  store.getState().setQty('empanada', 1);
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
  store.getState().setQty('empanada', 1);
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
    calls: ['garzón'],
  });
  expect(store.getState().tables[6].calls).toEqual([]);
  stop();
});
