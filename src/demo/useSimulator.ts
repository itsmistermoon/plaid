import { useEffect } from 'react';
import { startSimulator } from '../simulator';
import { store } from './store';

/** Starts the Garzón simulado and the Mesas de relleno while the demo is mounted. */
export function useSimulator() {
  useEffect(
    () =>
      startSimulator(store, {
        random: Math.random,
        setTimeout: (fn, ms) => window.setTimeout(fn, ms),
        clearTimeout: (id) => window.clearTimeout(id),
      }),
    [],
  );
}
