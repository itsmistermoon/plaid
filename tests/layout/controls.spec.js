import { expect, test } from '@playwright/test';

for (const width of [1440, 390]) {
  test(`los controles mantienen su geometría a ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/demo');
    await page.evaluate(() => document.fonts.ready);
    const selectors = [
      '.theme-switch',
      '.lang-switch',
      '.role-switch',
      '.tour-button',
      '.reset-button',
    ];
    let baseline;
    for (const theme of ['original', 'moderno']) {
      for (const lang of ['es', 'en']) {
        await page
          .locator('.theme-switch button')
          .nth(theme === 'original' ? 0 : 1)
          .click();
        await page.locator(`.lang-switch a[hreflang="${lang}"]`).click();
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        await expect(page).toHaveURL(lang === 'es' ? /\/demo$/ : /\/en\/demo$/);
        await page.evaluate(() => document.fonts.ready);
        const boxes = [];
        for (const selector of selectors) {
          const control = page.locator(selector);
          await expect(control).toBeVisible();
          boxes.push(await control.boundingBox());
        }
        if (!baseline) baseline = boxes;
        else
          for (let i = 0; i < selectors.length; i++) {
            for (const dimension of ['x', 'y', 'width', 'height']) {
              expect(
                Math.abs(boxes[i][dimension] - baseline[i][dimension]),
                `${selectors[i]} ${dimension} (${theme}/${lang})`,
              ).toBeLessThanOrEqual(0.5);
            }
          }
      }
    }
  });
}
