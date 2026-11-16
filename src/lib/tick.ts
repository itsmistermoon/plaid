// El "clic" de un detente: un tick sintetizado con Web Audio y un haptic.
// Adaptado de lib/sound.ts y lib/haptics.ts de spec-01 (Shu Ding, MIT).

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;

function audio() {
  if (ctx?.state === 'closed') ctx = null;
  if (!ctx) {
    if (typeof AudioContext === 'undefined') return null;
    ctx = new AudioContext({ latencyHint: 'interactive' });
    master = ctx.createGain();
    master.gain.value = 0.3; // bajo: acompaña, no protagoniza
    master.connect(ctx.destination);
    noise = ctx.createBuffer(1, ctx.sampleRate / 4, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  // Safari deja el contexto "interrupted" y no lo retoma solo.
  if (ctx.state !== 'running') ctx.resume().catch(() => {});
  return ctx;
}

// Los navegadores solo dejan iniciar audio dentro de un gesto: cada gesto
// crea o retoma el contexto, así los ticks de un arrastre también suenan.
if (typeof document !== 'undefined') {
  for (const type of ['pointerdown', 'keydown', 'touchend'])
    document.addEventListener(type, audio, { capture: true, passive: true });
}

const vary = (amount: number) => 1 + (Math.random() * 2 - 1) * amount;

function sound() {
  const c = audio();
  if (!c || !master || !noise) return;
  const at = c.currentTime + 0.002;
  // Ruido filtrado: el roce de plástico contra plástico.
  const source = c.createBufferSource();
  source.buffer = noise;
  const filter = c.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 3200 * vary(0.06);
  const gain = c.createGain();
  gain.gain.setValueAtTime(0, at);
  gain.gain.linearRampToValueAtTime(0.2 * vary(0.15), at + 0.0008);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.006);
  source.connect(filter).connect(gain).connect(master);
  source.start(at, Math.random() * 0.2);
  source.stop(at + 0.03);
  // Y un tono brillante y cortísimo encima.
  const osc = c.createOscillator();
  osc.frequency.value = 4300 * vary(0.04);
  const ring = c.createGain();
  ring.gain.setValueAtTime(0, at);
  ring.gain.linearRampToValueAtTime(0.035, at + 0.001);
  ring.gain.exponentialRampToValueAtTime(0.0001, at + 0.01);
  osc.connect(ring).connect(master);
  osc.start(at);
  osc.stop(at + 0.03);
}

// Safari no tiene Vibration API, pero iOS 18 vibra al alternar un
// <input type="checkbox" switch> a través de su label, incluso desde script.
let label: HTMLLabelElement | null = null;
function tapSwitch() {
  if (!label) {
    label = document.createElement('label');
    label.inert = true;
    label.setAttribute('aria-hidden', 'true');
    label.style.cssText =
      'position:fixed;top:0;left:0;width:1px;height:1px;overflow:hidden;opacity:0.01;pointer-events:none';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.setAttribute('switch', '');
    input.tabIndex = -1;
    label.append(input);
    document.body.append(label);
  }
  label.click();
}

function haptic() {
  if (typeof navigator.vibrate === 'function') navigator.vibrate(8);
  else if ('switch' in HTMLInputElement.prototype) {
    // Fuera de un gesto iOS no vibra; se deja quieto.
    if (navigator.userActivation && !navigator.userActivation.isActive) return;
    tapSwitch();
  }
}

let last = 0;

/** Un detente: suena y vibra. Dos en menos de 30 ms cuentan como uno. */
export function tick() {
  if (typeof document === 'undefined') return;
  const now = performance.now();
  if (now - last < 30) return;
  last = now;
  sound();
  haptic();
}
