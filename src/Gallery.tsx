import {
  BookOpen,
  Clock,
  ConciergeBell,
  ReceiptText,
  ShoppingCart,
} from 'lucide-react';
import {
  type ReactNode,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Link } from 'wouter';
import { CategoryTabs } from './components/CategoryTabs';
import { DishPlate } from './components/DishPlate';
import { Dropdown } from './components/Dropdown';
import { Extras } from './components/Extras';
import { KitCheck } from './components/KitCheck';
import { KitSwitch } from './components/KitSwitch';
import { LangSwitch } from './components/LangSwitch';
import {
  ArrowButton,
  CartButton,
  Navbar,
  PendingCalls,
} from './components/Navbar';
import {
  OrderToastRegion,
  showOrderToast,
  ToastFace,
  type ToastKind,
} from './components/OrderToast';
import { PostIt } from './components/PostIt';
import { ProgressBar } from './components/ProgressBar';
import { QuantityWheel } from './components/QuantityWheel';
import {
  Receipt,
  ReceiptActions,
  type ReceiptLine,
  Stepper,
} from './components/Receipt';
import { Ribbon } from './components/Ribbon';
import { Scanner } from './components/Scanner';
import { Scroller } from './components/Scroller';
import { SealBadge } from './components/Seal';
import { SearchField } from './components/SearchField';
import { Selector } from './components/Selector';
import { SelectorToggle } from './components/SelectorToggle';
import { Sidebar, SidebarItem } from './components/Sidebar';
import { StageBar } from './components/StageBar';
import { TableButton } from './components/Table';
import { TableDetail, TableDetailEmpty } from './components/TableDetail';
import { ThemeSwitch } from './components/ThemeSwitch';
import { lineKey, receiptLine } from './demo/lines';
import {
  billTotal,
  type CallKind,
  cartTotal,
  type Line,
  type Table,
} from './domain';
import { money } from './format';
import { pathFor, useExtraName, useLang, useT } from './i18n';
import { type Category, categories, dishes } from './menu';

const dish = (id: string) => {
  const found = dishes.find((item) => item.id === id);
  if (!found) throw new Error(`No existe el plato ${id}`);
  return found;
};
const callKinds: CallKind[] = ['pedido', 'garzón', 'pago'];
const line = (dishId: string, qty: number, extras: string[] = []): Line => ({
  dishId,
  qty,
  extras,
  note: '',
});

/**
 * Un componente de la galería, como en spec-01: la pieza en uso arriba,
 * sus variantes con etiqueta abajo y al pie si es presentacional o de UI SDK.
 * El número sale de un contador CSS, así el orden de la página es la numeración.
 */
function Panel({
  title,
  uses,
  states = [],
  wide,
  tall,
  children,
}: {
  title: string;
  uses: string[];
  states?: { label: string; node: ReactNode }[];
  wide?: boolean | 'full';
  /** Ocupa dos filas de la grilla, junto a dos paneles anchos apilados. */
  tall?: boolean;
  children: ReactNode;
}) {
  const t = useT();
  const id = useId();
  return (
    <section
      className="panel"
      aria-labelledby={id}
      data-wide={wide || undefined}
      data-tall={tall || undefined}
    >
      <h3 className="panel-caption" id={id}>
        <span className="panel-number" aria-hidden="true" />
        {title}
      </h3>
      <div className="panel-stage">{children}</div>
      {states.length > 0 && (
        <ul className="panel-states" aria-label={t('states')}>
          {states.map((state) => (
            <li key={state.label}>
              {state.node}
              <small>{state.label}</small>
            </li>
          ))}
        </ul>
      )}
      <p className="panel-uses">
        {uses.length ? `UI SDK: ${uses.join(', ')}` : t('presentational')}
      </p>
    </section>
  );
}

