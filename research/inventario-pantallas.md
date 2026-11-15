STATUS: completed

# Inventario de pantallas y flujos — iClub

## Qué hice
- Revisé visualmente las imágenes exportadas de `~/Downloads/iClub` (jpg/png de nivel superior y de las subcarpetas home, lista menu, general, web, phone, login, botones iclub y pantallas originales - diseño viejo). Los PSD (22 archivos) y `presupuesto.pdf` no se inspeccionaron; quedan fuera de este inventario.
- Para ver los íconos y componentes pequeños generé hojas de contacto en `scratch/` (`s1.png`, `s2.png`, `s3.png`) con un venv Pillow en `scratch/venv` (ejecutado con `python -I`).
- No modifiqué, moví ni borré nada en `~/Downloads/iClub`. No edité ningún repo.
- Verificación: cada pantalla completa fue abierta con Read; los datos de precios y totales se leyeron de la imagen (el total de `carrito.jpg` cuadra: 2.480+1.380+1.490+1.290+4.600 = 11.240).

---

## 1) Tabla de pantallas

### Tablet comensal (1024x600, salvo indicación)

| Archivo(s) | Superficie | Qué muestra | Elementos interactivos |
|---|---|---|---|
| `home/home.jpg` | Tablet comensal | Inicio: Menú / Tragos / Promos con íconos grandes. Sidebar izquierda: avatar + `username`, Opciones, Garzón, Perfil, logo del restaurante, "Acerca de iClub". Navbar: Volver + "Nombre Restaurant". **Sin ícono de carrito.** | Menú, Tragos, Promos, Opciones, Garzón, Perfil, Acerca de iClub, Volver |
| `home basket.jpg` | Tablet comensal | Misma pantalla de inicio **con ícono de carrito** en la navbar derecha. | Igual que el anterior + carrito |
| `general/home.jpg` | Tablet comensal | Variante del inicio: navbar verde, sidebar oscura con logo iClub abajo, carrito en navbar. | Igual que el anterior + carrito |
| `guiamenu.png` | Tablet comensal (overlay de ayuda) | Menú con categorías (Tapas & Bocadillos, Tablas, Sandwiches, Tragos, Promos) y lista de platos, cubierto por textos de instrucción manuscritos: "Seleccione una Categoria", "Seleccione una SubCategoria", "Seleccione algo de la lista para ver sus detalles y agregarlo a su pedido", y "(CLICK PARA CERRAR)". Navbar naranja: Volver / Ayuda / Siguiente. | Categorías, subcategorías, ítems de lista, Volver, Ayuda, Siguiente, cerrar overlay |
| `ss.png` | Tablet comensal | El mismo menú **sin overlay**: Del Puerto $5.500, Churrasco Italiano $5.500, Barros Luco $4.900, Ave Italiana $5.500. Navbar naranja: Volver / Ayuda / Siguiente. | Categorías, ítems, scroll, Siguiente, Volver |
| `lista menu.jpg` | Tablet comensal | Lista de sándwiches en tarjetas: miniatura, nombre, ingredientes, precio, checkbox, botón "Ver en detalle", barra de scroll. Sidebar de usuario. Navbar: Volver + "Nombre Restaurant". | Checkbox por ítem, botón "Ver en detalle", scroll, Volver |
| `lista menu1.jpg` | Tablet comensal | Variante de la lista **sin botón "Ver en detalle"**, con checkboxes y barra de scroll. | Checkbox, scroll, Volver |
| `detalle.jpg` | Tablet comensal | Detalle de Chacarero: foto con lupa (zoom), cinta verde con nombre, descripción, sección **"Agregados"** con checkboxes (Champiñones ✔, Lechuga ✔, Tocino, Queso, Tomates, Palta), vista previa de boleta (Chacarero $2.500 + agregados = $3.500). Ícono carrito en navbar. | Lupa, checkboxes de agregados, botones "Agregar" e "iClub +", carrito, Volver |
| `detalle (1).jpg` | Tablet comensal | Detalle de Chacarero en otra versión: **nota adhesiva "Agregar nota..."** (con chincheta roja), **stepper de cantidad** (2), vista previa de boleta "Chacarero x2 $5.000", botones "Agregar" e "iClub +". | Nota, stepper ▲▼, botones "Agregar" e "iClub +", lupa, carrito, Volver |
| `carrito.jpg` | Tablet comensal | Pantalla de carrito/boleta: Chacarero x2 $2.480; Papas fritas x2 $1.380; Cerveza Kunstmann x1 $1.490; Jugo natural x1 $1.290; Helado triple x2 $4.600. Total: $11.240. Sin botones visibles. | Volver, carrito (sin acciones sobre líneas) |
| `tablet.jpg` (mockup Samsung 1277x809) | Tablet comensal | Mismo carrito dentro de un marco de tablet Samsung, **con controles de edición**: por línea hay un ícono de lápiz que abre un desplegable 0 / 1 / 2. Botón **"Realizar pedido"**. Sidebar con logo iClub. | Lápiz por línea, desplegable 0/1/2, "Realizar pedido", Volver, carrito |

