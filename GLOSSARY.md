# plaid glossary

Domain vocabulary of the demo. Domain terms stay in Spanish, as they appear in the UI; definitions are in English. No implementation details.

## Place and roles

- **Restaurant El Clan**: the fictional restaurant of the demo.
- **Comensal** (diner): the person ordering from the tablet or phone at their table. In the demo, the visitor is the Comensal at Mesa 7.
- **Garzón** (server): the floor staff. Their view is the table grid.
- **Cocina** (kitchen): the staff that prepares the Pedidos. Their view is the rail of Comandas.
- **Cocina simulada**: the automatic Cocina that advances the Pedidos of the Mesas de relleno while the visitor is not in the Cocina view.
- **Garzón simulado**: the automatic Garzón that advances Mesa 7's Pedidos while the visitor is not in the Garzón view.
- **Mesa de relleno**: a Mesa occupied by simulated Comensales that sends Pedidos and Llamados to make the floor feel alive. It never affects Mesa 7.

## Mesa

- **Mesa**: a numbered spot on the floor. It can be **libre** (free) or **ocupada** (occupied). It accumulates Pedidos and Llamados.
- **Liberar**: free a Mesa after payment. It clears the Mesa's Pedidos and Llamados.

## Carta

- **Carta**: the dishes Restaurant El Clan offers, grouped into categories.
- **Categoría**: a group in the Carta: entradas, sándwiches, fondos, bebidas and postres.
- **Plato**: anything that can be ordered, drinks included. It has a name, description, price and photo.
- **Agotado**: a Plato that cannot be ordered today. It is shown, but cannot be added to the Carrito.

## Ordering

- **Carrito**: what the Comensal has chosen and not yet sent.
- **Pedido**: each submission of the Carrito to the kitchen. It goes through **enviado → confirmado → servido** (sent → confirmed → served). A Mesa can have several.
- **Cuenta**: what the Mesa owes, that is, the sum of its Pedidos.
- **Boleta**: the paper-receipt visual form of the Carrito or the Cuenta. It is not a separate concept.
- **Llamado**: a notice from the Comensal to the Garzón. There are three kinds:
  - **pedido**: a new Pedido was sent;
  - **garzón**: the Comensal asks for help;
  - **pago**: the Comensal asked for the Cuenta.
- **Atender**: resolve a Llamado.
- **Cobrar**: receive payment for the Cuenta. The demo does not simulate the payment method.

## Presentation

- **Comanda**: the visual form of a Pedido in the Cocina: a ticket hanging from the rail of its status.
- **Sello**: the visual form of a Llamado on a Mesa in the Garzón's grid.
- **Tema**: the skin of the interface. It is either **Plaid**, the skeuomorphic reconstruction of iClub, or **Slate**, flat. It changes appearance, not behavior.
- **Galería**: the page that shows every component with its live demo and states, in three views: standalone components, restaurant pieces and the Clan tartan.
- **Recorrido guiado**: the optional help layer that walks the visitor through the Comensal → Garzón circuit.
- **iClub**: the original 2012 app that plaid reconstructs.

## Terms to avoid

- "Carrito" for what was already sent: that is a **Pedido**.
- "Alerta" or "notificación": say **Llamado**. "Sello" is only its drawing.
- "Mozo" or "mesero": say **Garzón**.
- "Cliente" or "usuario": say **Comensal**, or **visitante** for the person trying the demo.
