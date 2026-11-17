import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { tartanSvg } from '../src/tartan';

test('the favicon is generated from the sett (pnpm tartan:assets)', () => {
  expect(readFileSync('public/favicon.svg', 'utf8')).toBe(
    `${tartanSvg('check', 64)}\n`,
  );
});
