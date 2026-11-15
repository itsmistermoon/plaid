# Skills de emilkowalski: qué cubren y cómo se integran a plaid

Ticket: https://github.com/itsmistermoon/plaid/issues/4
Fuente primaria: https://github.com/emilkowalski/skills (commit `64eb3de`, 2026-11-15): `README.md`, `skills/*/SKILL.md` (frontmatter) y `skills/ask-emil/SKILL.md` (mapa de flujos).

## Respuesta corta

Son 20 skills de diseño de interfaz, casi todas sobre animación y pulido web, más algunas de referencia (filosofía de Emil, Apple, vocabulario). Se instalan con `npx skills@latest add emilkowalski/skills` (README, sección "Install") y en Claude Code se invocan como `/nombre`. La mayoría también se activa sola por su `description`; cinco tienen `disable-model-invocation: true` y solo corren invocadas a mano. Para plaid (web, solo frontend, UI esqueuomórfica vectorial de tablet) sirven el flujo principal web y las referencias. Las de React Native (`animate-expo`), Swift (`write-swift`) y Sonner (`ask-sonner`) no aplican.

## Catálogo (según el frontmatter de cada SKILL.md)

Las marcadas con (manual) tienen `disable-model-invocation: true`.

| Skill | Qué guía | ¿Le sirve a plaid? |
| --- | --- | --- |
| `emil-design-eng` | Filosofía base de pulido: estados press/hover, origen de popovers, timing de tooltips, transitions vs keyframes, clip-path, detalles de drag. Es la de respaldo cuando ninguna más específica calza. | Sí, es la referencia base |
| `apple-design` | Principios de Apple llevados a la web: springs, gestos, materiales translúcidos y profundidad, tipografía, reduced-motion. | Sí, por el look tablet y la profundidad |
| `animation-vocabulary` | Glosario inverso: de una descripción vaga al término exacto ("pop in", "rubber-banding"). | Sí, para pedir bien las cosas |
| `animate` | Construye una animación web desde cero: si animar o no, herramienta, propiedades, curva, duración, interrupción, salida. | Sí |
| `choreograph` | Coordina varios elementos que se animan juntos: staggers, entradas hero, cambios de vista. | Sí |
| `gestures` | Drag, swipe y sheets que siguen el dedo 1:1 y se pueden interrumpir. | Sí, la UI es táctil |
| `mobile-native` | Arreglos de CSS y meta tags para que una web se sienta nativa en el teléfono o la tablet: hover pegado, tap highlight, el bug de 100vh, safe areas. | Sí, si se prueba en una tablet real |
| `animation-performance` | Animaciones que botan frames: propiedades que solo pasan por el compositor, `will-change`, CSS vs JS. | Sí, relevante con SVG pesado |
| `break-ui` | Somete un componente a datos extremos detrás de un toggle "Demo data / Worst case" y reporta qué se rompe. | Sí (nombres de platos, montos) |
| `review-animations` (manual) | Revisión estricta del motion en el diff. | Sí, antes de cerrar un PR |
| `improve-animations` | Auditoría de solo lectura de todo el motion, con planes priorizados que otro agente puede ejecutar. | Más adelante |
| `find-animation-opportunities` | Solo lectura: propone dónde agregar motion, con valores exactos. | Más adelante |
| `remove-animations` | Saca el motion que sobra; solo resta. | Más adelante |
| `prototype` (manual) | Arma varias versiones distintas de una pieza detrás de un selector en vivo y promueve la elegida. | Sí, para decisiones de look |
| `pick-ui-library` (manual) | Elige una librería de una lista curada (primitives, drawers, charts, etc.). | Solo si hace falta una dependencia |
| `learn-taste` (manual) | Al cierre de la sesión, convierte las correcciones de diseño en reglas con su porqué en `DESIGN.md`, en una skill del proyecto o en un lint. | Sí, al final de cada sesión |
| `ask-emil` (manual) | Router: dada tu situación, recomienda una skill o una secuencia. | Sí, cuando hay dudas |
| `ask-sonner` | Guía de Sonner (toasts en React). | Solo si se usa Sonner |
| `animate-expo` | Animación en React Native/Expo. | No |
| `write-swift` | Swift moderno. | No |

El repo trae además `ui-cheatsheet.md` y `performance-cheatsheet.md` (tablas problema/solución) en la raíz. No son skills.

## Flujo recomendado por el autor (`ask-emil/SKILL.md`)

1. **Idea:** `/prototype` cuando cuesta resolver con palabras cómo debe verse algo.
2. **Construcción:** `/pick-ui-library` si hace falta una dependencia; `/animate` para una animación; `/choreograph` para varios elementos; `/gestures` para interacción con el dedo.
3. **Romperlo:** `/break-ui`, `/review-animations`, `/mobile-native` y `/animation-performance`.
4. **Aprender:** `/learn-taste` al final de la misma sesión.

Mantenimiento, sobre código ya existente: `/improve-animations` (motion malo), `/find-animation-opportunities` (motion que falta) y `/remove-animations` (motion que sobra). Referencias que las demás usan por debajo: `emil-design-eng`, `apple-design` y `animation-vocabulary`.

## Instalación e invocación

- Instalación (README): `npx skills@latest add emilkowalski/skills`. Usa el CLI de skills.sh; el badge del README apunta a https://skills.sh/emilkowalski/skills. No lo ejecuté. Las opciones del CLI (alcance de proyecto o global, elegir un subconjunto) quedan por verificar al instalar, con `npx skills@latest add --help`.
- Formato: cada skill es `skills/<nombre>/SKILL.md` con frontmatter `name`/`description` y, a veces, archivos de apoyo (`RECIPES.md`, `STANDARDS.md`, `AUDIT.md`, `CATALOG.md`). Es el formato estándar de Agent Skills de Claude Code, así que también se puede copiar a mano a `.claude/skills/` del repo.
- Invocación: `/nombre` en Claude Code. Las que no tienen `disable-model-invocation` también se activan solas cuando la tarea calza con su `description`.

## Sugerencia de integración en plaid

Instalarlas con alcance de proyecto (versionadas en el repo) y dejar fuera `animate-expo`, `write-swift` y `ask-sonner`. Usar `/learn-taste` al cierre de cada sesión de UI para que `DESIGN.md` acumule las reglas de estilo esqueuomórfico.
