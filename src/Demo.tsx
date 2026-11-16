import { Label } from '@ui-sdk/react/label';
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
import {
  billTotal,
  cartTotal,
  createDemoStore,
  type Line,
  unitPrice,
} from './domain';
import { money } from './format';
import { useDishText, useExtraName, useT } from './i18n';
import {
  type Category,
  categories,
  type Dish,
  dishes,
  type Extra,
} from './menu';
import { startSimulator } from './simulator';

const store = createDemoStore();
const dishById = (id: string) => dishes.find((dish) => dish.id === id);
/** La línea tal como se imprime en la boleta: agregados y nota debajo. */
const receiptLine = (
  line: Line,
  key: string,
  qty: ReactNode,
  extraName: (extra: Extra) => string,
) => {
  const dish = dishById(line.dishId);
  return {
    key,
    name: dish?.name ?? line.dishId,
    qty,
    price: (dish?.price ?? 0) * line.qty,
    extras: (dish?.extras ?? [])
      .filter((extra) => line.extras.includes(extra.id))
      .map((extra) => ({
        name: extraName(extra),
        price: extra.price * line.qty,
      })),
    note: line.note,
  };
};
const lineKey = (line: Line) =>
  [line.dishId, ...line.extras, line.note].join('|');
/** Resumen de una línea para la lista del pedido: "2 × Italiano + Palta (sin mayo)". */
const lineSummary = (line: Line, extraName: (extra: Extra) => string) => {
  const dish = dishById(line.dishId);
  const extras = (dish?.extras ?? [])
    .filter((extra) => line.extras.includes(extra.id))
    .map((extra) => ` + ${extraName(extra)}`)
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
  const t = useT();
  const text = useDishText();
  const extraName = useExtraName();
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
                <p>{text(detail)}</p>
                <label className="post-it">
                  <span className="sr-only">{t('kitchenNote')}</span>
                  <textarea
                    value={note}
                    maxLength={120}
                    placeholder={t('addNote')}
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
                      {t('extras')}
                    </legend>
                    {detail.extras.map((extra) => (
                      <Label key={extra.id} className="extra">
                        <KitCheck
                          label={`${extraName(extra)}, ${money(extra.price)}`}
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
                        <span aria-hidden="true">{extraName(extra)}</span>
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
                      <p className="sold-out">{t('soldOut')}</p>
                    ) : (
                      <QuantityWheel
                        value={quantity}
                        onChange={setQuantity}
                        label={t('quantityOf')(detail.name)}
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
                      {t('add')}
                    </button>
                  </div>
                  <div className="detail-receipt">
                    {choice && (
                      <Receipt
                        caption={t('previewOf')(detail.name)}
                        lines={[
                          receiptLine(
                            choice,
                            detail.id,
                            `x${quantity}`,
                            extraName,
                          ),
                        ]}
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
                          aria-label={t('seeDetailOf')(dish.name)}
                          onClick={() => {
                            setQuantity(1);
                            setExtras([]);
                            setNote('');
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
                    lines={cart.map((line) =>
                      receiptLine(
                        line,
                        lineKey(line),
                        <Stepper
                          name={dishById(line.dishId)?.name ?? line.dishId}
                          qty={line.qty}
                          onChange={(qty) => setQty(line, qty)}
                        />,
                        extraName,
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
                          .map((line) => lineSummary(line, extraName))
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
                      order.lines.map((line) =>
                        receiptLine(
                          line,
                          `${order.id}-${lineKey(line)}`,
                          `x${line.qty}`,
                          extraName,
                        ),
                      ),
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
  const extraName = useExtraName();
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
                        {order.lines.map((line) => (
                          <small key={lineKey(line)}>
                            {lineSummary(line, extraName)}
                          </small>
                        ))}
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
