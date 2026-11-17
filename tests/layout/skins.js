import { expect } from '@playwright/test';

/** Every skin the bars must hold still across: the Plaid theme, and the Slate one in light and dark. */
export const skins = [
  { theme: 'plaid', scheme: 'system' },
  { theme: 'slate', scheme: 'light' },
  { theme: 'slate', scheme: 'dark' },
];

/** Picks a skin through the bar's own controls (on phones, toggles that cycle). */
export async function chooseSkin(page, width, { theme, scheme }) {
  const html = page.locator('html');
  if ((await html.getAttribute('data-theme')) !== theme)
    await (width > 760
      ? page.locator('.theme-switch button').nth(theme === 'plaid' ? 0 : 1)
      : page.locator('.theme-switch')
    ).click();
  await expect(html).toHaveAttribute('data-theme', theme);
  if (theme !== 'slate') return;
  if (width > 760)
    await page
      .locator('.scheme-switch button')
      .nth(['system', 'light', 'dark'].indexOf(scheme))
      .click();
  else
    for (let i = 0; i < 3; i++) {
      if ((await html.getAttribute('data-color-scheme')) === scheme) break;
      await page.locator('.scheme-switch').click();
    }
  await expect(html).toHaveAttribute('data-color-scheme', scheme);
}
