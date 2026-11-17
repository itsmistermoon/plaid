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
    await page.locator('.role-switch button').nth(1).click();
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
    await page.locator('.role-switch button').nth(2).click();
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

// The Carta's tabs (Hoy plus five categories) are fixed in place and size in
// every skin and language, and each label fits its share.
for (const width of [1440, 390]) {
  test(`las pestañas de la carta no se mueven ni desbordan a ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/demo');
    await page.locator('.portada .light-button').click();
    const tabs = page.locator('.tabs-bar [role="tab"]');
    await expect(tabs).toHaveCount(6);
    let baseline;
    for (const skin of skins) {
      for (const lang of ['es', 'en']) {
        await chooseSkin(page, width, skin);
        if (width > 760)
          await page.locator(`.lang-switch a[hreflang="${lang}"]`).click();
        else if (page.url().includes('/en/') !== (lang === 'en'))
          await page.locator('.lang-switch').click();
        await page.evaluate(() => document.fonts.ready);
        // "Hoy" is the first tab and opens on the chalkboard.
        await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
        await expect(page.locator('.chalkboard')).toBeVisible();
        const boxes = await tabs.evaluateAll((els) =>
          els.map((el) => {
            const { x, width: w } = el.getBoundingClientRect();
            return { x, w, fits: el.scrollWidth <= el.clientWidth };
          }),
        );
        for (const box of boxes)
          expect(box.fits, `una pestaña desborda (${skin.theme}/${lang})`).toBe(
            true,
          );
        if (!baseline) baseline = boxes;
        else
          boxes.forEach((box, i) => {
            expect(Math.abs(box.x - baseline[i].x)).toBeLessThanOrEqual(0.5);
            expect(Math.abs(box.w - baseline[i].w)).toBeLessThanOrEqual(0.5);
          });
      }
    }
  });
}

test('tocar un especial abre su detalle', async ({ page }) => {
  await page.goto('/demo');
  await page.locator('.portada .light-button').click();
  await page.locator('.special').first().click();
  await expect(page.locator('.detail')).toBeVisible();
});

// The waiter's bar buttons keep place and size in every skin and language, and
// their text never overflows. Also leaves screenshots of the bar in .cache/bar.
for (const width of [1440, 390]) {
  test(`los botones de la barra del garzón no se mueven ni desbordan a ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/demo');
    await page.locator('.role-switch button').nth(1).click();
    let baseline;
    for (const skin of skins) {
      await chooseSkin(page, width, skin);
      for (const lang of ['es', 'en']) {
        if (width > 760)
          await page.locator(`.lang-switch a[hreflang="${lang}"]`).click();
        else if (page.url().includes('/en/') !== (lang === 'en'))
          await page.locator('.lang-switch').click();
        await page.evaluate(() => document.fonts.ready);
        const boxes = [];
        for (const selector of ['.palette-trigger', '.book-trigger']) {
          const control = page.locator(selector);
          await expect(control).toBeVisible();
          boxes.push(await control.boundingBox());
          expect(
            await control.evaluate((el) => el.scrollWidth <= el.clientWidth),
            `${selector} desborda (${skin.theme}/${skin.scheme}/${lang})`,
          ).toBe(true);
        }
        if (!baseline) baseline = boxes;
        else
          boxes.forEach((box, i) => {
            for (const dimension of ['x', 'y', 'width', 'height'])
              expect(
                Math.abs(box[dimension] - baseline[i][dimension]),
                `botón ${i} ${dimension} (${skin.theme}/${skin.scheme}/${lang})`,
              ).toBeLessThanOrEqual(0.5);
          });
        await page.locator('.navbar').screenshot({
          path: `.cache/bar/${width}-${skin.theme}-${skin.scheme}-${lang}.png`,
        });
      }
    }
  });
}

// On phones the role is three icon segments: one tap reaches any of them, in
// particular back to the diner from the waiter or the Cocina.
test('a una toque se vuelve al comensal desde el garzón y la cocina en el teléfono', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  const role = (index) => page.locator('.role-switch button').nth(index);
  for (const from of [1, 2]) {
    await role(from).click();
    await expect(page.locator('main')).toHaveAttribute(
      'data-view',
      ['comensal', 'garzon', 'cocina'][from],
    );
    await role(0).click();
    await expect(page.locator('main')).toHaveAttribute('data-view', 'comensal');
  }
});

