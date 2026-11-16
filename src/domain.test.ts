import { beforeEach, expect, it } from 'vitest';

beforeEach(() => sessionStorage.clear());

import { cartTotal, createDemoStore } from './domain';

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
