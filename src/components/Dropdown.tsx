import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@ui-sdk/react/select';
import { Check, ChevronDown } from 'lucide-react';

/** Selector desplegable del kit: botón claro con lista flotante. */
export function Dropdown({
  label,
  items,
  value,
  onChange,
  disabled,
  invalid,
}: {
  label: string;
  items: string[];
  value: string | null;
  onChange?: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
}) {
  return (
    <Select
      items={items}
      value={value}
      placeholder="Elige una opción"
      disabled={disabled}
      onValueChange={(next) => next && onChange?.(next)}
    >
      <SelectLabel className="dropdown-label">{label}</SelectLabel>
      <SelectTrigger
        className="dropdown"
        aria-invalid={invalid || undefined}
        data-invalid={invalid || undefined}
      >
        <SelectValue />
        <ChevronDown aria-hidden="true" strokeWidth={3} />
      </SelectTrigger>
      <SelectContent className="dropdown-list">
        {items.map((item) => (
          <SelectItem key={item} value={item} className="dropdown-item">
            <SelectItemText>{item}</SelectItemText>
            <SelectItemIndicator>
              <Check aria-hidden="true" strokeWidth={3} />
            </SelectItemIndicator>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
