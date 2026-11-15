STATUS: completed

# Inventario de activos fuente — iClub (~/Downloads/iClub)

## Qué hice
- Solo lectura sobre ~/Downloads/iClub. No se modificó, movió ni borró nada allí.
- Herramientas en /tmp/rex-teams/plaid-inv/scratch/: venv con psd-tools 1.26.1, pymupdf y fonttools; scripts en scratch/inv/; previsualizaciones en scratch/previews/ (composiciones de PSD y hojas de contacto de los sueltos).
- Inventario: 197 archivos = 170 PNG/JPG + 22 PSD + 3 TTF + 1 PDF (más un .DS_Store oculto).
- No se incluyen en este reporte datos personales ni montos (aparecen en presupuesto.pdf y en textos de ejemplo de login.psd y login/login.psd).

---

## 1) PSD

Todos son RGB, 8 bits. "Texto" = capas de texto editables (T). "Vector" = capas de forma con máscara vectorial (V). "Bitmap" = capas de píxeles (P). "SO" = objeto inteligente. Los conteos de estilos de capa salen de buscar firmas de efectos en los datos de cada capa; son aproximados.

### Pantallas en alcance (comensal tablet)

| Archivo | Dimensiones | Pantalla | Grupos principales | Capas (G/T/V/P/SO) | Naturaleza |
|---|---|---|---|---|---|
| home.psd | 1024×600 | Menú principal de la tablet (Menú / Carrito / Pagar, sidebar con perfil) | Fondo (P), main, sidebar, statusbar | 16 / 13 / 23 / 18 / 1 | Texto editable (Museo700 para Menú, Carrito, Pagar; Helvetica Neue para sidebar y barra; BrushtipTravis para el logo). Formas vectoriales con estilos. |
| detalle.psd | 1024×600 | Detalle de producto (foto, descripción, nota adhesiva, contador, boleta mini, Agregar) | fondos, sidebar, statusbar, Vista detalle (base, Boleta, Contador, nota, foto, Zoom, Etiqueta) | 16 / 14 / 20 / 18 / 4 | Texto editable. Foto de producto como bitmap. Formas con estilos. Incluye 4 objetos inteligentes (logo y elementos). |
| carrito.psd | 1024×600 | Carrito / pedido (boleta de papel, ítems, ruleta de cantidad, Realizar pedido) | sidebar, statusbar, base, boton claro, Maquina (barra superior y papel como SO), Boleta (divisiones, textos de ítems y totales, Selector de ruleta, Editar×5) | 17 / 13 / 19 / 18 / 2 | Texto editable (AmericanTypewriter para la boleta). Papel como objeto inteligente. |
| lista menu.psd | 1024×600 | Lista de menú (ítems con foto, precio, checkbox y "Ver en detalle"; categorías Promos, Tragos, Opción 1-3) | fondos, sidebar, statusbar, menu | 29 / 30 / 29 / 19 / 4 | Texto editable (30 capas). Vectores con estilos. Más texto que ninguna otra pantalla. |
| login.psd (raíz) | 1024×600 | Pantalla de inicio: Ingresar / Código QR / Registrarse, y formularios de ingreso y registro | fondos, interfaz registrarse, interfaz ingresar, interfaz QR, interfaz inicio, T Logo Restaurant | 13 / 12 / 13 / 13 / 1 | Texto editable. Contiene textos de ejemplo con datos personales (no reproducidos aquí). |
| login/login.psd | 1024×600 | Variante de login (mismas tres pantallas) | interfaz inicio, interfaz ingresar, interfaz registrarse, T Logo | 12 / 15 / 14 / 9 / 0 | Texto editable. Versión que parece más antigua que login.psd en la raíz (menos capas, mismo tamaño). Contiene textos de ejemplo personales. |

### Pantallas en alcance (smartphone del comensal)

| Archivo | Dimensiones | Pantalla / naturaleza | Grupos / capas | Capas | Naturaleza |
|---|---|---|---|---|---|
| smartphones.psd | 640×960 | App smartphone: pestañas Código QR / Perfil / Mapa y vista QR | patron, pestañas, Seleccionado, Normal, Vista QR | 10 G / 6 T / 15 V / 6 P | Texto editable (HelveticaNeue-Medium 23 pt). Vectores con estilos. Única fuente de la vista de smartphone. |

