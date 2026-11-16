import { Link, useLocation } from 'wouter';
import { pathFor, routeFor, useLang, useT } from '../i18n';

/** Selector ES/EN: lleva a la misma página en el otro idioma. */
export function LangSwitch() {
  const t = useT();
  const lang = useLang();
  const [location] = useLocation();
  const page = routeFor(location)?.page ?? 'demo';
  return (
    <nav className="selector lang-switch" aria-label={t('langSwitch')}>
      {(['es', 'en'] as const).map((item) => (
        <Link
          key={item}
          href={pathFor(page, item)}
          hrefLang={item}
          lang={item}
          aria-current={lang === item ? 'page' : undefined}
          title={item === 'es' ? 'Español' : 'English'}
        >
          {item.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
