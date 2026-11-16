import { Label } from '@ui-sdk/react/label';
import {
  BookOpen,
  Check,
  Clock,
  ConciergeBell,
  ReceiptText,
  ShoppingCart,
} from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { DishPlate } from './components/DishPlate';
import { KitCheck } from './components/KitCheck';
import { ArrowButton, Navbar } from './components/Navbar';
import { QuantityWheel } from './components/QuantityWheel';
import { Receipt, Stepper } from './components/Receipt';
import { Table } from './components/Table';
import { ThemeSwitch } from './components/ThemeSwitch';
import {
  billTotal,
  type CallKind,
  cartTotal,
  createDemoStore,
  type Line,
  unitPrice,
} from './domain';
import { money } from './format';
import { type Category, categories, type Dish, dishes } from './menu';
import { startSimulator } from './simulator';

const store = createDemoStore();
const dishById = (id: string) => dishes.find((dish) => dish.id === id);
const callLabels: Record<CallKind, string> = {
  pedido: 'Pedido nuevo',
  garzón: 'Llama al garzón',
  pago: 'Pide la cuenta',
};
/** La línea tal como se imprime en la boleta: agregados y nota debajo. */
const receiptLine = (line: Line, key: string, qty: ReactNode) => {
  const dish = dishById(line.dishId);
  return {
    key,
    name: dish?.name ?? line.dishId,
    qty,
    price: (dish?.price ?? 0) * line.qty,
    extras: (dish?.extras ?? [])
      .filter((extra) => line.extras.includes(extra.id))
      .map((extra) => ({ name: extra.name, price: extra.price * line.qty })),
    note: line.note,
  };
};
const lineKey = (line: Line) =>
  [line.dishId, ...line.extras, line.note].join('|');
/** Resumen de una línea para la lista del pedido: "2 × Italiano + Palta (sin mayo)". */
const lineSummary = (line: Line) => {
  const dish = dishById(line.dishId);
  const extras = (dish?.extras ?? [])
    .filter((extra) => line.extras.includes(extra.id))
    .map((extra) => ` + ${extra.name}`)
    .join('');
  return `${line.qty} × ${dish?.name}${extras}${line.note ? ` (${line.note})` : ''}`;
};
const statusLabels = ['enviado', 'confirmado', 'servido'] as const;

type Page = 'carta' | 'carrito' | 'estado' | 'cuenta';