### Mockups de dispositivo (no son pantallas; son marcos para la pantalla)

| Archivo | Dimensiones | Dispositivo | Capas | Naturaleza |
|---|---|---|---|---|
| tablet.psd | 1277×809 | Tablet Samsung (marco) | 2 P, 1 gradiente (Relleno degradado 1), 1 V ("Forma 1", pantalla de 1026×603 en 129,105) | Marco en bitmap con un degradado y una forma vectorial de recorte de pantalla. Sin texto. |
| web/tablet.psd | 1277×809 | Idéntico en estructura a tablet.psd (tamaño de archivo distinto) | igual | Duplicado de tablet.psd. |
| smartphone.psd | 822×1575 | Smartphone LG, con la pantalla ya compuesta (barra de pestañas y fondo) | 2 P + 1 V | Marco bitmap + pantalla compuesta en bitmap ("Capa 2") + forma de recorte. |
| smartphone2.psd | 779×1451 | Smartphone Samsung, pantalla vacía (verde de marcador) | 2 P + 1 V | Marco bitmap + forma de recorte. |
| smartphone4.psd | 687×1280 | Smartphone Samsung (otro modelo), pantalla vacía | 1 P + 1 V | Marco bitmap + forma de recorte. |
| smartphone3.psd | 215×400 | Smartphone Samsung con pantalla blanca, con set de iconos de pestañas | 18 P + 1 SO ("fondo seleccionado") | Solo bitmaps (iconos QR, perfil y mapa en estado normal y seleccionado). Sin texto ni vectores. |

### Componentes, grilla de mesas y notificaciones

| Archivo | Dimensiones | Contenido | Capas | Naturaleza |
|---|---|---|---|---|
| mesa notificaciones.psd | 200×200 | Ícono de mesa (ocupada / libre) y sellos de notificación (garzón, pedido, pagar, promo) | 7 G / 4 T / 12 V / 3 P / 2 SO, + ajustes Levels y Hue/Saturation | Texto editable (Georgia Italic 17 pt: "Mesa ocupada" y "Mesa libre"). Vectores con estilos. Ajustes de color aplicados. |
| Kit interfaz.psd | 600×848 | Kit de componentes: botones (flecha), selectores, switch, búsqueda, scrollbar, progress bar, player, selector desplegable, numéricos, favoritos | 52 G / 23 T / 81 V / 13 P (169 capas) | Kit de componentes vectorial con estilos (sombra, degradado, trazo). Texto editable (HelveticaNeue-Bold / Medium). Es la fuente más completa de componentes UI. |
| lista menu/bgbox.psd | 631×120 | Fondo de caja de ítem de lista | 1 P | Bitmap. |
| home/icongarzon.psd | 41×37 | Ícono Garzón | 1 P | Bitmap. |
| home/iconprofile.psd | 41×37 | Ícono Perfil | 1 P | Bitmap. |

### Fuera de alcance (web / admin), registrados igual

| Archivo | Dimensiones | Contenido | Capas | Naturaleza |
|---|---|---|---|---|
| admin.psd | 1280×800 | Vista de administración: grilla de mesas 5×4 con íconos de alerta (dinero, cubiertos, garzón) y estructura de boleta con "Confirmar pedido" | 6 G / 7 T / 6 V / 13 P | Texto editable, bitmaps de mesas. Visibilidad de la boleta no verificada en detalle. Puede ser relevante para la grilla de personal. |
| web.psd | 1280×1400 | Sitio web: navbar, tablet con captura de la app, texto "¿Qué es iClub?", footer con redes | 8 G / 9 T / 14 V / 15 P / 3 SO | Texto editable (ITC Avant Garde Pro Demi, Helvetica, Helvetica Neue). |
| web/tablet.psd | 1277×809 | Ver tablet.psd | — | Duplicado. |
| descarga.psd | 460×145 | Badges de descarga (Android Market, Google Play, App Store) | 3 G / 7 T / 10 V / 7 P / 3 SO | Texto editable (PT Sans Narrow Bold). Vectores con estilos. |

### Sin usar

