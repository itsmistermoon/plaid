import { expect, it } from 'vitest';
import { crossed, flingTarget, give, settleStep, toothOffset } from './wheel';

const run = (pos: number, target: number, ms: number) => {
  let state = { pos, vel: 0 };
  let peak = pos;
  for (let t = 0; t < ms; t += 16) {
    state = settleStep(state, target, 16);
    peak = Math.max(peak, state.pos);
  }
  return { state, peak };
};

it('lleva el tambor hasta el objetivo y se detiene ahí', () => {
  const { state } = run(1, 4, 2000);
  expect(state).toEqual({ pos: 4, vel: 0 });
});

it('rebota un poco al asentarse, sin pasarse más de media fila', () => {
  const { peak } = run(1, 4, 2000);
  expect(peak).toBeGreaterThan(4);
  expect(peak).toBeLessThan(4.5);
});

it('avanza igual con cuadros largos que con cuadros cortos', () => {
  let fine = { pos: 0, vel: 0 };
  for (let i = 0; i < 12; i++) fine = settleStep(fine, 3, 8);
  const coarse = settleStep(settleStep({ pos: 0, vel: 0 }, 3, 48), 3, 48);
  expect(coarse.pos).toBeCloseTo(fine.pos, 1);
});

it('cuenta cada número que cruza el centro', () => {
  expect(crossed(2, 2.4)).toBe(0);
  expect(crossed(2, 2.6)).toBe(1);
  expect(crossed(5, 1.9)).toBe(3);
});

it('cede solo una fracción más allá de los bordes', () => {
  expect(give(3, 1, 20)).toBe(3);
  expect(give(0, 1, 20)).toBeCloseTo(0.7);
  expect(give(22, 1, 20)).toBeCloseTo(20.6);
});

it('un lanzamiento sigue en su dirección y cae en un número dentro del rango', () => {
  expect(flingTarget(5, 0, 1, 20)).toBe(5);
  expect(flingTarget(5.3, 0.02, 1, 20)).toBe(10);
  expect(flingTarget(5, -1, 1, 20)).toBe(1);
});

it('los dientes suben junto con los números cuando la cantidad aumenta', () => {
  // A number rises as the position grows; its tooth must rise the same.
  const before = toothOffset(3, 0, 30, 4);
  const after = toothOffset(3, 0.05, 30, 4);
  expect(after).toBeCloseTo(before - 0.05 * 30);
});
