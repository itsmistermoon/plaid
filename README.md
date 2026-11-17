# plaid

A demo of Restaurant El Clan, a reconstruction of iClub built for moon's portfolio.

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
