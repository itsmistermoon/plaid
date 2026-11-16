import { expect, test } from '@playwright/test';
import { chooseSkin, skins } from './skins.js';

for (const width of [1440, 390]) {
  test(`los controles mantienen su geometría a ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/demo');
    await page.evaluate(() => document.fonts.ready);
    const selectors = [
      '.theme-switch',
      '.scheme-switch',
      '.lang-switch',
      '.role-switch',
      '.tour-button',
      '.kit-link',
      '.reset-button',
    ];
    let baseline;
    for (const skin of skins) {
      const { theme, scheme } = skin;
      for (const lang of ['es', 'en']) {
        // On phones every choice is a single button that toggles.
        await chooseSkin(page, width, skin);
        if (width > 760)
          await page.locator(`.lang-switch a[hreflang="${lang}"]`).click();
        else if (page.url().includes('/en/') !== (lang === 'en'))
          await page.locator('.lang-switch').click();
        await expect(page).toHaveURL(lang === 'es' ? /\/demo$/ : /\/en\/demo$/);
        await page.evaluate(() => document.fonts.ready);
        const boxes = [];
        for (const selector of selectors) {
          const control = page.locator(selector);
          await expect(control).toBeVisible();
          boxes.push(await control.boundingBox());
          // The longest text across themes and languages fits without overflowing.
          expect(
            await control.evaluate((el) => el.scrollWidth <= el.clientWidth),
            `${selector} desborda (${theme}/${scheme}/${lang})`,
          ).toBe(true);
        }
        if (!baseline) baseline = boxes;
        else
          for (let i = 0; i < selectors.length; i++) {
            for (const dimension of ['x', 'y', 'width', 'height']) {
              expect(
                Math.abs(boxes[i][dimension] - baseline[i][dimension]),
                `${selectors[i]} ${dimension} (${theme}/${scheme}/${lang})`,
              ).toBeLessThanOrEqual(0.5);
            }
          }
      }
    }
  });
}