### Login (tablet comensal)

| Archivo(s) | Superficie | Qué muestra | Elementos interactivos |
|---|---|---|---|
| `login/login1.jpg` | Login (tablet comensal) | Pantalla de entrada: logo "Logo Restaurant" y tres opciones con íconos: **Ingresar**, **Código QR**, **Registrarse**. | Ingresar, Código QR, Registrarse |
| `login/login3.jpg` | Login | Formulario de ingreso: campos "usuario" y "contraseña", botón verde "entrar". | Campo usuario, campo contraseña, entrar, (volver no visible) |
| `login/login4.jpg` | Login | Formulario de registro: campos "email" y "contraseña", botón verde "crear". | Campo email, campo contraseña, crear |
| `login/login2.jpg` | Login (escáner QR) | Marco de monitor con línea láser violeta y botón verde "volver". | Botón volver |
| `qr.jpg` | Login (escáner QR, variante) | Mismo marco de monitor con línea láser y botón gris "Volver" sobre fondo gris. | Botón Volver |
| `login/qr_overwall.png`, `login/qrscan.png` | Login (escáner, recurso) | Marco de monitor vacío (pantalla blanca) y recorte del marco con láser. Son overlays del escáner, no pantallas completas. | Ninguno (recurso visual) |

### Tablet personal (personal del local)

| Archivo(s) | Superficie | Qué muestra | Elementos interactivos |
|---|---|---|---|
| `notifmesas.jpg` (1280x800) | Tablet personal | Grilla de mesas de 5 columnas x 4 filas, cada mesa con mantel verde a cuadros. Las 3 primeras tienen insignias de alerta en color (rojo $, azul tenedor/cubierto, dorado garzón). Navbar verde: Volver y botón "?" (ayuda). Panel izquierdo oscuro **vacío**. | Mesas (tiles), insignias de alerta, ayuda "?", Volver |
| `mesa ocupada (vista).png` (200x200) | Tablet personal (recurso/vista) | Tile de mesa con mantel y placa "Mesa ocupada". Sólo se exporta este tile, no una pantalla de detalle. | Ninguno visible |

### Smartphone (comensal)

| Archivo(s) | Superficie | Qué muestra | Elementos interactivos |
|---|---|---|---|
| `smartphone.jpg` (411x788, LG) | Smartphone | Pantalla con barra superior de 3 pestañas: **Código QR** (activa), **Perfil**, **Mapa**. Debajo, un marco de QR blanco sobre fondo azul-gris. | Pestañas Código QR / Perfil / Mapa |
| `web/smartphone.png` (LG vacío) y `smartphone3.png` (Samsung, pantalla verde) | Smartphone (marcos) | Mockups de teléfono sin contenido; el de Samsung tiene pantalla verde lisa (placeholder). | Ninguno |
| `phone/fondo+pestañas.png`, `phone/fondo.png` | Smartphone (fondos 640x960) | Fondo con barra de pestañas verde en la parte superior, y fondo azul-gris liso sin pestañas. | Ninguno (recursos) |

### Fuera de alcance (registradas)

| Archivo(s) | Superficie | Qué muestra | Elementos interactivos |
|---|---|---|---|
| `web/web.jpg` (1280x1400) | Web | Landing iClub: navbar Bienvenidos / Servicios / Quiénes Somos / Contacto; mockup de tablet con pantalla de detalle "Entrada de Mar"; texto "¿Qué es iClub?"; links a Facebook y Twitter. | Navegación web, links sociales |
| `web/tablet.png`, `web/tablet.psd` | Web (mockup) | Marco de tablet Samsung horizontal con pantalla verde placeholder. | Ninguno |
| `adminbg.jpg` (1280x800) | Admin | Fondo: panel lateral oscuro y área azul-gris, sin contenido. | Ninguno |
| `wall.png` (1024x600) | Fondo genérico | Gris liso, sin contenido. | Ninguno |

