import {
  BookOpen,
  CircleHelp,
  Clock,
  ConciergeBell,
  LayoutGrid,
  ReceiptText,
  RotateCcw,
  ShoppingCart,
} from 'lucide-react';
import {
  type CSSProperties,
  type ReactNode,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Link } from 'wouter';
import { Badge } from './components/Badge';
import { CategoryTabs } from './components/CategoryTabs';
import { Chalkboard } from './components/Chalkboard';
import { CommandPalette } from './components/CommandPalette';
import { DietFilter } from './components/DietFilter';
import { DishPlate } from './components/DishPlate';
import { Dropdown } from './components/Dropdown';
import { Extras } from './components/Extras';
import { KitCheck } from './components/KitCheck';
import { KitSwitch } from './components/KitSwitch';
import { LangSwitch } from './components/LangSwitch';
import { MoveMenu } from './components/MoveMenu';
import {
  ArrowButton,
  CartButton,
  Navbar,
  PendingCalls,
} from './components/Navbar';
import { NotePresets } from './components/NotePresets';
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
  ReceiptOption,
  Stepper,
} from './components/Receipt';
import { ReservationBook } from './components/ReservationBook';
import { Ribbon } from './components/Ribbon';
import { Scanner } from './components/Scanner';
import { SchemeSwitch } from './components/SchemeSwitch';
import { Scroller } from './components/Scroller';
import { SealBadge } from './components/Seal';
import { SearchField } from './components/SearchField';
import { Selector } from './components/Selector';
import { SelectorToggle } from './components/SelectorToggle';
import { Sidebar, SidebarItem } from './components/Sidebar';
import { StageBar, StageIntro } from './components/StageBar';
import { TableButton } from './components/Table';
import { TableDetail, TableDetailEmpty } from './components/TableDetail';
import { TartanDesigner } from './components/TartanDesigner';
import { ThemeSwitch } from './components/ThemeSwitch';
import { KitchenTicket, TicketRail } from './components/TicketRail';
import { Tip } from './components/Tip';
import { type TipPercent, TipSelector } from './components/TipSelector';
import { lineKey, receiptLine } from './demo/lines';
import {
  billTotal,
  type CallKind,
  cartTotal,
  type Line,
  type Order,
  type Reservation,
  splitShares,
  type Table,
  tipAmount,
  type View,
  views,
} from './domain';
import { money } from './format';
import { pathFor, useExtraName, useLang, useT } from './i18n';
import {
  type Category,
  categories,
  type Diet,
  dishes,
  soldOutDishes,
  specials,
  type Tab,
} from './menu';
import {
  fullSett,
  sett,
  settSize,
  type TartanColor,
  type TartanLayer,
  tartanColors,
  tartanUrl,
  threadcount,
} from './tartan';

const dish = (id: string) => {
  const found = dishes.find((item) => item.id === id);
  if (!found) throw new Error(`No existe el plato ${id}`);
  return found;
};
const uiSdkUrl = 'https://ui-sdk.dev';

export const galleryViews = ['components', 'restaurant', 'tartan'] as const;
export type GalleryView = (typeof galleryViews)[number];
const callKinds: CallKind[] = ['pedido', 'garzón', 'pago'];
const line = (dishId: string, qty: number, extras: string[] = []): Line => ({
  dishId,
  qty,
  extras,
  note: '',
});

/**
 * A gallery component, as in spec-01: the piece in use on top, its labeled
 * variants below, and a footer saying whether it is presentational or UI SDK.
 * The number comes from a CSS counter, so page order is the numbering.
 */
const noop = () => undefined;

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
  /** Spans two grid rows, next to two stacked wide panels. */
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
        {uses.length ? (
          <>
            <a href={uiSdkUrl} target="_blank" rel="noopener noreferrer">
              UI SDK
            </a>
            : {uses.join(', ')}
          </>
        ) : (
          t('presentational')
        )}
      </p>
    </section>
  );
}

