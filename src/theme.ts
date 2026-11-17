import {
  createColorScheme,
  createLocalStorage,
  createPreference,
} from '@ui-sdk/core';

/** Skin theme: `data-theme` on `<html>`, shared by the demo and the gallery. */
export const theme = createPreference({
  values: ['plaid', 'slate'],
  defaultValue: 'plaid',
  attribute: 'data-theme',
  global: true,
  storage: createLocalStorage('plaid-tema'),
});

/**
 * Light or dark scheme of the Slate theme: `data-color-scheme` on `<html>`
 * (`system` follows `prefers-color-scheme`). The Plaid theme is always dark
 * and ignores it.
 */
export const colorScheme = createColorScheme({
  global: true,
  storage: createLocalStorage('plaid-esquema'),
});
