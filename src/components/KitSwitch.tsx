import { Switch, SwitchThumb } from '@ui-sdk/react/switch';
import { useT } from '../i18n';

/** Interruptor del kit: riel hundido y perilla clara con SÍ/NO (ON/OFF en inglés). */
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
  const t = useT();
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
          {t('switchOn')}
        </span>
        <span className="kit-switch-off" aria-hidden="true">
          {t('switchOff')}
        </span>
        <SwitchThumb className="kit-switch-thumb" />
      </Switch>
    </label>
  );
}
