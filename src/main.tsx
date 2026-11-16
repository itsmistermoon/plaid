import '@fontsource/courier-prime/400.css';
import '@fontsource/courier-prime/700.css';
import '@fontsource/outfit/700.css';
import '@fontsource/kaushan-script/400.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import { Preferences } from '@ui-sdk/react/preferences';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Redirect, Route, Switch } from 'wouter';
import { Demo } from './Demo';
import { Gallery } from './Gallery';
import { theme } from './theme';
import './style.css';
import './theme-moderno.css';

function App() {
  return (
    <Switch>
      <Route path="/" component={() => <Redirect to="/demo" replace />} />
      <Route path="/demo">
        <Demo />
      </Route>
      <Route path="/componentes">
        <Gallery />
      </Route>
      <Route path="/en/demo">
        <main lang="en">
          <h1>El Clan demo</h1>
        </main>
      </Route>
      <Route path="/en/components">
        <main lang="en">
          <h1>Component gallery</h1>
        </main>
      </Route>
      <Route>
        <main>
          <h1>Página no encontrada</h1>
        </main>
      </Route>
    </Switch>
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
