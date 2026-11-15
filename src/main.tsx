import React, { useId, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { DollarSign, HandPlatter, Utensils } from 'lucide-react';
import '@fontsource/courier-prime';
import '@fontsource/outfit/700.css';
import '@fontsource/kaushan-script';
import '@fontsource/inter';
import '@fontsource/inter/600.css';
import './style.css';

type Call = 'pago' | 'pedido' | 'garzón';
type Table = { occupied: boolean; calls: Call[] };
const calls: Call[] = ['pago', 'pedido', 'garzón'];
const labels: Record<Call, string> = { pago: 'Pago', pedido: 'Pedido', garzón: 'Garzón' };
const sealIcons = { pago: DollarSign, pedido: Utensils, garzón: HandPlatter };
function Seal({ kind, x }: { kind: Call; x: number }) {
  const Icon = sealIcons[kind];
  const gradientId = useId().replace(/:/g, '');
  const points = Array.from({ length: 28 }, (_, i) => {
    const angle = i * Math.PI / 14 - Math.PI / 2;
    const radius = i % 2 === 0 ? 25 : 21;
    return `${x + Math.cos(angle) * radius},${153 + Math.sin(angle) * radius}`;
  }).join(" ");
  return <g className={`seal ${kind}`}>
    <defs><radialGradient id={gradientId} cx="35%" cy="25%" r="80%"><stop className="seal-light"/><stop offset="1" className="seal-dark"/></radialGradient></defs>
    <polygon points={points} className="seal-face" fill={`url(#${gradientId})`}/>
    <Icon x={x - 13} y="140" width="26" height="26" strokeWidth={3} className="seal-icon"/>
  </g>;
}
function Mesa({ table, number, theme = 'original' }: { table: Table; number: number; theme?: 'original' | 'moderno' }) {
  const id = useId().replace(/:/g, '');
  if (theme === 'moderno') return <div className="modern-table" data-occupied={table.occupied}>
    <svg className="modern-surface" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M50 0 100 50 50 100 0 50Z" className="modern-cloth"/><path d="M50 6 94 50 50 94 6 50Z" className="modern-stitch"/></svg>
    <div className="modern-plate"><strong>Mesa {number}</strong><span className={`badge ${table.occupied ? 'secondary' : 'default'}`}>{table.occupied ? 'Ocupada' : 'Libre'}</span></div>
    {table.calls.length > 0 && <div className="badges">{table.calls.map(call => { const Icon = sealIcons[call]; return <span key={call} className={`badge call ${call}`} title={labels[call]}><Icon aria-hidden="true" strokeWidth={2.5}/><span className="badge-label">{labels[call]}</span></span>; })}</div>}
  </div>;
  return <svg className="mesa" viewBox="0 0 200 200" role="img" aria-label={`Mesa ${number}, ${table.occupied ? 'ocupada' : 'libre'}${table.calls.length ? ', llamado: ' + table.calls.join(', ') : ''}`}>
    <defs>
      <pattern id={`${id}checks`} width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="28" height="28" className="cloth-base"/>
        <path d="M0 0h14v28H0zM0 0h28v14H0z" className="cloth-band"/>
        <path d="M0 0h14v14H0z" className="cloth-cross"/>
        <path d="M2 0v28M6 0v28M10 0v28M14 0v28M18 0v28M22 0v28M26 0v28M0 2h28M0 6h28M0 10h28M0 14h28M0 18h28M0 22h28M0 26h28" className="cloth-thread"/>
      </pattern>
      <filter id={`${id}grain`}><feTurbulence type="fractalNoise" baseFrequency=".035 .38" numOctaves="3" seed="8"/><feColorMatrix type="saturate" values="0"/></filter>
      <linearGradient id={`${id}wood`} x2="0" y2="1"><stop stopColor="#ddb585"/><stop offset=".5" stopColor="#ae7848"/><stop offset="1" stopColor="#79502e"/></linearGradient>
      <linearGradient id={`${id}plate`} x2="0" y2="1"><stop stopColor="#fffbd6"/><stop offset="1" stopColor="#c5b77d"/></linearGradient>
      <clipPath id={`${id}clip`}><rect x="19" y="19" width="162" height="162" rx="23"/></clipPath>
    </defs>
    <rect className="table-shadow" x="19" y="22" width="162" height="162" rx="23"/>
    <g clipPath={`url(#${id}clip)`}><rect className="wood" x="19" y="19" width="162" height="162" fill={`url(#${id}wood)`}/><rect className="grain" x="19" y="19" width="162" height="162" filter={`url(#${id}grain)`}/><path className="cloth-shadow" d="M100 3 198 101 100 199 2 101Z"/><path className="cloth" d="M100 0 200 100 100 200 0 100Z" fill={`url(#${id}checks)`}/><path className="cloth-shine" d="M100 2 198 100 100 198 2 100Z"/></g>
    <rect className="table-outline" x="19" y="19" width="162" height="162" rx="23"/>
    <g className="plate"><rect x="30" y="77" width="140" height="49" rx="2" fill={`url(#${id}plate)`}/><path d="M42 83H158Q158 89 164 89V114Q158 114 158 120H42Q42 114 36 114V89Q42 89 42 83Z"/><text x="100" y="107" textAnchor="middle">Mesa {table.occupied ? 'ocupada' : 'libre'}</text></g>
    <g className="table-number"><circle cx="157" cy="44" r="14"/><text x="157" y="49" textAnchor="middle">{number}</text></g>
    {table.calls.map((call, i) => <Seal key={call} kind={call} x={100 + (i - (table.calls.length - 1) / 2) * 49}/>)}
  </svg>;
}
function App() {
  const [theme, setTheme] = useState<'original' | 'moderno'>('original');
  const [selected, setSelected] = useState(0);
  const [tables, setTables] = useState<Table[]>(() => Array.from({ length: 12 }, (_, i) => ({ occupied: i % 3 !== 0, calls: i === 1 ? ['pago'] : i === 4 ? ['pedido'] : i === 7 ? ['garzón'] : [] })));
  const table = tables[selected];
  function update(next: Table) { setTables(tables.map((t, i) => i === selected ? next : t)); }
  return <div data-theme={theme} className="app"><header><div className="top-inner"><span className="brand">plaid <small> / laboratorio</small></span><label className="theme-switch"><span>Original</span><input type="checkbox" checked={theme === 'moderno'} onChange={e => setTheme(e.target.checked ? 'moderno' : 'original')}/><span className="track"/><span>Moderno</span></label></div></header>
    <main><div className="intro"><div><p className="eyebrow">PILOTO DE COMPONENTE · 01</p><h1>Una mesa, dos épocas.</h1><p>La grilla del garzón, reconstruida en vectores. Selecciona una mesa para probar sus estados y llamados.</p></div><span className="tag">SVG + CSS · sin imágenes en el componente</span></div>
    <section className="decision-panel"><h2>Qué necesito de ti</h2><p>Esta mesa es la prueba de la técnica antes de reconstruir todo el Kit de interfaz.</p><ul><li>¿El mantel, la placa y los sellos reconstruidos en vector se parecen lo suficiente al original para construir todo el kit con esta técnica? Sí / no, y qué falta.</li><li>¿Qué detalles son obligatorios al reconstruir (por ejemplo: plaid saturado, esquinas cóncavas, sello dentado) y cuáles se pueden simplificar?</li><li>¿La dirección del tema moderno sirve como contraparte en el switch?</li></ul></section><div className="workspace"><section className="grid-panel" aria-label="Grilla de mesas"><div className="section-heading"><div><p className="eyebrow">SALA PRINCIPAL</p><h2>Mesas</h2></div><span>12 mesas</span></div><div className="grid">{tables.map((t, i) => <button key={i} className="table-button" data-selected={selected === i} onClick={() => setSelected(i)} aria-pressed={selected === i}><Mesa table={t} number={i + 1} theme={theme}/><span className="sr-only">Seleccionar mesa {i + 1}</span></button>)}</div></section>
    <aside className="control-panel"><p className="eyebrow">CONTROLES</p><h2>Mesa {selected + 1}</h2><p>Prueba las combinaciones de estado y llamados.</p><fieldset><legend>Estado de la mesa</legend><div className="segments">{[false, true].map(occupied => <button key={String(occupied)} data-active={table.occupied === occupied} onClick={() => update({ ...table, occupied })}>{occupied ? 'Ocupada' : 'Libre'}</button>)}</div></fieldset><fieldset><legend>Llamados</legend><p className="hint">Puedes activar más de uno.</p>{calls.map(call => <label className="check" key={call}><input type="checkbox" checked={table.calls.includes(call)} onChange={e => update({ ...table, calls: e.target.checked ? [...table.calls, call] : table.calls.filter(c => c !== call) })}/><span className={`dot ${call}`}/>{labels[call]}</label>)}</fieldset></aside></div>
    <section className="comparison"><div className="section-heading"><div><p className="eyebrow">DE CERCA</p><h2>Original y reconstrucción</h2></div><span>Referencias de iClub · 2012</span></div><div className="compare-grid"><div><p>ORIGINAL</p><div className="reference"><img src="/ref/mesa.png" alt="Mesa original de iClub"/><img className="ref-label" src={table.occupied ? '/ref/mesaocupada.png' : '/ref/mesalibre.png'} alt=""/></div></div><div><p>VECTOR · MESA {selected + 1}</p><Mesa table={table} number={selected + 1}/></div><div className="ref-seals"><p>SELLOS · ORIGINAL Y VECTOR</p><div className="seal-pairs">{['notifpago2.png','notifpedido2.png','notifmozo2.png'].map((file, i) => <div className="seal-pair" key={file}><span>{labels[calls[i]]}</span><div><img src={`/ref/${file}`} alt={`Sello original: ${labels[calls[i]]}`}/><svg viewBox="74 127 52 52" role="img" aria-label={`Sello vectorial: ${labels[calls[i]]}`}><Seal kind={calls[i]} x={100}/></svg></div><small>Original · Vector</small></div>)}</div></div></div></section>
    <section className="fonts"><p className="eyebrow">PALETA TIPOGRÁFICA</p><h2>Cuatro voces para plaid</h2><div className="font-grid"><div><small>COURIER PRIME</small><p style={{fontFamily:'Courier Prime'}}>La cuenta, por favor.</p></div><div><small>OUTFIT 700</small><p style={{fontFamily:'Outfit',fontWeight:700}}>Mesa para cuatro</p></div><div><small>KAUSHAN SCRIPT</small><p style={{fontFamily:'Kaushan Script'}}>Buen provecho</p></div><div><small>INTER</small><p style={{fontFamily:'Inter'}}>Tu pedido está listo.</p></div></div></section><footer>plaid / experimento de reconstrucción vectorial</footer></main></div>;
}

createRoot(document.getElementById('root')!).render(<App/>);
