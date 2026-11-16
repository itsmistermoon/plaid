import { Checkbox, CheckboxIndicator } from '@ui-sdk/react/checkbox';
import { Check } from 'lucide-react';

/** Checkbox del kit: cuadro claro con un visto grueso. */
export function KitCheck({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <Checkbox
      className="kit-check"
      aria-label={label}
      disabled={disabled}
      checked={checked}
      onCheckedChange={(next) => onChange?.(next === true)}
    >
      <CheckboxIndicator>
        <Check aria-hidden="true" strokeWidth={4} />
      </CheckboxIndicator>
    </Checkbox>
  );
}
