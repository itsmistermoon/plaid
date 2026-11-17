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
import { useT } from '../i18n';

/** The kit's dropdown selector: a light button with a floating list. */
export function Dropdown({
  label,
  items,
  value,
  onChange,
  disabled,
  invalid,
}: {
  label: string;
  items: { value: string; label: string }[];
  value: string | null;
  onChange?: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
}) {
  const t = useT();
  return (
    <Select
      items={items}
      value={value}
      placeholder={t('pickOption')}
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
          <SelectItem
            key={item.value}
            value={item.value}
            className="dropdown-item"
          >
            <SelectItemText>{item.label}</SelectItemText>
            <SelectItemIndicator>
              <Check aria-hidden="true" strokeWidth={3} />
            </SelectItemIndicator>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
