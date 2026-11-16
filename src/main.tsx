import '@fontsource/courier-prime/400.css';
import '@fontsource/courier-prime/700.css';
import '@fontsource/outfit/700.css';
import '@fontsource/kaushan-script/400.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import { Preferences } from '@ui-sdk/react/preferences';
import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Redirect, useLocation } from 'wouter';
import { Demo } from './Demo';
import { Gallery } from './Gallery';
import { LangContext, messages, routeFor } from './i18n';
import { theme } from './theme';
import './style.css';
import './theme-moderno.css';
import './mobile.css';
import './tour.css';

function App() {
  const [location] = useLocation();
  const route = routeFor(location);
  useEffect(() => {
    document.documentElement.lang = route?.lang ?? 'es';
  }, [route?.lang]);
  if (location === '/') return <Redirect to="/demo" replace />;
  if (!route)
    return (
      <main>
        <h1>{messages.es.notFound}</h1>
      </main>
    );
  // Demo y galería quedan en la misma posición del árbol: cambiar de idioma
  // solo cambia el contexto y no desmonta el estado local.
  return (
    <LangContext value={route.lang}>
      {route.page === 'demo' ? <Demo /> : <Gallery />}
    </LangContext>
  );
}

const root = document.getElementById('root');
if (!root) throw new Error('No se encontró la raíz de la aplicación');
createRoot(root).render(
  <StrictMode>
    <Preferences preferences={[theme]}>
      <App />
    </Preferences>
  </StrictMode>,
);
