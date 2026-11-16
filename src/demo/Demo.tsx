import { LayoutGrid, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'wouter';
import { useStore } from 'zustand';
import { LangSwitch } from '../components/LangSwitch';
import { Selector } from '../components/Selector';
import { SelectorToggle } from '../components/SelectorToggle';
import { StageBar } from '../components/StageBar';
import { ThemeSwitch } from '../components/ThemeSwitch';
import { TourCoach } from '../components/TourCoach';
import { pathFor, useLang, useT } from '../i18n';
import { tourSteps } from '../tour';
import { Comensal } from './Comensal';
import { Garzon } from './Garzon';
import { Portada } from './Portada';
import { TourButton } from './Recorrido';
import { store } from './store';
import { useMedia } from './useMedia';
import { useSimulator } from './useSimulator';

export function Demo() {
  const { view, setView, reset, tour, skipTour, endTour } = useStore(store);
  const touring = tour && !tour.skipped ? tour : null;
  const t = useT();
  const lang = useLang();
  const phone = useMedia('(max-width: 760px)');
  const [revision, setRevision] = useState(0);
  const [entered, setEntered] = useState(false);
  useSimulator();
  return (
    <main
      className="app"
      data-view={view}
      data-tour-step={touring ? tourSteps[touring.step] : undefined}
    >
      <StageBar>
        <h1>
          Restaurant El Clan <small>{t('stageSubtitle')}</small>
        </h1>
        <ThemeSwitch />
        <LangSwitch />
        {phone ? (
          <SelectorToggle
            className="role-switch"
            label={t('device')}
            current={view === 'garzon' ? t('waiter') : t('diner')}
            next={view === 'garzon' ? t('diner') : t('waiter')}
            data-tour={view === 'garzon' ? 'cuenta' : 'sala servir cobrar'}
            onClick={() => setView(view === 'garzon' ? 'comensal' : 'garzon')}
          />
        ) : (
          <Selector
            className="role-switch"
            legend={t('device')}
            value={view}
            options={[
              { value: 'comensal', label: t('diner'), tour: 'cuenta' },
              {
                value: 'garzon',
                label: t('waiter'),
                tour: 'sala servir cobrar',
              },
            ]}
            onChange={setView}
          />
        )}
        <TourButton />
        <Link
          href={pathFor('gallery', lang)}
          className="dark-button kit-link"
          aria-label={t('uiKit')}
        >
          <LayoutGrid aria-hidden="true" />
          <span className="reset-label">{t('uiKit')}</span>
        </Link>
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
      </StageBar>
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
