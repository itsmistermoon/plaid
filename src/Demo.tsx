import {
  BookOpen,
  Check,
  Clock,
  ConciergeBell,
  ReceiptText,
  RotateCcw,
  ShoppingCart,
} from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { DishPlate } from './components/DishPlate';
import { KitCheck } from './components/KitCheck';
import { LangSwitch } from './components/LangSwitch';
import { ArrowButton, Navbar } from './components/Navbar';
import { QuantityWheel } from './components/QuantityWheel';
import { Receipt, Stepper } from './components/Receipt';
import { Table } from './components/Table';
import { ThemeSwitch } from './components/ThemeSwitch';
import { billTotal, cartTotal, createDemoStore } from './domain';
import { money } from './format';
import { useDishText, useT } from './i18n';
import { type Category, categories, type Dish, dishes } from './menu';
import { startSimulator } from './simulator';

const store = createDemoStore();
const dishById = (id: string) => dishes.find((dish) => dish.id === id);
const statusLabels = ['enviado', 'confirmado', 'servido'] as const;

type Page = 'carta' | 'carrito' | 'estado' | 'cuenta';

function Comensal({ onHome }: { onHome: () => void }) {
  const { cart, tables, setQty, sendOrder, requestBill, callWaiter } =
    useStore(store);
  const t = useT();
  const text = useDishText();
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
        carrito: t('yourOrder'),
        estado: t('status'),
        cuenta: t('yourBill'),
      }[page];
  const menu: { page: Page; label: string; icon: ReactNode; off?: boolean }[] =
    [
      { page: 'carta', label: t('menu'), icon: <BookOpen /> },
      {
        page: 'carrito',
        label: t('order'),
        icon: <ShoppingCart />,
      },
      {
        page: 'estado',
        label: t('status'),
        icon: <Clock />,
        off: !mesa.orders.length,
      },
      { page: 'cuenta', label: t('bill'), icon: <ReceiptText /> },
    ];
  return (
    <div className="screen" data-surface="comensal">
      <Navbar
        start={
          <ArrowButton
            className={detail ? undefined : 'desktop-only'}
            onClick={() => (detail ? setDetail(null) : onHome())}
          >
            {detail ? t('menu') : t('back')}
          </ArrowButton>
        }
        title={title}
        logo={title === 'El Clan'}
        end={
          <button
            type="button"
            className="dark-button cart-button desktop-only"
            aria-label={t('viewOrder')(count)}
            onClick={() => go('carrito')}
          >
            <ShoppingCart aria-hidden="true" strokeWidth={2.5} />
            {count > 0 && <span className="count">{count}</span>}
          </button>
        }
      />
      <div className="screen-body">
        <nav className="sidebar tabbar" aria-label={t('diner')}>
          <div className="sidebar-guest">
            <span className="avatar" aria-hidden="true">
              7
            </span>
            {t('table7')}
          </div>
          {menu.map((item) => (
            <button
              key={item.page}
              type="button"
              className="sidebar-item"
              data-tab={item.page === 'cuenta' ? undefined : true}
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
            {mesa.calls.includes('garzón')
              ? t('waiterComing')
              : t('waiterShort')}
          </button>
          <p className="sidebar-logo">
            El Clan<small>{t('withIclub')}</small>
          </p>
        </nav>
        <div className="board">
          {detail ? (
            <section className="card detail" aria-label={detail.name}>
              <DishPlate dish={detail} size="big" />
              <h3 className="ribbon">{detail.name}</h3>
              <p className="detail-text">{text(detail)}</p>
              <div className="detail-foot">
                <div className="detail-qty">
                  <span className="stamp" aria-hidden="true" />
                  <h4>{t('quantity')}</h4>
                  {detail.soldOut ? (
                    <p className="sold-out">{t('soldOut')}</p>
                  ) : (
                    <QuantityWheel
                      value={quantity}
                      onChange={setQuantity}
                      label={t('quantityOf')(detail.name)}
                    />
                  )}
                </div>
                <div className="detail-receipt">
                  <Receipt
                    caption={t('previewOf')(detail.name)}
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
                    {t('add')}
                  </button>
                </div>
              </div>
            </section>
          ) : page === 'carta' ? (
            <>
              <div
                className="segmented"
                role="tablist"
                aria-label={t('categoriesLabel')}
              >
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    role="tab"
                    aria-selected={category === item}
                    onClick={() => setCategory(item)}
                  >
                    {t('categories')[item]}
                  </button>
                ))}
              </div>
              <ul className="dish-list" aria-label={t('categories')[category]}>
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
                        <p>{dish.soldOut ? t('soldOut') : text(dish)}</p>
                      </div>
                      <div className="dish-side">
                        <span className="dish-price">{money(dish.price)}</span>
                        <KitCheck
                          label={t('addToOrder')(dish.name)}
                          disabled={dish.soldOut}
                          checked={!!cart[dish.id]}
                          onChange={(checked) =>
                            setQty(dish.id, checked ? 1 : 0)
                          }
                        />
                        <button
                          className="light-button"
                          type="button"
                          aria-label={t('seeDetailOf')(dish.name)}
                          onClick={() => {
                            setQuantity(1);
                            setDetail(dish);
                          }}
                        >
                          {t('seeDetail')}
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            </>
          ) : page === 'carrito' ? (
            <section className="card ticket-card" aria-label={t('yourOrder')}>
              {count === 0 ? (
                <div className="empty">
                  <ShoppingCart aria-hidden="true" />
                  <p>{t('emptyOrder')}</p>
                  <button
                    type="button"
                    className="light-button"
                    onClick={() => go('carta')}
                  >
                    {t('seeMenu')}
                  </button>
                </div>
              ) : (
                <>
                  <Receipt
                    caption={t('yourOrder')}
                    total={cartTotal(cart)}
                    lines={dishes
                      .filter((dish) => cart[dish.id])
                      .map((dish) => ({
                        key: dish.id,
                        name: dish.name,
                        price: dish.price * cart[dish.id],
                        qty: (
                          <Stepper
                            name={dish.name}
                            qty={cart[dish.id]}
                            onChange={(qty) => setQty(dish.id, qty)}
                          />
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
                    {t('placeOrder')}
                  </button>
                </>
              )}
            </section>
          ) : page === 'estado' ? (
            <section className="card status" aria-label={t('orderStatus')}>
              <ol className="orders">
                {mesa.orders.map((order, index) => {
                  const step = statusLabels.indexOf(order.status);
                  return (
                    <li key={order.id}>
                      <h3>{t('orderN')(index + 1)}</h3>
                      <p className="order-lines">
                        {order.lines
                          .map(
                            (line) =>
                              `${line.qty} × ${dishById(line.dishId)?.name}`,
                          )
                          .join(' · ')}
                      </p>
                      <ol className="steps" aria-label={t('progress')}>
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
                            {t('statuses')[label]}
                          </li>
                        ))}
                      </ol>
                    </li>
                  );
                })}
              </ol>
              <div className="status-actions mobile-only">
                <button
                  type="button"
                  className="dark-button"
                  disabled={mesa.calls.includes('garzón')}
                  onClick={callWaiter}
                >
                  <ConciergeBell aria-hidden="true" />
                  {mesa.calls.includes('garzón')
                    ? t('waiterComing')
                    : t('callWaiter')}
                </button>
                <button
                  type="button"
                  className="light-button"
                  onClick={() => go('cuenta')}
                >
                  <ReceiptText aria-hidden="true" />
                  {t('bill')}
                </button>
              </div>
            </section>
          ) : (
            <section className="card ticket-card" aria-label={t('yourBill')}>
              {mesa.orders.length === 0 ? (
                <div className="empty">
                  <ReceiptText aria-hidden="true" />
                  <p>{t('emptyBill')}</p>
                </div>
              ) : (
                <>
                  <Receipt
                    caption={t('yourBill')}
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
                      {t('billComing')}
                    </p>
                  ) : (
                    <button
                      type="button"
                      className="light-button"
                      onClick={requestBill}
                    >
                      {t('askBill')}
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
  const t = useT();
  return (
    <div className="screen portada" data-surface="comensal">
      <h2 className="sr-only">{t('welcome')}</h2>
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
      <p className="portada-text">{t('scanQr')}</p>
      <button type="button" className="light-button" onClick={onEnter}>
        {t('sitDown')}
      </button>
    </div>
  );
}

function Garzon() {
  const { tables, confirmOrder, serveOrder, attendCall, chargeAndFree } =
    useStore(store);
  const t = useT();
  const [selected, setSelected] = useState<number | null>(null);
  const table = tables.find((item) => item.number === selected);
  const pending = tables.reduce((sum, item) => sum + item.calls.length, 0);
  return (
    <div className="screen" data-surface="garzon">
      <Navbar
        title={t('floor')}
        end={
          <span className="pending" role="status">
            {t('pendingCalls')(pending)}
          </span>
        }
      />
      <div className="screen-body">
        <aside
          className="sidebar table-detail"
          aria-label={t('tableDetail')}
          data-open={table ? true : undefined}
        >
          {table ? (
            <>
              <div className="table-detail-head">
                <h3>{t('tableN')(table.number)}</h3>
                <button
                  type="button"
                  className="dark-button mobile-only"
                  onClick={() => setSelected(null)}
                >
                  {t('closeDetail')}
                </button>
              </div>
              <p className="muted">
                {table.occupied ? t('occupied') : t('free')}
              </p>
              <h4>{t('calls')}</h4>
              {table.calls.length ? (
                <ul className="side-list">
                  {[...new Set(table.calls)].map((call) => (
                    <li key={call} data-kind={call}>
                      <span>{t('callLabels')[call]}</span>
                      <button
                        type="button"
                        className="dark-button"
                        onClick={() => attendCall(table.number, call)}
                      >
                        {t('attend')}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted">{t('noCalls')}</p>
              )}
              <h4>{t('orders')}</h4>
              {table.orders.length ? (
                <ul className="side-list">
                  {table.orders.map((order, index) => (
                    <li key={order.id}>
                      <span>
                        {t('orderN')(index + 1)}
                        <small>
                          {order.lines
                            .map(
                              (line) =>
                                `${line.qty} × ${dishById(line.dishId)?.name}`,
                            )
                            .join(', ')}
                        </small>
                        <small>{t('statuses')[order.status]}</small>
                      </span>
                      {order.status === 'enviado' && (
                        <button
                          type="button"
                          className="dark-button"
                          onClick={() => confirmOrder(table.number, order.id)}
                        >
                          {t('confirm')}
                        </button>
                      )}
                      {order.status === 'confirmado' && (
                        <button
                          type="button"
                          className="dark-button"
                          onClick={() => serveOrder(table.number, order.id)}
                        >
                          {t('serve')}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted">{t('noOrders')}</p>
              )}
              <h4>{t('bill')}</h4>
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
                  {t('chargeAndFree')}
                </button>
              )}
            </>
          ) : (
            <p className="muted">{t('pickTable')}</p>
          )}
        </aside>
        <div className="board">
          <ul className="tables" aria-label={t('tables')}>
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
                    {t('tableSummary')(item.number, item.occupied)}
                    {item.calls.length
                      ? `, ${t('callsSummary')}: ${[...new Set(item.calls)]
                          .map((call) => t('callLabels')[call])
                          .join(', ')}`
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
  const t = useT();
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
          El Clan <small>{t('stageSubtitle')}</small>
        </h1>
        <ThemeSwitch />
        <LangSwitch />
        <fieldset className="selector">
          <legend className="sr-only">{t('device')}</legend>
          <button
            type="button"
            aria-pressed={view === 'comensal'}
            onClick={() => setView('comensal')}
          >
            {t('diner')}
          </button>
          <button
            type="button"
            aria-pressed={view === 'garzon'}
            onClick={() => setView('garzon')}
          >
            {t('waiter')}
          </button>
        </fieldset>
        <button
          type="button"
          className="dark-button reset-button"
          aria-label={t('resetDemo')}
          onClick={() => {
            reset();
            setEntered(false);
            setRevision((value) => value + 1);
          }}
        >
          <RotateCcw aria-hidden="true" />
          <span className="reset-label">{t('resetDemo')}</span>
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