// The table plate uses an allowed font, never Georgia.
test('la placa de la mesa usa Courier Prime', async ({ page }) => {
  await page.goto('/demo');
  await page.locator('.role-switch button').nth(1).click();
  await page.evaluate(() => document.fonts.ready);
  const font = await page
    .locator('.plate text')
    .first()
    .evaluate((el) => getComputedStyle(el).fontFamily);
  expect(font).toContain('Courier Prime');
  expect(font).not.toContain('Georgia');
  // The longest plate text fits inside the plate's paper (116px of the 140).
  for (const width of await page
    .locator('.plate text')
    .evaluateAll((els) => els.map((el) => el.getBBox().width)))
    expect(width).toBeLessThanOrEqual(116);
});

// The diner's tip and split reach the waiter's view of the Mesa, whose total
// reads "$23.805" with no stray spaces around the thousands dot.
test('el garzón ve la propina, la división y el total sin espacios', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/demo');
  await page.locator('.portada .light-button').click();
  await page.locator('.special').first().click();
  await page.locator('.detail-order .light-button').click();
  await page.locator('.cart-button').click();
  await page.locator('.light-button[data-tour="enviar"]').click();
  await page.locator('.sidebar-item', { hasText: /Cuenta|Bill/ }).click();
  await page.locator('.tip-selector button').nth(2).click();
  await page.locator('.split-selector button').nth(2).click();
  await page.locator('.role-switch button').nth(1).click();
  await page.locator('.table-button').nth(6).click();
  const bill = page.locator('.table-detail-bill');
  await expect(bill.locator('.side-total')).toHaveText(/^\$\d{1,3}(\.\d{3})+$/);
  await expect(bill.locator('.side-bill-line').first()).toContainText('15%');
  await expect(bill.locator('.side-bill-line').nth(1)).toContainText('3');
  await expect(bill.locator('.side-bill-line').nth(1)).toBeVisible();
  // The tip and split lines have a fixed height, shown or not.
  const heights = await bill
    .locator('.side-bill-line')
    .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().height));
  expect(heights).toEqual([18, 18]);
});

// On phones the notices sit at the top: the sheet's "Cobrar y liberar" button
// stays uncovered after a move.
test('el aviso de mover mesa no tapa "Cobrar y liberar" en el teléfono', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  await page.locator('.role-switch button').nth(1).click();
  await page.locator('.table-button').nth(6).click();
  await page.locator('.move-button').click();
  await page.locator('.dropdown-item').first().click();
  const toast = page.locator('.toast').first();
  await expect(toast).toBeVisible();
  await page.waitForTimeout(600);
  const [toastBox, buttonBox] = await Promise.all([
    toast.boundingBox(),
    page.locator('.table-detail-bill .light-button').boundingBox(),
  ]);
  expect(toastBox.y + toastBox.height).toBeLessThanOrEqual(buttonBox.y);
});

// The reservation book offers every day of the week as a fixed strip.
for (const width of [1440, 390]) {
  test(`el libro de reservas elige cualquier día de la semana a ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/demo');
    await page.locator('.role-switch button').nth(1).click();
    await page.locator('.book-trigger').click();
    const days = page.locator('.book-day button');
    await expect(days).toHaveCount(7);
    const first = await days.evaluateAll((els) =>
      els.map((el) => el.getBoundingClientRect().width),
    );
    // The seed has Vidal at 13:00 tomorrow and nothing three days out.
    await expect(page.locator('.book-entries')).toHaveCount(2);
    await days.nth(1).click();
    await expect(page.locator('.book-slots')).toContainText('Vidal');
    await days.nth(4).click();
    await expect(days.nth(4)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.book-entries')).toHaveCount(0);
    for (const day of [0, 6]) {
      await days.nth(day).click();
      const widths = await days.evaluateAll((els) =>
        els.map((el) => el.getBoundingClientRect().width),
      );
      expect(widths).toEqual(first);
      expect(
        await page
          .locator('.book-day')
          .evaluate((el) => el.scrollWidth <= el.clientWidth),
      ).toBe(true);
    }
    // A booking made for a later day lands on that day.
    await days.nth(4).click();
    await page.getByRole('combobox', { name: 'Mesa' }).click();
    await page.getByRole('option', { name: 'Mesa 1', exact: true }).click();
    await page.getByRole('combobox', { name: 'Hora' }).click();
    await page.getByRole('option', { name: '13:00' }).click();
    await page.locator('.book-name input').fill('Pino');
    await page.locator('.book-form [type="submit"]').click();
    await expect(page.locator('.book-slots')).toContainText('Pino');
    await days.nth(0).click();
    await expect(page.locator('.book-slots')).not.toContainText('Pino');
  });
}
