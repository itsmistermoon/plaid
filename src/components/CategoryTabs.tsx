import { useT } from '../i18n';
import { type Category, categories } from '../menu';

/** Pestañas de categorías fijas arriba del tablero; la sombra aparece al desplazar. */
export function CategoryTabs({
  value,
  onChange,
}: {
  value: Category;
  onChange: (category: Category) => void;
}) {
  const t = useT();
  return (
    <div className="tabs-bar">
      <div
        className="segmented"
        role="tablist"
        aria-label={t('categoriesLabel')}
      >
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={value === item}
            onClick={() => onChange(item)}
          >
            {t('categories')[item]}
          </button>
        ))}
      </div>
    </div>
  );
}
