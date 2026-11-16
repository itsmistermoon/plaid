import { expect, it } from 'vitest';
import { messages, pathFor, routeFor } from './i18n';
import { dishes } from './menu';

it('lee la página y el idioma desde la ruta', () => {
  expect(routeFor('/demo')).toEqual({ page: 'demo', lang: 'es' });
  expect(routeFor('/componentes')).toEqual({ page: 'gallery', lang: 'es' });
  expect(routeFor('/en/demo')).toEqual({ page: 'demo', lang: 'en' });
  expect(routeFor('/en/components/')).toEqual({ page: 'gallery', lang: 'en' });
  expect(routeFor('/en/componentes')).toBeNull();
  expect(routeFor('/components')).toBeNull();
});

it('arma la ruta equivalente en el otro idioma', () => {
  expect(pathFor('demo', 'en')).toBe('/en/demo');
  expect(pathFor('gallery', 'es')).toBe('/componentes');
  for (const lang of ['es', 'en'] as const)
    for (const page of ['demo', 'gallery'] as const)
      expect(routeFor(pathFor(page, lang))).toEqual({ page, lang });
});

/** Walks the dictionary and returns every text, calling the functions. */
const texts = (value: unknown): string[] =>
  typeof value === 'string'
    ? [value]
    : typeof value === 'function'
      ? texts(value(3, 'X'))
      : Object.values(value as object).flatMap(texts);
const keys = (value: unknown, prefix = ''): string[] =>
  value && typeof value === 'object'
    ? Object.entries(value).flatMap(([key, child]) =>
        keys(child, `${prefix}${key}.`),
      )
    : [prefix];

it('tiene las mismas claves en español e inglés, sin textos vacíos', () => {
  expect(keys(messages.en)).toEqual(keys(messages.es));
  for (const text of [...texts(messages.es), ...texts(messages.en)])
    expect(text.trim()).not.toBe('');
});

const spanish = /[áéíóúñ¿¡]/i;

it('no deja texto en español en el diccionario inglés', () => {
  for (const text of texts(messages.en)) expect(text).not.toMatch(spanish);
});

it('da a cada plato una bajada en inglés', () => {
  for (const dish of dishes) {
    expect(dish.en.trim()).not.toBe('');
    expect(dish.en).not.toMatch(spanish);
  }
});
