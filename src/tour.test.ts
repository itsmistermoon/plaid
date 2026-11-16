import { beforeEach, expect, it } from 'vitest';
import { createDemoStore } from './domain';
import { tourSteps } from './tour';

beforeEach(() => sessionStorage.clear());

const stepOf = (store: ReturnType<typeof createDemoStore>) => {
  const tour = store.getState().tour;
  return tour && (tourSteps[tour.step] ?? 'listo');
};

const orderId = (store: ReturnType<typeof createDemoStore>) =>
  store.getState().tables[6].orders[0].id;

it('no hay recorrido hasta que el visitante lo empieza', () => {
  const store = createDemoStore();
  expect(store.getState().tour).toBeNull();
  store.getState().startTour();
  expect(stepOf(store)).toBe('elegir');
});

it('avanza paso a paso por el circuito completo', () => {
  const store = createDemoStore();
  const s = () => store.getState();
  s().startTour();
  s().addToCart({ dishId: 'chacarero' }, 1);
  expect(stepOf(store)).toBe('enviar');
  s().sendOrder();
  expect(stepOf(store)).toBe('sala');
  s().setView('garzon');
  expect(stepOf(store)).toBe('servir');
  s().confirmOrder(7, orderId(store));
  expect(stepOf(store)).toBe('servir');
  s().serveOrder(7, orderId(store));
  expect(stepOf(store)).toBe('cuenta');
  s().setView('comensal');
  s().requestBill();
  expect(stepOf(store)).toBe('cobrar');
  s().setView('garzon');
  s().chargeAndFree(7);
  expect(stepOf(store)).toBe('listo');
});

it('al empezar salta los pasos que el visitante ya hizo', () => {
  const store = createDemoStore();
  store.getState().addToCart({ dishId: 'chacarero' }, 1);
  store.getState().sendOrder();
  store.getState().startTour();
  expect(stepOf(store)).toBe('sala');
});

it('no retrocede cuando el visitante vuelve a la vista del comensal', () => {
  const store = createDemoStore();
  const s = () => store.getState();
  s().startTour();
  s().addToCart({ dishId: 'chacarero' }, 1);
  s().sendOrder();
  s().setView('garzon');
  s().setView('comensal');
  expect(stepOf(store)).toBe('servir');
});

it('vuelve a elegir platos si la mesa se libera antes de pedir la cuenta', () => {
  const store = createDemoStore();
  const s = () => store.getState();
  s().startTour();
  s().addToCart({ dishId: 'chacarero' }, 1);
  s().sendOrder();
  s().setView('garzon');
  s().chargeAndFree(7);
  expect(stepOf(store)).toBe('elegir');
  s().addToCart({ dishId: 'empanada' }, 1);
  s().sendOrder();
  expect(s().tables[6].occupied).toBe(true);
  expect(stepOf(store)).toBe('servir');
});

it('se salta y se retoma en el paso en que iba', () => {
  const store = createDemoStore();
  const s = () => store.getState();
  s().startTour();
  s().addToCart({ dishId: 'chacarero' }, 1);
  s().skipTour();
  expect(s().tour).toMatchObject({ skipped: true });
  s().sendOrder();
  s().startTour();
  expect(s().tour).toMatchObject({ skipped: false });
  expect(stepOf(store)).toBe('sala');
});

it('empieza de nuevo después de terminar', () => {
  const store = createDemoStore();
  const s = () => store.getState();
  s().startTour();
  s().addToCart({ dishId: 'chacarero' }, 1);
  s().sendOrder();
  s().setView('garzon');
  s().confirmOrder(7, orderId(store));
  s().serveOrder(7, orderId(store));
  s().requestBill();
  s().chargeAndFree(7);
  expect(stepOf(store)).toBe('listo');
  s().setView('comensal');
  s().startTour();
  expect(stepOf(store)).toBe('elegir');
});

it('cerrar al final y reiniciar la demo quitan el recorrido', () => {
  const store = createDemoStore();
  store.getState().startTour();
  store.getState().endTour();
  expect(store.getState().tour).toBeNull();
  store.getState().startTour();
  store.getState().reset();
  expect(store.getState().tour).toBeNull();
});