| Archivo | Dimensiones | Contenido | Capas | Naturaleza |
|---|---|---|---|---|
| (sin usar) detalle.psd | 1024×600 | Versión anterior de detalle con sidebar oculta y textos "Acerca de iClub" | 26 G / 19 T / 27 V / 20 P / 2 SO | Marcado como sin usar en el nombre. Usa Noteworthy-Light y AmericanTypewriter. |

### Estilos de capa en PSD (conteo aproximado)
- Presentes en prácticamente todas las capas vectoriales: sombra paralela (DrSh, decenas de ocurrencias por archivo), sombra interior (IrSh), superposición de degradado (GrFl), trazo (FrFX), bisel y relieve (ebbl), y brillo interior o exterior (IrGl / OrGl) en pocas capas.
- Kit interfaz.psd es el que más usa estilos (216 sombras paralelas, 72 degradados, 65 trazos).
- Los vectores son máscaras vectoriales (vmsk) con relleno sólido (SoCo) y estilos de capa.

---

## 2) Fuentes (carpeta fonts/)

| Archivo | Familia (nombre interno) | Estilo | Licencia (deducida) | Textos de PSD que la usan |
|---|---|---|---|---|
| amrtypen.ttf | AmerType Md BT / American Typewriter Medium BT (Bitstream) | Regular / Medium | Comercial. Copyright Bitstream 1990-1993. Embedding fsType 14 (editable). | Probable correspondencia con "AmericanTypewriter" (regular). Usada en boletas, precios y descripciones: detalle $ a 14 pt, boleta de carrito a 16 pt, home a 8 pt. Correspondencia no confirmada (nombre PostScript distinto). |
| amrtypeb.ttf | AmerType Md BT / American Typewriter Bold BT (Bitstream) | Bold | Comercial. Mismo copyright. fsType 14. | Probable correspondencia con "AmericanTypewriter-Bold": precio "$17.800" (24 pt), "Total: $11.240" (28 pt), "$3.500" (24 pt). |
| ATLC__LH.TTF | ITC American Typewriter LH Light Condensed (Linotype-Hell AG) | Light Condensed | Comercial. fsType 2 (restricted license embedding). | Ninguna referencia en los PSD. No aparece en ningún FontSet. |

