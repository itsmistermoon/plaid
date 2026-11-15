import { useEffect, useState } from 'react';
import { ArrowLeft, ShoppingBag, BookOpen, ReceiptText, CheckCircle2, Plus, Minus } from 'lucide-react';
import { Mesa } from './main';
import './mobile.css';

const dishes = [
  { name: 'Pastel de choclo', description: 'Pino de vacuno, pollo y albahaca, cubierto de choclo dorado.', price: 9900, emoji: '🌽' },
  { name: 'Lomo a lo pobre', description: 'Lomo de vacuno, papas fritas, cebolla y huevo.', price: 14900, emoji: '🥩' },
  { name: 'Cazuela de vacuno', description: 'Caldo casero con verduras de estación y carne blanda.', price: 8900, emoji: '🍲' },
  { name: 'Merluza austral', description: 'Merluza dorada con puré rústico y ensalada.', price: 11900, emoji: '🐟' },
  { name: 'Ensalada chilena', description: 'Tomate, cebolla y cilantro fresco.', price: 4900, emoji: '🍅' },
];
const money = (amount: number) => '$' + amount.toLocaleString('es-CL');
type Page = 'carta' | 'detalle' | 'carrito' | 'enviado';
const statuses = ['Recibimos tu pedido', 'En preparación', 'En camino a tu mesa', '¡Buen provecho!'];

