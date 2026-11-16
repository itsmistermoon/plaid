# DESIGN.md

Reglas de diseño de plaid (demo de El Clan, reconstrucción de iClub). Cada regla viene de una corrección de moon; el comentario guarda la fecha y sus palabras.

## Surfaces

- **En el tema original, todo elemento se reconstruye con CSS/SVG propio, tomando del original su forma, materiales y proporciones. Nunca se calcan bitmaps ni se pegan imágenes del PSD.**
  Why: el objetivo es mostrar cómo una interfaz esqueuomórfica funcionaría hoy, no una copia pixel a pixel.
  <!-- 2026-11-15: "no es necesario pixel por pixel, puede ser una reinterpretación reconstruida de forma vectorial" -->
- **Cuando una pieza del original se ve tosca, se rediseña como un objeto físico de calidad en vez de copiarla. Que se reconozca el original importa más que la fidelidad.**
  Why: la pieza debe sentirse distinta y "especial", no arrastrar la tosquedad del original.
  <!-- 2026-11-16: "no necesariamente el mismo diseño original (ahora que lo veo es bastante tosco), pero sí algo que haga se sienta distinto y especial" -->
- **Las piezas emblemáticas del original (lector QR, mantel, sellos, boleta) conservan su anatomía: las mismas partes, en la misma posición y con las mismas proporciones.**
  Why: son la firma visual de iClub.
  <!-- 2026-11-16: "el lector qr puede ser más similar al diseño original" -->
- **La cinta de título es una tela que cuelga desde el borde superior del panel, sin pliegue ni parte trasera. Termina en cola de golondrina con dos puntas, nunca desborda el layout y usa el verde de acento saturado, nunca una versión pálida.**
  Why: el efecto de tela plegándose desde atrás no se leía convincente; solo queda la parte que va por encima.
  <!-- 2026-11-16: "una tela que viene plegándose desde atrás del contenedor principal, además usa un color muy pálido" / "no tiene las dos puntas" -->
  <!-- 2026-11-16: "con este efecto me rindo, deja solo la parte que queda por encima y elimina el efecto de pliegue hacia atrás" -->
- **El mantel cuadrillé es más grande que la mesa: sobrepasa sus puntas y se recorta.**
  Why: así es el original.
  <!-- 2026-11-15: "Que el mantel sobrepase sus puntas igual que en el original" -->
- **El papel de la boleta tiene el borde superior entero, sin dientes ni prepicado. Los dientes van solo en el borde inferior.**
  Why: el papel sale de la ranura, así que arriba no hay corte.
  <!-- 2026-11-16: "el borde superior del papel no debería verse prepicado sino que entero" -->
- **En el tema original, el papel siempre nace desde adentro de una ranura: la boca de la ranura queda por encima del borde del papel y es más ancha que él, con una sombra interior donde el papel entra.**
  Why: si el papel no sale de la ranura, se pierde la ilusión esqueuomórfica.
  <!-- 2026-11-16: "el papel no sale de la supuesta ranura de la impresora, mata la ilusión esqueumórfica" -->
- **El tema moderno no simula objetos físicos: sin ranuras, impresoras ni papel. La boleta es una tarjeta limpia.**
  Why: el tema moderno no simula papel impreso.
  <!-- 2026-11-16: "en la versión moderna, la info no debería tener ranura de impresora, ya que no simula un papel siendo impreso" -->
- **El tema moderno es plano, estilo shadcn, con el verde del mantel como acento. Solo cambia la piel; la estructura, los tamaños y las posiciones son las mismas en ambos temas.**
  Why: permite comparar los dos temas uno al lado del otro.
  <!-- 2026-11-15: "un switch que cambie entre el diseño original y uno más limpio y moderno" -->

## Color

