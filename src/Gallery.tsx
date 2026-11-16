import { ShoppingCart } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { Link } from 'wouter';
import { DishPlate } from './components/DishPlate';
import { Dropdown } from './components/Dropdown';
import { KitCheck } from './components/KitCheck';
import { KitSwitch } from './components/KitSwitch';
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
import type { CallKind } from './domain';
import { money } from './format';
import { categories, dishes } from './menu';

const dish = (id: string) => {
  const found = dishes.find((item) => item.id === id);
  if (!found) throw new Error(`No existe el plato ${id}`);
  return found;
};
const callKinds: CallKind[] = ['pedido', 'garzón', 'pago'];
const callLabels: Record<CallKind, string> = {
  pedido: 'Pedido nuevo',
  garzón: 'Llama al garzón',
  pago: 'Pide la cuenta',
};

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
      <ul className="panel-states" aria-label="Estados">
        {states.map((state) => (
          <li key={state.label}>
            {state.node}
            <small>{state.label}</small>
          </li>
        ))}
      </ul>
      <p className="panel-uses">
        {uses.length ? `UI SDK: ${uses.join(', ')}` : 'Presentacional'}
      </p>
    </section>
  );
}

function ButtonDemo() {
  const [taps, setTaps] = useState(0);
  return (
    <div className="row">
      <button
        type="button"
        className="light-button"
        onClick={() => setTaps(taps + 1)}
      >
        Agregar
      </button>
      <button
        type="button"
        className="dark-button"
        onClick={() => setTaps(taps + 1)}
      >
        Atender
      </button>
      <output className="hint">{taps} toques</output>
    </div>
  );
}

function ArrowDemo() {
  const [backs, setBacks] = useState(0);
  return (
    <div className="row">
      <ArrowButton onClick={() => setBacks(backs + 1)}>Carta</ArrowButton>
      <output className="hint">{backs} vueltas</output>
    </div>
  );
}

function WheelDemo() {
  const [qty, setQty] = useState(2);
  return <QuantityWheel value={qty} onChange={setQty} label="Cantidad" />;
}

function CheckDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <label className="row">
      <KitCheck
        label="Agregar Italiano"
        checked={checked}
        onChange={setChecked}
      />
      <span className="hint">{checked ? 'En el pedido' : 'Sin agregar'}</span>
    </label>
  );
}

function SwitchDemo() {
  const [on, setOn] = useState(true);
  return <KitSwitch label="Avisos" checked={on} onChange={setOn} />;
}

function SearchDemo() {
  const [query, setQuery] = useState('pi');
  const found = dishes.filter((item) =>
    item.name.toLowerCase().includes(query.trim().toLowerCase()),
  );
  return (
    <div className="stack">
      <SearchField
        label="Buscar en la carta"
        value={query}
        onChange={setQuery}
      />
      <p className="hint" aria-live="polite">
        {query.trim()
          ? `${found.length} platos: ${found.map((item) => item.name).join(', ')}`
          : 'Escribe para buscar en la carta'}
      </p>
    </div>
  );
}

