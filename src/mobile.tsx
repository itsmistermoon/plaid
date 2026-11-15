import { useEffect, useState } from 'react';
import { BookOpen, Check, ChevronLeft, ConciergeBell, Minus, Plus, ReceiptText, ShoppingBag } from 'lucide-react';
import { Mesa } from './main';
import './mobile.css';

type Theme = 'original' | 'moderno';
type Page = 'carta' | 'detalle' | 'pedido' | 'estado';
type Call = 'pago' | 'pedido' | 'garzón';

const categories = ['Sándwiches', 'Fondos', 'Bebidas', 'Postres'] as const;
type Category = typeof categories[number];

const dishes: { name: string; description: string; price: number; category: Category; emoji: string; soldOut?: boolean }[] = [
  { name: 'Chacarero', description: 'Churrasco, porotos verdes, ají, tomate y mayonesa casera en pan frica.', price: 7900, category: 'Sándwiches', emoji: '🥪' },
  { name: 'Barros Luco', description: 'Churrasco y queso derretido en marraqueta tostada.', price: 7400, category: 'Sándwiches', emoji: '🧀' },
  { name: 'Italiano', description: 'Palta, tomate y mayonesa sobre lomito de cerdo.', price: 7200, category: 'Sándwiches', emoji: '🥑' },
  { name: 'Chemilico', description: 'Churrasco, huevo frito y cebolla caramelizada.', price: 7600, category: 'Sándwiches', emoji: '🍳', soldOut: true },
  { name: 'Pastel de choclo', description: 'Pino de vacuno, pollo y albahaca, gratinado en greda.', price: 9900, category: 'Fondos', emoji: '🌽' },
  { name: 'Cazuela de vacuno', description: 'Caldo casero con zapallo, papa y choclo.', price: 8900, category: 'Fondos', emoji: '🍲' },
  { name: 'Lomo a lo pobre', description: 'Lomo, papas fritas, cebolla y dos huevos.', price: 14900, category: 'Fondos', emoji: '🥩' },
  { name: 'Mote con huesillo', description: 'Néctar de durazno, mote de trigo y huesillos.', price: 3500, category: 'Bebidas', emoji: '🍑' },
  { name: 'Cerveza de la casa', description: 'Lager artesanal de barril, 500 ml.', price: 4200, category: 'Bebidas', emoji: '🍺' },
  { name: 'Helado triple', description: 'Lúcuma, chocolate y frutilla.', price: 4600, category: 'Postres', emoji: '🍨' },
  { name: 'Leche asada', description: 'Receta de la abuela con caramelo.', price: 3900, category: 'Postres', emoji: '🍮' },
];

const statuses = ['Recibido', 'En preparación', 'En camino', '¡Buen provecho!'];
const money = (n: number) => '$' + n.toLocaleString('es-CL');

const tables: { occupied: boolean; calls: Call[] }[] = Array.from({ length: 12 }, (_, i) => ({
  occupied: i % 3 !== 0,
  calls: i === 1 ? ['pago'] : i === 4 ? ['pedido'] : i === 7 ? ['garzón'] : i === 10 ? ['pedido', 'garzón'] : [],
}));

export function MobileApp() {
  const [theme, setTheme] = useState<Theme>('original');
  const [role, setRole] = useState<'comensal' | 'garzon'>('comensal');
  return <div className="mlab" data-theme={theme}>
    <div className="mlab-bar">
      <span className="mlab-title"><b>plaid</b> / prueba móvil</span>
      <div className="seg" role="group" aria-label="Vista">
        <button data-active={role === 'comensal'} onClick={() => setRole('comensal')}>Comensal</button>
        <button data-active={role === 'garzon'} onClick={() => setRole('garzon')}>Garzón</button>
      </div>
      <div className="seg" role="group" aria-label="Tema">
        <button data-active={theme === 'original'} onClick={() => setTheme('original')}>Original</button>
        <button data-active={theme === 'moderno'} onClick={() => setTheme('moderno')}>Moderno</button>
      </div>
    </div>
    <div className="mlab-stage">
      <div className="phone">{role === 'comensal' ? <Diner/> : <Waiter theme={theme}/>}</div>
      <Questions/>
    </div>
  </div>;
}

