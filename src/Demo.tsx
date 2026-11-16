import { useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { billTotal, cartTotal, createDemoStore } from './domain';
import { categories, type Dish, dishes } from './menu';
import { startSimulator } from './simulator';

const store = createDemoStore();
const money = (amount: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(
    amount,
  );

function Comensal() {
  const { cart, tables, setQty, sendOrder, requestBill, callWaiter } =
    useStore(store);
  const [page, setPage] = useState<'carta' | 'carrito' | 'cuenta'>('carta');
  const [detail, setDetail] = useState<Dish | null>(null);
  const [quantity, setQuantity] = useState(1);
  const count = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  return (
    <>
      <nav className="tabs" aria-label="Comensal">
        <button
          type="button"
          aria-pressed={page === 'carta'}
          onClick={() => {
            setPage('carta');
            setDetail(null);
          }}
        >
          Carta
        </button>
        <button
          type="button"
          aria-pressed={page === 'carrito'}
          onClick={() => {
            setPage('carrito');
            setDetail(null);
          }}
        >
          Carrito ({count})
        </button>
        <button
          type="button"
          aria-pressed={page === 'cuenta'}
          onClick={() => {
            setPage('cuenta');
            setDetail(null);
          }}
        >
          Cuenta
        </button>
        <button type="button" onClick={callWaiter}>
          Llamar al garzón
        </button>
      </nav>
      {detail ? (
        <section className="panel">
          <button type="button" onClick={() => setDetail(null)}>
            ← Volver a la carta
          </button>
          <h2>{detail.name}</h2>
          <p>{detail.description}</p>
          <p>{money(detail.price)}</p>
          {detail.soldOut ? (
            <strong>Agotado</strong>
          ) : (
            <div className="actions">
              <label>
                Cantidad{' '}
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(event) =>
                    setQuantity(
                      Math.max(1, Math.floor(Number(event.target.value) || 1)),
                    )
                  }
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  setQty(detail.id, (cart[detail.id] ?? 0) + quantity);
                  setDetail(null);
                }}
              >
                Agregar al carrito
              </button>
            </div>
          )}
        </section>
      ) : page === 'carta' ? (
        <div>
          <h2>La carta</h2>
          {categories.map((category) => (
            <section key={category}>
              <h3>{category}</h3>
              <div className="dish-list">
                {dishes
                  .filter((dish) => dish.category === category)
                  .map((dish) => (
                    <article
                      className="dish"
                      key={dish.id}
                      data-sold-out={dish.soldOut || undefined}
                    >
                      <input
                        type="checkbox"
                        aria-label={`Agregar ${dish.name} al carrito`}
                        disabled={dish.soldOut}
                        checked={!!cart[dish.id]}
                        onChange={(event) =>
                          setQty(dish.id, event.target.checked ? 1 : 0)
                        }
                      />
                      <button
                        className="dish-detail"
                        type="button"
                        onClick={() => {
                          setQuantity(1);
                          setDetail(dish);
                        }}
                      >
                        <strong>{dish.name}</strong>
                        <span>{dish.description}</span>
                      </button>
                      <span>
                        {dish.soldOut ? 'Agotado' : money(dish.price)}
                      </span>
                    </article>
                  ))}
              </div>
            </section>
          ))}
        </div>
      ) : page === 'cuenta' ? (
        <section className="panel">
          <h2>Tu cuenta</h2>
          {tables[6].orders.length === 0 ? (
            <p>Aún no hay pedidos.</p>
          ) : (
            <>
              {tables[6].orders.flatMap((order) =>
                order.lines.map((line) => {
                  const dish = dishes.find((item) => item.id === line.dishId);
                  return (
                    <div
                      className="cart-line"
                      key={`${order.id}-${line.dishId}`}
                    >
                      <span>
                        {line.qty} × {dish?.name}
                      </span>
                      <strong>{money((dish?.price ?? 0) * line.qty)}</strong>
                    </div>
                  );
                }),
              )}
              <p className="total">Total: {money(billTotal(tables[6]))}</p>
              {tables[6].calls.includes('pago') ? (
                <p>El garzón viene a cobrar.</p>
              ) : (
                <button type="button" onClick={requestBill}>
                  Pedir la cuenta
                </button>
              )}
            </>
          )}
        </section>
      ) : (
        <section className="panel">
          <h2>Tu carrito</h2>
          {count === 0 ? (
            <>
              <p>Tu carrito está vacío.</p>
              <button type="button" onClick={() => setPage('carta')}>
                Ver la carta
              </button>
            </>
          ) : (
            <>
              {dishes
                .filter((dish) => cart[dish.id])
                .map((dish) => (
                  <div className="cart-line" key={dish.id}>
                    <span>{dish.name}</span>
                    <div className="actions">
                      <button
                        type="button"
                        aria-label={`Quitar una unidad de ${dish.name}`}
                        onClick={() => setQty(dish.id, cart[dish.id] - 1)}
                      >
                        −
                      </button>
                      <span>{cart[dish.id]}</span>
                      <button
                        type="button"
                        aria-label={`Agregar una unidad de ${dish.name}`}
                        onClick={() => setQty(dish.id, cart[dish.id] + 1)}
                      >
                        +
                      </button>
                      <strong>{money(dish.price * cart[dish.id])}</strong>
                    </div>
                  </div>
                ))}
              <p className="total">Total: {money(cartTotal(cart))}</p>
              <button type="button" onClick={sendOrder}>
                Enviar pedido
              </button>
            </>
          )}
        </section>
      )}
      {tables[6].orders.length > 0 && (
        <section className="panel">
          <h2>Pedidos de la mesa</h2>
          {tables[6].orders.map((order, index) => (
            <p key={order.id}>
              Pedido {index + 1}: <strong>{order.status}</strong>
            </p>
          ))}
        </section>
      )}
    </>
  );
}

