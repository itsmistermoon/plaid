# Cómo está construido spec-01 como galería de componentes

Ticket: https://github.com/itsmistermoon/plaid/issues/3 · Investigado 2026-11-15 sobre `shuding/spec-01@b8f91b6` (2026-11-14).

## Respuesta corta

spec-01 es un SPA **Vite 8 + React 19 + TypeScript**, sin Tailwind ni librería de estilos: **CSS plano** escopado a `[data-skin="hardware"]` con hooks `data-kit`. Los comportamientos (foco, teclado, ARIA, selección, popups, drag) vienen de **UI SDK** (`@ui-sdk/core` + `@ui-sdk/react`), que **es** `vercel-labs/ui`. La galería es una sola página-grilla de paneles numerados, uno por componente, cada uno renderiza un *demo* vivo; los estados se muestran interactuando, no como matriz estática. El mismo código se publica como **registry shadcn** (`/r/*.json`). El repo es público (MIT): https://github.com/shuding/spec-01, autor Shu Ding.

## Stack (fuente: `package.json`, `vite.config.ts`, `vercel.json`, bundle)

- Deps: `react`/`react-dom` 19.2.3, `@ui-sdk/core` y `@ui-sdk/react` `0.0.0-20261111125312.ga16c1d57` (beta, pin exacto), `@carbon/icons-react`, `@vercel/analytics`. Dev: `vite` ^8, `@vitejs/plugin-react`, `typescript` ~5.9, `shadcn` ^4 (solo para construir el registry). — `package.json`
- Deploy en Vercel como SPA: `vercel.json` reescribe todo a `/index.html`. El HTML servido es un `<div id="root">` con un bundle (`/assets/index-*.js`, ~870 KB, y `index-*.css`, ~430 KB); sin sourcemaps públicos.
- Router casero (~30 líneas) en `src/main.tsx`: `useSyncExternalStore` sobre `location.pathname` + interceptor de clicks en `<a>` y `history.pushState`. Rutas: `/` (catálogo) y 7 "devices" (`/music`, `/paint`, `/midi`, `/timer`, `/color`, `/image`, `/dashboard`) — `src/Site.tsx`.
- Fuente propia "Spec Mono" subseteada con `scripts/fonts/subset.py` (bloque generado en `index.html`).

## UI SDK = vercel-labs/ui

`gh repo view vercel-labs/ui` → "A library of behaviors for agents to build the next generation of user interfaces", homepage https://ui-sdk.dev. Su README: teclado, foco, selección, dismissal, popups, drag and drop y ARIA viven en `@ui-sdk/core`, con adaptadores React/Vue/Svelte/Solid/Web Components; está en beta. spec-01 importa primitivas headless, p. ej. `import { Switch as SdkSwitch, SwitchThumb } from "@ui-sdk/react/switch"` (`registry/hardware/ui/switch.tsx`) y `RadioGroup` para el selector de color (`src/LabPanel.tsx`), y les pone encima piel + haptics + sonido.

## Estructura del repo

```
registry/hardware/
  ui/            61 componentes (*.tsx) + ui/hardware/*.css (tokens, skin, texturas, uno por familia)
  examples/      <componente>-demo.tsx, uno por panel del catálogo
  blocks/        7 devices compuestos (music-player, paint, timer, ...)
  lib/           haptics, sound, input-modality, block-caret, safari-tabbing, install
src/
  main.tsx       router + installHardware()
  Site.tsx       frame, navbar, páginas
  catalog/       Catalog.tsx (grilla), dashboard.tsx (Panel), sdk-chain.ts (generado)
scripts/registry.mjs  genera registry.json desde los imports y corre `shadcn build` → public/r/*.json
```

## Cómo presenta componentes y estados

- `src/catalog/Catalog.tsx`: una grilla CSS (`data-kit="grid"`) con `<Panel n="05" title="Slider" uses={["slider","field"]} wide>` que envuelve `<SliderDemo />`. ~52 paneles numerados. Un hook `useFilledGrid` (ResizeObserver) ensancha paneles para tapar huecos que deja `grid-auto-flow: dense`.
- `Panel` (`src/catalog/dashboard.tsx`): `<section aria-label>` → `caption` (número + título) → `stage` → `surface` con el demo. Flags `wide`/`tall`. El título abre un `HoverCard` con la "SDK chain": qué behaviors, core APIs y foundation usa el componente, leído de `sdk-chain.ts` generado desde `@ui-sdk/core`; si no usa nada dice "none, presentational".
- Los demos son mínimos y vivos: `switch-demo.tsx` es `<Switch label="Power" defaultChecked />`; `button-demo.tsx` muestra variantes lado a lado (`tone="primary"`, default, `round`). No hay matriz de estados (hover/disabled/pressed) ni Storybook; los estados se ven usándolos, y el CSS los estiliza por atributos que pone UI SDK (`[data-checked]`, `[data-highlighted]`, `[aria-expanded="true"]` en `hardware.css`).
- Theming global: un selector de "key color" (`src/LabPanel.tsx`) escribe `--theme-l/c/h` (OKLCH) y `data-key` directo en el root `[data-skin]`, sin re-render de React; `tokens.css` deriva roles (`--key-ink`, `--key-lamp`, `--key-glow`, ...) con relative color syntax.
- Devices: páginas que componen los mismos componentes en un producto creíble; prueban el kit en contexto.

## Cómo dibuja lo esqueuomórfico

Casi todo es **CSS** (gradientes, `box-shadow`, texturas en `hardware-textures.css`); solo 1 `<svg>` inline en `ui/`. Cada parte lleva `data-kit="..."` y el skin la estiliza; no hay clases utilitarias.

## Patrones a adoptar en plaid

1. **Panel = demo vivo**: una grilla de paneles numerados, cada uno renderiza un archivo `examples/<x>-demo.tsx` independiente. Barato de mantener y demuestra interacción real. Para plaid (tablet de restaurante) conviene añadir lo que spec-01 no tiene: variantes de estado explícitas (disabled, pressed, error) en el mismo demo cuando no se alcancen interactuando.
2. **Separar comportamiento de piel**: primitivas headless (UI SDK u otra) + estilos propios por `data-*`. El skin vectorial de plaid queda aislado y reemplazable.
3. **Tema por custom properties en el root**, no por estado React.
4. **Devices/pantallas compuestas** como segunda capa: además del catálogo, 1–2 pantallas reales (comanda, mesa) armadas con los componentes.
5. **Router mínimo** y SPA en Vercel con rewrite; no hace falta Next.
6. Opcional, después: publicar como registry shadcn (`scripts/registry.mjs`). No es necesario para un demo.

Diferencia a considerar: plaid es vectorial; spec-01 usa CSS en vez de SVG. Si plaid necesita fidelidad de ilustración, el patrón de grilla/panel/demo aplica igual con componentes SVG.

## Fuentes

- https://spec-01.vercel.app/ (HTML, `/r/registry.json`, bundle)
- https://github.com/shuding/spec-01 — `README.md`, `package.json`, `vercel.json`, `src/main.tsx`, `src/Site.tsx`, `src/catalog/Catalog.tsx`, `src/catalog/dashboard.tsx`, `src/LabPanel.tsx`, `registry/hardware/ui/switch.tsx`, `registry/hardware/ui/hardware/tokens.css`, `scripts/registry.mjs`
- https://github.com/vercel-labs/ui — `README.md`; https://ui-sdk.dev
