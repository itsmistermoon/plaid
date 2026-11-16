import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import colorNames from 'color-name';
import postcss from 'postcss';
import valueParser from 'postcss-value-parser';
import { expect, test } from 'vitest';
import exceptions from './color-exceptions.json';

// Only rules whose full selector is :root or [data-theme=...] are excluded,
// and whose content is exclusively custom property declarations.
// Declarations (including variables and fallbacks) are examined with PostCSS;
// comments, strings and URLs are ignored, and hex, CSS names and
// color functions are detected, even inside gradients and shadows. Each
// exception identifies file, selector, property and value, keeping duplicates.
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
