import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
} from '@ui-sdk/react/number-input';
import { ChevronDown, ChevronUp } from 'lucide-react';

/** Ruleta de cantidad: muestra el valor vecino arriba y abajo, como un tambor. */
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
  return (
    <NumberInput
      value={value}
      min={min}
      max={max}
      disabled={disabled}
      onValueChange={(next) => onChange(next ?? min)}
    >
      <NumberInputGroup className="wheel">
        <span className="wheel-window">
          <span className="wheel-ghost" aria-hidden="true">
            {value > min ? value - 1 : ''}
          </span>
          <NumberInputControl className="wheel-value" aria-label={label} />
          <span className="wheel-ghost" aria-hidden="true">
            {value < max ? value + 1 : ''}
          </span>
        </span>
        <span className="wheel-arrows">
          <NumberInputIncrement aria-label="Agregar una unidad">
            <ChevronUp aria-hidden="true" />
          </NumberInputIncrement>
          <NumberInputDecrement aria-label="Quitar una unidad">
            <ChevronDown aria-hidden="true" />
          </NumberInputDecrement>
        </span>
      </NumberInputGroup>
    </NumberInput>
  );
}