### Diseño viejo (`pantallas originales - diseño viejo/`, 1024x600)

| Archivo | Superficie | Qué muestra | Elementos interactivos |
|---|---|---|---|
| `1.png` | Login (tablet) | Fondo de madera. Título "Login:", campos Correo y Password, QR en el centro, botones Reset y Enviar. Sidebar izquierda: Login / Registro / Acerca de iClub. | Campos, Reset, Enviar, Login, Registro, Acerca de iClub |
| `2.png` | Inicio (tablet) | "Bienvenido(a): Iván". Botones Menú / Tragos / Promos. "Total General $ 0". Barra inferior: Opciones / Perfil / Garzón. | Menú, Tragos, Promos, Opciones, Perfil, Garzón |
| `3.png` | Menú - categorías | Cuadrícula de categorías: Sandwiches, Burritos, Tablas. Izquierda: ES, CL y un ícono de lista. "Sesión de Iván", "Total $ 0". | Categorías, ES, CL, lista, Volver |
| `4.png` | Menú - lista | Filas con miniatura, nombre, ingredientes, precio en cian y checkbox. | Checkbox por ítem, Volver |
| `6.png` | Detalle | Chacarero con foto grande, precio, descripción, campo "Nota del pedido" y botón "Agregar". | Nota, Agregar, Volver |
| `7.png` | Carrito | Tabla Nombre / Cantidad / Precio con ícono de basura, botón +, checkbox "Puntos iClub", Total General $6500, botón "Hacer Pedido", Sub Total. | Eliminar, +, Puntos iClub, Hacer Pedido, ES, CL, Volver |
| *(5.png)* | — | **No existe en la carpeta** (la numeración salta del 4 al 6). | — |

---

## 2) Flujos inferidos

Los flujos son inferencias a partir de las imágenes. Los huecos están marcados con **[HUECO]**.

**F1. Entrada / login (tablet comensal)**
`login1 (Ingresar / Código QR / Registrarse)`
- Ingresar → `login3 (usuario + contraseña)` → **[HUECO: a qué pantalla lleva al entrar; probablemente inicio, pero no está exportada]**
- Código QR → `login2 / qr.jpg (escáner)` → **[HUECO: qué pantalla sigue tras leer el código]**
- Registrarse → `login4 (email + contraseña)` → **[HUECO: confirmación o verificación; sin pantalla]**
- **[HUECO]** Recuperar contraseña: existía en el diseño viejo (botón Reset) y no hay equivalente en el diseño nuevo.

**F2. Pedido principal (tablet comensal)**
`Inicio (home / home basket / general/home)` → Menú → `guiamenu` / `ss` (categorías + lista) → categoría/subcategoría → `lista menu` / `lista menu1` → "Ver en detalle" → `detalle` / `detalle (1)` → Agregar → **[HUECO: qué pasa tras "Agregar": ¿vuelve a la lista?, ¿confirmación?, ¿feedback de cantidad?]** → ícono carrito → `carrito.jpg` → lápiz → desplegable 0/1/2 (`tablet.jpg`) → "Realizar pedido" → **[HUECO: pantalla de pedido enviado / estado del pedido]**.

Observaciones del flujo:
- Desde la lista sólo hay una pantalla de lista exportada (ítems tipo sándwich). **[HUECO]** las listas de Tapas & Bocadillos, Tablas, Tragos y Promos no tienen pantalla.
- Desde el inicio, Tragos y Promos no tienen pantalla de lista. **[HUECO]**

**F3. Desde el inicio: opciones de sidebar**
Inicio → Opciones / Perfil / Garzón / Acerca de iClub → **[HUECO: ninguna de estas pantallas está exportada]**.

