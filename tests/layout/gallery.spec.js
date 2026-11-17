import { expect, test } from '@playwright/test';
import { chooseSkin, skins } from './skins.js';

for (const width of [1440, 390]) {
  test(`la galería no desborda y su barra no se mueve a ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/componentes');
    const selectors = [
      '.theme-switch',
      '.scheme-switch',
      '.lang-switch',
      '.stage-bar > a',
    ];
    let baseline;
    for (const skin of skins) {
      const { theme, scheme } = skin;
      for (const lang of ['es', 'en']) {
        await chooseSkin(page, width, skin);
        const english = page.url().includes('/en/');
        if (english !== (lang === 'en'))
          await (width > 760
            ? page.locator(`.lang-switch a[hreflang="${lang}"]`)
            : page.locator('.lang-switch')
          ).click();
        await expect(page).toHaveURL(
          lang === 'es' ? /\/componentes$/ : /\/en\/components$/,
        );
        await page.evaluate(() => document.fonts.ready);
        // No piece goes outside the page or its panel.
        const overflow = await page.evaluate(() => {
          const page = document.documentElement.clientWidth;
          return [...document.querySelectorAll('.panel')]
            .filter((panel) => {
              const box = panel.getBoundingClientRect();
              return box.left < 0 || box.right > page;
            })
            .map((panel) => panel.querySelector('.panel-caption')?.textContent);
        });
        expect(
          overflow,
          `paneles desbordados (${theme}/${scheme}/${lang})`,
        ).toEqual([]);
        const boxes = [];
        for (const selector of selectors)
          boxes.push(await page.locator(selector).boundingBox());
        if (!baseline) baseline = boxes;
        else
          for (let i = 0; i < selectors.length; i++)
            for (const dimension of ['x', 'y', 'width', 'height'])
              expect(
                Math.abs(boxes[i][dimension] - baseline[i][dimension]),
                `${selectors[i]} ${dimension} (${theme}/${scheme}/${lang})`,
              ).toBeLessThanOrEqual(0.5);
      }
    }
  });
}

for (const width of [1440, 390]) {
  test(`la barra de la galería queda fija arriba y el segmentado del panel mide lo mismo a ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/componentes');
    for (const skin of skins) {
      await chooseSkin(page, width, skin);
      await page.evaluate(() => window.scrollTo(0, 1500));
      const bar = await page.locator('.gallery > .stage-bar').boundingBox();
      expect(
        bar.y,
        `barra fija (${skin.theme}/${skin.scheme})`,
      ).toBeLessThanOrEqual(0);
      expect(bar.y + bar.height).toBeGreaterThan(40);
      const roleBar = await page
        .locator('.panel .stage-bar .selector')
        .first()
        .boundingBox();
      expect(roleBar.width, 'segmentado del panel').toBe(246);
    }
  });
}

test('las tres vistas de la galería se alternan con la barra fija y respetan el idioma', async ({
  page,
}) => {
  await page.goto('/componentes');
  const views = page.locator('.gallery > .stage-bar .gallery-views a');
  await expect(views).toHaveCount(3);
  await views.nth(1).click();
  await expect(page).toHaveURL(/\/componentes\/restaurant$/);
  await expect(page.locator('.panel-caption').first()).toBeVisible();
  await page.locator('.lang-switch a[hreflang="en"]').click();
  await expect(page).toHaveURL(/\/en\/components\/restaurant$/);
  await page.locator('.gallery-views a').nth(2).click();
  await expect(page).toHaveURL(/\/en\/components\/tartan$/);
  await expect(page.locator('.stage-bar')).toBeVisible();
  await page.locator('.gallery-views a').nth(0).click();
  await expect(page).toHaveURL(/\/en\/components$/);
});
