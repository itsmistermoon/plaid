import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import colorNames from 'color-name';
import postcss from 'postcss';
import valueParser from 'postcss-value-parser';
import { expect, test } from 'vitest';
import exceptions from './color-exceptions.json';

// Solo se excluyen reglas cuyo selector completo es :root o [data-theme=...]
// y cuyo contenido son exclusivamente declaraciones de custom properties.
// Se examinan declaraciones (incluidas variables y fallbacks) con PostCSS;
// se ignoran comentarios, strings y URL, y se detectan hex, nombres CSS y
// funciones de color, incluso dentro de gradientes y sombras. Cada excepción
// identifica archivo, selector, propiedad y valor, conservando duplicados.
const colorFunctions = new Set([
  'rgb',
  'rgba',
  'hsl',
  'hsla',
  'hwb',
  'lab',
  'lch',
  'oklab',
  'oklch',
  'color',
  'color-mix',
  'light-dark',
  'device-cmyk',
]);
function hasColor(value) {
  let found = false;
  valueParser(value).walk((node) => {
    if (node.type === 'function') {
      if (colorFunctions.has(node.value.toLowerCase())) found = true;
      if (node.value.toLowerCase() === 'url') return false;
    }
    if (node.type === 'word') {
      const word = node.value.toLowerCase();
      if (
        /^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i.test(word) ||
        Object.hasOwn(colorNames, word)
      )
        found = true;
    }
  });
  return found;
}
function cssFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory()
      ? cssFiles(path)
      : entry.name.endsWith('.css')
        ? [path]
        : [];
  });
}
function violations() {
  return cssFiles('src')
    .flatMap((file) => {
      const result = [];
      postcss
        .parse(readFileSync(file, 'utf8'), { from: file })
        .walkDecls((decl) => {
          const rule = decl.parent;
          const tokenBlock =
            rule.type === 'rule' &&
            /^(?::root|\[data-theme\s*=\s*(?:"[^"]+"|'[^']+'|[\w-]+)\])$/.test(
              rule.selector.trim(),
            ) &&
            rule.nodes.every(
              (node) =>
                node.type === 'comment' ||
                (node.type === 'decl' && node.prop.startsWith('--')),
            );
          if (!tokenBlock && hasColor(decl.value))
            result.push(
              `${relative('.', file)} | ${rule.selector ?? `@${rule.name} ${rule.params}`} | ${decl.prop}: ${decl.value}`,
            );
        });
      return result;
    })
    .sort();
}

test('los colores literales fuera de tokens no aumentan', () => {
  const remaining = [...exceptions];
  const unexpected = violations().filter((violation) => {
    const index = remaining.indexOf(violation);
    if (index === -1) return true;
    remaining.splice(index, 1);
    return false;
  });
  expect(unexpected).toEqual([]);
});