**F4. Atención en mesa: llamar garzón, pagar, pedido (comensal)**
- Existen íconos y estilos: `iconopagar.png`, `iconopedido.png`, `icongarzon` (home), `pagar.png` (texto "Pagar"), y componentes de boleta `boleta.png` / `totalboleta.png`.
- **[HUECO]** No hay pantalla de "Llamar garzón" (estado de la llamada / confirmación) en la tablet del comensal.
- **[HUECO]** No hay pantalla de "Pagar" (resumen de cuenta, medio de pago, confirmación). Los componentes de boleta existen pero sin una pantalla que los use.
- **[HUECO]** No hay pantalla de "Pedido" (estado de pedidos enviados a cocina).

**F5. Personal (tablet personal)**
`Login personal (no exportado)` → `notifmesas.jpg (grilla de mesas)` → tocar una mesa → **[HUECO: detalle de mesa; el panel izquierdo está vacío]** → acciones (pagar, pedido, garzón) → **[HUECO]**.
- Las insignias de alerta sugieren los tipos de notificación: $ (pago), tenedor (pedido), garzón (llamada), ticket (promo). Esto es inferencia; no hay pantallas de cada alerta.
- **[HUECO]** No hay pantalla de login del personal. La pantalla de login comensal no indica si se usa para el personal.

**F6. Smartphone (comensal)**
Abrir app → pestaña **Código QR** (activa por defecto) → muestra QR. Inferencia: el QR de smartphone es lo que escanea la tablet en `login2 / qr.jpg` (no verificado).
- Pestaña **Perfil** → **[HUECO: no hay pantalla]**.
- Pestaña **Mapa** → **[HUECO: no hay pantalla]**. Hay un ícono de pin (`pin_iClub.png` / `icono mapa`) sin pantalla.
- **[HUECO]** No hay pantallas de menú, pedido, carrito o pago para smartphone; sólo se exportó la pantalla de QR.

**F7. Diseño viejo (flujo completo, sin el 5)**
`1 Login` → `2 Inicio (Bienvenido + Total)` → `3 Menú (categorías)` → `4 Lista` → **[HUECO: 5.png no existe]** → `6 Detalle` → `7 Carrito (Hacer Pedido)`.

**F8. Web / admin**: fuera de alcance; sin flujos exportados.

---

## 3) Diferencias: diseño viejo vs diseño final (sólo lo observado)

| Aspecto | Diseño viejo (`pantallas originales`) | Diseño final (imágenes de tablet/smartphone) |
|---|---|---|
| Fondo | Madera oscura con marca de agua "iClub" en rojo | Gris-azul texturizado o pizarra; en algunas pantallas navbar y mantel verde |
| Restaurante de ejemplo | "Casa Lila" (cursiva) | "Nombre Restaurant" y "Logo Restaurant" |
| Login | Un solo formulario: Correo / Password, Reset / Enviar, y sidebar Login / Registro / Acerca de iClub | Tres opciones con íconos (Ingresar, Código QR, Registrarse); formularios separados; sin Reset |
| Inicio | Saludo "Bienvenido(a): Iván", "Total General $ 0", botones de texto sobre fondo | Sin saludo ni total visible; sidebar con avatar y username; íconos ilustrados (Menú, Tragos, Promos) |
| Navegación | Columna izquierda con ES, CL y lista; "Volver" en rojo abajo; barra inferior Opciones/Perfil/Garzón | Navbar superior con Volver como botón, título y carrito; sidebar fija izquierda |
| Categorías de menú | Botones en cuadrícula (Sandwiches, Burritos, Tablas) | Panel lateral (Tapas & Bocadillos, Tablas, Sandwiches, Tragos, Promos) |
| Lista de platos | Filas con miniatura, precio en cian y checkbox | Tarjetas con miniatura, descripción, precio en blanco, checkbox y "Ver en detalle" (sólo en una variante) |
| Detalle | Foto, precio, descripción, "Nota del pedido" y "Agregar" | Foto con lupa, cinta con nombre, "Agregados" con checkboxes, nota adhesiva, stepper de cantidad, vista previa de boleta, "Agregar" e "iClub +" |
| Carrito | Tabla con basura, +, cantidad, "Puntos iClub" y "Hacer Pedido" | Boleta con Total; en una variante, lápiz por línea con 0/1/2 y "Realizar pedido". No aparece "Puntos iClub" en las pantallas nuevas |
| Tablet personal / mesas | No existe en el diseño viejo | Grilla de mesas con mantel e insignias de alerta |
| Smartphone | No existe en el diseño viejo | Pestañas Código QR / Perfil / Mapa |

