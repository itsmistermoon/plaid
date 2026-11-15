# vercel-labs/ui: qué ofrece y si sirve para una UI esqueuomórfica vectorial

Ticket: https://github.com/itsmistermoon/plaid/issues/2 · Revisado el 2026-11-15 contra el commit `98ba9fd` de https://github.com/vercel-labs/ui

## Respuesta corta

vercel-labs/ui es **UI SDK**, una librería *headless* de comportamientos (teclado, foco, selección, popups, drag and drop, ARIA) sin estilos. No trae texturas, relieves ni un look propio: **no aporta nada a lo visual esqueuomórfico**, pero tampoco lo estorba, porque todo el aspecto queda en tu CSS/SVG. Sirve como base de comportamiento y accesibilidad para la galería, y su `createPreference` resuelve el switch de tema original/moderno con un atributo `data-*`. Riesgo: está en beta (`0.1.0-beta.5`) y sujeto a los términos beta de Vercel.

## Hallazgos

- **Qué es.** "A library of behaviors for agents to build the next generation of user interfaces." Los comportamientos viven en `@ui-sdk/core`, con adaptadores para React, Vue, Svelte, Solid y Web Components. Fuente: `README.md`.
- **Sin estilos.** Los primitivos (`definePrimitive`) se definen "with no styles"; los adaptadores (`createParts`) dejan que "You write the markup and styles. State shows up as data attributes and CSS variables." Fuente: `AGENTS.md`, líneas 8-9.
- **Componentes.** Hay 54 ejemplos en `examples/components/` (accordion, button, checkbox, combobox, dialog, menu, number-input, radio, segmented-control, etc.). Su estilo de ejemplo (`examples/styles/tokens.css`) es plano y moderno: tokens `--ink`, `--paper`, `--surface-*` y sombras suaves con `light-dark()`. Sirve de referencia para el tema "moderno", no para el original.
- **Theming.** No hay sistema de temas visual. Hay dos piezas útiles:
  - `createColorScheme`: light/dark/system, guardado y aplicado desde el primer paint (guía `apps/docs/content/docs/guides/dark-mode.mdx`).
  - `createPreference`: preferencia genérica con `values`, `defaultValue` y un `attribute` `data-*`, persistible con `createLocalStorage`; "You decide what each value looks like." (`apps/docs/content/docs/core/behaviors/preferences.mdx`). Un `data-theme="original|moderno"` sale directo de aquí.
- **Esqueuomorfismo.** Como no hay estilos, texturas (mantel cuadrillé), relieves y biseles se hacen con SVG (patterns, filtros `feTurbulence`/`feDiffuseLighting`, gradientes) y CSS (`box-shadow` en capas, `border-image`), keyed a los data attributes de estado (`data-pressed`, `data-checked`, etc.) que expone el SDK.
- **Madurez.** Todos los paquetes en `0.1.0-beta.5`; README: "UI SDK is in beta ... the framework, APIs, documentation, and behavior may change before general availability." Docs: https://ui-sdk.dev/docs. Pensado para que agentes escriban los primitivos (`npx skills add vercel-labs/ui --skill ui-sdk`).
- **Licencia.** Apache 2.0 (`LICENSE`).

## Recomendación para plaid

Úsalo solo si quieres accesibilidad y teclado correctos en controles interactivos (menús, diálogos, selectores). Para un demo mayormente visual, el valor está en `createPreference` para el switch de tema; la parte esqueuomórfica es trabajo propio de SVG/CSS en cualquier caso. Evalúa el costo de una dependencia beta frente a botones y paneles en HTML nativo.
