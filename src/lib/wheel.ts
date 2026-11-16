// Lógica pura del tambor de la ruleta: resorte, detentes, cesión en los
// bordes y lanzamiento. Adaptado de la page-wheel de spec-01 (Shu Ding, MIT).

export type Motion = { pos: number; vel: number };

// Resorte poco amortiguado: llega rápido y se pasa apenas antes de asentarse.
const stiffness = 0.00035; // por ms²
const damping = 2 * 0.75 * Math.sqrt(stiffness);
const substep = 4; // ms, para que el resultado no dependa del frame rate

/** Avanza el tambor `dt` ms hacia `target`. Devuelve el reposo exacto al llegar. */
export function settleStep(
  { pos, vel }: Motion,
  target: number,
  dt: number,
): Motion {
  let left = Math.min(dt, 64);
  while (left > 0) {
    const h = Math.min(substep, left);
    vel += (stiffness * (target - pos) - damping * vel) * h;
    pos += vel * h;
    left -= h;
  }
  if (Math.abs(target - pos) < 0.001 && Math.abs(vel) < 0.0001)
    return { pos: target, vel: 0 };
  return { pos, vel };
}

/** Cuántos números cruzaron el centro entre el número `center` y la posición `pos`. */
export const crossed = (center: number, pos: number) =>
  Math.abs(Math.round(pos) - center);

/** Más allá de min/max el tambor aún se mueve, pero solo un 30 %. */
export const give = (p: number, min: number, max: number) =>
  p < min ? min - (min - p) * 0.3 : p > max ? max + (p - max) * 0.3 : p;

/** Donde cae un lanzamiento a `velocity` filas/ms: sigue su impulso y se ajusta a un número. */
export const flingTarget = (
  pos: number,
  velocity: number,
  min: number,
  max: number,
) => Math.min(max, Math.max(min, Math.round(pos + velocity * 220)));
