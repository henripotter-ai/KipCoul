import React, { useState, useRef } from 'react';
import { Category, ProblemItem, GameSettings } from '../types';
import { 
  X, 
  Settings as SettingsIcon,
  Sliders, 
  FolderDown, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  RotateCcw, 
  FileCode2,
  Layers,
  Check
} from 'lucide-react';
import { saveSettings, importBackupJson, resetAllData } from '../utils/storage';
import { DEFAULT_PROBLEMS, DEFAULT_CATEGORIES } from '../data/defaultData';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  problems: ProblemItem[];
  settings: GameSettings;
  currentDeckName: string;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onLoadDeck: (cats: Category[], probs: ProblemItem[], deckName: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  categories,
  problems,
  settings,
  currentDeckName,
  onUpdateSettings,
  onLoadDeck
}) => {
  const [activeTab, setActiveTab] = useState<'questions' | 'dataset'>('questions');
  const [seriesLength, setSeriesLength] = useState<number>(settings.seriesLength || 10);
  
  // Onglet Jeu de données
  const [dataTab, setDataTab] = useState<'file' | 'presets' | 'paste'>('file');
  const [pasteText, setPasteText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [previewDeck, setPreviewDeck] = useState<{
    name: string;
    categories: Category[];
    problems: ProblemItem[];
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Mise à jour du nombre de questions
  const handleSaveQuestions = (newCount: number) => {
    const validCount = Math.max(1, Math.min(newCount, problems.length || 10));
    setSeriesLength(validCount);
    const newSettings = { ...settings, seriesLength: validCount };
    saveSettings(newSettings);
    onUpdateSettings(newSettings);
    setSuccessMessage(`Série configurée à ${validCount} question${validCount > 1 ? 's' : ''}.`);
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  // Chargement par fichier JSON
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importBackupJson(content);
      if (res.success && res.data) {
        setPreviewDeck({
          name: file.name.replace(/\.json$/i, ''),
          categories: res.data.categories,
          problems: res.data.problems
        });
      } else {
        setErrorMessage(res.error || 'Fichier JSON non reconnu. Assurez-vous qu\'il s\'agit d\'un export KeepCool.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleApplyPreview = () => {
    if (!previewDeck) return;
    onLoadDeck(previewDeck.categories, previewDeck.problems, previewDeck.name);
    setSuccessMessage(`Jeu « ${previewDeck.name} » chargé (${previewDeck.problems.length} photos) !`);
    setTimeout(() => {
      setPreviewDeck(null);
      setSuccessMessage(null);
      onClose();
    }, 1200);
  };

  // Presets KeepCool
  const handleApplyPreset = (filterType: 'all' | 'ventilation' | 'toiture' | 'eau') => {
    setErrorMessage(null);
    let chosenProblems = [...DEFAULT_PROBLEMS];
    let deckTitle = 'Jeu complet KeepCool';

    if (filterType === 'ventilation') {
      chosenProblems = DEFAULT_PROBLEMS.filter(p => p.categoryId === 'ventilation');
      deckTitle = 'Ventilation & Flux d\'air';
    } else if (filterType === 'toiture') {
      chosenProblems = DEFAULT_PROBLEMS.filter(p => p.categoryId === 'toiture');
      deckTitle = 'Toitures & Rayonnement';
    } else if (filterType === 'eau') {
      chosenProblems = DEFAULT_PROBLEMS.filter(p => p.categoryId === 'eau' || p.categoryId === 'attente');
      deckTitle = 'Abreuvement & Attente';
    }

    onLoadDeck(DEFAULT_CATEGORIES, chosenProblems, deckTitle);
    setSuccessMessage(`Jeu « ${deckTitle} » activé (${chosenProblems.length} photos) !`);
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1000);
  };

  // Coller JSON
  const handleApplyPaste = () => {
    if (!pasteText.trim()) {
      setErrorMessage('Veuillez coller le contenu JSON.');
      return;
    }
    const res = importBackupJson(pasteText.trim());
    if (res.success && res.data) {
      onLoadDeck(res.data.categories, res.data.problems, 'Jeu importé par texte');
      setSuccessMessage(`Jeu importé avec succès (${res.data.problems.length} photos) !`);
      setTimeout(() => {
        setPasteText('');
        setSuccessMessage(null);
        onClose();
      }, 1000);
    } else {
      setErrorMessage(res.error || 'Format JSON invalide.');
    }
  };

  // Réinitialisation par défaut
  const handleResetToDefault = () => {
    if (window.confirm('Voulez-vous réinitialiser le jeu avec la base KeepCool officielle ?')) {
      const def = resetAllData();
      onLoadDeck(def.categories, def.problems, 'Jeu standard KeepCool');
      setSuccessMessage('Base de données réinitialisée avec succès !');
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* En-tête Modal */}
        <div className="px-4 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <SettingsIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                Paramètres du jeu
              </h3>
              <p className="text-[11px] text-slate-300">
                Série : <span className="text-emerald-300 font-bold">{seriesLength} questions</span> • Base : <span className="text-emerald-300 font-bold">{problems.length} photos</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barre d'onglets principale : Questions vs Jeu de données */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('questions')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'questions'
                ? 'bg-white text-emerald-900 shadow-xs border border-emerald-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-600" />
            <span>Nombre de questions</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full font-black">
              {seriesLength}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('dataset')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'dataset'
                ? 'bg-white text-emerald-900 shadow-xs border border-emerald-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FolderDown className="w-3.5 h-3.5 text-emerald-600" />
            <span>Jeu de données</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full font-black">
              {problems.length}
            </span>
          </button>
        </div>

        {/* Notifications */}
        {errorMessage && (
          <div className="mx-4 mt-3 p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mx-4 mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}

        {/* Corps du modal */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* ========================================================= */}
          {/* ONGLET 1 : RÉGLAGE DU NOMBRE DE QUESTIONS */}
          {/* ========================================================= */}
          {activeTab === 'questions' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 space-y-1">
                <span className="text-xs font-bold text-emerald-950 block">
                  Combien de situations souhaitez-vous aborder par partie ?
                </span>
                <p className="text-[11px] text-emerald-800 leading-snug">
                  Une fois la série achevée, le jeu calcule automatiquement votre score de réussite et affiche le récapitulatif complet des observations.
                </p>
              </div>

              {/* Boutons de sélection rapide */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Choix rapide de la longueur de série :
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[3, 5, 10, problems.length].map((count, idx) => {
                    const isTotal = idx === 3;
                    const label = isTotal ? `Tout (${count})` : `${count} cas`;
                    const isSelected = seriesLength === count;
                    return (
                      <button
                        key={count + '-' + idx}
                        onClick={() => handleSaveQuestions(count)}
                        className={`py-2 px-1 rounded-xl text-xs font-extrabold flex flex-col items-center justify-center transition-all border ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                            : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <span className="text-sm">{isTotal ? 'Toutes' : count}</span>
                        <span className="text-[10px] font-normal opacity-90">{isTotal ? `(${count})` : 'questions'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Réglage précis par curseur */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    Ajustement personnalisé :
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-black text-emerald-700">
                      {seriesLength}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      / {problems.length} disponibles
                    </span>
                  </div>
                </div>

                <input
                  type="range"
                  min="1"
                  max={Math.max(1, problems.length)}
                  value={seriesLength}
                  onChange={(e) => handleSaveQuestions(parseInt(e.target.value) || 1)}
                  className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />

                <div className="flex justify-between text-[10px] text-slate-400 font-bold px-0.5">
                  <span>1 question</span>
                  <span>{Math.round(problems.length / 2)} questions</span>
                  <span>{problems.length} (total)</span>
                </div>
              </div>

              {/* Résumé actuel */}
              <div className="p-3 bg-white rounded-2xl border border-slate-200 text-xs flex items-center justify-between">
                <span className="text-slate-600">Base active :</span>
                <span className="font-bold text-slate-800 truncate max-w-[200px]">
                  {currentDeckName}
                </span>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* ONGLET 2 : CHARGEMENT D'UN JEU DE DONNÉES */}
          {/* ========================================================= */}
          {activeTab === 'dataset' && (
            <div className="space-y-3.5">
              {/* Info jeu actuel */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between">
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wide block">
                    Jeu actuellement chargé
                  </span>
                  <span className="text-xs font-bold text-slate-900 truncate block">
                    {currentDeckName}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    {problems.length} photos
                  </span>
                </div>
              </div>

              {/* Sous-onglets de chargement */}
              <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold gap-1">
                <button
                  onClick={() => setDataTab('file')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    dataTab === 'file' ? 'bg-white text-emerald-900 shadow-2xs font-bold' : 'text-slate-600'
                  }`}
                >
                  Fichier .JSON
                </button>
                <button
                  onClick={() => setDataTab('presets')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    dataTab === 'presets' ? 'bg-white text-emerald-900 shadow-2xs font-bold' : 'text-slate-600'
                  }`}
                >
                  Jeux thématiques
                </button>
                <button
                  onClick={() => setDataTab('paste')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    dataTab === 'paste' ? 'bg-white text-emerald-900 shadow-2xs font-bold' : 'text-slate-600'
                  }`}
                >
                  Texte direct
                </button>
              </div>

              {/* OPTION 1 : FICHIER JSON */}
              {dataTab === 'file' && (
                <div className="space-y-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-950">
                        Cliquez pour importer un jeu (.json)
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Fichier de photos et associations préparé par l'enseignant
                      </p>
                    </div>
                  </div>

                  {/* Aperçu du fichier détecté */}
                  {previewDeck && (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                        <span className="truncate">{previewDeck.name}</span>
                        <span className="text-[11px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                          {previewDeck.problems.length} photos
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-800">
                        {previewDeck.categories.length} rubriques et solutions associées prêtes à l'emploi.
                      </p>
                      <button
                        onClick={handleApplyPreview}
                        className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs active:scale-98 transition-all"
                      >
                        Valider et activer ce jeu de données
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* OPTION 2 : PRESETS THÉMATIQUES */}
              {dataTab === 'presets' && (
                <div className="space-y-2">
                  <div
                    onClick={() => handleApplyPreset('all')}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 bg-white hover:bg-emerald-50/60 cursor-pointer transition-all flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 block truncate">Jeu complet KeepCool</span>
                        <span className="text-[10px] text-slate-500 block">Toutes les situations et catégories</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                      10 photos
                    </span>
                  </div>

                  <div
                    onClick={() => handleApplyPreset('ventilation')}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-sky-300 bg-white hover:bg-sky-50/60 cursor-pointer transition-all flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                        💨
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 block truncate">Ventilation & Flux d'air</span>
                        <span className="text-[10px] text-slate-500 block">Bardages, lanterneaux, brasseurs</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200 shrink-0">
                      4 photos
                    </span>
                  </div>

                  <div
                    onClick={() => handleApplyPreset('toiture')}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-amber-300 bg-white hover:bg-amber-50/60 cursor-pointer transition-all flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                        ☀️
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 block truncate">Toitures & Rayonnement</span>
                        <span className="text-[10px] text-slate-500 block">Isolation, ombrage, translucides</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 shrink-0">
                      3 photos
                    </span>
                  </div>

                  <div
                    onClick={() => handleApplyPreset('eau')}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-teal-300 bg-white hover:bg-teal-50/60 cursor-pointer transition-all flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                        💧
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 block truncate">Abreuvement & Attente</span>
                        <span className="text-[10px] text-slate-500 block">Accès à l'eau et aire d'attente</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-black text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200 shrink-0">
                      3 photos
                    </span>
                  </div>
                </div>
              )}

              {/* OPTION 3 : TEXTE DIRECT */}
              {dataTab === 'paste' && (
                <div className="space-y-2">
                  <textarea
                    value={pasteText}
                    onChange={(e) => setPasteText(e.target.value)}
                    placeholder="Collez ici le contenu JSON du jeu fourni par l'enseignant..."
                    rows={4}
                    className="w-full p-2.5 text-xs font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <button
                    onClick={handleApplyPaste}
                    className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs active:scale-98 transition-all"
                  >
                    Importer et charger ce texte
                  </button>
                </div>
              )}

              {/* Bouton de réinitialisation usine */}
              <div className="pt-2 border-t border-slate-200">
                <button
                  onClick={handleResetToDefault}
                  className="w-full py-2 px-3 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Rétablir les photos KeepCool d'origine</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pied du modal */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs active:scale-98 transition-all"
          >
            Fermer et continuer à jouer
          </button>
        </div>
      </div>
    </div>
  );
};
