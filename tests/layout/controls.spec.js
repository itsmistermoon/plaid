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

// The waiter's floor has the same grid in every skin: only the skin changes.
for (const width of [1440, 390]) {
  test(`la sala del garzón tiene la misma grilla en todos los temas a ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/demo');
    if (width > 760) await page.locator('.role-switch button').nth(1).click();
    else await page.locator('.role-switch').click();
    let baseline;
    for (const skin of skins) {
      await chooseSkin(page, width, skin);
      await page.evaluate(() => document.fonts.ready);
      const boxes = await page.locator('.tables .mesa').evaluateAll((els) =>
        els.map((el) => {
          const { x, y, width, height } = el.getBoundingClientRect();
          return { x, y, width, height };
        }),
      );
      expect(boxes.length).toBe(12);
      if (!baseline) baseline = boxes;
      else
        boxes.forEach((box, i) => {
          for (const dimension of ['x', 'y', 'width', 'height'])
            expect(
              Math.abs(box[dimension] - baseline[i][dimension]),
              `mesa ${i} ${dimension} (${skin.theme}/${skin.scheme})`,
            ).toBeLessThanOrEqual(0.5);
        });
    }
  });
}

// The Cocina has its three rails in the same place in every skin.
for (const width of [1440, 390]) {
  test(`los rieles de la cocina miden lo mismo en todos los temas a ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/demo');
    if (width > 760) await page.locator('.role-switch button').nth(2).click();
    else for (let i = 0; i < 2; i++) await page.locator('.role-switch').click();
    let baseline;
    for (const skin of skins) {
      await chooseSkin(page, width, skin);
      await page.evaluate(() => document.fonts.ready);
      const boxes = await page
        .locator('.kitchen .rail-bar')
        .evaluateAll((els) =>
          els.map((el) => {
            const { x, width, height } = el.getBoundingClientRect();
            return { x, width, height };
          }),
        );
      expect(boxes.length).toBe(3);
      if (!baseline) baseline = boxes;
      else
        boxes.forEach((box, i) => {
          for (const dimension of ['x', 'width', 'height'])
            expect(
              Math.abs(box[dimension] - baseline[i][dimension]),
              `riel ${i} ${dimension} (${skin.theme}/${skin.scheme})`,
            ).toBeLessThanOrEqual(0.5);
        });
    }
  });
}