export function MobileApp() {
  const [theme, setTheme] = useState<'original' | 'moderno'>('original');
  const [role, setRole] = useState<'comensal' | 'garzon'>('comensal');
  const [page, setPage] = useState<Page>('carta');
  const [selected, setSelected] = useState(0);
  const [cart, setCart] = useState<number[]>(dishes.map(() => 0));
  const [status, setStatus] = useState(0);
  const [orderSent, setOrderSent] = useState(false);
  useEffect(() => {
    if (!orderSent || status >= statuses.length - 1) return;
    const timer = window.setTimeout(() => setStatus(status + 1), 4000);
    return () => window.clearTimeout(timer);
  }, [orderSent, status]);
  const count = cart.reduce((sum, n) => sum + n, 0);
  const total = cart.reduce((sum, n, i) => sum + n * dishes[i].price, 0);
  const change = (i: number, amount: number) => setCart(cart.map((n, index) => index === i ? Math.max(0, n + amount) : n));
  return <div className="mobile-lab" data-theme={theme}>
    <div className="mobile-controls"><div><span className="mobile-logo">plaid</span><span className="lab-label"> / prueba móvil</span></div><label className="theme-switch"><span>Original</span><input type="checkbox" checked={theme === 'moderno'} onChange={e => setTheme(e.target.checked ? 'moderno' : 'original')}/><span className="track"/><span>Moderno</span></label></div>
    <div className="mobile-layout"><div className="phone"><div className="phone-header"><div className="role-switch" aria-label="Elegir vista"><button data-active={role === 'comensal'} onClick={() => setRole('comensal')}>Comensal</button><button data-active={role === 'garzon'} onClick={() => setRole('garzon')}>Garzón</button></div><div className="phone-brand">plaid <small>{role === 'comensal' ? 'mesa 4' : 'sala principal'}</small></div></div>
      {role === 'garzon' ? <div className="phone-content"><p className="mobile-kicker">SALA PRINCIPAL</p><h1>Mesas</h1><p className="mobile-subtitle">12 mesas · 3 llamados pendientes</p><div className="mobile-tables">{Array.from({ length: 12 }, (_, i) => <div key={i}><Mesa number={i + 1} theme={theme} table={{ occupied: i % 3 !== 0, calls: i === 1 ? ['pago'] : i === 4 ? ['pedido'] : i === 7 ? ['garzón'] : [] }}/></div>)}</div></div> : <>
      <div className="phone-content">
        {page === 'carta' && <><p className="mobile-kicker">BIENVENIDO A LA MESA 4</p><h1>La carta</h1><p className="mobile-subtitle">Sabores de casa, hechos para compartir.</p><div className="menu-heading">Nuestros platos <span>5 opciones</span></div><div className="dish-list">{dishes.map((dish, i) => <button className="dish-row" key={dish.name} onClick={() => { setSelected(i); setPage('detalle'); }}><span className="dish-art">{dish.emoji}</span><span className="dish-copy"><strong>{dish.name}</strong><small>{dish.description}</small><b>{money(dish.price)}</b></span><span className="dish-arrow">›</span></button>)}</div></>}
        {page === 'detalle' && <><button className="back-link" onClick={() => setPage('carta')}><ArrowLeft size={16}/> Volver a la carta</button><div className="dish-hero">{dishes[selected].emoji}</div><p className="mobile-kicker">DE NUESTRA COCINA</p><h1>{dishes[selected].name}</h1><p className="detail-description">{dishes[selected].description}</p><p className="detail-price">{money(dishes[selected].price)}</p><button className="primary-action" onClick={() => { change(selected, 1); setPage('carrito'); }}>Agregar al pedido · {money(dishes[selected].price)}</button></>}
        {page === 'carrito' && <><p className="mobile-kicker">MESA 4</p><h1>Tu pedido</h1>{count === 0 ? <div className="empty-cart"><ShoppingBag/><p>Tu pedido está vacío.</p><button className="primary-action" onClick={() => setPage('carta')}>Explorar la carta</button></div> : <><p className="mobile-subtitle">Revisa tu selección antes de enviarla.</p><div className="receipt"><div className="receipt-title">plaid <small>BOLETA DE PEDIDO</small></div><div className="receipt-rule"/>{cart.map((n, i) => n > 0 && <div className="receipt-item" key={dishes[i].name}><div><strong>{dishes[i].name}</strong><div className="quantity"><button aria-label={`Quitar ${dishes[i].name}`} onClick={() => change(i, -1)}><Minus size={14}/></button><span>{n}</span><button aria-label={`Agregar ${dishes[i].name}`} onClick={() => change(i, 1)}><Plus size={14}/></button></div></div><b>{money(n * dishes[i].price)}</b></div>)}<div className="receipt-rule"/><div className="receipt-total"><strong>TOTAL</strong><strong>{money(total)}</strong></div></div><button className="primary-action" onClick={() => { setStatus(0); setOrderSent(true); setPage('enviado'); }}>Enviar pedido</button><button className="text-action" onClick={() => setPage('carta')}>Agregar más platos</button></>}</>}
        {page === 'enviado' && <><div className="sent-icon"><CheckCircle2 size={36}/></div><p className="mobile-kicker">PEDIDO ENVIADO · MESA 4</p><h1>{statuses[status]}</h1><p className="mobile-subtitle">Gracias. Te avisaremos cómo avanza tu pedido.</p><div className="status-list">{statuses.map((label, i) => <div key={label} data-done={i <= status}><span>{i < status ? '✓' : i + 1}</span><strong>{label}</strong>{i === status && <small>AHORA</small>}</div>)}</div><p className="simulation-note">Estado simulado: avanza cada 4 segundos.</p><button className="text-action" onClick={() => { setCart(dishes.map(() => 0)); setPage('carta'); }}>Volver a la carta</button></>}
      </div><nav className="bottom-nav" aria-label="Navegación del comensal"><button data-active={page === 'carta' || page === 'detalle'} onClick={() => setPage('carta')}><BookOpen size={20}/>Carta</button><button data-active={page === 'carrito'} onClick={() => setPage('carrito')}><span className="nav-icon"><ShoppingBag size={20}/>{count > 0 && <i>{count}</i>}</span>Pedido</button><button data-active={page === 'enviado'} onClick={() => setPage('enviado')} disabled={!orderSent}><ReceiptText size={20}/>Estado</button></nav></>}
    </div><aside className="mobile-decisions"><details><summary>Qué necesito de ti</summary><p>Prueba ambos roles y temas antes de decidir:</p><ol><li>¿Funcionan las pestañas inferiores para carta, pedido y estado?</li><li>¿Dos columnas dan suficiente tamaño a las mesas y sus alertas?</li><li>¿La boleta y los controles de cantidad se leen bien en angosto?</li><li>¿El detalle de plato y la confirmación dan suficiente contexto?</li><li>¿Ambos temas conservan el carácter que buscas en móvil?</li></ol></details></aside></div>
  </div>;
}