function ScrollDemo() {
  return (
    <Scroller label="Carta completa">
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
  return (
    <div className="stack">
      <ProgressBar
        label={`Pedido ${statusSteps[step]}`}
        value={((step + 1) / statusSteps.length) * 100}
      />
      <button
        type="button"
        className="dark-button"
        onClick={() => setStep((step + 1) % statusSteps.length)}
      >
        Avanzar
      </button>
    </div>
  );
}

function DropdownDemo() {
  const [value, setValue] = useState<string | null>('Fondos');
  return (
    <Dropdown
      label="Categoría"
      items={categories}
      value={value}
      onChange={setValue}
    />
  );
}

const plateIds = ['empanada', 'italiano', 'pastel', 'sopaipillas'];

function PlateDemo() {
  const [index, setIndex] = useState(0);
  const current = dish(plateIds[index]);
  return (
    <button
      type="button"
      className="plate-demo"
      onClick={() => setIndex((index + 1) % plateIds.length)}
    >
      <DishPlate dish={current} />
      <span className="hint">{current.name} · toca para cambiar</span>
    </button>
  );
}

function ReceiptDemo() {
  const [cart, setCart] = useState<Record<string, number>>({
    empanada: 2,
    italiano: 1,
  });
  const lines = Object.entries(cart).filter(([, qty]) => qty > 0);
  return (
    <Receipt
      caption="Boleta de ejemplo"
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

const toastTexts: Record<ToastKind, [string, string]> = {
  enviado: ['Pedido enviado', 'La cocina lo recibió.'],
  confirmado: ['Pedido confirmado', 'El garzón lo está preparando.'],
  servido: ['Pedido servido', '¡Buen provecho!'],
  error: ['No se pudo enviar', 'Revisa la conexión e inténtalo de nuevo.'],
};

function ToastDemo() {
  return (
    <div className="row">
      {statusSteps.map((kind) => (
        <button
          key={kind}
          type="button"
          className="dark-button"
          onClick={() => showOrderToast(kind, ...toastTexts[kind])}
        >
          {kind}
        </button>
      ))}
    </div>
  );
}

function StaticToast({ kind }: { kind: ToastKind }) {
  const [title, description] = toastTexts[kind];
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
  return (
    <button
      type="button"
      className="plate-demo"
      onClick={() => setIndex((index + 1) % callKinds.length)}
    >
      <SealBadge kind={kind} label={callLabels[kind]} />
      <span className="hint">{callLabels[kind]} · toca para cambiar</span>
    </button>
  );
}

function TableDemo() {
  const [occupied, setOccupied] = useState(true);
  const [calls, setCalls] = useState<CallKind[]>(['pedido']);
  return (
    <div className="table-demo">
      <div className="table-demo-mesa">
        <Table number={7} occupied={occupied} calls={occupied ? calls : []} />
      </div>
      <div className="stack">
        <KitSwitch label="Ocupada" checked={occupied} onChange={setOccupied} />
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
  return (
    <div className="navbar-demo">
      <Navbar
        start={<ArrowButton onClick={() => setCount(0)}>Volver</ArrowButton>}
        title="El Clan"
        logo
        end={
          <button
            type="button"
            className="dark-button cart-button"
            aria-label={`Agregar una unidad, ${count} unidades`}
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
  return (
    <main className="gallery" data-theme="original">
      <header className="stage-bar">
        <h1>
          Galería de componentes <small>El Clan · iClub</small>
        </h1>
        <Link href="/demo" className="light-button">
          Abrir la demo
        </Link>
      </header>
      <div className="gallery-grid">
        <Panel
          n={1}
          title="Botón"
          uses={[]}
          states={[
            {
              label: 'Deshabilitado',
              node: (
                <button type="button" className="light-button" disabled>
                  Agregar
                </button>
              ),
            },
            {
              label: 'Deshabilitado',
              node: (
                <button type="button" className="dark-button" disabled>
                  Atender
                </button>
              ),
            },
          ]}
        >
          <ButtonDemo />
        </Panel>
        <Panel
          n={2}
          title="Botón flecha"
          uses={[]}
          states={[
            {
              label: 'Deshabilitado',
              node: <ArrowButton disabled>Volver</ArrowButton>,
            },
          ]}
        >
          <ArrowDemo />
        </Panel>
        <Panel
          n={3}
          title="Ruleta de cantidad"
          uses={['NumberInput']}
          states={[
            {
              label: 'En el mínimo',
              node: (
                <QuantityWheel value={1} onChange={() => {}} label="Mínimo" />
              ),
            },
            {
              label: 'En el máximo',
              node: (
                <QuantityWheel value={20} onChange={() => {}} label="Máximo" />
              ),
            },
            {
              label: 'Deshabilitada',
              node: (
                <QuantityWheel
                  value={1}
                  onChange={() => {}}
                  label="Deshabilitada"
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
          title="Checkbox"
          uses={['Checkbox']}
          states={[
            { label: 'Marcado', node: <KitCheck label="Marcado" checked /> },
            {
              label: 'Agotado',
              node: <KitCheck label="Agotado" checked={false} disabled />,
            },
          ]}
        >
          <CheckDemo />
        </Panel>
        <Panel
          n={5}
          title="Switch"
          uses={['Switch']}
          states={[
            {
              label: 'Apagado',
              node: <KitSwitch label="Avisos" checked={false} />,
            },
            {
              label: 'Deshabilitado',
              node: <KitSwitch label="Avisos" checked disabled />,
            },
          ]}
        >
          <SwitchDemo />
        </Panel>
        <Panel
          n={6}
          title="Búsqueda"
          uses={['Input', 'InputClear']}
          states={[
            {
              label: 'Deshabilitada',
              node: <SearchField label="Deshabilitada" value="" disabled />,
            },
            {
              label: 'Error',
              node: <SearchField label="Con error" value="sushi" invalid />,
            },
          ]}
        >
          <SearchDemo />
        </Panel>
        <Panel
          n={7}
          title="Scrollbar"
          uses={['ScrollArea']}
          states={[
            {
              label: 'Sin desborde',
              node: (
                <Scroller label="Lista corta">
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
          title="Progress bar"
          uses={['Progress']}
          states={[
            {
              label: 'Indeterminada',
              node: <ProgressBar label="Enviando" value={null} />,
            },
            {
              label: 'Completa',
              node: <ProgressBar label="Servido" value={100} />,
            },
          ]}
        >
          <ProgressDemo />
        </Panel>
        <Panel
          n={9}
          title="Selector desplegable"
          uses={['Select']}
          states={[
            {
              label: 'Deshabilitado',
              node: (
                <Dropdown
                  label="Categoría"
                  items={categories}
                  value="Postres"
                  disabled
                />
              ),
            },
            {
              label: 'Error',
              node: (
                <Dropdown
                  label="Categoría"
                  items={categories}
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
          title="Placa de plato"
          uses={[]}
          states={[
            {
              label: 'Agotado',
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
          title="Boleta"
          uses={[]}
          wide
          states={[
            {
              label: 'Vista previa del detalle',
              node: (
                <div className="detail-receipt">
                  <Receipt
                    caption="Vista previa"
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
          title="Toast de estado"
          uses={['Toast']}
          wide
          states={[
            { label: 'Confirmado', node: <StaticToast kind="confirmado" /> },
            { label: 'Error', node: <StaticToast kind="error" /> },
          ]}
        >
          <ToastDemo />
        </Panel>
        <Panel
          n={13}
          title="Sello"
          uses={[]}
          states={callKinds.map((kind) => ({
            label: kind,
            node: <SealBadge kind={kind} label={callLabels[kind]} />,
          }))}
        >
          <SealDemo />
        </Panel>
        <Panel
          n={14}
          title="Mesa"
          uses={[]}
          wide="full"
          states={[
            {
              label: 'Libre',
              node: (
                <span className="table-state" data-occupied="false">
                  <Table number={3} occupied={false} calls={[]} />
                </span>
              ),
            },
            {
              label: 'Llamados combinados',
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
          title="Navbar"
          uses={[]}
          wide="full"
          states={[
            {
              label: 'Garzón',
              node: (
                <div className="navbar-demo" data-surface="garzon">
                  <Navbar
                    title="Sala principal"
                    end={<span className="pending">4 llamados</span>}
                  />
                </div>
              ),
            },
            {
              label: 'Título largo',
              node: (
                <div className="navbar-demo">
                  <Navbar
                    start={<ArrowButton>Carta</ArrowButton>}
                    title="Pastel de choclo con ensalada chilena"
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
