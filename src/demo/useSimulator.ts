import { useEffect } from 'react';
import { startSimulator } from '../simulator';
import { store } from './store';

/** Arranca el garzón simulado y las mesas de relleno mientras la demo está montada. */
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
