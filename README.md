# plaid

Plaid is a skeuomorphic UI kit built on [UI SDK](https://ui-sdk.dev), and Restaurant El Clan is a demo app made with it: a reconstruction of iClub built for moon's portfolio. Textures, relief and real-looking materials (tablecloth, paper receipts, seals, a leather-bound reservation book) sit on top of the accessible behavior of a modern component library. The look is deliberately the skeuomorphic style of the early 2010s, before flat design, chosen on purpose rather than left over from the past.

Every piece comes in two skins, Plaid (tactile) and Slate (flat), so the two approaches can be compared side by side. The UI is available in Spanish and English.

## Live

- **[Demo](https://plaid-ui-kit.vercel.app/)**: a whole restaurant on a tablet. Order from the table, follow your order and pay the bill, or switch to the waiter or kitchen view to run the floor. Change the skin, language or theme and try everything.
- **[UI kit](https://plaid-ui-kit.vercel.app/componentes)**: the component gallery. Every piece in its states, grouped as standalone components, restaurant components and the tartan designer, each with the UI SDK primitives it uses.

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
pnpm lint
```

## Deployment

The Vercel configuration includes the rewrite needed to reload SPA routes. Production: https://plaid-ui-kit.vercel.app (production branch `main`; every PR gets a preview).
