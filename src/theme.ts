import { createLocalStorage, createPreference } from '@ui-sdk/core';

/** Tema de la piel: `data-theme` en `<html>`, compartido por la demo y la galería. */
export const theme = createPreference({
  values: ['original', 'moderno'],
  defaultValue: 'original',
  attribute: 'data-theme',
  global: true,
  storage: createLocalStorage('plaid-tema'),
});
