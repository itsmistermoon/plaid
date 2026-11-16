import { RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { useStore } from 'zustand';
import { LangSwitch } from '../components/LangSwitch';
import { ThemeSwitch } from '../components/ThemeSwitch';
import { TourCoach } from '../components/TourCoach';
import { useT } from '../i18n';
import { tourSteps } from '../tour';
import { Comensal } from './Comensal';
import { Garzon } from './Garzon';
import { Portada } from './Portada';
import { TourButton } from './Recorrido';
import { store } from './store';
import { useSimulator } from './useSimulator';

export function Demo() {
  const { view, setView, reset, tour, skipTour, endTour } = useStore(store);
  const touring = tour && !tour.skipped ? tour : null;
  const t = useT();
  const [revision, setRevision] = useState(0);
  const [entered, setEntered] = useState(false);
  useSimulator();
  return (
    <main
      className="app"
      data-view={view}
      data-tour-step={touring ? tourSteps[touring.step] : undefined}
    >
      <header className="stage-bar">
        <h1>
          El Clan <small>{t('stageSubtitle')}</small>
        </h1>
        <ThemeSwitch />
        <LangSwitch />
        <fieldset className="selector">
          <legend className="sr-only">{t('device')}</legend>
          <button
            type="button"
            aria-pressed={view === 'comensal'}
            data-tour="cuenta"
            onClick={() => setView('comensal')}
          >
            {t('diner')}
          </button>
          <button
            type="button"
            aria-pressed={view === 'garzon'}
            data-tour="sala servir cobrar"
            onClick={() => setView('garzon')}
          >
            {t('waiter')}
          </button>
        </fieldset>
        <TourButton />
        <button
          type="button"
          className="dark-button reset-button"
          aria-label={t('resetDemo')}
          onClick={() => {
            reset();
            setEntered(false);
            setRevision((value) => value + 1);
          }}
        >
          <RotateCcw aria-hidden="true" />
          <span className="reset-label">{t('resetDemo')}</span>
        </button>
      </header>
      <div className="tablet">
        <span className="tablet-camera" aria-hidden="true" />
        <div className="tablet-glass">
          {view === 'garzon' ? (
            <Garzon key={revision} />
          ) : entered ? (
            <Comensal key={revision} onHome={() => setEntered(false)} />
          ) : (
            <Portada onEnter={() => setEntered(true)} />
          )}
        </div>
      </div>
      {touring && (
        <TourCoach tour={touring} onSkip={skipTour} onEnd={endTour} />
      )}
    </main>
  );
}