Observación de datos (no es una decisión de diseño): en `carrito.jpg`, Chacarero x2 figura en $2.480, mientras que en la lista y el detalle el precio unitario es $2.500 (x2 = $5.000 en `detalle (1).jpg`). Los precios son de muestra, pero no coinciden entre pantallas.

---

## 4) Componentes recurrentes

| Componente | Archivos | Dónde aparece (pantallas) |
|---|---|---|
| Navbar superior con título | `general/navbarfull.png` (1024x49), `navbarfull.png` (1280x49), `general/navbarpattern.png`, `home/statusbar.png` = `login/statusbar.png` (mismo hash) | home*, lista*, detalle*, carrito.jpg, tablet.jpg |
| Navbar naranja (Volver / Ayuda / Siguiente) | Sin asset separado; sólo dentro de la captura | guiamenu.png, ss.png |
| Navbar verde (Volver / "?") | Sin asset separado; sólo dentro de la captura. `helpbutton.png` (40x28) es el botón "?" | notifmesas.jpg |
| Botón Volver | `general/volver.png` (66x28), `home/backbutton.png` (66x28, oscuro), `login/greenbutton.png` (botón verde "volver" en login2) | Todas las pantallas de comensal; login2; qr.jpg |
| Sidebar de usuario | `home/avatar.png`, `home/iconconfig.png` (Opciones), `home/icongarzon.png` (Garzón), `home/iconprofile.png` (Perfil), `home/separador.png` y `separador2.png` (divisores) | home*, lista*, detalle*, carrito.jpg, tablet.jpg |
| Logo del restaurante / iClub | `logorestaurant.png`, `logorestaurant2.png` (texto "Logo Restaurant"), `iclub.png`, `logo iclub.png`, `icon.png`, `icon iclub.png`, `pin_iClub.png`, `web/logo_footer.png` | Sidebar de home/tablet; login1, login3, login4 (logorestaurant) |
| Ítems de categoría (sidebar de menú) | `icominimenu.png` (tenedor), `icominidrink.png` (copa), `icominipromo.png` (ticket); en home: `home/iconmenu.png`, `icondrink.png`, `iconpromo.png` (95x96) | guiamenu.png, ss.png (sidebar de menú), home* (grandes) |
| Títulos de home | `home/textmenu.png`, `home/textdrink.png`, `home/textpromo.png` | home*, general/home |
| Tarjeta de plato | Sin fondo de tarjeta exportado (sólo `lista menu/bgbox.psd`, PSD). Miniaturas dentro de la captura | lista menu.jpg, lista menu1.jpg |
| Botón "Ver en detalle" | `lista menu/button.png` (101x27), `botondetalle.png` (121x29), `botones iclub/normal1-2.png` (83x29) | lista menu.jpg |
| Botones de acción (claro/oscuro) | `botones iclub/normal1.png`, `normal2.png` (claros), `oscuro1.png`, `oscuro2.png` (oscuros), `botones iclub/flnormalizq1-2.png`, `flnormalder1-2.png`, `floscuraizq1-2.png`, `floscurader1-2.png` (botones con flecha: uso probable Volver/Siguiente, sin verificar) | detalle*, carrito, tablet.jpg (botones "Agregar", "iClub +", "Realizar pedido") |
| Checkbox | `lista menu/checkbox1.png`, `checkbox2.png` (24px); `botones iclub/checkbox1-2.png` (18px); `checkboxgrande1-2.png` (27px) | lista menu*, detalle.jpg (Agregados) |
| Scrollbar | `lista menu/scrollbar.png`, `lista menu/handler.png`; `botones iclub/srollbar.png`, `scrollbarhandler.png` | lista menu*, carrito.jpg (barra en lista) |
| Stepper de cantidad | `botones iclub/selector1.png` (vertical), `selector1-1/-2/-3.png`; `selector2.png` (con flechas ▲▼), `selector2-1/-2/-3.png` | detalle (1).jpg |
| Desplegable 0/1/2 (ruleta) | `botones iclub/ruleta1base.png`, `ruleta1frame.png`, `ruleta2base.png`, `ruleta2frame.png` (uso probable, sin verificar) | tablet.jpg (lápiz de carrito) |
| Editar (lápiz) | `editar1.png`, `editar2.png` (22x23), `botones iclub/editar.png` | tablet.jpg |
| Boleta / ticket | `boleta.png` (415x563, cabecera verde y papel con borde dentado), `totalboleta.png` (415x413, con columnas y total), `carrito.png` (título "Carrito" en texto) | carrito.jpg, tablet.jpg, detalle* (vista previa de boleta) |
| Ícono carrito | `basket.png` (52x28), `general/basket.png` (52x28), `home/...`; `iconopedido.png` (111x102) | navbar de home basket, general/home, detalle*, carrito |
| Nota adhesiva | Sin asset separado (sólo dentro de la captura); chincheta roja también dentro de la captura | detalle (1).jpg, tablet.jpg (vista de mockup) |
| Mesa con mantel | `mesa.png` (150x151, mantel y madera), `mesalibre.png` (132x52, placa "Mesa libre"), `mesaocupada.png` (132x52, placa "Mesa ocupada"), `mesa ocupada (vista).png` (200x200) | notifmesas.jpg |
| Insignias de alerta | `notifpago2.png` ($), `notifpedido2.png` (tenedor), `notifmozo2.png` (garzón), `notifpromo2.png` (ticket): versiones grises 88x89. En notifmesas se ven en color (rojo, azul, dorado); no hay asset coloreado exportado | notifmesas.jpg |
| Íconos de login | `login/login.png` (Ingresar), `newuser.png` y `loginreg.png` (Registrarse), `loginqr.png` y `qrcode.png` (Código QR) | login1.jpg |
| Campos de texto | `login/field.png` (293x53), `login/textfield.png` (293x54) | login3.jpg, login4.jpg |
| Botón verde de acción | `login/enterbutton.png` (113x53, "entrar"/"crear"), `login/greenbutton.png` (111x50) | login3.jpg, login4.jpg, login2.jpg |
| Marco de escáner QR | `login/qr_overwall.png`, `login/qrscan.png`, `login/qrlaser.png` (línea láser 325x20), `qr.jpg` (captura completa) | login2.jpg, qr.jpg |
| Marco de QR (smartphone) | `phone/marco QR.png` (434x504) | smartphone.jpg |
| Pestañas smartphone | `phone/pestañas.png` (640x111), `phone/fondo+pestañas.png`, `phone/fondo seleccionado.png` (204x100), `phone/icono QR.png` / `QR select.png`, `icono perfil.png` / `perfil select.png`, `icono mapa.png` / `mapa select.png` | smartphone.jpg |
| Mockups de dispositivo | `smartphone.jpg`, `web/smartphone.png` (LG), `smartphone3.png` (Samsung), `tablet.jpg` (Samsung 1277x809), `web/tablet.png` | smartphone; tablet (mockup) |
| Fondos | `wall.png` (gris liso), `general/bg.png`, `login/bg.png`, `login/bgpattern.png` (100x100), `fondobase.png` (816x710, rosa: placeholder), `adminbg.jpg` | Pantallas de login, home, admin |
| Fuentes | `fonts/amrtypeb.ttf`, `fonts/amrtypen.ttf`, `fonts/ATLC__LH.TTF` (no verifiqué cuál usa cada pantalla) | — |

