/** Guided tour: the circuit's steps and their progress according to the domain state. */

import { findVisitorTable } from './domain';

export const tourSteps = [
  'hoy',
  'elegir',
  'enviar',
  'sala',
  'buscar',
  'reservar',
  'servir',
  'cuenta',
  'cobrar',
] as const;
export type TourStep = (typeof tourSteps)[number];

/** `step === tourSteps.length` is the end of the tour. `seen` holds the steps about a button the visitor has already tried. */
export interface Tour {
  step: number;
  skipped: boolean;
  seen: TourStep[];
}

interface Snapshot {
  view: 'comensal' | 'garzon' | 'cocina';
  cart: unknown[];
  tour: { seen: TourStep[] } | null;
  tables: {
    number: number;
    orders: { status: string }[];
    calls: string[];
  }[];
}

const served = (s: Snapshot) =>
  findVisitorTable(s.tables).orders.some((order) => order.status === 'servido');

const done: Record<TourStep, (state: Snapshot) => boolean> = {
  hoy: (s) =>
    !!s.tour?.seen.includes('hoy') ||
    s.cart.length > 0 ||
    findVisitorTable(s.tables).orders.length > 0,
  elegir: (s) =>
    s.cart.length > 0 || findVisitorTable(s.tables).orders.length > 0,
  enviar: (s) => findVisitorTable(s.tables).orders.length > 0,
  sala: (s) => s.view === 'garzon',
  buscar: (s) => !!s.tour?.seen.includes('buscar') || served(s),
  reservar: (s) => !!s.tour?.seen.includes('reservar') || served(s),
  servir: served,
  cuenta: (s) => findVisitorTable(s.tables).calls.includes('pago'),
  cobrar: (s) => findVisitorTable(s.tables).orders.length === 0,
};

/** First pending step from `step` on. If Mesa 7 lost its Pedidos midway through the circuit, it goes back to choosing dishes. */
export function advanceTour(step: number, state: Snapshot): number {
  const sala = tourSteps.indexOf('sala');
  const cobrar = tourSteps.indexOf('cobrar');
  if (
    step >= sala &&
    step < cobrar &&
    !findVisitorTable(state.tables).orders.length
  )
    step = tourSteps.indexOf('elegir');
  while (step < tourSteps.length && done[tourSteps[step]](state)) step++;
  return step;
}
