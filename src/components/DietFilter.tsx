import { useT } from '../i18n';
import { type Diet, diets } from '../menu';

/** Diet toggles above the Carta: dishes that do not match every one fade. */
export function DietFilter({
  value,
  onChange,
}: {
  value: Diet[];
  onChange: (value: Diet[]) => void;
}) {
  const t = useT();
  return (
    <fieldset className="selector diet-filter">
      <legend className="sr-only">{t('dietFilter')}</legend>
      {diets.map((diet) => (
        <button
          key={diet}
          type="button"
          aria-pressed={value.includes(diet)}
          onClick={() =>
            onChange(
              value.includes(diet)
                ? value.filter((other) => other !== diet)
                : [...value, diet],
            )
          }
        >
          {t('diets')[diet]}
        </button>
      ))}
    </fieldset>
  );
}