---

## Huecos (resumen)
- Login: pantalla posterior a "Ingresar", a "Código QR" y a "Registrarse"; recuperar contraseña (existía en el viejo).
- Menú: listas de Tapas & Bocadillos, Tablas, Tragos y Promos; pantalla después de "Agregar" y después de "Realizar pedido".
- Inicio: Opciones, Perfil, Garzón, Acerca de iClub.
- Atención: llamar garzón, pagar (resumen de cuenta), estado de pedido (comensal).
- Personal: login del personal, detalle de mesa y acciones.
- Smartphone: pestañas Perfil y Mapa; flujo de menú/pedido/pago.
- Diseño viejo: falta `5.png`.
- Sin inspeccionar: 22 PSD y `presupuesto.pdf`. Algunos PSD (`mesa notificaciones.psd`, `lista menu/bgbox.psd`, `(sin usar) detalle.psd`) podrían resolver huecos.

## Archivos tocados
- Ninguno en `~/Downloads/iClub` ni en el repo.
- Creados sólo en `/tmp/rex-teams/plaid-inv/scratch/`: `sheet.py`, `s1.png`, `s2.png`, `s3.png`, `venv/`.
- Este reporte: `/tmp/rex-teams/tasks/inv-pantallas-20261115-162244-egii/result.md`.
