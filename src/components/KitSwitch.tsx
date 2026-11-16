import { Switch, SwitchThumb } from '@ui-sdk/react/switch';

/** Interruptor del kit: riel hundido y perilla clara con SÍ/NO. */
export function KitSwitch({
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
    <label className="kit-switch-field">
      {label}
      <Switch
        className="kit-switch"
        checked={checked}
        disabled={disabled}
        onCheckedChange={(next) => onChange?.(next)}
      >
        <span className="kit-switch-on" aria-hidden="true">
          SÍ
        </span>
        <span className="kit-switch-off" aria-hidden="true">
          NO
        </span>
        <SwitchThumb className="kit-switch-thumb" />
      </Switch>
    </label>
  );
}
