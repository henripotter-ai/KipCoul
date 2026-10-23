import React, { useState, useEffect } from 'react';
import { Category, ProblemItem, GameSettings } from './types';
import { getCategories, getProblems, getSettings } from './utils/storage';
import { SwipeGame } from './components/SwipeGame';
import { SettingsModal } from './components/SettingsModal';
import { Settings as CogwheelIcon } from 'lucide-react';

export default function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [problems, setProblems] = useState<ProblemItem[]>([]);
  const [settings, setSettings] = useState<GameSettings>({ seriesLength: 10 });
  const [currentDeckTitle, setCurrentDeckTitle] = useState<string>('Jeu standard KeepCool');

  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [gameKey, setGameKey] = useState<number>(0);

  // Chargement des données au démarrage
  useEffect(() => {
    const cats = getCategories();
    const probs = getProblems();
    const stt = getSettings();
    setCategories(cats);
    setProblems(probs);
    setSettings(stt);
  }, []);

  const handleUpdateSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    setGameKey(prev => prev + 1);
  };

  const handleLoadCustomDeck = (newCats: Category[], newProbs: ProblemItem[], deckTitle: string) => {
    setCategories(newCats);
    setProblems(newProbs);
    setCurrentDeckTitle(deckTitle);
    setGameKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Bandeau d'en-tête épuré Version Élève */}
      <header className="bg-white border-b border-slate-200/90 sticky top-0 z-30 shadow-xs">
        <div className="max-w-md mx-auto px-3.5 py-2.5 flex items-center justify-between gap-3">
          {/* Côté gauche : Logo du jeu + "KeepCool Challenge" + "Trouver la meilleure solution pour adapter le bâtiment" */}
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="/pwa-192x192.png"
              alt="KeepCool Challenge"
              className="w-11 h-11 rounded-2xl object-cover shadow-xs border border-emerald-300/70 shrink-0"
            />
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-none truncate">
                KeepCool Challenge
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-tight mt-1 line-clamp-2">
                Trouver la meilleure solution pour adapter le bâtiment
              </p>
            </div>
          </div>

          {/* Côté droit en face : Logo KeepCool avec juste en dessous la roue crantée (Paramètres) */}
          <div className="flex flex-col items-end justify-center shrink-0 gap-1.5">
            <img
              src="/logo-keepcool.png"
              alt="Projet KeepCool"
              className="h-6 w-auto max-w-[135px] object-contain"
            />
            <button
              onClick={() => setShowSettingsModal(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-semibold border border-slate-200 hover:border-emerald-300 transition-all active:scale-95 shadow-2xs group"
              title="Paramètres : réglage du nombre de questions et chargement d'un jeu de données"
              aria-label="Accéder aux paramètres du jeu"
            >
              <CogwheelIcon className="w-3.5 h-3.5 text-emerald-700 group-hover:rotate-45 transition-transform" />
              <span className="text-[11px] font-bold">Paramètres</span>
            </button>
          </div>
        </div>
      </header>

      {/* Modal Paramètres : Réglage du nombre de questions & Chargement d'un jeu de données */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        categories={categories}
        problems={problems}
        settings={settings}
        currentDeckName={currentDeckTitle}
        onUpdateSettings={handleUpdateSettings}
        onLoadDeck={handleLoadCustomDeck}
      />

      {/* Contenu principal : Accès direct au jeu Élève */}
      <main className="flex-1 max-w-md mx-auto px-3.5 pt-2.5 pb-4 w-full flex flex-col justify-start">
        <SwipeGame
          key={`game-${gameKey}`}
          categories={categories}
          problems={problems}
          settings={settings}
          onOpenAdmin={() => setShowSettingsModal(true)}
          isStudentMode={true}
        />
      </main>
    </div>
  );
}
