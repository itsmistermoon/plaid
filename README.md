# Plaid UI Kit

A component kit built on [UI SDK](https://ui-sdk.dev), and Restaurant El Clan, a complete restaurant app made with it. I'm Juan Pablo Armstrong; I designed and coded both.

[Demo](https://plaid-ui-kit.vercel.app/) · [UI kit](https://plaid-ui-kit.vercel.app/componentes) · [Case study](https://jparmstrong.vercel.app/en/plaid-ui-kit)

## Origin

Plaid rebuilds iClub, an Android app for ordering from the table in restaurants, on tablets. From December 2011 to April 2012 I designed its whole interface as a freelance UI designer ([iClub on Behance](https://www.behance.net/gallery/43812871/iClub-Interactive-menu-for-restaurants-on-tablets)). Fourteen years later I rebuilt it, this time writing the code as well.

It keeps the skeuomorphic style of that time: screens that imitate real materials, with depth and shadows. Here that means a tablecloth, paper receipts, seals and a leather-bound reservation book. UI SDK provides the accessible behavior (menus, dialogs, selects, the command palette) and Plaid only adds the look.

Every piece comes in two skins, Plaid (tactile) and Slate (flat), so you can compare them side by side. The UI is in Spanish and English.

## What's in it

- **[Demo](https://plaid-ui-kit.vercel.app/)**: a whole restaurant on a tablet. The diner orders from the table, follows the order and pays the bill. The waiter sees the floor, moves and joins tables, and takes payment. The kitchen gets tickets on a rail.
- **[UI kit](https://plaid-ui-kit.vercel.app/componentes)**: the component gallery. 27 panels show every piece in its states and the UI SDK primitives it uses, grouped as standalone components, restaurant components and a tartan designer.

The design rules are written down in [`DESIGN.md`](DESIGN.md), each with its reason.

## Tests

- **Unit tests** (Vitest, `pnpm test`): app logic, plus a color test that reads every stylesheet with PostCSS and fails if a color is written outside the design tokens. The few allowed exceptions are listed in `tests/color-exceptions.json`.
- **Layout tests** (Playwright, `pnpm test:layout`): they measure the position and size of controls in each skin, language and light or dark mode, so switching any of them never moves or resizes a control.

## Development

Requires Node.js and pnpm.

```sh
pnpm install
pnpm dev
```

The demo lives at `/demo` and the gallery in three views: `/componentes` (standalone components), `/componentes/restaurant` and `/componentes/tartan`. The English routes are `/en/demo`, `/en/components`, `/en/components/restaurant` and `/en/components/tartan`.

```sh
pnpm build
pnpm test
pnpm test:layout
pnpm lint
```

## Deployment

The Vercel configuration includes the rewrite needed to reload SPA routes. Production: https://plaid-ui-kit.vercel.app (production branch `main`; every PR gets a preview).
