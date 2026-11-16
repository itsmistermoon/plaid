/** Recorrido guiado: pasos del circuito y su avance según el estado del dominio. */

import { findVisitorTable } from './domain';

export const tourSteps = [
  'elegir',
  'enviar',
  'sala',
  'servir',
  'cuenta',
  'cobrar',
] as const;
export type TourStep = (typeof tourSteps)[number];

/** `step === tourSteps.length` es el cierre del recorrido. */
export interface Tour {
  step: number;
  skipped: boolean;
}

interface Snapshot {
  view: 'comensal' | 'garzon';
  cart: unknown[];
  tables: {
    number: number;
    orders: { status: string }[];
    calls: string[];
  }[];
}

const done: Record<TourStep, (state: Snapshot) => boolean> = {
  elegir: (s) =>
    s.cart.length > 0 || findVisitorTable(s.tables).orders.length > 0,
  enviar: (s) => findVisitorTable(s.tables).orders.length > 0,
  sala: (s) => s.view === 'garzon',
  servir: (s) =>
    findVisitorTable(s.tables).orders.some(
      (order) => order.status === 'servido',
    ),
  cuenta: (s) => findVisitorTable(s.tables).calls.includes('pago'),
  cobrar: (s) => findVisitorTable(s.tables).orders.length === 0,
};

/** Primer paso pendiente a partir de `step`. Si la Mesa 7 perdió sus pedidos a mitad del circuito, vuelve a elegir platos. */
export function advanceTour(step: number, state: Snapshot): number {
  const sala = tourSteps.indexOf('sala');
  const cobrar = tourSteps.indexOf('cobrar');
  if (
    step >= sala &&
    step < cobrar &&
    !findVisitorTable(state.tables).orders.length
  )
    step = 0;
  while (step < tourSteps.length && done[tourSteps[step]](state)) step++;
  return step;
}