/** Un grupo de paneles con su título. */
function Group({ title, children }: { title: string; children: ReactNode }) {
  const id = useId();
  return (
    <section className="gallery-group" aria-labelledby={id}>
      <h2 className="gallery-group-title" id={id}>
        {title}
      </h2>
      <div className="gallery-grid">{children}</div>
    </section>
  );
}

function ButtonDemo() {
  const [taps, setTaps] = useState(0);
  const t = useT();
  return (
    <div className="row">
      <button
        type="button"
        className="light-button"
        onClick={() => setTaps(taps + 1)}
      >
        {t('add')}
      </button>
      <button
        type="button"
        className="dark-button"
        onClick={() => setTaps(taps + 1)}
      >
        {t('attend')}
      </button>
      <output className="hint">{t('taps')(taps)}</output>
    </div>
  );
}

function ArrowDemo() {
  const [backs, setBacks] = useState(0);
  const t = useT();
  return (
    <div className="row">
      <ArrowButton onClick={() => setBacks(backs + 1)}>{t('menu')}</ArrowButton>
      <output className="hint">{t('backs')(backs)}</output>
    </div>
  );
}

function WheelDemo() {
  const [qty, setQty] = useState(2);
  const t = useT();
  return <QuantityWheel value={qty} onChange={setQty} label={t('quantity')} />;
}

/** El stepper vive sobre el papel de la boleta. */
function StepperOnPaper({ qty }: { qty: number }) {
  const [value, setValue] = useState(qty);
  return (
    <span className="stepper-paper">
      <Stepper
        name="Italiano"
        qty={value}
        onChange={(next) => setValue(Math.max(1, next))}
      />
    </span>
  );
}

function CheckDemo() {
  const [checked, setChecked] = useState(false);
  const t = useT();
  return (
    <label className="row">
      <KitCheck
        label={t('addDish')('Italiano')}
        checked={checked}
        onChange={setChecked}
      />
      {/* Las dos etiquetas ocupan la misma celda y solo se ve una: el ancho
          es el de la más larga y cambiar de estado no mueve nada. */}
      <span className="hint swap-label">
        <span hidden={checked}>{t('notAdded')}</span>
        <span hidden={!checked}>{t('inOrder')}</span>
      </span>
    </label>
  );
}

const sandwichExtras = dish('chacarero').extras ?? [];

function ExtrasDemo() {
  const [selected, setSelected] = useState<string[]>(['palta']);
  return (
    <Extras
      extras={sandwichExtras}
      selected={selected}
      onChange={setSelected}
    />
  );
}

function SwitchDemo() {
  const [on, setOn] = useState(true);
  const t = useT();
  return <KitSwitch label={t('callsSwitch')} checked={on} onChange={setOn} />;
}

function SearchDemo() {
  const [query, setQuery] = useState('pi');
  const t = useT();
  const found = dishes.filter((item) =>
    item.name.toLowerCase().includes(query.trim().toLowerCase()),
  );
  return (
    <div className="stack">
      <SearchField label={t('searchMenu')} value={query} onChange={setQuery} />
      <p className="hint search-hint" aria-live="polite">
        {query.trim()
          ? t('found')(found.length, found.map((item) => item.name).join(', '))
          : t('typeToSearch')}
      </p>
    </div>
  );
}

function DropdownDemo() {
  const [value, setValue] = useState<Category | null>('Fondos');
  const t = useT();
  return (
    <Dropdown
      label={t('category')}
      items={categories.map((id) => ({
        value: id,
        label: t('categories')[id],
      }))}
      value={value}
      onChange={(next) => setValue(next as Category)}
    />
  );
}

type View = 'comensal' | 'garzon';

/** El selector de rol de la barra del demo, en sus dos formas. */
function RoleSwitch({ phone }: { phone?: boolean }) {
  const [view, setView] = useState<View>('comensal');
  const t = useT();
  return (
    <div className="stage-bar" data-phone={phone || undefined}>
      {phone ? (
        <SelectorToggle
          className="role-switch"
          label={t('device')}
          current={view === 'garzon' ? t('waiter') : t('diner')}
          next={view === 'garzon' ? t('diner') : t('waiter')}
          onClick={() => setView(view === 'garzon' ? 'comensal' : 'garzon')}
        />
      ) : (
        <Selector
          className="role-switch"
          legend={t('device')}
          value={view}
          options={[
            { value: 'comensal', label: t('diner') },
            { value: 'garzon', label: t('waiter') },
          ]}
          onChange={setView}
        />
      )}
    </div>
  );
}