Fuentes referenciadas por los PSD y no incluidas en fonts/:
- BrushtipTravis: logo "Logo Restaurant" (97 pt en home, detalle, carrito; 60 pt en login). Color #aee921. Licencia no deducible desde los insumos.
- Museo700-Regular: "Menú", "Carrito", "Pagar" (72 pt en home.psd, color #bfbfbf). Familia de exljbris; licencia no verificada.
- HelveticaNeue (Medium, Bold, Italic, regular) y Helvetica / Helvetica-Bold: textos de UI en casi todos los PSD (Perfil, Garzón, Opciones, username, Nombre Restaurant, Volver, Agregar, descripciones). Fuente comercial de Linotype/Apple, no en la carpeta.
- Noteworthy-Light: "iClub" y "Acerca de iClub" (solo en (sin usar) detalle). Fuente de sistema de macOS.
- Georgia-Italic: "Mesa ocupada" y "Mesa libre" (mesa notificaciones.psd). Fuente de sistema de Microsoft.
- PT Sans Narrow Bold: textos de descarga.psd (ANDROID MARKET, GOOGLE PLAY). Probablemente Open Font License (Google Fonts), no verificado.
- ITC Avant Garde Pro Demi: "Síguenos en twitter/facebook" (web.psd). Comercial.
- MyriadPro-Regular y AdobeInvisFont: aparecen en el FontSet de detalle.psd (y de otros), pero no en los runs de texto revisados. AdobeInvisFont es un marcador interno de Adobe.

Nota de licencia: no verifiqué licencias contra fuentes oficiales. Lo que sí es verificable: los tres TTF incluidos tienen copyright de Bitstream/Linotype y no son de licencia libre.

---

## 3) presupuesto.pdf (1 página)

Alcance original según el documento (sin montos ni datos de contacto):
1. Desarrollo creativo: elementos conceptuales, estilos identificativos, construcción gráfica de la interfaz, implementación general, íconos para apps Android.
2. Interfaz de aplicaciones Android, con cinco módulos: iClub Client, iClub Admin, iClub Personal, iClub QR e iClub "God" (así figura en el documento).
3. Diseño web: implementación de identidad corporativa, aplicación de reglas del manual de marca (tamaños mínimos, colores, otros), aplicación de estilos de interfaz de software, desarrollo de blog de la empresa.
4. Correcciones y ajustes posteriores a nivel de software, con cobro mensual (monto omitido). Condiciones de pago y plazos de entrega "a definir".

Observación: el documento habla de apps Android, mientras los PSD muestran tablet y smartphone; no lo interpreto, solo lo registro.

---

## 4) Íconos, texturas y fondos sueltos

Clasificación por naturaleza. "Vector candidato" = símbolo simple (silueta, línea o forma plana) que podría dibujarse en SVG. "Bitmap" = textura, relieve, brillo, cuero, tela, papel o foto, que tiene detalle que el vector no reproduce.

### Íconos de UI
| Archivo(s) | Qué representa | Tipo |
|---|---|---|
| home/iconconfig.png (41×37) | Engranaje (Opciones) | Vector candidato |
| home/icongarzon.png (41×37), home/iconprofile.png (41×37) | Copa-embudo (Garzón) y silueta (Perfil) | Vector candidato |
| home/iconmenu.png, home/icondrink.png, home/iconpromo.png (95×96) | Íconos de menú, tragos y promo, en tarjetas de cuero/foto | Bitmap |
| iconomenu.png, iconopagar.png, iconopedido.png (111×102) | Tarjetas de cuero con cubiertos, billete y carrito | Bitmap (textura de cuero y costura) |
| icominidrink.png (24×33), icominimenu.png (27×34), icominipromo.png (35×36) | Mini íconos de copa, cubiertos y ticket | Vector candidato |
| notifmozo2.png, notifpago2.png, notifpedido2.png, notifpromo2.png (88×89) | Sellos de notificación metálicos (Garzón, pago, pedido, promo) | Bitmap (relieve metálico) |
| phone/icono QR.png, icono QR select.png (60×60) | Ícono QR normal y seleccionado | Vector candidato (con sombra) |
| phone/icono perfil.png, perfil select (62×62) | Silueta de perfil normal y seleccionada | Vector candidato |
| phone/icono mapa.png, mapa select (63×62) | Ícono de mapa normal y seleccionado | Vector candidato |
| general/facebook*.png, twitter*.png (43×44) | Íconos de redes sociales, encendido y apagado | Bitmap (brillo) |
| helpbutton.png (40×28), general/volver.png (66×28), home/backbutton.png (66×28), basket.png (52×28), general/basket.png | Botones de ayuda, volver y carrito (pills de cuero/verde) | Bitmap |
| editar.png, editar1.png, editar2.png, botones iclub/editar.png (22×23) | Ícono de lápiz en círculo | Vector candidato |
| botondetalle.png (121×29) | Botón "Ver en detalle" | Bitmap (degradado) |
| pagar.png, menu.png, carrito.png, home/textmenu.png, textdrink.png, textpromo.png | Texto rasterizado: "Pagar", "Menú", "Carrito", "Tragos", "Promos" (con relieve) | Bitmap de texto. El PSD tiene el mismo texto como capa editable (Museo700). |
| web/ico_home.png (16×30), web/y.png (58×37) | Ícono de inicio (mano) y "y" decorativa | Vector candidato |

### Logos y marca
| Archivo | Qué representa | Tipo |
|---|---|---|
| iclub.png, logo iclub.png (283×140), icon.png, icon iclub.png (128×128) | Logo iClub (mano que toca, tarjeta verde con "Club" azul) y su versión de ícono de app | Logo: candidato a vector (formas planas con degradado sutil). Ícono de app: bitmap. |
| web/logo_footer.png (201×102) | Logo iClub de pie de página | Logo (vector candidato). |
| pin_iClub.png (155×266) | Pin de mapa verde-azul | Vector candidato (brillo). |
| logorestaurant.png (423×91), logorestaurant2.png (260×56) | "Logo Restaurant" manuscrito (placeholder de logo del restaurante) | Bitmap de texto (fuente manuscrita BrushtipTravis). El PSD tiene texto editable. |

### Mesas
| Archivo | Qué representa | Tipo |
|---|---|---|
| mesa.png (150×151) | Mesa libre (tablero a cuadros verdes sobre madera) | Bitmap (textura) |
| mesalibre.png (132×52), mesaocupada.png (132×52) | Etiqueta "Mesa libre" / "Mesa ocupada" (cartel) | Bitmap (textura y relieve) |
| mesa ocupada (vista).png (200×200) | Mesa ocupada completa | Bitmap |
| notifmesas.jpg (1280×800) | Captura de la grilla de mesas | Referencia (no es activo) |

### Texturas y fondos
| Archivo | Qué representa | Tipo |
|---|---|---|
| login/bgpattern.png (100×100, RGB) | Tile de tela o tejido teal | Bitmap de textura (tileable) |
| general/bg.png (1024×600, RGBA opaco), login/bg.png (1024×600) | Fondo completo teal con textura | Bitmap de textura |
| wall.png (1024×600), adminbg.jpg (1280×800) | Fondo gris-teal oscuro para vistas de admin y prueba | Bitmap |
| phone/fondo.png (640×960), phone/fondo+pestañas.png (640×960) | Fondo smartphone, con y sin barra de pestañas | Bitmap de textura |
| phone/fondo seleccionado.png (204×100) | Fondo del tab seleccionado (oscuro semitransparente) | Bitmap (alfa bajo) |
| fondobase.png (816×710, alfa 0-38) | Brillo blanco semitransparente | Bitmap (overlay) |
| web/brillo pantalla.png (340×352, alfa 0-51) | Reflejo de pantalla (glare) | Bitmap (overlay) |
| web/patron_fondo.png (6×6), web/patron_contenido.png (20×20) | Tiles de patrón diagonal: el oscuro para sidebar (#2b2b2b aprox.) y el de contenido | Bitmap (tile) |
| general/navbarpattern.png (48×49), web/navbar pattern.png (1024×44) | Tile de barra verde con degradado | Bitmap (tile) |
| general/navbarfull.png (1024×49), navbarfull.png (1280×49), home/statusbar.png (1024×49), login/statusbar.png (1024×49) | Barra superior verde (statusbar) | Bitmap (degradado) |
| web/navbarbg.png (44×47), web/navbar1.png (10×47), web/navbar2.png (11×47), web/navbar.png (1002×47) | Piezas de la navbar web (inicio, medio, fin) | Bitmap (degradado) |
| home/separador.png (298×2), home/separador2.png (2×600) | Líneas separadoras (gris, alfa 38) | Vector candidato (son líneas de 1 px). |
| botones iclub/scrollbarhandler.png, srollbar.png, scrollbar.png, lista menu/scrollbar.png, handler.png | Scrollbar y manija | Bitmap (sprites con degradado) |
| login/qrlaser.png (325×20) | Línea láser de escáner QR | Vector candidato (línea con degradado). |

### Botones y controles (sprites)
| Archivos | Qué representa | Tipo |
|---|---|---|
| botones iclub/ (≈50 PNG) | Sprites de botones flecha (oscuro, claro, normal), checkboxes, selectores, ruleta (base y marco), editar, scrollbar | Bitmap (degradado y sombra). Podrían reconstruirse con CSS/SVG, pero la fuente de verdad es Kit interfaz.psd. |
| lista menu/ button.png (101×27), checkbox1/2.png (24×25), handler.png (16×16) | Botón, checkbox y manija de la lista | Bitmap |
| login/field.png (293×53), textfield.png (293×54), enterbutton.png (113×53), greenbutton.png (111×50) | Campo de texto y botones de login | Bitmap (degradado y sombra) |
| web/select1-3.png, select1-2, slideshow1-2.png | Piezas de selector y de carrusel (puntos) | Bitmap |

### Papel, boleta y tarjetas
| Archivo | Qué representa | Tipo |
|---|---|---|
| boleta.png (415×563), totalboleta.png (415×413) | Papel de boleta con borde zigzag y sombra | Bitmap (papel) |
| carrito.png (248×61) | Texto "Carrito" con relieve | Bitmap de texto |
| login/loginqr.png, loginreg.png, login.png, newuser.png, qrcode.png (144×144) | Íconos de pantalla de login (perfil, perfil con +, QR) | Bitmap (relieve metálico). |

### QR y marcos
| Archivo | Qué representa | Tipo |
|---|---|---|
| phone/marco QR.png (434×504) | Marco de tarjeta de QR con pin verde | Vector candidato (forma plana con sombra). |
| login/qrscan.png (404×406), qr_overwall.png (1024×600) | Marco de escáner QR y overlay | Bitmap |
| qr.jpg (1024×600) | Captura de QR | Referencia |

### Dispositivos y fotos (bitmap, no reconstruir)
| Archivo | Qué representa |
|---|---|
| tablet.jpg, web/tablet.png (620×393), smartphone.jpg, smartphone3.png, web/smartphone.png | Fotos de dispositivos Samsung y LG |
| home/avatar.png (52×51) | Avatar de usuario (foto de ejemplo) |

### Capturas de referencia (no son activos)
carrito.jpg, detalle.jpg, detalle (1).jpg, home.jpg, home/home.jpg, home basket.jpg, lista menu.jpg, lista menu1.jpg, login/login1-4.jpg, guiamenu.png (lista con texto manuscrito de ayuda), ss.png, web/web.jpg, general/home.jpg. La carpeta "pantallas originales - diseño viejo/" (6 PNG) muestra un diseño anterior con fondo de madera, tipografía oscura y "iClub" como marca de agua.

---

## 5) Paleta y estilos recurrentes

Colores de texto y relleno (exactos, leídos de los PSD):
- #ffffff, #e6e6e6, #d9d9d9, #bfbfbf, #b3b3b3, #808080, #595959, #404040, #000000
- #aee921: verde lima del logo de restaurante (Logo Restaurant, texto de logo en home, detalle y carrito)
- #a06230: marrón/naranja de precios y total (boleta)
- #88b347: verde de pestañas smartphone
- #335208: verde oscuro (botones y paneles)
- #3f738c: teal de pantalla smartphone
- #4a5c66: teal de web
- #2d3133, #383d40, #4d4d4d: grises oscuros de kit y login
- #b1a682: beige (un fondo de home)

Colores de fondos y bitmaps (aproximados, por cuantización de píxeles):
- Fondo teal de tablet: aprox. #4c646c a #546c74 (login/bg.png, bgpattern)
- Sidebar oscuro: aprox. #2b2b2b a #444c54 (patrón diagonal)
- Barra superior verde: aprox. #6c8c44 a #94b45c (navbarpattern, statusbar)
- Logo iClub (bitmap): #84c454 (verde) y #0c6c8c (azul)

Estilos recurrentes:
- Degradados: barra superior verde, botones claros y oscuros con degradado vertical, sellos metálicos y botones de cuero.
- Sombras: sombra paralela y sombra interior en casi todas las formas y botones.
- Texturas: tela o tejido teal (login/bgpattern.png), patrón diagonal oscuro (web/patron_fondo.png), cuadros verdes sobre madera (mesas), cuero con costura (iconomenu.png, iconopagar.png, iconopedido.png), papel con borde zigzag (boleta).
- Trazos finos en botones y bordes de formas (FrFX presente en varios PSD).
- Brillo: overlay blanco semitransparente (fondobase.png, web/brillo pantalla.png) en fondos y dispositivos.

---

## Verificación
- Los conteos de capas, dimensiones y tipos salen de psd-tools y se contrastaron con previsualizaciones compuestas (scratch/previews/).
- Los textos y fuentes se leyeron de los runs de texto (FontSet, StyleRun, FillColor) de cada PSD.
- Las fuentes se leyeron con fontTools (nameID 0-6, 13-14 y fsType).
- El PDF se extrajo con pymupdf (1 página).
- Los íconos y texturas se revisaron en hojas de contacto con la herramienta Read.

## Sin resolver / a confirmar
- La correspondencia exacta entre AmericanTypewriter (PSD) y amrtypen/amrtypeb (TTF) es probable pero no confirmada, porque los nombres PostScript no coinciden.
- Las licencias de Museo700, BrushtipTravis, Helvetica Neue y PT Sans Narrow no se pudieron verificar desde los insumos.
- La visibilidad de la boleta en admin.psd no se revisó capa por capa.

## Archivos modificados
- Ninguno en ~/Downloads/iClub ni en ningún repo. Solo se creó /tmp/rex-teams/plaid-inv/scratch/ (venv, inv/, previews/) y este result.md.
