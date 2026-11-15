# Mesa piloto

Prototipo desechable de la grilla del garzón de iClub. Requiere Node.js 20.19+ o 22.12+ y pnpm.

```sh
pnpm install
pnpm dev
pnpm build
```

Selecciona una mesa para cambiar su estado y combinar llamados. El interruptor cambia el tratamiento visual de los mismos componentes; el estado vive solo durante la sesión de la página.

## Reconstrucción

El tablero, el mantel diagonal, la placa y los sellos son SVG en línea. El cuadrillé usa un patrón y la veta usa `feTurbulence`; CSS cambia el acabado para el tema moderno. La composición conserva la silueta y el contraste de la referencia, y permite escalar y combinar estados sin generar sprites. Las imágenes en `public/ref` se usan únicamente para comparación.

Lo más costoso fue aproximar el relieve de la madera, el textil y las chapas con formas, degradados y sombras. El ruido procedural sugiere material, pero no reproduce exactamente las fibras, el bisel ni el desgaste de los bitmaps originales; la placa usa Georgia en vez de una fuente redistribuida del PSD. Los múltiples llamados se presentan juntos como una decisión del piloto, ya que no hay una referencia de esa combinación. No se intentó una reproducción píxel a píxel.
