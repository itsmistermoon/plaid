# plaid

Demo de El Clan, una reconstrucción de iClub para el portfolio de moon.

## Desarrollo

Requiere Node.js y pnpm.

```sh
pnpm install
pnpm dev
```

La demo está en `/demo` y la galería en `/componentes`. Las rutas en inglés son `/en/demo` y `/en/components`.

```sh
pnpm build
pnpm test
pnpm lint
```

## Publicación

La configuración de Vercel incluye el rewrite necesario para recargar las rutas de la SPA. Queda pendiente conectar un proyecto de Vercel al repositorio y anotar aquí la URL de producción cuando moon configure la cuenta.
