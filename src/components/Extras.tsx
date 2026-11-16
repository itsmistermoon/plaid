import { Label } from '@ui-sdk/react/label';
import { BadgePlus } from 'lucide-react';
import { useId } from 'react';
import { money } from '../format';
import { useExtraName, useT } from '../i18n';
import type { Extra } from '../menu';
import { KitCheck } from './KitCheck';

/** Agregados de un plato: título con `BadgePlus` y una casilla por agregado. */
export function Extras({
  extras,
  selected,
  onChange,
  disabled,
}: {
  extras: Extra[];
  selected: string[];
  onChange?: (selected: string[]) => void;
  disabled?: boolean;
}) {
  const t = useT();
  const extraName = useExtraName();
  const titleId = useId();
  return (
    <fieldset className="extras" aria-labelledby={titleId}>
      <div className="extras-title" id={titleId}>
        <BadgePlus className="extras-icon" aria-hidden="true" />
        {t('extras')}
      </div>
      {extras.map((extra) => (
        <Label key={extra.id} className="extra">
          <KitCheck
            label={`${extraName(extra)}, ${money(extra.price)}`}
            disabled={disabled}
            checked={selected.includes(extra.id)}
            onChange={(checked) =>
              onChange?.(
                checked
                  ? [...selected, extra.id]
                  : selected.filter((id) => id !== extra.id),
              )
            }
          />
          <span aria-hidden="true">{extraName(extra)}</span>
          <span className="extra-price" aria-hidden="true">
            +{money(extra.price)}
          </span>
        </Label>
      ))}
    </fieldset>
  );
}