const statusSteps = ['enviado', 'confirmado', 'servido'] as const;

function ProgressDemo() {
  const [step, setStep] = useState(0);
  const t = useT();
  return (
    <div className="stack">
      <ProgressBar
        label={t('orderStatusLabel')(t('statuses')[statusSteps[step]])}
        value={((step + 1) / statusSteps.length) * 100}
      />
      <button
        type="button"
        className="dark-button"
        onClick={() => setStep((step + 1) % statusSteps.length)}
      >
        {t('advance')}
      </button>
    </div>
  );
}

function ScrollDemo() {
  const t = useT();
  return (
    <Scroller label={t('fullMenu')}>
      <ul className="scroll-list">
        {dishes.map((item) => (
          <li key={item.id}>
            <span>{item.name}</span>
            <span>{money(item.price)}</span>
          </li>
        ))}
      </ul>
    </Scroller>
  );
}

function PostItDemo() {
  const [note, setNote] = useState('');
  const t = useT();
  return (
    <div className="post-it-demo">
      <PostIt
        label={t('kitchenNote')}
        placeholder={t('addNote')}
        value={note}
        onChange={setNote}
      />
    </div>
  );
}

function NavbarDemo() {
  const [count, setCount] = useState(3);
  const t = useT();
  return (
    <div className="navbar-demo">
      <Navbar
        start={
          <ArrowButton onClick={() => setCount(0)}>{t('back')}</ArrowButton>
        }
        title="Restaurant El Clan"
        logo
        end={
          <CartButton
            count={count}
            label={t('addUnitCount')(count)}
            onClick={() => setCount(count + 1)}
          />
        }
      />
    </div>
  );
}

type DinerPage = 'carta' | 'carrito' | 'estado' | 'cuenta';

/** Los ítems del comensal, como en la demo. */
function DinerItems({
  page,
  onPage,
  count,
  hasOrders,
}: {
  page: DinerPage;
  onPage?: (page: DinerPage) => void;
  count: number;
  hasOrders: boolean;
}) {
  const t = useT();
  const items = [
    { page: 'carta', label: t('menu'), icon: <BookOpen />, tab: true },
    { page: 'carrito', label: t('order'), icon: <ShoppingCart />, tab: true },
    { page: 'estado', label: t('status'), icon: <Clock />, tab: true },
    { page: 'cuenta', label: t('bill'), icon: <ReceiptText />, tab: false },
  ] as const;
  return (
    <>
      {items.map((item) => (
        <SidebarItem
          key={item.page}
          icon={item.icon}
          label={item.label}
          tab={item.tab}
          current={page === item.page}
          disabled={item.page === 'estado' && !hasOrders}
          count={item.page === 'carrito' ? count : undefined}
          onClick={() => onPage?.(item.page)}
        />
      ))}
      <SidebarItem icon={<ConciergeBell />} label={t('waiterShort')} />
    </>
  );
}

function SidebarDemo({ tabbar }: { tabbar?: boolean }) {
  const [page, setPage] = useState<DinerPage>('carta');
  const t = useT();
  return (
    <div className={tabbar ? 'tabbar-demo' : 'sidebar-demo'}>
      <Sidebar label={t('diner')} table={7} tabbar={tabbar}>
        <DinerItems page={page} onPage={setPage} count={3} hasOrders={false} />
      </Sidebar>
    </div>
  );
}

/** Un ítem suelto del sidebar, sobre su material. */
function SidebarSample({ children }: { children: ReactNode }) {
  return <div className="sidebar sidebar-sample">{children}</div>;
}

