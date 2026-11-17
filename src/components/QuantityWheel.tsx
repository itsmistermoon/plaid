import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
} from '@ui-sdk/react/number-input';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useT } from '../i18n';
import { unlockAudio } from '../lib/sound';
import { tick } from '../lib/tick';
import {
  crossed,
  flingTarget,
  give,
  settleStep,
  toothOffset,
} from '../lib/wheel';

// Vertical drum with teeth on the edge, a mix of the select wheel and the
// page-wheel from spec-01 (Shu Ding, MIT), with its own skin.
const row = 36;
const stepDeg = 24;
const radius = row / ((stepDeg * Math.PI) / 180);
const pitch = 7;
const teeth = Array.from(
  { length: Math.ceil((Math.PI * radius) / pitch) + 2 },
  (_, i) => i,
);

const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Quantity wheel: a drum that clicks on every number.
 *
 * UI SDK's NumberInput is the source of truth (spinbutton, keyboard and
 * arrows that repeat when held). The drum only draws: inputs move a target
 * and a single loop reaches it with a spring, playing a sound and vibrating
 * each time a number crosses the center.
 */
export function QuantityWheel({
  value,
  onChange,
  label,
  min = 1,
  max = 20,
  disabled,
}: {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  max?: number;
  disabled?: boolean;
}) {
  const t = useT();
  const [center, setCenter] = useState(value);
  const windowEl = useRef<HTMLSpanElement>(null);
  const motion = useRef({
    pos: value,
    vel: 0,
    target: value,
    center: value,
    frame: 0,
    last: 0,
  });
  const drag = useRef<{
    y: number;
    target: number;
    samples: [number, number][];
    moved: boolean;
  } | null>(null);
  const latest = useRef({ value, onChange, min, max });
  latest.current = { value, onChange, min, max };

  const clamp = (p: number) => Math.min(max, Math.max(min, p));
  const commit = (next: number) => {
    const { value, onChange } = latest.current;
    if (next !== value) onChange(next);
  };

  const teethEls = useRef<HTMLElement[] | null>(null);
  const paint = () => {
    const el = windowEl.current;
    if (!el) return;
    teethEls.current ??= [...el.querySelectorAll<HTMLElement>('[data-tooth]')];
    const { pos } = motion.current;
    // The teeth wrap around the drum's curve: they bunch up toward the edges.
    const half = teeth.length / 2;
    for (const tooth of teethEls.current) {
      const angle =
        toothOffset(Number(tooth.dataset.tooth) - half, pos, row, pitch) /
        radius;
      const visible = Math.abs(angle) < Math.PI / 2;
      tooth.style.transform = visible
        ? `translateY(${(-radius * Math.sin(angle)).toFixed(2)}px) scaleY(${Math.cos(angle).toFixed(3)})`
        : 'scaleY(0)';
      tooth.style.opacity = visible
        ? (0.25 + 0.75 * Math.cos(angle)).toFixed(2)
        : '0';
    }
    for (const face of el.querySelectorAll<HTMLElement>('[data-n]')) {
      const d = Number(face.dataset.n) - pos;
      const angle = Math.max(-90, Math.min(90, d * stepDeg));
      const rad = (angle * Math.PI) / 180;
      // Larger numbers sit on top: raising the quantity moves the drum down.
      face.style.transform = `translateY(${(-radius * Math.sin(rad)).toFixed(2)}px) translateZ(${(radius * (Math.cos(rad) - 1)).toFixed(2)}px) rotateX(${angle.toFixed(2)}deg)`;
      face.style.opacity = Math.max(0, 1 - Math.abs(d) * 0.3).toFixed(2);
    }
  };

  // The single loop: moves the drum to the target and sounds on each detent.
  const run = () => {
    const m = motion.current;
    if (m.frame) return;
    m.last = performance.now();
    const frame = (now: number) => {
      const dt = Math.max(0, now - m.last);
      m.last = now;
      if (drag.current) {
        m.pos = m.target;
        m.vel = 0;
      } else if (reducedMotion()) {
        m.pos = m.target;
        m.vel = 0;
      } else {
        Object.assign(m, settleStep(m, m.target, dt));
      }
      paint();
      if (crossed(m.center, m.pos)) {
        tick();
        m.center = Math.round(m.pos);
        setCenter(m.center);
      }
      if (m.pos === m.target && m.vel === 0 && !drag.current) {
        m.frame = 0;
        return;
      }
      m.frame = requestAnimationFrame(frame);
    };
    m.frame = requestAnimationFrame(frame);
  };

  const aim = (target: number) => {
    motion.current.target = target;
    run();
  };

  useLayoutEffect(paint);

  // Only a value change from outside (arrows, keyboard, typing) moves it.
  useEffect(() => {
    if (!drag.current && motion.current.target !== value) aim(value);
  }, [value]);

  // The mouse wheel moves the target and settles when it stops. React's
  // listener is passive, so it is added here to stop the page from scrolling.
  useEffect(() => {
    const el = windowEl.current;
    if (!el || disabled) return;
    let settle = 0;
    const onWheel = (event: WheelEvent) => {
      if (!event.deltaY) return;
      event.preventDefault();
      const m = motion.current;
      const { min, max } = latest.current;
      m.target = give(m.target - event.deltaY / row / 1.5, min, max);
      run();
      clearTimeout(settle);
      settle = window.setTimeout(() => {
        const { min, max } = latest.current;
        const p = Math.min(
          max,
          Math.max(min, Math.round(motion.current.target)),
        );
        aim(p);
        commit(p);
      }, 120);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      clearTimeout(settle);
    };
  }, [disabled]);

  useEffect(() => () => cancelAnimationFrame(motion.current.frame), []);

  const goTo = (next: number) => {
    const p = clamp(next);
    aim(p);
    commit(p);
  };

  const numbers = [];
  for (let n = Math.max(min, center - 4); n <= Math.min(max, center + 4); n++)
    numbers.push(n);

  return (
    <NumberInput
      value={value}
      min={min}
      max={max}
      disabled={disabled}
      onValueChange={(next) => onChange(next ?? min)}
    >
      <NumberInputGroup
        className="wheel"
        // Every gesture on the wheel enables the audio for the clicks that follow.
        onPointerDownCapture={unlockAudio}
        onKeyDownCapture={unlockAudio}
        onTouchEndCapture={unlockAudio}
      >
        <span
          ref={windowEl}
          className="wheel-window"
          onPointerDown={(event) => {
            if (disabled || event.button !== 0) return;
            event.currentTarget.setPointerCapture(event.pointerId);
            drag.current = {
              y: event.clientY,
              target: motion.current.target,
              samples: [],
              moved: false,
            };
          }}
          onPointerMove={(event) => {
            const d = drag.current;
            if (!d) return;
            const dy = event.clientY - d.y;
            if (!d.moved && Math.abs(dy) < 3) return;
            if (!d.moved) event.currentTarget.dataset.dragging = '';
            d.moved = true;
            // Dragging down brings the larger numbers, which are on top.
            const target = give(d.target + dy / row, min, max);
            d.samples = [...d.samples.slice(-4), [performance.now(), target]];
            aim(target);
          }}
          onPointerUp={(event) => {
            const d = drag.current;
            drag.current = null;
            delete event.currentTarget.dataset.dragging;
            if (!d) return;
            if (!d.moved) {
              // A tap above or below the center raises or lowers by one.
              const box = event.currentTarget.getBoundingClientRect();
              const offset = event.clientY - box.top - box.height / 2;
              if (Math.abs(offset) > row / 2)
                goTo(Math.round(motion.current.target) + (offset < 0 ? 1 : -1));
              else run();
              return;
            }
            const [a, b] = [d.samples[0], d.samples.at(-1)];
            const velocity =
              a && b && b[0] > a[0] ? (b[1] - a[1]) / (b[0] - a[0]) : 0;
            goTo(flingTarget(motion.current.target, velocity, min, max));
          }}
          onPointerCancel={(event) => {
            drag.current = null;
            delete event.currentTarget.dataset.dragging;
            goTo(Math.round(motion.current.target));
          }}
        >
          <span className="wheel-teeth" aria-hidden="true">
            {teeth.map((i) => (
              <i key={i} data-tooth={i} />
            ))}
          </span>
          <span className="wheel-drum" aria-hidden="true">
            {numbers.map((n) => (
              <span
                key={n}
                data-n={n}
                className="wheel-face"
                data-current={n === center || undefined}
              >
                {n}
              </span>
            ))}
          </span>
          <NumberInputControl
            className="wheel-value"
            aria-label={label}
            role="spinbutton"
            aria-valuenow={value}
            aria-valuemin={min}
            aria-valuemax={max}
          />
        </span>
        <span className="wheel-arrows">
          <NumberInputIncrement aria-label={t('addOne')}>
            <ChevronUp aria-hidden="true" />
          </NumberInputIncrement>
          <NumberInputDecrement aria-label={t('removeOne')}>
            <ChevronDown aria-hidden="true" />
          </NumberInputDecrement>
        </span>
      </NumberInputGroup>
    </NumberInput>
  );
}
