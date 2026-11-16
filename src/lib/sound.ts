// El sonido de un detente: un clic sintetizado con Web Audio.
// Adaptado de lib/sound.ts de spec-01 (Shu Ding, MIT).

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

/**
 * Crea o retoma el audio. Los navegadores solo dejan iniciarlo dentro de un
 * gesto: llámala desde el handler de un gesto para que los clics que vengan
 * después (un arrastre, una inercia) también suenen.
 */
export function unlockAudio() {
  audio();
}

const vary = (amount: number) => 1 + (Math.random() * 2 - 1) * amount;

/** Un clic de plástico, corto y bajo. */
export function click() {
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
