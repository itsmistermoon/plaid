# Sustitutos tipográficos libres para la tipografía de iClub

Ticket: https://github.com/itsmistermoon/plaid/issues/9
Mapa: https://github.com/itsmistermoon/plaid/issues/1

## Pregunta

Cuatro fuentes comerciales de iClub necesitan un reemplazo libre para web:

| Original | Uso en iClub | Fuente de referencia |
|---|---|---|
| American Typewriter | boleta y precios | `fonts/amrtypen.ttf`, `amrtypeb.ttf`, `ATLC__LH.TTF` (Linotype, `fsType` 2) |
| Museo 700 | títulos grandes del inicio ("Menú", "Carrito", "Pagar") | nombrada en `home.psd`; no está en la carpeta |
| BrushtipTravis | logo "Logo Restaurant" | nombrada en `home.psd`, `detalle.psd`, `carrito.psd`, `login.psd`; no está en la carpeta |
| Helvetica Neue | texto de la UI | nombrada en casi todos los PSD; no está en la carpeta |

Inventario de referencia: `research/inventario-activos.md` (rama `research/inventario`, sección 2).

## Criterio

- Licencia libre para web: OFL 1.1 o Apache 2.0.
- Disponible en Google Fonts y en Fontsource.
- Parecido visual con la original.
- Pesos disponibles (relevantes para títulos y UI).

## Cómo se verificó

- **Licencia, pesos, versión y paquete:** API de Fontsource (`https://api.fontsource.org/v1/fonts/<id>`) y registro npm de `@fontsource/<id>` (versión 5.3.0 para todas las candidatas). Ambas fuentes coinciden en la licencia.
- **Fuente de la licencia:** el campo `license` de Fontsource (procedente de `github.com/google/fonts`). El texto completo de la OFL 1.1 está en el repositorio de Google Fonts junto a cada familia.
- **Parecido visual:** no quedó verificado. Intenté renderizar muestras en `/tmp/rex-teams/plaid-inv/scratch/fonts/`, pero la inserción de texto falló y el PNG resultante solo tiene los encabezados. Las recomendaciones de parecido son juicio de diseño, no comparación medida. Hay que confirmarlo antes de decidir.

## Hallazgos por fuente

### 1. American Typewriter (boleta y precios)

Es una slab serif con carácter de máquina de escribir. Como la boleta necesita números alineados, conviene una fuente proporcional o una monoespaciada con buena lectura de cifras.

| Candidata | Categoría | Licencia | Pesos | Fontsource | Parecido |
|---|---|---|---|---|---|
| **Rokkitt** (recomendada) | slab serif | OFL 1.1 | 100–900 (variable) | `@fontsource/rokkitt` | Alto en la estructura de slab; no imita la máquina |
| **Courier Prime** (alternativa) | monoespaciada | OFL 1.1 | 400, 700 + itálica | `@fontsource/courier-prime` | Alto en el carácter de máquina; ancho fijo |

Otras consideradas: Arvo (OFL 1.1, 400/700, slab geométrica) y Zilla Slab (OFL 1.1, 300–700). Se descartan por tener menos parecido con el trazo de la original.

Recomendación: **Rokkitt**. Si el objetivo es que la boleta parezca impresa en máquina, **Courier Prime**.

### 2. Museo 700 (títulos grandes)

Es una sans geométrica-humanista de trazo grueso. La licencia de Museo no quedó verificada: la página de exljbris respondió HTTP 200, pero no pude extraer el texto de licencia. Se trata como comercial hasta confirmar lo contrario.

| Candidata | Categoría | Licencia | Pesos | Fontsource | Parecido |
|---|---|---|---|---|---|
| **Outfit** (recomendada) | sans geométrica | OFL 1.1 | 100–900 (variable) | `@fontsource/outfit` | Alto en la geometría y el peso de títulos |
| **Nunito** (alternativa) | sans redondeada | OFL 1.1 | 200–900 (variable) | `@fontsource/nunito` | Medio; más redondeada que Museo |

Otra considerada: Fredoka (OFL 1.1, 300–700), redondeada y de tono más infantil; se descarta para títulos de restaurante.

Recomendación: **Outfit 700**.

### 3. BrushtipTravis (logo manuscrito "Logo Restaurant")

Es un script con punta de pincel. La licencia de la original no es deducible de los insumos. Como el logo es una pieza de marca, el reemplazo debe servir para el logo mismo y no solo para texto.

| Candidata | Categoría | Licencia | Pesos | Fontsource | Parecido |
|---|---|---|---|---|---|
| **Kaushan Script** (recomendada) | script de pincel | OFL 1.1 | 400 | `@fontsource/kaushan-script` | Alto en trazo de pincel y enlace |
| **Caveat Brush** (alternativa) | manuscrita con pincel | OFL 1.1 | 400 | `@fontsource/caveat-brush` | Medio; más cercana a manuscrito de marcador |

Otra considerada: Permanent Marker (Apache 2.0, 400), más de marcador grueso; se descarta.

Recomendación: **Kaushan Script**. Para un logo, conviene además vectorizar el resultado final, porque la licencia de OFL no impide hacerlo pero Fontsource solo entrega WOFF2/WOFF.

### 4. Helvetica Neue (texto de la UI)

Helvetica Neue es comercial (Linotype/Monotype). Se incluye una copia local en macOS (`/System/Library/Fonts/HelveticaNeue.ttc`) solo como referencia visual.

| Candidata | Categoría | Licencia | Pesos | Fontsource | Parecido |
|---|---|---|---|---|---|
| **Arimo** (recomendada) | sans neogrotesca | OFL 1.1 | 400, 500, 600, 700 | `@fontsource/arimo` | Alto; métricas compatibles con Arial, que deriva de Helvetica |
| **Inter** (alternativa) | sans neogrotesca moderna | OFL 1.1 | 100–900 (variable) | `@fontsource/inter` | Medio; x-height mayor, más moderna |

Recomendación: **Arimo** si importa el parecido con Helvetica. **Inter** si se busca una UI más moderna y pesos intermedios.

## Qué no se resolvió

- Parecido visual de todas las candidatas (render fallido; ver "Cómo se verificó").
- Licencia exacta de Museo 700 y BrushtipTravis.
- Muestras de Museo y BrushtipTravis para comparar: no están en la carpeta de referencias.

## Decisión pendiente

No hay decisión tomada. Moon elige entre las recomendaciones de cada categoría, idealmente después de comparar muestras con las imágenes de referencia en `~/Downloads/iClub/` (carrito.jpg, home basket.jpg, lista menu.jpg, logorestaurant.png).
