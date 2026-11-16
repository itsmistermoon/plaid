import { Checkbox, CheckboxIndicator } from '@ui-sdk/react/checkbox';
import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
} from '@ui-sdk/react/number-input';
import {
  Beef,
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Clock,
  ConciergeBell,
  CupSoda,
  IceCreamCone,
  Minus,
  Plus,
  ReceiptText,
  Salad,
  Sandwich,
  ShoppingCart,
} from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { billTotal, type CallKind, cartTotal, createDemoStore } from './domain';
import { type Category, categories, type Dish, dishes } from './menu';
import { startSimulator } from './simulator';
import { Table } from './Table';

const store = createDemoStore();
const money = (amount: number) => `$${amount.toLocaleString('es-CL')}`;
const dishById = (id: string) => dishes.find((dish) => dish.id === id);
const categoryIcons: Record<Category, typeof Beef> = {
  Entradas: Salad,
  Sándwiches: Sandwich,
  Fondos: Beef,
  Bebidas: CupSoda,
  Postres: IceCreamCone,
};
const callLabels: Record<CallKind, string> = {
  pedido: 'Pedido nuevo',
  garzón: 'Llama al garzón',
  pago: 'Pide la cuenta',
};
const statusLabels = ['enviado', 'confirmado', 'servido'] as const;

type Page = 'carta' | 'carrito' | 'estado' | 'cuenta';

/** Placa de esquinas cóncavas que enmarca la foto del plato. */
function DishPlate({ dish, size }: { dish: Dish; size?: 'big' }) {
  const Icon = categoryIcons[dish.category];
  return (
    <span className="dish-plate" data-size={size} aria-hidden="true">
      <Icon strokeWidth={1.5} />
    </span>
  );
}

