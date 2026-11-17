import { expect, test } from '@playwright/test';

// Controls that measure the same in both themes. The receipt is left out: in the
// Slate theme it is a card with a different typeface (see DESIGN.md).
const controls = [
  '.light-button',
  '.dark-button',
  '.arrow-button',
  '.search',
  '.dropdown',
  '.selector',
  '.selector :is(button, a)',
  '.segmented',
  '.segmented button',
  '.kit-check',
  '.kit-switch',
  '.stepper',
  '.stepper button',
  '.sidebar-item',
];

const measure = (page) =>
  page.evaluate((selectors) => {
    const boxes = {};
    for (const selector of selectors)
      document.querySelectorAll(selector).forEach((el, i) => {
        if (el.closest('.receipt')) return;
        const { width, height } = el.getBoundingClientRect();
        const { padding } = getComputedStyle(el);
        boxes[`${selector} #${i}`] = { width, height, padding };
      });
    return boxes;
  }, controls);

for (const width of [1440, 390]) {
  test(`los controles miden lo mismo en todos los temas y esquemas a ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const skins = {};
    for (const [name, theme, scheme] of [
      ['plaid', 'plaid', 'system'],
      ['slate', 'slate', 'light'],
      ['slateDark', 'slate', 'dark'],
    ]) {
      await page.goto('/componentes');
      await page.evaluate(
        ([t, s]) => {
          localStorage.setItem('plaid-tema', t);
          localStorage.setItem('plaid-esquema', s);
        },
        [theme, scheme],
      );
      await page.reload();
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await expect(page.locator('html')).toHaveAttribute(
        'data-color-scheme',
        scheme,
      );
      await page.evaluate(() => document.fonts.ready);
      skins[name] = await measure(page);
      // The sidebar items live in the restaurant view.
      await page.goto('/componentes/restaurant');
      await page.evaluate(() => document.fonts.ready);
      Object.assign(skins[name], await measure(page));
    }
    const { plaid, ...others } = skins;
    expect(Object.keys(plaid).length).toBeGreaterThan(50);
    for (const [name, measured] of Object.entries(others)) {
      expect(Object.keys(measured)).toEqual(Object.keys(plaid));
      for (const [key, box] of Object.entries(plaid)) {
        const other = measured[key];
        for (const dimension of ['width', 'height'])
          expect(
            Math.abs(other[dimension] - box[dimension]),
            `${name} ${key} ${dimension}`,
          ).toBeLessThanOrEqual(0.5);
        expect(other.padding, `${name} ${key} padding`).toBe(box.padding);
      }
    }
  });
}