/** A group of panels with its title. */
function Group({
  title,
  thread,
  children,
}: {
  title: string;
  /** Which thread this group's panel headers carry. */
  thread: 'controls' | 'containers' | 'restaurant' | 'tartan';
  children: ReactNode;
}) {
  const id = useId();
  return (
    <section
      className="gallery-group"
      data-thread={thread}
      aria-labelledby={id}
    >
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

/** The stepper in context: a receipt line on a full strip of paper. */
function StepperOnPaper({ qty }: { qty: number }) {
  const [value, setValue] = useState(qty);
  const name = dish('italiano').name;
  return (
    <div className="receipt-paper stepper-paper">
      <span>{name}</span>
      <Stepper
        name={name}
        qty={value}
        onChange={(next) => setValue(Math.max(1, next))}
      />
    </div>
  );
}

/** A wheel with its own state, to show it resting on a value. */
function WheelAt({ start, label }: { start: number; label: string }) {
  const [value, setValue] = useState(start);
  return <QuantityWheel value={value} onChange={setValue} label={label} />;
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
      {/* Both labels share the same cell and only one is visible: the width is
          that of the longer one, so changing state moves nothing. */}
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

/** The demo bar's role selector, in both forms. */
function RoleSwitch({ phone }: { phone?: boolean }) {
  const [view, setView] = useState<View>('comensal');
  const t = useT();
  const roles = {
    comensal: t('diner'),
    garzon: t('waiter'),
    cocina: t('kitchen'),
  };
  const next = views[(views.indexOf(view) + 1) % views.length];
  return (
    <div className="stage-bar" data-phone={phone || undefined}>
      {phone ? (
        <SelectorToggle
          className="role-switch"
          label={t('device')}
          current={roles[view]}
          next={roles[next]}
          onClick={() => setView(next)}
        />
      ) : (
        <Selector
          className="role-switch"
          legend={t('device')}
          value={view}
          options={views.map((value) => ({ value, label: roles[value] }))}
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
      <NotePresets note={note} onChange={setNote} />
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

/** The Comensal's items, as in the demo. */
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

/** A single sidebar item, on its material. */
function SidebarSample({ children }: { children: ReactNode }) {
  return <div className="sidebar sidebar-sample">{children}</div>;
}

function DietFilterDemo({ initial = [] }: { initial?: Diet[] }) {
  const [chosen, setChosen] = useState(initial);
  return <DietFilter value={chosen} onChange={setChosen} />;
}

/** Tabs over a board with the menu below; `scrolled` leaves it scrolled. */
function CategoryTabsDemo({ scrolled }: { scrolled?: boolean }) {
  const [category, setCategory] = useState<Tab>('Sándwiches');
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
          onClick={() =>
            showOrderToast(
              kind,
              t('toasts')[kind],
              // Like Sonner's Undo: a sent order can still be taken back.
              kind === 'enviado'
                ? {
                    label: t('undo'),
                    onAction: () => showOrderToast('error', t('undone')),
                  }
                : undefined,
            )
          }
        >
          {t('statuses')[kind]}
        </button>
      ))}
    </div>
  );
}

/** The palette with a few sample commands: running one shows a notice. */
function PaletteDemo() {
  const t = useT();
  const table = t('tableN');
  const items = [
    {
      label: `${table(2)} · ${t('attend')} · ${t('callLabels').garzón}`,
      icon: <ConciergeBell />,
    },
    {
      label: `${table(7)} · ${t('serve')} · ${t('orderN')(1)}`,
      icon: <ReceiptText />,
    },
    { label: `${table(7)} · ${t('chargeAndFree')}`, icon: <ReceiptText /> },
  ].map((item) => ({ ...item, value: item.label }));
  return (
    <div className="palette-demo">
      <CommandPalette
        title={t('paletteTitle')}
        placeholder={t('paletteHint')}
        groups={[{ label: t('paletteActions'), items }]}
        onRun={(value) => showOrderToast('confirmado', [value, t('advance')])}
      />
    </div>
  );
}

/** Icon-only buttons of the phone bar, each named by its tooltip. */
function TipDemo({ blocked }: { blocked?: boolean }) {
  const t = useT();
  const buttons = [
    { icon: CircleHelp, name: t('tour') },
    { icon: LayoutGrid, name: t('uiKit') },
    { icon: RotateCcw, name: t('resetDemo') },
  ];
  return (
    <div className="row tip-demo">
      {buttons.slice(0, blocked ? 1 : 3).map(({ icon: Icon, name }) => (
        <Tip
          key={name}
          hint={blocked ? t('schemeSlateOnly') : name}
          naming={!blocked}
          render={
            <button
              type="button"
              className="dark-button"
              aria-label={name}
              aria-disabled={blocked || undefined}
            />
          }
        >
          <Icon aria-hidden="true" />
        </Tip>
      ))}
    </div>
  );
}

function StaticToast({
  kind,
  withAction,
}: {
  kind: ToastKind;
  withAction?: boolean;
}) {
  const t = useT();
  const [title, description] = t('toasts')[kind];
  return (
    <div className="toast-card" data-static>
      <ToastFace
        kind={kind}
        title={<span className="toast-title">{title}</span>}
        description={<span className="toast-description">{description}</span>}
        action={
          withAction && (
            <button type="button" className="light-button toast-action">
              {t('undo')}
            </button>
          )
        }
      />
    </div>
  );
}

function BadgeDemo() {
  const t = useT();
  return (
    <div className="stack">
      <div className="row">
        {statusSteps.map((kind) => (
          <Badge key={kind} variant={kind}>
            {t('statuses')[kind]}
          </Badge>
        ))}
      </div>
      <div className="row">
        {callKinds.map((kind) => (
          <Badge key={kind} variant={kind}>
            {t('callLabels')[kind]}
          </Badge>
        ))}
      </div>
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

/** The order receipt as in the demo: paper with stepper and the action column. */
function ReceiptDemo() {
  const [cart, setCart] = useState<Line[]>([
    line('empanada', 2),
    line('italiano', 1, ['palta']),
  ]);
  const [percent, setPercent] = useState<TipPercent>(10);
  const tip = tipAmount(cartTotal(cart), percent);
  const total = cartTotal(cart) + tip;
  const t = useT();
  const extraName = useExtraName();
  return (
    <section className="card ticket-card" aria-label={t('sampleReceipt')}>
      <Receipt
        caption={t('sampleReceipt')}
        total={total}
        tip={{ percent, amount: tip }}
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
      <ReceiptActions total={total}>
        <ReceiptOption label={t('tip')}>
          <TipSelector value={percent} onChange={setPercent} />
        </ReceiptOption>
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

function Printer({ lines, people = 1 }: { lines: Line[]; people?: number }) {
  const t = useT();
  return (
    <div className="printer-demo">
      <Receipt
        caption={t('preview')}
        lines={useLines(lines)}
        total={cartTotal(lines)}
        shares={splitShares(cartTotal(lines), people)}
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

const sampleOrder = (status: Order['status']): Order => ({
  id: status,
  status,
  lines: [line('italiano', 2, ['palta']), line('cerveza', 1)],
});

/** A rail of the Cocina whose ticket moves through the three statuses. */
function TicketRailDemo() {
  const [status, setStatus] = useState<Order['status']>('enviado');
  return (
    <div className="kitchen rail-demo">
      <TicketRail status={status} count={2}>
        <KitchenTicket
          table={7}
          number={1}
          order={sampleOrder(status)}
          onAdvance={() =>
            setStatus(status === 'enviado' ? 'confirmado' : 'servido')
          }
        />
        <KitchenTicket
          table={3}
          number={2}
          order={{ id: 'b', status, lines: [line('pastel', 1)] }}
          onAdvance={() => setStatus('enviado')}
        />
      </TicketRail>
    </div>
  );
}

/** The reservation book with local state. */
function BookDemo() {
  const [reservations, setReservations] = useState<Reservation[]>([
    { id: 'a', table: 4, day: 0, time: '21:00', name: 'Soto' },
    { id: 'b', table: 11, day: 0, time: '20:00', name: 'Rojas' },
    { id: 'c', table: 2, day: 1, time: '13:00', name: 'Vidal' },
  ]);
  return (
    <div className="book book-demo">
      <ReservationBook
        reservations={reservations}
        tables={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
        onReserve={(item) =>
          setReservations([
            ...reservations,
            { ...item, id: `${reservations.length}${item.name}` },
          ])
        }
        onCancel={(id) =>
          setReservations(reservations.filter((item) => item.id !== id))
        }
      />
    </div>
  );
}

const sampleTargets = [1, 2, 4, 5, 6].map((number) => ({
  number,
  occupied: number % 2 === 0,
}));

/** The move menu on its own: choosing a Mesa shows the notice with Undo. */
function MoveMenuDemo() {
  const t = useT();
  return (
    <MoveMenu
      targets={sampleTargets}
      onMove={(to) =>
        showOrderToast(
          'confirmado',
          t(to % 2 === 0 ? 'merged' : 'transferred')(3, to),
          { label: t('undo'), onAction: () => {} },
        )
      }
    />
  );
}

/** Table detail with local state: attend, confirm, serve, charge and move. */
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
        moveTargets={sampleTargets}
        onMove={() =>
          setTable({ ...table, occupied: false, calls: [], orders: [] })
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

/** The table detail lives in the Garzón's sidebar, at its fixed height. */
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

function TartanSwatch({ layer }: { layer?: TartanLayer }) {
  return (
    <span
      className="tartan-swatch"
      style={{ backgroundImage: tartanUrl(layer) }}
    />
  );
}

/** The Clan tartan: the cloth, its sett, its colors and how it is woven. */
function TartanGroup() {
  const t = useT();
  const panel = t('panels');
  const text = t('tartan');
  return (
    <Group title={t('groups').tartan} thread="tartan">
      <Panel title={panel.tartanCloth} uses={[]}>
        <div className="tartan-cloth">
          <TartanSwatch />
          <p className="hint">{text.intro}</p>
        </div>
      </Panel>
      <Panel title={panel.tartanSett} uses={[]}>
        <div className="tartan-sett">
          <code>{threadcount}</code>
          <ol aria-label={threadcount}>
            {sett.map(([color, count], index) => (
              <li
                key={index}
                style={{ flexGrow: count, background: tartanColors[color] }}
                title={`${text.colors[color][0]} · ${text.threads(count)}`}
              />
            ))}
          </ol>
          <div
            className="tartan-repeat"
            aria-label={text.repeat(settSize)}
            role="img"
          >
            {fullSett.map(([color, count], index) => (
              <span
                key={index}
                style={{ flexGrow: count, background: tartanColors[color] }}
              />
            ))}
          </div>
          <p className="hint">{text.repeat(settSize)}</p>
        </div>
      </Panel>
      <Panel title={panel.tartanColors} uses={[]}>
        <ul className="tartan-colors">
          {(Object.keys(tartanColors) as TartanColor[]).map((color) => (
            <li key={color}>
              <span
                className="tartan-chip"
                style={{ background: tartanColors[color] }}
              >
                {color}
              </span>
              <span>
                <strong>{text.colors[color][0]}</strong>
                <small className="hint">
                  {text.colors[color][1]} · {tartanColors[color]}
                </small>
              </span>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel
        title={panel.tartanDesigner}
        uses={['NumberInput', 'Toast']}
        wide="full"
      >
        <TartanDesigner />
      </Panel>
      <Panel
        title={panel.tartanWeave}
        uses={[]}
        wide="full"
        states={[
          { label: text.warp, node: <TartanSwatch layer="warp" /> },
          { label: text.weft, node: <TartanSwatch layer="weft" /> },
          { label: text.check, node: <TartanSwatch /> },
        ]}
      >
        <p className="hint tartan-tokens">
          {text.tokens
            .split(/(--[\w*-]+)/)
            .map((part, index) =>
              part.startsWith('--') ? (
                <code key={part}>{part}</code>
              ) : (
                <span key={`${index}${part}`}>{part}</span>
              ),
            )}
        </p>
      </Panel>
    </Group>
  );
}

function ComponentsView() {
  const t = useT();
  const categoryItems = categories.map((id) => ({
    value: id,
    label: t('categories')[id],
  }));
  const s = t('stateLabels');
  const panel = t('panels');
  const group = t('groups');
  return (
    <>
      <Group title={group.controls} thread="controls">
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
              node: <WheelAt start={1} label={s.min} />,
            },
            {
              label: s.atMax,
              node: <WheelAt start={20} label={s.max} />,
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
          title={panel.badge}
          uses={[]}
          states={['1', '24', '99+'].map((count) => ({
            label: `${s.count} ${count}`,
            node: <Badge variant="count">{count}</Badge>,
          }))}
        >
          <BadgeDemo />
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
        <Panel title={panel.palette} uses={['Dialog', 'Command']}>
          <PaletteDemo />
        </Panel>
        <Panel
          title={panel.tooltip}
          uses={['Tooltip']}
          states={[{ label: s.explains, node: <TipDemo blocked /> }]}
        >
          <TipDemo />
        </Panel>
        <Panel
          title={panel.toast}
          uses={['Toast']}
          wide="full"
          states={[
            { label: s.confirmed, node: <StaticToast kind="confirmado" /> },
            {
              label: s.withAction,
              node: <StaticToast kind="enviado" withAction />,
            },
            { label: s.error, node: <StaticToast kind="error" /> },
          ]}
        >
          <ToastDemo />
        </Panel>
      </Group>
    </>
  );
}

function RestaurantView() {
  const t = useT();
  const callLabels = t('callLabels');
  const s = t('stateLabels');
  const panel = t('panels');
  const group = t('groups');
  return (
    <>
      <Group title={group.containers} thread="containers">
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
          title={panel.dietFilter}
          uses={[]}
          states={[
            {
              label: t('diets').vegetarian,
              node: <DietFilterDemo initial={['vegetarian']} />,
            },
          ]}
        >
          <DietFilterDemo />
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
      </Group>
      <Group title={group.restaurant} thread="restaurant">
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
          title={panel.chalkboard}
          uses={[]}
          wide
          states={[
            {
              label: s.noSoldOut,
              node: (
                <Chalkboard specials={specials} soldOut={[]} onOpen={noop} />
              ),
            },
          ]}
        >
          <Chalkboard
            specials={specials}
            soldOut={soldOutDishes}
            onOpen={noop}
          />
        </Panel>
        <Panel title={panel.book} uses={['Dialog', 'Select', 'Input']} wide>
          <BookDemo />
        </Panel>
        <Panel title={panel.moveMenu} uses={['Menu', 'Toast']}>
          <MoveMenuDemo />
        </Panel>
        <Panel
          title={panel.ticketRail}
          uses={[]}
          wide="full"
          states={[
            {
              label: s.served,
              node: (
                <ul className="rail-tickets">
                  <KitchenTicket
                    table={7}
                    number={1}
                    order={sampleOrder('servido')}
                  />
                </ul>
              ),
            },
            {
              label: s.noOrders,
              node: (
                <div className="kitchen rail-demo">
                  <TicketRail status="confirmado" count={0}>
                    {null}
                  </TicketRail>
                </div>
              ),
            },
          ]}
        >
          <TicketRailDemo />
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
          wide="full"
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
              label: s.reserved,
              node: (
                <span className="table-state">
                  <TableButton
                    number={11}
                    occupied={false}
                    calls={[]}
                    reserved="20:00"
                  />
                </span>
              ),
            },
            {
              label: s.occupiedF,
              node: (
                <span className="table-state">
                  <TableButton number={4} occupied calls={[]} />
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
            ...callKinds.map((kind, index) => ({
              label: callLabels[kind],
              node: (
                <span className="table-state">
                  <TableButton number={6 + index} occupied calls={[kind]} />
                </span>
              ),
            })),
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
            {
              label: s.splitBill,
              node: (
                <div className="detail-receipt">
                  <Printer
                    people={3}
                    lines={[line('italiano', 2), line('cerveza', 3)]}
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
    </>
  );
}

export function Gallery({ view }: { view: GalleryView }) {
  const t = useT();
  const lang = useLang();
  return (
    <main
      className="gallery"
      style={{ '--clan-tartan': tartanUrl() } as CSSProperties}
    >
      <StageBar>
        <ThemeSwitch />
        <SchemeSwitch />
        <LangSwitch />
        <nav className="selector gallery-views" aria-label={t('galleryViews')}>
          {galleryViews.map((item) => (
            <Link
              key={item}
              href={pathFor(item, lang)}
              aria-current={view === item ? 'page' : undefined}
            >
              {t('viewLabels')[item]}
            </Link>
          ))}
        </nav>
        <Link href={pathFor('demo', lang)} className="light-button">
          {t('openDemo')}
        </Link>
      </StageBar>
      <StageIntro
        title={t('galleryTitle')}
        tagline={t('gallerySubtitle')}
        description={
          <>
            {t('galleryIntro')}{' '}
            <a href={uiSdkUrl} target="_blank" rel="noopener noreferrer">
              UI SDK
            </a>
            {t('galleryIntroMid')}{' '}
            <a
              href="https://github.com/itsmistermoon/plaid"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            .
          </>
        }
      />
      {view === 'components' && <ComponentsView />}
      {view === 'restaurant' && <RestaurantView />}
      {view === 'tartan' && <TartanGroup />}
      <OrderToastRegion />
    </main>
  );
}
