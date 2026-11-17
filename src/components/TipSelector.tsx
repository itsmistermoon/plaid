import { useT } from '../i18n';
import { Selector } from './Selector';

export const tipPercents = [0, 10, 15] as const;
export type TipPercent = (typeof tipPercents)[number];

/** Suggested tip of the Cuenta: 0, 10 or 15% of the bill. */
export function TipSelector({
  value,
  onChange,
}: {
  value: TipPercent;
  onChange: (value: TipPercent) => void;
}) {
  const t = useT();
  return (
    <Selector
      className="tip-selector"
      legend={t('tip')}
      options={tipPercents.map((percent) => ({
        value: `${percent}`,
        label: `${percent}%`,
      }))}
      value={`${value}`}
      onChange={(percent) => onChange(Number(percent) as TipPercent)}
    />
  );
}
