# Glosario de plaid

Vocabulario del dominio de la demo. Sin detalles de implementación.

## Lugar y roles

- **Restaurant El Clan**: el restaurant ficticio de la demo.
- **Comensal**: quien pide desde la tablet o el teléfono de su mesa. En la demo, el visitante es el comensal de la Mesa 7.
- **Garzón**: el personal de sala. Su vista es la grilla de mesas.
- **Garzón simulado**: el garzón automático que hace avanzar los pedidos de la Mesa 7 mientras el visitante no ocupa la vista del garzón.
- **Mesa de relleno**: una mesa ocupada por comensales simulados, que manda llamados para que la sala se vea viva. Nunca afecta a la Mesa 7.

## Mesa

- **Mesa**: puesto numerado de la sala. Puede estar **libre** u **ocupada**. Acumula pedidos y llamados.
- **Liberar**: dejar libre una mesa después de cobrar. Borra sus pedidos y sus llamados.

## Carta

- **Carta**: los platos que ofrece Restaurant El Clan, agrupados en categorías.
- **Categoría**: grupo de la carta: entradas, sándwiches, fondos, bebidas y postres.
- **Plato**: todo lo que se puede pedir, bebidas incluidas. Tiene nombre, descripción, precio y foto.
- **Agotado**: un plato que hoy no se puede pedir. Se muestra, pero no entra al carrito.

## Pedir

- **Carrito**: lo que el comensal eligió y todavía no envía.
- **Pedido**: cada envío del carrito a cocina. Pasa por **enviado → confirmado → servido**. Una mesa puede tener varios.
- **Cuenta**: lo que debe la mesa, es decir, la suma de sus pedidos.
- **Boleta**: la forma visual en papel del carrito o de la cuenta. No es un concepto aparte.
- **Llamado**: un aviso del comensal al garzón. Hay tres tipos:
  - **pedido**: se envió un pedido nuevo;
  - **garzón**: el comensal pide ayuda;
  - **pago**: el comensal pidió la cuenta.
- **Atender**: resolver un llamado.
- **Cobrar**: recibir el pago de la cuenta. La demo no simula el medio de pago.

## Presentación

- **Sello**: la forma visual de un llamado sobre la mesa en la grilla del garzón.
- **Tema**: la piel de la interfaz. Es **original**, la reconstrucción esqueuomórfica de iClub, o **moderno**, plano. Cambia la apariencia, no el comportamiento.
- **Galería**: la página que muestra cada componente con su demo vivo y sus estados.
- **Recorrido guiado**: la capa de ayuda opcional que lleva al visitante por el circuito comensal → garzón.
- **iClub**: la app original de 2012 que plaid reconstruye.

## Términos a evitar

- "Carrito" para lo ya enviado: es un **pedido**.
- "Alerta" o "notificación": se dice **llamado**. "Sello" es solo su dibujo.
- "Mozo" o "mesero": se dice **garzón**.
- "Cliente" o "usuario": se dice **comensal**, o **visitante** para quien prueba la demo.
