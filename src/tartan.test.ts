import { expect, test } from 'vitest';
import { fullSett, settSize, threadcount } from './tartan';

test('the threadcount is written pivot to pivot', () => {
  expect(threadcount).toBe('K/8 G32 K6 G6 K24 W4 K24 Y/2');
});

test('the full sett mirrors the half-sett without repeating the pivots', () => {
  expect(fullSett.map(([color]) => color).join('')).toBe('KGKGKWKYKWKGKG');
  expect(settSize).toBe(202);
});