/** Pestañas sobre un tablero con la carta debajo; `scrolled` lo deja desplazado. */
function CategoryTabsDemo({ scrolled }: { scrolled?: boolean }) {
  const [category, setCategory] = useState<Category>('Sándwiches');
  const board = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (scrolled && board.current) board.current.scrollTop = 48;
  }, [scrolled]);
  return (
    <div className="board tabs-demo" ref={board}>
      <CategoryTabs value={category} onChange={setCategory} />
      <ul className="scroll-list">
        {dishes
          .filter((item) => item.category === category)
          .concat(dishes.filter((item) => item.category !== category))
          .map((item) => (
            <li key={item.id}>
              <span>{item.name}</span>
              <span>{money(item.price)}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}

function ToastDemo() {
  const t = useT();
  return (
    <div className="row">
      {statusSteps.map((kind) => (
        <button
          key={kind}
          type="button"
          className="dark-button"
          onClick={() => showOrderToast(kind, ...t('toasts')[kind])}
        >
          {t('statuses')[kind]}
        </button>
      ))}
    </div>
  );
}

function StaticToast({ kind }: { kind: ToastKind }) {
  const [title, description] = useT()('toasts')[kind];
  return (
    <div className="toast" data-static>
      <ToastFace
        kind={kind}
        title={<span className="toast-title">{title}</span>}
        description={<span className="toast-description">{description}</span>}
      />
    </div>
  );
}

const plateIds = ['empanada', 'italiano', 'pastel', 'sopaipillas'];

function PlateDemo() {
  const [index, setIndex] = useState(0);
  const current = dish(plateIds[index]);
  const t = useT();
  return (
    <button
      type="button"
      className="plate-demo"
      onClick={() => setIndex((index + 1) % plateIds.length)}
    >
      <DishPlate dish={current} />
      <span className="hint">
        {current.name} · {t('tapToChange')}
      </span>
    </button>
  );
}

/** La boleta del pedido tal como en la demo: papel con stepper y la columna de acción. */
function ReceiptDemo() {
  const [cart, setCart] = useState<Line[]>([
    line('empanada', 2),
    line('italiano', 1, ['palta']),
  ]);
  const t = useT();
  const extraName = useExtraName();
  return (
    <section className="card ticket-card" aria-label={t('sampleReceipt')}>
      <Receipt
        caption={t('sampleReceipt')}
        total={cartTotal(cart)}
        lines={cart.map((item) =>
          receiptLine(
            item,
            lineKey(item),
            <Stepper
              name={dish(item.dishId).name}
              qty={item.qty}
              onChange={(qty) =>
                setCart(
                  cart
                    .map((other) => (other === item ? { ...item, qty } : other))
                    .filter((other) => other.qty > 0),
                )
              }
            />,
            extraName,
          ),
        )}
      />
      <ReceiptActions total={cartTotal(cart)}>
        <button type="button" className="light-button">
          {t('placeOrder')}
        </button>
      </ReceiptActions>
    </section>
  );
}

function useLines(lines: Line[]): ReceiptLine[] {
  const extraName = useExtraName();
  return lines.map((item) =>
    receiptLine(item, lineKey(item), `x${item.qty}`, extraName),
  );
}

const longOrder = [
  line('empanada', 2),
  line('papas', 1, ['cheddar']),
  line('chacarero', 1, ['palta', 'tomate']),
  line('italiano', 2),
  line('pastel', 1),
  line('cerveza', 3),
  line('pisco', 2),
  line('helado', 1),
];

function Printer({ lines }: { lines: Line[] }) {
  const t = useT();
  return (
    <div className="printer-demo">
      <Receipt
        caption={t('preview')}
        lines={useLines(lines)}
        total={cartTotal(lines)}
      />
    </div>
  );
}

function SealDemo() {
  const [index, setIndex] = useState(0);
  const kind = callKinds[index];
  const t = useT();
  const callLabels = t('callLabels');
  return (
    <button
      type="button"
      className="plate-demo"
      onClick={() => setIndex((index + 1) % callKinds.length)}
    >
      <SealBadge kind={kind} label={callLabels[kind]} />
      <span className="hint">
        {callLabels[kind]} · {t('tapToChange')}
      </span>
    </button>
  );
}

function TableDemo() {
  const [occupied, setOccupied] = useState(true);
  const [calls, setCalls] = useState<CallKind[]>(['pedido']);
  const t = useT();
  const callLabels = t('callLabels');
  return (
    <div className="table-demo">
      <div className="table-demo-mesa">
        <TableButton
          number={7}
          occupied={occupied}
          calls={occupied ? calls : []}
        />
      </div>
      <div className="stack">
        <KitSwitch
          label={t('occupied')}
          checked={occupied}
          onChange={setOccupied}
        />
        {callKinds.map((kind) => (
          <label key={kind} className="row">
            <KitCheck
              label={callLabels[kind]}
              disabled={!occupied}
              checked={calls.includes(kind)}
              onChange={(checked) =>
                setCalls(
                  checked
                    ? callKinds.filter((k) => k === kind || calls.includes(k))
                    : calls.filter((k) => k !== kind),
                )
              }
            />
            <span className="hint">{callLabels[kind]}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

const sampleTable = (): Table => ({
  number: 7,
  occupied: true,
  calls: ['pedido', 'garzón'],
  orders: [
    {
      id: 'a',
      status: 'servido',
      lines: [line('empanada', 2), line('cerveza', 2)],
    },
    {
      id: 'b',
      status: 'confirmado',
      lines: [line('chacarero', 1, ['palta']), line('papas', 1)],
    },
    {
      id: 'c',
      status: 'enviado',
      lines: [line('pastel', 1), line('pisco', 2)],
    },
  ],
});

/** Detalle de una mesa con estado local: atender, confirmar, servir y cobrar. */
function TableDetailDemo() {
  const [table, setTable] = useState(sampleTable);
  const setStatus = (id: string, status: 'confirmado' | 'servido') =>
    setTable({
      ...table,
      orders: table.orders.map((order) =>
        order.id === id ? { ...order, status } : order,
      ),
    });
  return (
    <TableDetailFrame>
      <TableDetail
        table={table}
        heading={<TableHeading number={table.number} />}
        onAttend={(call) =>
          setTable({ ...table, calls: table.calls.filter((c) => c !== call) })
        }
        onConfirm={(id) => setStatus(id, 'confirmado')}
        onServe={(id) => setStatus(id, 'servido')}
        onCharge={() =>
          setTable(
            billTotal(table)
              ? { ...table, occupied: false, calls: [], orders: [] }
              : sampleTable(),
          )
        }
      />
    </TableDetailFrame>
  );
}

function TableHeading({ number }: { number: number }) {
  const t = useT();
  return (
    <div className="table-detail-head">
      <h3>{t('tableN')(number)}</h3>
    </div>
  );
}

/** El detalle de mesa vive en el sidebar del garzón, con su alto fijo. */
function TableDetailFrame({
  children,
  short,
}: {
  children: ReactNode;
  short?: boolean;
}) {
  return (
    <div
      className="sidebar table-detail table-detail-demo"
      data-open
      data-short={short || undefined}
    >
      {children}
    </div>
  );
}

export function Gallery() {
  const t = useT();
  const lang = useLang();
  const callLabels = t('callLabels');
  const s = t('stateLabels');
  const panel = t('panels');
  const group = t('groups');
  const categoryItems = categories.map((id) => ({
    value: id,
    label: t('categories')[id],
  }));
  return (
    <main className="gallery">
      <StageBar>
        <h1>
          {t('galleryTitle')} <small>{t('gallerySubtitle')}</small>
        </h1>
        <ThemeSwitch />
        <LangSwitch />
        <Link href={pathFor('demo', lang)} className="light-button">
          {t('openDemo')}
        </Link>
      </StageBar>
      <Group title={group.controls}>
        <Panel
          title={panel.button}
          uses={[]}
          states={[
            {
              label: s.lightDisabled,
              node: (
                <button type="button" className="light-button" disabled>
                  {t('add')}
                </button>
              ),
            },
            {
              label: s.darkDisabled,
              node: (
                <button type="button" className="dark-button" disabled>
                  {t('attend')}
                </button>
              ),
            },
          ]}
        >
          <ButtonDemo />
        </Panel>
        <Panel
          title={panel.arrow}
          uses={[]}
          states={[
            {
              label: s.disabled,
              node: <ArrowButton disabled>{t('back')}</ArrowButton>,
            },
          ]}
        >
          <ArrowDemo />
        </Panel>
        <Panel
          title={panel.wheel}
          uses={['NumberInput']}
          states={[
            {
              label: s.atMin,
              node: (
                <QuantityWheel value={1} onChange={() => {}} label={s.min} />
              ),
            },
            {
              label: s.atMax,
              node: (
                <QuantityWheel value={20} onChange={() => {}} label={s.max} />
              ),
            },
            {
              label: s.disabledF,
              node: (
                <QuantityWheel
                  value={1}
                  onChange={() => {}}
                  label={s.disabledF}
                  disabled
                />
              ),
            },
          ]}
        >
          <WheelDemo />
        </Panel>
        <Panel
          title={panel.stepper}
          uses={[]}
          states={[1, 9, 10].map((qty) => ({
            label: `x${qty}`,
            node: <StepperOnPaper qty={qty} />,
          }))}
        >
          <StepperOnPaper qty={9} />
        </Panel>
        <Panel
          title={panel.check}
          uses={['Checkbox']}
          states={[
            { label: s.checked, node: <KitCheck label={s.checked} checked /> },
            {
              label: s.soldOut,
              node: <KitCheck label={s.soldOut} checked={false} disabled />,
            },
          ]}
        >
          <CheckDemo />
        </Panel>
        <Panel
          title={panel.extras}
          uses={['Checkbox', 'Label']}
          wide
          states={[
            {
              label: s.noneChecked,
              node: (
                <Extras extras={sandwichExtras.slice(0, 3)} selected={[]} />
              ),
            },
            {
              label: s.someChecked,
              node: (
                <Extras
                  extras={sandwichExtras.slice(0, 3)}
                  selected={['palta', 'tomate']}
                />
              ),
            },
          ]}
        >
          <ExtrasDemo />
        </Panel>
        <Panel
          title={panel.switch}
          uses={['Switch']}
          states={[
            {
              label: s.off,
              node: <KitSwitch label={t('callsSwitch')} checked={false} />,
            },
            {
              label: s.disabled,
              node: <KitSwitch label={t('callsSwitch')} checked disabled />,
            },
          ]}
        >
          <SwitchDemo />
        </Panel>
        <Panel
          title={panel.search}
          uses={['Input', 'InputClear']}
          states={[
            {
              label: s.disabledF,
              node: <SearchField label={s.disabledF} value="" disabled />,
            },
            {
              label: s.error,
              node: <SearchField label={s.withError} value="sushi" invalid />,
            },
          ]}
        >
          <SearchDemo />
        </Panel>
        <Panel
          title={panel.dropdown}
          uses={['Select']}
          states={[
            {
              label: s.disabled,
              node: (
                <Dropdown
                  label={t('category')}
                  items={categoryItems}
                  value="Postres"
                  disabled
                />
              ),
            },
            {
              label: s.error,
              node: (
                <Dropdown
                  label={t('category')}
                  items={categoryItems}
                  value={null}
                  invalid
                />
              ),
            },
          ]}
        >
          <DropdownDemo />
        </Panel>
        <Panel
          title={panel.selector}
          uses={[]}
          states={[
            { label: s.desktop, node: <RoleSwitch /> },
            { label: s.phone, node: <RoleSwitch phone /> },
          ]}
        >
          <div className="stack">
            <RoleSwitch />
            <RoleSwitch phone />
          </div>
        </Panel>
        <Panel
          title={panel.progress}
          uses={['Progress']}
          states={[
            {
              label: s.indeterminate,
              node: <ProgressBar label={s.sending} value={null} />,
            },
            {
              label: s.complete,
              node: <ProgressBar label={s.served} value={100} />,
            },
          ]}
        >
          <ProgressDemo />
        </Panel>
        <Panel
          title={panel.scroll}
          uses={['ScrollArea']}
          states={[
            {
              label: s.noOverflow,
              node: (
                <Scroller label={t('shortList')}>
                  <ul className="scroll-list" data-short>
                    <li>
                      <span>Pisco sour</span>
                      <span>{money(4900)}</span>
                    </li>
                  </ul>
                </Scroller>
              ),
            },
          ]}
        >
          <ScrollDemo />
        </Panel>
        <Panel
          title={panel.postIt}
          uses={[]}
          wide
          states={[
            {
              label: s.emptyF,
              node: (
                <div className="post-it-demo">
                  <PostIt
                    label={t('kitchenNote')}
                    placeholder={t('addNote')}
                    value=""
                  />
                </div>
              ),
            },
            {
              label: s.withText,
              node: (
                <div className="post-it-demo">
                  <PostIt
                    label={t('kitchenNote')}
                    placeholder={t('addNote')}
                    value={t('sampleNote')}
                  />
                </div>
              ),
            },
          ]}
        >
          <PostItDemo />
        </Panel>
      </Group>
      <Group title={group.containers}>
        <Panel
          title={panel.navbar}
          uses={[]}
          wide="full"
          states={[
            {
              label: s.waiter,
              node: (
                <div className="navbar-demo" data-surface="garzon">
                  <Navbar
                    title={t('floor')}
                    end={<PendingCalls>{t('pendingCalls')(4)}</PendingCalls>}
                  />
                </div>
              ),
            },
            {
              label: s.longTitle,
              node: (
                <div className="navbar-demo">
                  <Navbar
                    start={<ArrowButton>{t('menu')}</ArrowButton>}
                    title={t('longTitle')}
                  />
                </div>
              ),
            },
          ]}
        >
          <NavbarDemo />
        </Panel>
        <Panel
          title={panel.sidebar}
          uses={[]}
          states={[
            {
              label: s.activeItem,
              node: (
                <SidebarSample>
                  <SidebarItem icon={<BookOpen />} label={t('menu')} current />
                </SidebarSample>
              ),
            },
            {
              label: s.withCount,
              node: (
                <SidebarSample>
                  <SidebarItem
                    icon={<ShoppingCart />}
                    label={t('order')}
                    count={3}
                  />
                </SidebarSample>
              ),
            },
            {
              label: s.disabledItem,
              node: (
                <SidebarSample>
                  <SidebarItem icon={<Clock />} label={t('status')} disabled />
                </SidebarSample>
              ),
            },
          ]}
        >
          <SidebarDemo />
        </Panel>
        <Panel
          title={panel.categoryTabs}
          uses={[]}
          wide
          states={[
            { label: s.notScrolled, node: <CategoryTabsDemo /> },
            { label: s.scrolled, node: <CategoryTabsDemo scrolled /> },
          ]}
        >
          <CategoryTabsDemo />
        </Panel>
        <Panel
          title={panel.tabbar}
          uses={[]}
          wide
          states={[
            {
              label: s.noOrders,
              node: (
                <div className="tabbar-demo">
                  <Sidebar label={t('diner')} table={7} tabbar>
                    <DinerItems page="carrito" count={0} hasOrders={false} />
                  </Sidebar>
                </div>
              ),
            },
          ]}
        >
          <SidebarDemo tabbar />
        </Panel>
        <Panel title={panel.empty} uses={[]}>
          <TableDetailFrame short>
            <TableDetailEmpty />
          </TableDetailFrame>
        </Panel>
        <Panel
          title={panel.toast}
          uses={['Toast']}
          wide="full"
          states={[
            { label: s.confirmed, node: <StaticToast kind="confirmado" /> },
            { label: s.error, node: <StaticToast kind="error" /> },
          ]}
        >
          <ToastDemo />
        </Panel>
      </Group>
      <Group title={group.restaurant}>
        <Panel
          title={panel.ribbon}
          uses={[]}
          wide
          states={[
            {
              label: s.shortName,
              node: (
                <div className="card ribbon-demo">
                  <Ribbon>Italiano</Ribbon>
                </div>
              ),
            },
            {
              label: s.longName,
              node: (
                <div className="card ribbon-demo">
                  <Ribbon>{t('longTitle')}</Ribbon>
                </div>
              ),
            },
          ]}
        >
          <div className="card ribbon-demo" data-size="big">
            <Ribbon>Chacarero</Ribbon>
          </div>
        </Panel>
        <Panel
          title={panel.tableDetail}
          uses={[]}
          tall
          states={[
            {
              label: s.freeTable,
              node: (
                <TableDetailFrame>
                  <TableDetail
                    table={{
                      number: 3,
                      occupied: false,
                      calls: [],
                      orders: [],
                    }}
                    heading={<TableHeading number={3} />}
                  />
                </TableDetailFrame>
              ),
            },
          ]}
        >
          <TableDetailDemo />
        </Panel>
        <Panel
          title={panel.table}
          uses={[]}
          wide
          states={[
            {
              label: s.free,
              node: (
                <span className="table-state">
                  <TableButton number={3} occupied={false} calls={[]} />
                </span>
              ),
            },
            {
              label: s.selected,
              node: (
                <span className="table-state">
                  <TableButton number={5} occupied calls={[]} pressed />
                </span>
              ),
            },
            {
              label: s.combinedCalls,
              node: (
                <span className="table-state">
                  <TableButton number={9} occupied calls={callKinds} />
                </span>
              ),
            },
          ]}
        >
          <TableDemo />
        </Panel>
        <Panel title={panel.scanner} uses={[]}>
          <div className="scanner-demo">
            <Scanner />
          </div>
        </Panel>
        <Panel
          title={panel.plate}
          uses={[]}
          states={[
            {
              label: s.soldOut,
              node: (
                <span className="dish" data-sold-out>
                  <DishPlate dish={dish('chemilico')} />
                </span>
              ),
            },
          ]}
        >
          <PlateDemo />
        </Panel>
        <Panel
          title={panel.seal}
          uses={[]}
          states={callKinds.map((kind) => ({
            label: callLabels[kind],
            node: <SealBadge kind={kind} label={callLabels[kind]} />,
          }))}
        >
          <SealDemo />
        </Panel>
        <Panel
          title={panel.receipt}
          uses={[]}
          wide="full"
          states={[
            {
              label: s.detailPreview,
              node: (
                <div className="detail-receipt">
                  <Printer lines={[line('empanada', 3)]} />
                </div>
              ),
            },
            {
              label: s.withExtras,
              node: (
                <div className="detail-receipt">
                  <Printer
                    lines={[
                      {
                        ...line('chacarero', 2, ['palta', 'tomate']),
                        note: t('sampleNote'),
                      },
                    ]}
                  />
                </div>
              ),
            },
          ]}
        >
          <ReceiptDemo />
        </Panel>
        <Panel
          title={panel.printer}
          uses={[]}
          wide="full"
          states={[
            {
              label: s.short,
              node: <Printer lines={[line('cerveza', 1)]} />,
            },
            { label: s.long, node: <Printer lines={longOrder} /> },
          ]}
        >
          <Printer lines={[line('empanada', 2), line('italiano', 1)]} />
        </Panel>
      </Group>
      <OrderToastRegion />
    </main>
  );
}
