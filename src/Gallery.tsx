import { ShoppingCart } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { Link } from 'wouter';
import { DishPlate } from './components/DishPlate';
import { Dropdown } from './components/Dropdown';
import { KitCheck } from './components/KitCheck';
import { KitSwitch } from './components/KitSwitch';
import { LangSwitch } from './components/LangSwitch';
import { ArrowButton, Navbar } from './components/Navbar';
import {
  OrderToastRegion,
  showOrderToast,
  ToastFace,
  type ToastKind,
} from './components/OrderToast';
import { ProgressBar } from './components/ProgressBar';
import { QuantityWheel } from './components/QuantityWheel';
import { Receipt, Stepper } from './components/Receipt';
import { Scroller } from './components/Scroller';
import { SealBadge } from './components/Seal';
import { SearchField } from './components/SearchField';
import { Table } from './components/Table';
import { ThemeSwitch } from './components/ThemeSwitch';
import type { CallKind } from './domain';
import { money } from './format';
import { pathFor, useLang, useT } from './i18n';
import { type Category, categories, dishes } from './menu';

const dish = (id: string) => {
  const found = dishes.find((item) => item.id === id);
  if (!found) throw new Error(`No existe el plato ${id}`);
  return found;
};
const callKinds: CallKind[] = ['pedido', 'garzón', 'pago'];

/** Un componente de la galería: demo vivo, fila de estados y primitivas. */
function Panel({
  n,
  title,
  uses,
  states,
  wide,
  children,
}: {
  n: number;
  title: string;
  uses: string[];
  states: { label: string; node: ReactNode }[];
  wide?: boolean | 'full';
  children: ReactNode;
}) {
  const t = useT();
  return (
    <section
      className="panel"
      aria-labelledby={`panel-${n}`}
      data-wide={wide || undefined}
    >
      <h2 className="panel-caption" id={`panel-${n}`}>
        <span className="panel-number">{String(n).padStart(2, '0')}</span>
        {title}
      </h2>
      <div className="panel-stage">{children}</div>
      <ul className="panel-states" aria-label={t('states')}>
        {states.map((state) => (
          <li key={state.label}>
            {state.node}
            <small>{state.label}</small>
          </li>
        ))}
      </ul>
      <p className="panel-uses">
        {uses.length ? `UI SDK: ${uses.join(', ')}` : t('presentational')}
      </p>
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
      <span className="hint">{checked ? t('inOrder') : t('notAdded')}</span>
    </label>
  );
}

function SwitchDemo() {
  const [on, setOn] = useState(true);
  const t = useT();
  return <KitSwitch label={t('alerts')} checked={on} onChange={setOn} />;
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
      <p className="hint" aria-live="polite">
        {query.trim()
          ? t('found')(found.length, found.map((item) => item.name).join(', '))
          : t('typeToSearch')}
      </p>
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

function ReceiptDemo() {
  const [cart, setCart] = useState<Record<string, number>>({
    empanada: 2,
    italiano: 1,
  });
  const t = useT();
  const lines = Object.entries(cart).filter(([, qty]) => qty > 0);
  return (
    <Receipt
      caption={t('sampleReceipt')}
      total={lines.reduce((sum, [id, qty]) => sum + dish(id).price * qty, 0)}
      lines={lines.map(([id, qty]) => ({
        key: id,
        name: dish(id).name,
        price: dish(id).price * qty,
        qty: (
          <Stepper
            name={dish(id).name}
            qty={qty}
            onChange={(next) => setCart({ ...cart, [id]: Math.max(0, next) })}
          />
        ),
      }))}
    />
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

function SealDemo() {
  const [index, setIndex] = useState(0);
  const kind = callKinds[index];
  const callLabels = useT()('callLabels');
  return (
    <button
      type="button"
      className="plate-demo"
      onClick={() => setIndex((index + 1) % callKinds.length)}
    >
      <SealBadge kind={kind} label={callLabels[kind]} />
      <span className="hint">
        {callLabels[kind]} · {useT()('tapToChange')}
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
        <Table number={7} occupied={occupied} calls={occupied ? calls : []} />
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

function NavbarDemo() {
  const [count, setCount] = useState(3);
  const t = useT();
  return (
    <div className="navbar-demo">
      <Navbar
        start={
          <ArrowButton onClick={() => setCount(0)}>{t('back')}</ArrowButton>
        }
        title="El Clan"
        logo
        end={
          <button
            type="button"
            className="dark-button cart-button"
            aria-label={t('addUnitCount')(count)}
            onClick={() => setCount(count + 1)}
          >
            <ShoppingCart aria-hidden="true" strokeWidth={2.5} />
            {count > 0 && <span className="count">{count}</span>}
          </button>
        }
      />
    </div>
  );
}

export function Gallery() {
  const t = useT();
  const lang = useLang();
  const callLabels = t('callLabels');
  const s = t('stateLabels');
  const panel = t('panels');
  const categoryItems = categories.map((id) => ({
    value: id,
    label: t('categories')[id],
  }));
  return (
    <main className="gallery">
      <header className="stage-bar">
        <h1>
          {t('galleryTitle')} <small>{t('gallerySubtitle')}</small>
        </h1>
        <ThemeSwitch />
        <LangSwitch />
        <Link href={pathFor('demo', lang)} className="light-button">
          {t('openDemo')}
        </Link>
      </header>
      <div className="gallery-grid">
        <Panel
          n={1}
          title={panel.button}
          uses={[]}
          states={[
            {
              label: s.disabled,
              node: (
                <button type="button" className="light-button" disabled>
                  {t('add')}
                </button>
              ),
            },
            {
              label: s.disabled,
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
          n={2}
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
          n={3}
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
          n={4}
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
          n={5}
          title={panel.switch}
          uses={['Switch']}
          states={[
            {
              label: s.off,
              node: <KitSwitch label={t('alerts')} checked={false} />,
            },
            {
              label: s.disabled,
              node: <KitSwitch label={t('alerts')} checked disabled />,
            },
          ]}
        >
          <SwitchDemo />
        </Panel>
        <Panel
          n={6}
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
          n={7}
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
          n={8}
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
          n={9}
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
          n={10}
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
          n={11}
          title={panel.receipt}
          uses={[]}
          wide
          states={[
            {
              label: s.detailPreview,
              node: (
                <div className="detail-receipt">
                  <Receipt
                    caption={t('preview')}
                    total={dish('empanada').price * 3}
                    lines={[
                      {
                        key: 'empanada',
                        name: dish('empanada').name,
                        qty: 'x3',
                        price: dish('empanada').price * 3,
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
          n={12}
          title={panel.toast}
          uses={['Toast']}
          wide
          states={[
            { label: s.confirmed, node: <StaticToast kind="confirmado" /> },
            { label: s.error, node: <StaticToast kind="error" /> },
          ]}
        >
          <ToastDemo />
        </Panel>
        <Panel
          n={13}
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
          n={14}
          title={panel.table}
          uses={[]}
          wide="full"
          states={[
            {
              label: s.free,
              node: (
                <span className="table-state" data-occupied="false">
                  <Table number={3} occupied={false} calls={[]} />
                </span>
              ),
            },
            {
              label: s.combinedCalls,
              node: (
                <span className="table-state">
                  <Table number={9} occupied calls={callKinds} />
                </span>
              ),
            },
          ]}
        >
          <TableDemo />
        </Panel>
        <Panel
          n={15}
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
                    end={
                      <span className="pending">{t('pendingCalls')(4)}</span>
                    }
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
      </div>
      <OrderToastRegion />
    </main>
  );
}
