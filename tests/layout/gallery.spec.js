import { expect, test } from '@playwright/test';

for (const width of [1440, 390]) {
  test(`la galería no desborda y su barra no se mueve a ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/componentes');
    const selectors = ['.theme-switch', '.lang-switch', '.stage-bar > a'];
    let baseline;
    for (const theme of ['original', 'moderno']) {
      for (const lang of ['es', 'en']) {
        const current = await page.locator('html').getAttribute('data-theme');
        if (current !== theme)
          await (width > 760
            ? page
                .locator('.theme-switch button')
                .nth(theme === 'original' ? 0 : 1)
            : page.locator('.theme-switch')
          ).click();
        const english = page.url().includes('/en/');
        if (english !== (lang === 'en'))
          await (width > 760
            ? page.locator(`.lang-switch a[hreflang="${lang}"]`)
            : page.locator('.lang-switch')
          ).click();
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        await expect(page).toHaveURL(
          lang === 'es' ? /\/componentes$/ : /\/en\/components$/,
        );
        await page.evaluate(() => document.fonts.ready);
        // Ninguna pieza se sale de la página ni de su panel.
        const overflow = await page.evaluate(() => {
          const page = document.documentElement.clientWidth;
          return [...document.querySelectorAll('.panel')]
            .filter((panel) => {
              const box = panel.getBoundingClientRect();
              return box.left < 0 || box.right > page;
            })
            .map((panel) => panel.querySelector('.panel-caption')?.textContent);
        });
        expect(overflow, `paneles desbordados (${theme}/${lang})`).toEqual([]);
        const boxes = [];
        for (const selector of selectors)
          boxes.push(await page.locator(selector).boundingBox());
        if (!baseline) baseline = boxes;
        else
          for (let i = 0; i < selectors.length; i++)
            for (const dimension of ['x', 'y', 'width', 'height'])
              expect(
                Math.abs(boxes[i][dimension] - baseline[i][dimension]),
                `${selectors[i]} ${dimension} (${theme}/${lang})`,
              ).toBeLessThanOrEqual(0.5);
      }
    }
  });
}
