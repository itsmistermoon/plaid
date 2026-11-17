import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
} from '@ui-sdk/react/number-input';
import { Minus, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { useT } from '../i18n';
import {
  type Sett,
  sett,
  settSizeOf,
  type TartanColor,
  tartanColors,
  tartanUrl,
  threadcountOf,
} from '../tartan';
import { showOrderToast } from './OrderToast';

const palette = Object.keys(tartanColors) as TartanColor[];
const maxStripes = 8;

/**
 * A loom to try other setts with the Clan's four colors: change each stripe's
 * color and width and see the cloth woven live. It never changes the Clan
 * tartan itself, which stays defined in `tartan.ts`.
 */
export function TartanDesigner() {
  const text = useT()('tartan');
  const [design, setDesign] = useState<Sett>(sett);
  const edit = (index: number, color: TartanColor, count: number) =>
    setDesign(
      design.map((stripe, i) => (i === index ? [color, count] : stripe)),
    );
  const code = threadcountOf(design);
  return (
    <div className="designer">
      <div className="designer-cloth">
        <span
          className="tartan-swatch"
          role="img"
          aria-label={code}
          style={{
            backgroundImage: tartanUrl('check', design),
            // One pixel per thread: a longer sett weaves a larger check.
            backgroundSize: `${settSizeOf(design)}px`,
          }}
        />
        <code>{code}</code>
        <p className="hint">{text.repeat(settSizeOf(design))}</p>
      </div>
      <div className="designer-loom">
        <ol className="designer-stripes">
          {design.map(([color, count], index) => {
            const name = text.colors[color][0];
            const next = palette[(palette.indexOf(color) + 1) % palette.length];
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: stripes are positional
              <li key={index}>
                <button
                  type="button"
                  className="tartan-chip"
                  style={{ background: tartanColors[color] }}
                  aria-label={text.stripeColor(index + 1, name)}
                  onClick={() => edit(index, next, count)}
                >
                  {color}
                </button>
                <span className="designer-name">{name}</span>
                <NumberInput
                  value={count}
                  min={2}
                  max={48}
                  step={2}
                  onValueChange={(value) => edit(index, color, value ?? 2)}
                >
                  <NumberInputGroup className="stepper">
                    <NumberInputDecrement
                      aria-label={text.fewerThreads(index + 1)}
                    >
                      <Minus aria-hidden="true" strokeWidth={3} />
                    </NumberInputDecrement>
                    <NumberInputControl
                      aria-label={text.threadsOf(index + 1)}
                    />
                    <NumberInputIncrement
                      aria-label={text.moreThreads(index + 1)}
                    >
                      <Plus aria-hidden="true" strokeWidth={3} />
                    </NumberInputIncrement>
                  </NumberInputGroup>
                </NumberInput>
                <button
                  type="button"
                  className="dark-button designer-remove"
                  aria-label={text.removeStripe(index + 1)}
                  disabled={design.length <= 2}
                  onClick={() =>
                    setDesign(design.filter((_, i) => i !== index))
                  }
                >
                  <X aria-hidden="true" strokeWidth={3} />
                </button>
              </li>
            );
          })}
        </ol>
        <div className="designer-actions">
          <button
            type="button"
            className="dark-button"
            disabled={design.length >= maxStripes}
            onClick={() => setDesign([...design, ['G', 8]])}
          >
            {text.addStripe}
          </button>
          <button
            type="button"
            className="dark-button"
            onClick={() => setDesign(sett)}
          >
            {text.reset}
          </button>
          <button
            type="button"
            className="light-button"
            onClick={() => {
              navigator.clipboard?.writeText(code).catch(() => {});
              showOrderToast('confirmado', [text.copied, code]);
            }}
          >
            {text.copy}
          </button>
        </div>
      </div>
    </div>
  );
}
