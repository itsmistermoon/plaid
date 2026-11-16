import { Checkbox, CheckboxIndicator } from '@ui-sdk/react/checkbox';
import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
} from '@ui-sdk/react/number-input';
import { useState } from 'react';
import { useStore } from 'zustand';
import { cartTotal, createDemoStore } from './domain';
import { categories, type Dish, dishes } from './menu';
import { Table } from './Table';

const store = createDemoStore();
const money = (amount: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(
    amount,
  );

function Comensal() {
  const { cart, tables, setQty, sendOrder } = useStore(store);
  const [page, setPage] = useState<'carta' | 'carrito' | 'estado'>('carta');
  const [category, setCategory] = useState(categories[0]);
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
          aria-pressed={page === 'estado'}
          disabled={!tables[6].orders.length}
          onClick={() => {
            setPage('estado');
            setDetail(null);
          }}
        >
          Estado
        </button>
      </nav>
      {detail ? (
        <section className="panel detail-panel">
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
              <NumberInput
                value={quantity}
                min={1}
                onValueChange={(value) => setQuantity(value ?? 1)}
              >
                <NumberInputGroup className="actions">
                  <NumberInputDecrement aria-label="Quitar una unidad">
                    −
                  </NumberInputDecrement>
                  <NumberInputControl aria-label="Cantidad" />
                  <NumberInputIncrement aria-label="Agregar una unidad">
                    +
                  </NumberInputIncrement>
                </NumberInputGroup>
              </NumberInput>
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
          <div className="categories">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
          {[category].map((category) => (
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
                      <Checkbox
                        aria-label={`Agregar ${dish.name} al carrito`}
                        disabled={dish.soldOut}
                        checked={!!cart[dish.id]}
                        onCheckedChange={(checked) =>
                          setQty(dish.id, checked ? 1 : 0)
                        }
                      >
                        <CheckboxIndicator aria-hidden="true">
                          ✓
                        </CheckboxIndicator>
                      </Checkbox>
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
      ) : page === 'estado' ? (
        <section className="panel status-panel">
          <h2>Estado del pedido</h2>
          {tables[6].orders.map((order, index) => (
            <p key={order.id}>
              Pedido {index + 1}: <strong>{order.status}</strong>
            </p>
          ))}
        </section>
      ) : (
        <section className="receipt-wrap">
          <div className="receipt">
            <div className="receipt-head">
              El Clan<small>Mesa 7 · boleta de pedido</small>
            </div>
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
                <button
                  type="button"
                  onClick={() => {
                    sendOrder();
                    setPage('estado');
                  }}
                >
                  Enviar pedido
                </button>
              </>
            )}
          </div>
        </section>
      )}
    </>
  );
}

function Garzon() {
  const { tables, confirmOrder, serveOrder, attendCall } = useStore(store);
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
            data-occupied={item.occupied}
            type="button"
            key={item.number}
            onClick={() => setSelected(item.number)}
          >
            <Table
              number={item.number}
              occupied={item.occupied}
              calls={item.calls}
            />
            <span className="sr-only">
              Mesa {item.number}, {item.occupied ? 'ocupada' : 'libre'}
              {item.calls.length ? `, llamados: ${item.calls.join(', ')}` : ''}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

export function Demo() {
  const { view, setView } = useStore(store);
  const [entered, setEntered] = useState(false);
  return (
    <main className="app" data-theme="original">
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
      </header>
      <div className="tablet">
        <div className="tablet-camera" />
        <div className="tablet-screen">
          <div className="screen-bar">
            <span>El Clan</span>
            <span>{view === 'comensal' ? 'Mesa 7' : 'Sala principal'}</span>
          </div>
          {view === 'comensal' ? (
            entered ? (
              <Comensal />
            ) : (
              <section className="welcome">
                <div className="qr" aria-hidden="true">
                  ▦
                </div>
                <h2>Bienvenido a El Clan</h2>
                <p>
                  Escanea el código de tu mesa para descubrir nuestra carta.
                </p>
                <button type="button" onClick={() => setEntered(true)}>
                  Entrar a la carta
                </button>
              </section>
            )
          ) : (
            <Garzon />
          )}
        </div>
      </div>
    </main>
  );
}
