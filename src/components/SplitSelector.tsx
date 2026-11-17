import { useT } from '../i18n';
import { Selector } from './Selector';

export const splitPeople = [1, 2, 3, 4] as const;
export type SplitPeople = (typeof splitPeople)[number];

/** How many people share the Cuenta evenly: 1 (no split) to 4. */
export function SplitSelector({
  value,
  onChange,
}: {
  value: SplitPeople;
  onChange: (value: SplitPeople) => void;
}) {
  const t = useT();
  return (
    <Selector
      className="split-selector"
      legend={t('splitBill')}
      options={splitPeople.map((people) => ({
        value: `${people}`,
        label: `${people}`,
      }))}
      value={`${value}`}
      onChange={(people) => onChange(Number(people) as SplitPeople)}
    />
  );
}
