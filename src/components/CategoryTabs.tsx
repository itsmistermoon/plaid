import { useT } from '../i18n';
import { type Category, categories } from '../menu';

/** Category tabs pinned above the board; the shadow appears on scroll. */
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