function Diner() {
  const [page, setPage] = useState<Page>('carta');
  const [category, setCategory] = useState<Category>('Sándwiches');
  const [selected, setSelected] = useState(0);
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState<number[]>(dishes.map(() => 0));
  const [status, setStatus] = useState(-1);
  const [called, setCalled] = useState(false);

  useEffect(() => {
    if (status < 0 || status >= statuses.length - 1) return;
    const t = window.setTimeout(() => setStatus(status + 1), 4000);
    return () => window.clearTimeout(t);
  }, [status]);

  const count = cart.reduce((a, n) => a + n, 0);
  const total = cart.reduce((a, n, i) => a + n * dishes[i].price, 0);
  const set = (i: number, n: number) => setCart(cart.map((v, j) => (j === i ? Math.max(0, n) : v)));
  const open = (i: number) => { setSelected(i); setQty(Math.max(1, cart[i])); setPage('detalle'); };
  const dish = dishes[selected];
  const title = { carta: 'El Clan', detalle: dish.name, pedido: 'Tu pedido', estado: 'Estado del pedido' }[page];

  return <>
    <nav className="navbar">
      {page === 'detalle' ? <button className="back" onClick={() => setPage('carta')}><ChevronLeft size={15} strokeWidth={3}/>Carta</button> : <span/>}
      <h1 className={page === 'carta' ? 'logo' : ''}>{title}</h1>
      <span className="navtag">Mesa 4</span>
    </nav>

    <main className="screen">
      {page === 'carta' && <>
        <div className="chips" role="tablist">{categories.map(c =>
          <button key={c} role="tab" aria-selected={c === category} onClick={() => setCategory(c)}>{c}</button>)}</div>
        <ul className="dishes">{dishes.map((d, i) => d.category === category &&
          <li key={d.name} className="dish" data-soldout={d.soldOut || undefined}>
            <button className="dish-open" onClick={() => open(i)} disabled={d.soldOut}>
              <span className="plate">{d.emoji}</span>
              <span className="dish-text"><strong>{d.name}</strong><small>{d.soldOut ? 'Agotado por hoy' : d.description}</small></span>
            </button>
            <span className="dish-side">
              <b className="price">{money(d.price)}</b>
              {!d.soldOut && <button className="check" role="checkbox" aria-checked={cart[i] > 0} aria-label={`Agregar ${d.name}`}
                onClick={() => set(i, cart[i] > 0 ? 0 : 1)}>{cart[i] > 0 && <Check size={16} strokeWidth={4}/>}</button>}
            </span>
          </li>)}</ul>
      </>}

      {page === 'detalle' && <div className="detail">
        <div className="hero"><span className="plate big">{dish.emoji}</span></div>
        <p className="desc">{dish.description}</p>
        <div className="detail-row">
          <b className="price big">{money(dish.price)}</b>
          <Stepper value={qty} onChange={setQty} min={1} label={dish.name}/>
        </div>
        <button className="cta" onClick={() => { set(selected, qty); setPage('carta'); }}>
          {cart[selected] ? 'Actualizar pedido' : 'Agregar al pedido'} · {money(qty * dish.price)}
        </button>
      </div>}

      {page === 'pedido' && (count === 0
        ? <div className="empty"><ShoppingBag size={40}/><p>Aún no eliges nada.</p><button className="cta" onClick={() => setPage('carta')}>Ver la carta</button></div>
        : <>
          <div className="receipt">
            <div className="receipt-head">El Clan<small>Mesa 4 · boleta de pedido</small></div>
            {cart.map((n, i) => n > 0 && <div className="line" key={i}>
              <span className="line-name">{dishes[i].name}</span>
              <Stepper value={n} onChange={v => set(i, v)} min={0} label={dishes[i].name} compact/>
              <span className="line-price">{money(n * dishes[i].price)}</span>
            </div>)}
            <div className="receipt-total">Total: {money(total)}</div>
          </div>
          <button className="cta" onClick={() => { setStatus(0); setCart(dishes.map(() => 0)); setPage('estado'); }}>Enviar pedido a cocina</button>
        </>)}

      {page === 'estado' && <div className="status">
        <ol>{statuses.map((s, i) => <li key={s} data-state={i < status ? 'done' : i === status ? 'now' : 'next'}>
          <span className="dot">{i < status ? <Check size={14} strokeWidth={3}/> : i + 1}</span>{s}</li>)}</ol>
        <p className="note">Estado simulado: avanza cada 4 segundos.</p>
        <button className="ghost" disabled={called} onClick={() => setCalled(true)}><ConciergeBell size={16}/>{called ? 'Garzón en camino' : 'Llamar al garzón'}</button>
      </div>}
    </main>

    <nav className="tabbar">
      <button data-active={page === 'carta' || page === 'detalle'} onClick={() => setPage('carta')}><BookOpen size={22}/>Carta</button>
      <button data-active={page === 'pedido'} onClick={() => setPage('pedido')}><span className="badge-wrap"><ShoppingBag size={22}/>{count > 0 && <i>{count}</i>}</span>Pedido</button>
      <button data-active={page === 'estado'} onClick={() => setPage('estado')} disabled={status < 0}><ReceiptText size={22}/>Estado</button>
    </nav>
  </>;
}

function Stepper({ value, onChange, min, label, compact }: { value: number; onChange: (n: number) => void; min: number; label: string; compact?: boolean }) {
  return <span className="stepper" data-compact={compact || undefined}>
    <button aria-label={`Quitar ${label}`} disabled={value <= min} onClick={() => onChange(value - 1)}><Minus size={compact ? 12 : 16} strokeWidth={3}/></button>
    <output>{compact ? `x${value}` : value}</output>
    <button aria-label={`Agregar ${label}`} onClick={() => onChange(value + 1)}><Plus size={compact ? 12 : 16} strokeWidth={3}/></button>
  </span>;
}

function Waiter({ theme }: { theme: Theme }) {
  const pending = tables.reduce((a, t) => a + t.calls.length, 0);
  return <>
    <nav className="navbar"><span/><h1>Sala principal</h1><span className="navtag alert">{pending} llamados</span></nav>
    <main className="screen">
      <div className="tables">{tables.map((t, i) =>
        <div key={i} className="table-cell" data-free={!t.occupied || undefined}><Mesa number={i + 1} theme={theme} table={t}/></div>)}</div>
    </main>
  </>;
}

function Questions() {
  return <aside className="questions"><details open><summary>Qué necesito de ti</summary><ol>
    <li><b>Tema original:</b> ¿la pizarra gris con barra oscura y pestañas verdes (como <i>lista menu</i> y <i>smartphone</i>) es el iClub que recuerdas?</li>
    <li><b>Carta:</b> ¿categorías en chips arriba, y el checkbox del original para agregar 1 unidad sin entrar al detalle?</li>
    <li><b>Boleta:</b> ¿bordes dentados y columnas plato / cantidad / precio, con −/+ dentro de la boleta?</li>
    <li><b>Garzón:</b> ¿2 columnas con las mesas libres atenuadas para que resalten las alertas?</li>
    <li><b>Agotado:</b> el Chemilico se ve atenuado y sin checkbox. ¿Te sirve ese estado?</li>
  </ol><p>Los emojis son provisorios: las fotos tienen su propio ticket.</p></details></aside>;
}