/** Boleta de papel con bordes dentados y columnas plato, cantidad y precio. */
function Receipt({
  lines,
  total,
  caption,
  children,
}: {
  lines: { key: string; name: string; qty: ReactNode; price: number }[];
  total: number;
  caption: string;
  children?: ReactNode;
}) {
  return (
    <div className="receipt">
      <span className="receipt-slot" aria-hidden="true" />
      <div className="receipt-paper">
        <table>
          <caption className="sr-only">{caption}</caption>
          <thead className="sr-only">
            <tr>
              <th scope="col">Plato</th>
              <th scope="col">Cantidad</th>
              <th scope="col">Precio</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => (
              <tr key={line.key}>
                <th scope="row">{line.name}</th>
                <td>{line.qty}</td>
                <td>{money(line.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="receipt-total">Total: {money(total)}</p>
        {children}
      </div>
    </div>
  );
}

function Comensal({ onHome }: { onHome: () => void }) {
  const { cart, tables, setQty, sendOrder, requestBill, callWaiter } =
    useStore(store);
  const mesa = tables[6];
  const [page, setPage] = useState<Page>('carta');
  const [category, setCategory] = useState<Category>(categories[0]);
  const [detail, setDetail] = useState<Dish | null>(null);
  const [quantity, setQuantity] = useState(1);
  const count = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const go = (next: Page) => {
    setPage(next);
    setDetail(null);
  };
  const title = detail
    ? detail.name
    : {
        carta: 'El Clan',
        carrito: 'Tu pedido',
        estado: 'Estado',
        cuenta: 'Tu cuenta',
      }[page];
  const menu: { page: Page; label: string; icon: ReactNode; off?: boolean }[] =
    [
      { page: 'carta', label: 'Carta', icon: <BookOpen /> },
      {
        page: 'carrito',
        label: 'Pedido',
        icon: <ShoppingCart />,
      },
      {
        page: 'estado',
        label: 'Estado',
        icon: <Clock />,
        off: !mesa.orders.length,
      },
      { page: 'cuenta', label: 'Cuenta', icon: <ReceiptText /> },
    ];
  return (
    <div className="screen" data-surface="comensal">
      <div className="navbar">
        <button
          type="button"
          className="arrow-button"
          onClick={() => (detail ? setDetail(null) : onHome())}
        >
          <ChevronLeft aria-hidden="true" strokeWidth={3} />
          {detail ? 'Carta' : 'Volver'}
        </button>
        <h2 data-logo={title === 'El Clan' || undefined}>{title}</h2>
        <button
          type="button"
          className="dark-button cart-button"
          aria-label={`Ver pedido, ${count} unidades`}
          onClick={() => go('carrito')}
        >
          <ShoppingCart aria-hidden="true" strokeWidth={2.5} />
          {count > 0 && <span className="count">{count}</span>}
        </button>
      </div>
      <div className="screen-body">
        <nav className="sidebar" aria-label="Comensal">
          <div className="sidebar-guest">
            <span className="avatar" aria-hidden="true">
              7
            </span>
            Mesa 7
          </div>
          {menu.map((item) => (
            <button
              key={item.page}
              type="button"
              className="sidebar-item"
              aria-current={page === item.page && !detail ? 'page' : undefined}
              disabled={item.off}
              onClick={() => go(item.page)}
            >
              {item.icon}
              {item.label}
              {item.page === 'carrito' && count > 0 && (
                <span className="count">{count}</span>
              )}
            </button>
          ))}
          <button
            type="button"
            className="sidebar-item"
            disabled={mesa.calls.includes('garzón')}
            onClick={callWaiter}
          >
            <ConciergeBell />
            {mesa.calls.includes('garzón') ? 'Garzón en camino' : 'Garzón'}
          </button>
          <p className="sidebar-logo">
            El Clan<small>con iClub</small>
          </p>
        </nav>
        <div className="board">
          {detail ? (
            <section className="card detail" aria-label={detail.name}>
              <DishPlate dish={detail} size="big" />
              <h3 className="ribbon">{detail.name}</h3>
              <p className="detail-text">{detail.description}</p>
              <div className="detail-foot">
                <div className="detail-qty">
                  <span className="stamp" aria-hidden="true" />
                  <h4>Cantidad</h4>
                  {detail.soldOut ? (
                    <p className="sold-out">Agotado por hoy</p>
                  ) : (
                    <NumberInput
                      value={quantity}
                      min={1}
                      max={20}
                      onValueChange={(value) => setQuantity(value ?? 1)}
                    >
                      <NumberInputGroup className="wheel">
                        <span className="wheel-window">
                          <span className="wheel-ghost" aria-hidden="true">
                            {quantity - 1 || ''}
                          </span>
                          <NumberInputControl
                            className="wheel-value"
                            aria-label={`Cantidad de ${detail.name}`}
                          />
                          <span className="wheel-ghost" aria-hidden="true">
                            {quantity < 20 ? quantity + 1 : ''}
                          </span>
                        </span>
                        <span className="wheel-arrows">
                          <NumberInputIncrement aria-label="Agregar una unidad">
                            <ChevronUp aria-hidden="true" />
                          </NumberInputIncrement>
                          <NumberInputDecrement aria-label="Quitar una unidad">
                            <ChevronDown aria-hidden="true" />
                          </NumberInputDecrement>
                        </span>
                      </NumberInputGroup>
                    </NumberInput>
                  )}
                </div>
                <div className="detail-receipt">
                  <Receipt
                    caption={`Vista previa de ${detail.name}`}
                    lines={[
                      {
                        key: detail.id,
                        name: detail.name,
                        qty: `x${quantity}`,
                        price: detail.price * quantity,
                      },
                    ]}
                    total={detail.soldOut ? 0 : detail.price * quantity}
                  />
                  <button
                    type="button"
                    className="light-button"
                    disabled={detail.soldOut}
                    onClick={() => {
                      setQty(detail.id, (cart[detail.id] ?? 0) + quantity);
                      setDetail(null);
                    }}
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </section>
          ) : page === 'carta' ? (
            <>
              <div className="segmented" role="tablist" aria-label="Categorías">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    role="tab"
                    aria-selected={category === item}
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <ul className="dish-list" aria-label={category}>
                {dishes
                  .filter((dish) => dish.category === category)
                  .map((dish) => (
                    <li
                      className="card dish"
                      key={dish.id}
                      data-sold-out={dish.soldOut || undefined}
                    >
                      <DishPlate dish={dish} />
                      <div className="dish-text">
                        <h3>{dish.name}</h3>
                        <p>
                          {dish.soldOut ? 'Agotado por hoy' : dish.description}
                        </p>
                      </div>
                      <div className="dish-side">
                        <span className="dish-price">{money(dish.price)}</span>
                        <Checkbox
                          className="kit-check"
                          aria-label={`Agregar ${dish.name} al pedido`}
                          disabled={dish.soldOut}
                          checked={!!cart[dish.id]}
                          onCheckedChange={(checked) =>
                            setQty(dish.id, checked ? 1 : 0)
                          }
                        >
                          <CheckboxIndicator>
                            <Check aria-hidden="true" strokeWidth={4} />
                          </CheckboxIndicator>
                        </Checkbox>
                        <button
                          className="light-button"
                          type="button"
                          aria-label={`Ver ${dish.name} en detalle`}
                          onClick={() => {
                            setQuantity(1);
                            setDetail(dish);
                          }}
                        >
                          Ver en detalle
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            </>
          ) : page === 'carrito' ? (
            <section className="card ticket-card" aria-label="Tu pedido">
              {count === 0 ? (
                <div className="empty">
                  <ShoppingCart aria-hidden="true" />
                  <p>Tu pedido está vacío.</p>
                  <button
                    type="button"
                    className="light-button"
                    onClick={() => go('carta')}
                  >
                    Ver la carta
                  </button>
                </div>
              ) : (
                <>
                  <Receipt
                    caption="Tu pedido"
                    total={cartTotal(cart)}
                    lines={dishes
                      .filter((dish) => cart[dish.id])
                      .map((dish) => ({
                        key: dish.id,
                        name: dish.name,
                        price: dish.price * cart[dish.id],
                        qty: (
                          <span className="stepper">
                            <button
                              type="button"
                              aria-label={`Quitar una unidad de ${dish.name}`}
                              onClick={() => setQty(dish.id, cart[dish.id] - 1)}
                            >
                              <Minus aria-hidden="true" strokeWidth={3} />
                            </button>
                            <output>x{cart[dish.id]}</output>
                            <button
                              type="button"
                              aria-label={`Agregar una unidad de ${dish.name}`}
                              onClick={() => setQty(dish.id, cart[dish.id] + 1)}
                            >
                              <Plus aria-hidden="true" strokeWidth={3} />
                            </button>
                          </span>
                        ),
                      }))}
                  />
                  <button
                    type="button"
                    className="light-button"
                    onClick={() => {
                      sendOrder();
                      setPage('estado');
                    }}
                  >
                    Realizar pedido
                  </button>
                </>
              )}
            </section>
          ) : page === 'estado' ? (
            <section className="card status" aria-label="Estado del pedido">
              <ol className="orders">
                {mesa.orders.map((order, index) => {
                  const step = statusLabels.indexOf(order.status);
                  return (
                    <li key={order.id}>
                      <h3>Pedido {index + 1}</h3>
                      <p className="order-lines">
                        {order.lines
                          .map(
                            (line) =>
                              `${line.qty} × ${dishById(line.dishId)?.name}`,
                          )
                          .join(' · ')}
                      </p>
                      <ol className="steps" aria-label="Avance">
                        {statusLabels.map((label, i) => (
                          <li
                            key={label}
                            data-state={
                              i < step ? 'done' : i === step ? 'now' : 'next'
                            }
                            aria-current={i === step ? 'step' : undefined}
                          >
                            <span className="step-dot" aria-hidden="true">
                              {i <= step ? <Check strokeWidth={4} /> : i + 1}
                            </span>
                            {label}
                          </li>
                        ))}
                      </ol>
                    </li>
                  );
                })}
              </ol>
            </section>
          ) : (
            <section className="card ticket-card" aria-label="Tu cuenta">
              {mesa.orders.length === 0 ? (
                <div className="empty">
                  <ReceiptText aria-hidden="true" />
                  <p>Aún no hay pedidos en tu cuenta.</p>
                </div>
              ) : (
                <>
                  <Receipt
                    caption="Tu cuenta"
                    total={billTotal(mesa)}
                    lines={mesa.orders.flatMap((order) =>
                      order.lines.map((line) => {
                        const dish = dishById(line.dishId);
                        return {
                          key: `${order.id}-${line.dishId}`,
                          name: dish?.name ?? line.dishId,
                          qty: `x${line.qty}`,
                          price: (dish?.price ?? 0) * line.qty,
                        };
                      }),
                    )}
                  />
                  {mesa.calls.includes('pago') ? (
                    <p className="notice" role="status">
                      El garzón viene a cobrar.
                    </p>
                  ) : (
                    <button
                      type="button"
                      className="light-button"
                      onClick={requestBill}
                    >
                      Pedir la cuenta
                    </button>
                  )}
                </>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function Portada({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="screen portada" data-surface="comensal">
      <h2 className="sr-only">Bienvenido a El Clan</h2>
      <div className="scanner" aria-hidden="true">
        <span className="scanner-window">
          <span className="scanner-laser" />
        </span>
        <span className="scanner-leds">
          <i />
          <i />
          <i />
        </span>
      </div>
      <p className="portada-text">Escanea el código QR de tu mesa</p>
      <button type="button" className="light-button" onClick={onEnter}>
        Sentarme en la Mesa 7
      </button>
    </div>
  );
}

function Garzon() {
  const { tables, confirmOrder, serveOrder, attendCall, chargeAndFree } =
    useStore(store);
  const [selected, setSelected] = useState<number | null>(null);
  const table = tables.find((item) => item.number === selected);
  const pending = tables.reduce((sum, item) => sum + item.calls.length, 0);
  return (
    <div className="screen" data-surface="garzon">
      <div className="navbar">
        <span />
        <h2>Sala principal</h2>
        <span className="pending" role="status">
          {pending} {pending === 1 ? 'llamado' : 'llamados'}
        </span>
      </div>
      <div className="screen-body">
        <aside className="sidebar table-detail" aria-label="Detalle de mesa">
          {table ? (
            <>
              <h3>Mesa {table.number}</h3>
              <p className="muted">{table.occupied ? 'Ocupada' : 'Libre'}</p>
              <h4>Llamados</h4>
              {table.calls.length ? (
                <ul className="side-list">
                  {[...new Set(table.calls)].map((call) => (
                    <li key={call} data-kind={call}>
                      <span>{callLabels[call]}</span>
                      <button
                        type="button"
                        className="dark-button"
                        onClick={() => attendCall(table.number, call)}
                      >
                        Atender
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted">Sin llamados.</p>
              )}
              <h4>Pedidos</h4>
              {table.orders.length ? (
                <ul className="side-list">
                  {table.orders.map((order, index) => (
                    <li key={order.id}>
                      <span>
                        Pedido {index + 1}
                        <small>
                          {order.lines
                            .map(
                              (line) =>
                                `${line.qty} × ${dishById(line.dishId)?.name}`,
                            )
                            .join(', ')}
                        </small>
                        <small>{order.status}</small>
                      </span>
                      {order.status === 'enviado' && (
                        <button
                          type="button"
                          className="dark-button"
                          onClick={() => confirmOrder(table.number, order.id)}
                        >
                          Confirmar
                        </button>
                      )}
                      {order.status === 'confirmado' && (
                        <button
                          type="button"
                          className="dark-button"
                          onClick={() => serveOrder(table.number, order.id)}
                        >
                          Servir
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted">Sin pedidos.</p>
              )}
              <h4>Cuenta</h4>
              <p className="side-total">{money(billTotal(table))}</p>
              {table.occupied && (
                <button
                  type="button"
                  className="light-button"
                  onClick={() => {
                    chargeAndFree(table.number);
                    setSelected(null);
                  }}
                >
                  Cobrar y liberar
                </button>
              )}
            </>
          ) : (
            <p className="muted">Toca una mesa para ver su detalle.</p>
          )}
        </aside>
        <div className="board">
          <ul className="tables" aria-label="Mesas">
            {tables.map((item) => (
              <li key={item.number}>
                <button
                  className="table-button"
                  data-occupied={item.occupied}
                  type="button"
                  aria-pressed={selected === item.number}
                  onClick={() => setSelected(item.number)}
                >
                  <Table
                    number={item.number}
                    occupied={item.occupied}
                    calls={item.calls}
                  />
                  <span className="sr-only">
                    Mesa {item.number}, {item.occupied ? 'ocupada' : 'libre'}
                    {item.calls.length
                      ? `, llamados: ${[...new Set(item.calls)].join(', ')}`
                      : ''}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function Demo() {
  const { view, setView, reset } = useStore(store);
  const [revision, setRevision] = useState(0);
  const [entered, setEntered] = useState(false);
  useEffect(
    () =>
      startSimulator(store, {
        random: Math.random,
        setTimeout: window.setTimeout.bind(window),
        clearTimeout: window.clearTimeout.bind(window),
      }),
    [],
  );
  return (
    <main className="app" data-theme="original">
      <header className="stage-bar">
        <h1>
          El Clan <small>una reconstrucción de iClub</small>
        </h1>
        <fieldset className="selector">
          <legend className="sr-only">Dispositivo</legend>
          <button
            type="button"
            aria-pressed={view === 'comensal'}
            onClick={() => setView('comensal')}
          >
            Comensal
          </button>
          <button
            type="button"
            aria-pressed={view === 'garzon'}
            onClick={() => setView('garzon')}
          >
            Garzón
          </button>
        </fieldset>
        <button
          type="button"
          className="dark-button"
          onClick={() => {
            reset();
            setEntered(false);
            setRevision((value) => value + 1);
          }}
        >
          Reiniciar demo
        </button>
      </header>
      <div className="tablet">
        <span className="tablet-camera" aria-hidden="true" />
        <div className="tablet-glass">
          {view === 'garzon' ? (
            <Garzon key={revision} />
          ) : entered ? (
            <Comensal key={revision} onHome={() => setEntered(false)} />
          ) : (
            <Portada onEnter={() => setEntered(true)} />
          )}
        </div>
      </div>
    </main>
  );
}
