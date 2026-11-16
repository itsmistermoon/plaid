// Pure logic of the wheel drum: spring, detents, yielding at the edges and
// flinging. Adapted from the page-wheel in spec-01 (Shu Ding, MIT).

export type Motion = { pos: number; vel: number };

// Lightly damped spring: arrives fast and overshoots slightly before settling.
const stiffness = 0.00035; // per ms²
const damping = 2 * 0.75 * Math.sqrt(stiffness);
const substep = 4; // ms, so the result does not depend on the frame rate

/** Advances the drum `dt` ms toward `target`. Returns exact rest on arrival. */
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

/** How many numbers crossed the center between number `center` and position `pos`. */
export const crossed = (center: number, pos: number) =>
  Math.abs(Math.round(pos) - center);

/** Beyond min/max the drum still moves, but only 30 %. */
export const give = (p: number, min: number, max: number) =>
  p < min ? min - (min - p) * 0.3 : p > max ? max + (p - max) * 0.3 : p;

/** Where a fling at `velocity` rows/ms lands: it follows its momentum and snaps to a number. */
export const flingTarget = (
  pos: number,
  velocity: number,
  min: number,
  max: number,
) => Math.min(max, Math.max(min, Math.round(pos + velocity * 220)));

/**
 * Distance along the arc from tooth `index` to the center, with the drum at `pos`.
 * As `pos` grows the numbers rise, so the teeth rise too; the offset repeats
 * every `pitch` px so the row of teeth looks infinite.
 */
export const toothOffset = (
  index: number,
  pos: number,
  row: number,
  pitch: number,
) => index * pitch - ((((pos * row) % pitch) + pitch) % pitch);
