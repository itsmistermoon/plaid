import { Link, useLocation } from 'wouter';
import { useMedia } from '../demo/useMedia';
import { messages, pathFor, routeFor, useLang, useT } from '../i18n';
import { SelectorToggle } from './SelectorToggle';

/** Selector ES/EN: lleva a la misma página en el otro idioma. En teléfono, un solo botón que alterna. */
export function LangSwitch() {
  const t = useT();
  const lang = useLang();
  const [location, navigate] = useLocation();
  const phone = useMedia('(max-width: 760px)');
  const page = routeFor(location)?.page ?? 'demo';
  if (phone) {
    const next = lang === 'es' ? 'en' : 'es';
    return (
      <SelectorToggle
        className="lang-switch"
        label={t('langSwitch')}
        current={lang.toUpperCase()}
        next={messages[next].langName}
        onClick={() => navigate(pathFor(page, next))}
      />
    );
  }
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
