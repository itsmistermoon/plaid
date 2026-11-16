import { haptic } from './haptics';
import { click } from './sound';

let last = 0;

/** Un detente: suena y vibra. Dos en menos de 30 ms cuentan como uno. */
export function tick() {
  if (typeof document === 'undefined') return;
  const now = performance.now();
  if (now - last < 30) return;
  last = now;
  click();
  haptic();
}