function Garzon() {
  const { tables, confirmOrder, serveOrder, attendCall, chargeAndFree } =
    useStore(store);
  const [selected, setSelected] = useState<number | null>(null);
  const table = tables.find((item) => item.number === selected);
  return table ? (
    <section className="panel">
      <button type="button" onClick={() => setSelected(null)}>
        ← Volver a las mesas
      </button>
      <h2>Mesa {table.number}</h2>
      <h3>Llamados</h3>
      {table.calls.length ? (
        [...new Set(table.calls)].map((call) => (
          <div className="cart-line" key={call}>
            <span>
              {call} ({table.calls.filter((item) => item === call).length})
            </span>
            <button
              type="button"
              onClick={() => attendCall(table.number, call)}
            >
              Atender
            </button>
          </div>
        ))
      ) : (
        <p>Sin llamados pendientes.</p>
      )}
      <h3>Cuenta</h3>
      <p>Total: {money(billTotal(table))}</p>
      {table.occupied && (
        <button
          type="button"
          onClick={() => {
            chargeAndFree(table.number);
            setSelected(null);
          }}
        >
          Cobrar y liberar mesa
        </button>
      )}
      <h3>Pedidos</h3>
      {table.orders.length ? (
        table.orders.map((order, index) => (
          <article className="order" key={order.id}>
            <strong>
              Pedido {index + 1} · {order.status}
            </strong>
            <ul>
              {order.lines.map((line) => (
                <li key={line.dishId}>
                  {line.qty} ×{' '}
                  {dishes.find((dish) => dish.id === line.dishId)?.name}
                </li>
              ))}
            </ul>
            {order.status === 'enviado' && (
              <button
                type="button"
                onClick={() => confirmOrder(table.number, order.id)}
              >
                Confirmar
              </button>
            )}
            {order.status === 'confirmado' && (
              <button
                type="button"
                onClick={() => serveOrder(table.number, order.id)}
              >
                Servir
              </button>
            )}
          </article>
        ))
      ) : (
        <p>Sin pedidos.</p>
      )}
    </section>
  ) : (
    <section>
      <h2>Mesas</h2>
      <p>
        {tables.reduce((sum, item) => sum + item.calls.length, 0)} llamados
        pendientes
      </p>
      <div className="tables">
        {tables.map((item) => (
          <button
            className="table"
            type="button"
            key={item.number}
            onClick={() => setSelected(item.number)}
          >
            <strong>Mesa {item.number}</strong>
            <span>{item.occupied ? 'Ocupada' : 'Libre'}</span>
            {[...new Set(item.calls)].map((call) => (
              <span className="call" key={call}>
                Llamado: {call} (
                {item.calls.filter((kind) => kind === call).length})
              </span>
            ))}
          </button>
        ))}
      </div>
    </section>
  );
}

export function Demo() {
  const { view, setView, reset } = useStore(store);
  const [revision, setRevision] = useState(0);
  useEffect(
    () =>
      startSimulator(store, { random: Math.random, setTimeout, clearTimeout }),
    [],
  );
  return (
    <main className="app">
      <header>
        <div>
          <span className="eyebrow">Restaurant</span>
          <h1>El Clan</h1>
          <p>Mesa 7</p>
        </div>
        <nav className="tabs" aria-label="Vista">
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
        </nav>
        <button
          type="button"
          onClick={() => {
            reset();
            setRevision((value) => value + 1);
          }}
        >
          Reiniciar demo
        </button>
      </header>
      {view === 'comensal' ? (
        <Comensal key={revision} />
      ) : (
        <Garzon key={revision} />
      )}
    </main>
  );
}