- **Comensal y Garzón usan la misma estructura: la misma barra superior, el mismo ancho y fondo de sidebar, los mismos botones y badges. El color sale siempre de variables por tema y nunca de un valor fijado en una sola vista.**
  Why: tienen que verse como una sola app.
  <!-- 2026-11-16: "deben ser consistentes: mismo verde en la barra superior, botones, etc." -->
- **Las barras de navegación (superior, sidebar y tabbar del teléfono) usan el mismo material oscuro; el verde de acento solo marca el ítem activo.**
  Why: la tabbar verde brillante competía con el contenido y no se veía parte de la misma app.
  <!-- 2026-11-16: aprobado por moon tras auditoría -->

- **En el tema moderno, las superficies usan grises neutros (zinc/neutral), nunca grises cálidos o beige.**
  Why: los grises cálidos en fondos, pestañas y paneles delatan una interfaz genérica hecha por IA.
  <!-- 2026-11-16: "cambia esos colores medio cálidos en las superficies que gritan hecho por Claude" -->

## Typography

- **Tipografías: Courier Prime para la boleta, Outfit 700 para los títulos, Kaushan Script para el logo e Inter para la interfaz. No se agregan otras.**
  Why: las eligió moon.
  <!-- 2026-11-15: "elijo: Courier Prime, Outfit 700, Kaushan Script, Inter" -->
- **Los íconos son de `lucide-react`; nunca se dibujan íconos propios. Los sellos usan `strokeWidth` 3. Agregados usa `BadgePlus`.**
  Why: los íconos dibujados a mano se veían mal.
  <!-- 2026-11-15: "Los badges vectorizados se ven muy mal, reemplázalos por los iconos de Lucide, en su versión más ancha" / 2026-11-16: "usa badge-plus en este icono" -->

## Spacing & layout

- **Ninguna cifra que cambie puede mover el layout: se usan `tabular-nums` y columnas de ancho fijo. Los controles tienen el mismo tamaño y posición en ambos temas e idiomas, con el ancho calculado para el texto más largo entre ES y EN.**
  Why: si las cosas se mueven, la interfaz se siente desordenada.
  <!-- 2026-11-16: "establecer anchos fijos para que las columnas y el contenido no bailen" / "Deben estar en posiciones y tamaños independiente del estilo e idioma" -->
- **Las barras fijas (sticky), como pestañas y encabezados, tienen fondo opaco y el contenido pasa por debajo de ellas.**
  Why: si el contenido se ve a través, la interfaz parece rota.
  <!-- 2026-11-16: "que las pestañas superiores queden fijas y el menú se deslice por debajo, sin ser visible por detrás" -->

## Motion

- **No se agregan animaciones decorativas de entrada. Solo se anima lo que responde a una acción, como el clic de la rueda.**
  Why: la animación de impresión no aportaba nada.
  <!-- 2026-11-16: "quítale la animación de papel imprimiéndose, no es necesaria" -->

## Interaction

- **En toda pantalla con contenido que puede crecer, la acción principal va arriba a la derecha y siempre queda visible. Nunca va al final del contenido.**
  Why: con una boleta larga el botón quedaba fuera de vista.
  <!-- 2026-11-16: "pondría el botón de acción arriba a la derecha... para casos donde la boleta es muy larga el botón queda fuera de vista" -->
- **El dato más importante de una pantalla (por ejemplo, el total de pedido o cuenta) queda siempre visible junto a la acción principal, aunque se repita en otra parte y rompa la metáfora física.**
  Why: es la información más importante y tiene que verse de inmediato.
  <!-- 2026-11-16: "aunque rompe la ilusión de la boleta en papel, el monto total debería estar replicado arriba a la derecha, junto al botón" -->
- **Los controles de cantidad dan respuesta física en cada paso (tope, sonido, vibración). Su dirección coincide con la flecha: subir aumenta, y los números mayores quedan arriba.**
  Why: la rueda tiene que comportarse como un objeto real.
  <!-- 2026-11-16: "que se sienta que hace clic cada vez que gira" / "hay que invertir la dirección de los números" -->
