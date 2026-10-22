import React, { useState, useEffect } from 'react';
import { Category, ProblemItem, GameSettings } from './types';
import { getCategories, getProblems, getSettings } from './utils/storage';
import { SwipeGame } from './components/SwipeGame';
import { PhotoManager } from './components/PhotoManager';
import { PWAInstallButton } from './components/PWAInstallButton';
import { AndroidApkModal } from './components/AndroidApkModal';
import { 
  GraduationCap, 
  Settings, 
  UserCheck, 
  ArrowLeft,
  Smartphone,
  QrCode
} from 'lucide-react';

export default function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [problems, setProblems] = useState<ProblemItem[]>([]);
  const [settings, setSettings] = useState<GameSettings>({ seriesLength: 10 });

  // Mode de l'application : 'student' (Version Élève) ou 'teacher' (Version Enseignante)
  const [appRole, setAppRole] = useState<'student' | 'teacher'>('student');
  const [teacherView, setTeacherView] = useState<'game' | 'manager'>('game');
  const [showApkModal, setShowApkModal] = useState<boolean>(false);

  // Chargement des données au démarrage
  useEffect(() => {
    const cats = getCategories();
    const probs = getProblems();
    const stt = getSettings();
    setCategories(cats);
    setProblems(probs);
    setSettings(stt);
  }, []);

  const handleDataChange = (newCats: Category[], newProbs: ProblemItem[], newSettings: GameSettings) => {
    setCategories(newCats);
    setProblems(newProbs);
    setSettings(newSettings);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Barre d'en-tête smartphone épurée */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-md mx-auto px-3.5 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-black text-sm shadow-xs">
              🐄
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-extrabold text-slate-900 tracking-tight leading-none">
                  ThermiLait
                </h1>
                <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase ${
                  appRole === 'student' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                }`}>
                  {appRole === 'student' ? 'Élève' : 'Enseignant'}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">
                Défi Bâtiments Laitiers
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Bouton pour tester sur mobile ou générer l'APK */}
            <button
              onClick={() => setShowApkModal(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 transition-all"
              title="Scanner le QR Code ou générer l'APK"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Tester sur Mobile</span>
              <span className="sm:hidden">Mobile/APK</span>
            </button>

            {/* Bascule Version Élève / Version Enseignante */}
            {appRole === 'student' ? (
              <button
                onClick={() => setAppRole('teacher')}
                className="p-1.5 rounded-full text-slate-400 hover:text-indigo-700 hover:bg-slate-100 transition-all"
                title="Passer en version Enseignante (Gestion des photos)"
              >
                <Settings className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-1">
                {teacherView === 'game' ? (
                  <button
                    onClick={() => setTeacherView('manager')}
                    className="text-xs font-bold px-2.5 py-1 bg-indigo-50 text-indigo-800 rounded-lg border border-indigo-200"
                  >
                    Gérer
                  </button>
                ) : (
                  <button
                    onClick={() => setTeacherView('game')}
                    className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg"
                  >
                    Tester
                  </button>
                )}
                <button
                  onClick={() => { setAppRole('student'); setTeacherView('game'); }}
                  className="p-1.5 text-xs text-slate-500 hover:text-emerald-700"
                  title="Revenir en mode Élève"
                >
                  <UserCheck className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal QR Code / Android APK */}
      <AndroidApkModal
        isOpen={showApkModal}
        onClose={() => setShowApkModal(false)}
      />

      {/* Contenu principal calibré pour smartphone */}
      <main className="flex-1 max-w-md mx-auto px-3.5 pt-2.5 w-full flex flex-col justify-start">
        {appRole === 'student' || teacherView === 'game' ? (
          <SwipeGame
            categories={categories}
            problems={problems}
            settings={settings}
            onOpenAdmin={() => { setAppRole('teacher'); setTeacherView('manager'); }}
            isStudentMode={appRole === 'student'}
          />
        ) : (
          <PhotoManager
            categories={categories}
            problems={problems}
            settings={settings}
            onDataChange={handleDataChange}
            onBackToGame={() => setTeacherView('game')}
          />
        )}
      </main>
    </div>
  );
}
