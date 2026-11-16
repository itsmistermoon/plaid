import { expect, test } from '@playwright/test';

// Controles que miden lo mismo en ambos temas. La boleta queda fuera: en el
// moderno es una tarjeta con otra tipografía (ver DESIGN.md).
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
  test(`los controles miden lo mismo en ambos temas a ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const themes = {};
    for (const theme of ['original', 'moderno']) {
      await page.goto('/componentes');
      await page.evaluate((t) => localStorage.setItem('plaid-tema', t), theme);
      await page.reload();
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await page.evaluate(() => document.fonts.ready);
      themes[theme] = await measure(page);
    }
    const { original, moderno } = themes;
    expect(Object.keys(moderno)).toEqual(Object.keys(original));
    expect(Object.keys(original).length).toBeGreaterThan(50);
    for (const [key, box] of Object.entries(original)) {
      const other = moderno[key];
      for (const dimension of ['width', 'height'])
        expect(
          Math.abs(other[dimension] - box[dimension]),
          `${key} ${dimension}`,
        ).toBeLessThanOrEqual(0.5);
      expect(other.padding, `${key} padding`).toBe(box.padding);
    }
  });
}
