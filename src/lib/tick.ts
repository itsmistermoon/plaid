import { haptic } from './haptics';
import { click } from './sound';

let last = 0;

/** A detent: sounds and vibrates. Two within 30 ms count as one. */
export function tick() {
  if (typeof document === 'undefined') return;
  const now = performance.now();
  if (now - last < 30) return;
  last = now;
  click();
  haptic();
}
