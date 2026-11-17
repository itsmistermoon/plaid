import { expect, test } from 'vitest';
import {
  fullSett,
  settSize,
  settSizeOf,
  tartanSvg,
  threadcount,
  threadcountOf,
} from './tartan';

test('the threadcount is written pivot to pivot', () => {
  expect(threadcount).toBe('K/8 G32 K6 G6 K24 W4 K24 Y/2');
});

test('the full sett mirrors the half-sett without repeating the pivots', () => {
  expect(fullSett.map(([color]) => color).join('')).toBe('KGKGKWKYKWKGKG');
  expect(settSize).toBe(202);
});

test('another sett is written, measured and woven the same way', () => {
  const design = [
    ['G', 4],
    ['W', 2],
    ['K', 6],
  ] as const;
  expect(threadcountOf(design)).toBe('G/4 W2 K/6');
  expect(settSizeOf(design)).toBe(14);
  expect(tartanSvg('check', undefined, design)).toContain(
    'viewBox="0 0 14 14"',
  );
});