function Comensal({ onHome }: { onHome: () => void }) {
  const {
    cart,
    tables,
    setQty,
    addToCart,
    sendOrder,
    requestBill,
    callWaiter,
  } = useStore(store);
  const mesa = tables[6];
  const [page, setPage] = useState<Page>('carta');
  const [category, setCategory] = useState<Category>(categories[0]);
  const [detail, setDetail] = useState<Dish | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [extras, setExtras] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const count = cart.reduce((sum, line) => sum + line.qty, 0);
  const choice: Line | null = detail && {
    dishId: detail.id,
    extras,
    note: note.trim(),
    qty: quantity,
  };
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
      <Navbar
        start={
          <ArrowButton onClick={() => (detail ? setDetail(null) : onHome())}>
            {detail ? 'Carta' : 'Volver'}
          </ArrowButton>
        }
        title={title}
        logo={title === 'El Clan'}
        end={
          <button
            type="button"
            className="dark-button cart-button"
            aria-label={`Ver pedido, ${count} unidades`}
            onClick={() => go('carrito')}
          >
            <ShoppingCart aria-hidden="true" strokeWidth={2.5} />
            {count > 0 && <span className="count">{count}</span>}
          </button>
        }
      />
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
              <h3 className="ribbon">
                <span className="ribbon-cloth">
                  <svg
                    className="ribbon-stitch"
                    viewBox="0 0 100 26"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <polyline points="0,20 50,7 100,20" />
                  </svg>
                  {detail.name}
                </span>
              </h3>
              <div className="detail-text">
                <p>{detail.description}</p>
                <label className="post-it">
                  <span className="sr-only">Nota para cocina</span>
                  <textarea
                    value={note}
                    maxLength={120}
                    placeholder="Agregar nota..."
                    disabled={detail.soldOut}
                    onChange={(event) => setNote(event.target.value)}
                  />
                </label>
              </div>
              <div className="detail-foot">
                {detail.extras && (
                  <fieldset className="extras">
                    <legend>
                      <span className="stamp" aria-hidden="true" />
                      Agregados
                    </legend>
                    {detail.extras.map((extra) => (
                      <Label key={extra.id} className="extra">
                        <KitCheck
                          label={`${extra.name}, ${money(extra.price)}`}
                          disabled={detail.soldOut}
                          checked={extras.includes(extra.id)}
                          onChange={(checked) =>
                            setExtras((current) =>
                              checked
                                ? [...current, extra.id]
                                : current.filter((id) => id !== extra.id),
                            )
                          }
                        />
                        <span aria-hidden="true">{extra.name}</span>
                        <span className="extra-price" aria-hidden="true">
                          +{money(extra.price)}
                        </span>
                      </Label>
                    ))}
                  </fieldset>
                )}
                <div className="detail-order">
                  <div className="detail-qty">
                    {detail.soldOut ? (
                      <p className="sold-out">Agotado por hoy</p>
                    ) : (
                      <QuantityWheel
                        value={quantity}
                        onChange={setQuantity}
                        label={`Cantidad de ${detail.name}`}
                      />
                    )}
                    <button
                      type="button"
                      className="light-button"
                      disabled={detail.soldOut}
                      onClick={() => {
                        if (choice) addToCart(choice, quantity);
                        setDetail(null);
                      }}
                    >
                      Agregar
                    </button>
                  </div>
                  <div className="detail-receipt">
                    {choice && (
                      <Receipt
                        caption={`Vista previa de ${detail.name}`}
                        lines={[receiptLine(choice, detail.id, `x${quantity}`)]}
                        total={
                          detail.soldOut ? 0 : unitPrice(choice) * quantity
                        }
                      />
                    )}
                  </div>
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
                        <KitCheck
                          label={`Agregar ${dish.name} al pedido`}
                          disabled={dish.soldOut}
                          checked={cart.some(
                            (line) =>
                              line.dishId === dish.id &&
                              !line.extras.length &&
                              !line.note,
                          )}
                          onChange={(checked) =>
                            setQty({ dishId: dish.id }, checked ? 1 : 0)
                          }
                        />
                        <button
                          className="light-button"
                          type="button"
                          aria-label={`Ver ${dish.name} en detalle`}
                          onClick={() => {
                            setQuantity(1);
                            setExtras([]);
                            setNote('');
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
                    lines={cart.map((line) =>
                      receiptLine(
                        line,
                        lineKey(line),
                        <Stepper
                          name={dishById(line.dishId)?.name ?? line.dishId}
                          qty={line.qty}
                          onChange={(qty) => setQty(line, qty)}
                        />,
                      ),
                    )}
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
                        {order.lines.map(lineSummary).join(' · ')}
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
                      order.lines.map((line) =>
                        receiptLine(
                          line,
                          `${order.id}-${lineKey(line)}`,
                          `x${line.qty}`,
                        ),
                      ),
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
      <Navbar
        title="Sala principal"
        end={
          <span className="pending" role="status">
            {pending} {pending === 1 ? 'llamado' : 'llamados'}
          </span>
        }
      />
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
                        {order.lines.map((line) => (
                          <small key={lineKey(line)}>{lineSummary(line)}</small>
                        ))}
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
        setTimeout: (fn, ms) => window.setTimeout(fn, ms),
        clearTimeout: (id) => window.clearTimeout(id),
      }),
    [],
  );
  return (
    <main className="app">
      <header className="stage-bar">
        <h1>
          El Clan <small>una reconstrucción de iClub</small>
        </h1>
        <ThemeSwitch />
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
