import React, { useState, useRef } from 'react';
import { Category, ProblemItem, GameSettings } from '../types';
import { 
  X, 
  Upload, 
  FolderDown, 
  FileCheck, 
  Layers, 
  Sparkles, 
  FileCode2, 
  CheckCircle2, 
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import { importBackupJson, resetAllData } from '../utils/storage';
import { DEFAULT_PROBLEMS, DEFAULT_CATEGORIES } from '../data/defaultData';

interface LoadDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  problems: ProblemItem[];
  settings: GameSettings;
  onLoadDeck: (cats: Category[], probs: ProblemItem[], deckName: string) => void;
  currentDeckName?: string;
}

export const LoadDeckModal: React.FC<LoadDeckModalProps> = ({
  isOpen,
  onClose,
  categories,
  problems,
  settings,
  onLoadDeck,
  currentDeckName = 'Jeu standard KeepCool'
}) => {
  const [activeTab, setActiveTab] = useState<'file' | 'presets' | 'paste'>('file');
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
        setErrorMessage(res.error || 'Fichier JSON non reconnu.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleApplyPreview = () => {
    if (!previewDeck) return;
    onLoadDeck(previewDeck.categories, previewDeck.problems, previewDeck.name);
    setSuccessMessage(`Jeu « ${previewDeck.name} » chargé avec succès (${previewDeck.problems.length} situations) !`);
    setTimeout(() => {
      onClose();
      setPreviewDeck(null);
      setSuccessMessage(null);
    }, 1200);
  };

  const handleApplyPreset = (filterType: 'all' | 'ventilation' | 'toiture' | 'eau') => {
    setErrorMessage(null);
    let chosenProblems = [...DEFAULT_PROBLEMS];
    let deckTitle = 'Jeu complet KeepCool';

    if (filterType === 'ventilation') {
      chosenProblems = DEFAULT_PROBLEMS.filter(p => p.categoryId === 'ventilation');
      deckTitle = 'Thématique : Ventilation & Flux d\'air';
    } else if (filterType === 'toiture') {
      chosenProblems = DEFAULT_PROBLEMS.filter(p => p.categoryId === 'toiture');
      deckTitle = 'Thématique : Toitures & Rayonnement';
    } else if (filterType === 'eau') {
      chosenProblems = DEFAULT_PROBLEMS.filter(p => p.categoryId === 'eau' || p.categoryId === 'attente');
      deckTitle = 'Thématique : Abreuvement & Attente traite';
    }

    onLoadDeck(DEFAULT_CATEGORIES, chosenProblems, deckTitle);
    setSuccessMessage(`Jeu « ${deckTitle} » activé (${chosenProblems.length} situations) !`);
    setTimeout(() => {
      onClose();
      setSuccessMessage(null);
    }, 1000);
  };

  const handleApplyPaste = () => {
    if (!pasteText.trim()) {
      setErrorMessage('Veuillez coller le contenu JSON partagé par votre enseignant.');
      return;
    }
    const res = importBackupJson(pasteText.trim());
    if (res.success && res.data) {
      onLoadDeck(res.data.categories, res.data.problems, 'Jeu importé par texte');
      setSuccessMessage(`Jeu importé avec succès (${res.data.problems.length} situations) !`);
      setTimeout(() => {
        onClose();
        setPasteText('');
        setSuccessMessage(null);
      }, 1000);
    } else {
      setErrorMessage(res.error || 'Format JSON invalide.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <FolderDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                Charger un jeu de photos
              </h3>
              <p className="text-[11px] text-slate-300">
                Jeu actif : <span className="text-emerald-300 font-bold">{currentDeckName}</span> ({problems.length} cas)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback alertes */}
        {errorMessage && (
          <div className="mx-4 mt-3 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mx-4 mt-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Onglets */}
        <div className="px-4 pt-3">
          <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold">
            <button
              onClick={() => { setActiveTab('file'); setErrorMessage(null); }}
              className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'file'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Fichier .json</span>
            </button>
            <button
              onClick={() => { setActiveTab('presets'); setErrorMessage(null); }}
              className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'presets'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Thématiques</span>
            </button>
            <button
              onClick={() => { setActiveTab('paste'); setErrorMessage(null); }}
              className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'paste'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Coller code</span>
            </button>
          </div>
        </div>

        {/* Contenu onglets */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Onglet 1 : Fichier JSON préparé par l'enseignant */}
          {activeTab === 'file' && (
            <div className="space-y-3">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-3xl p-6 text-center cursor-pointer bg-emerald-50/40 hover:bg-emerald-50/70 transition-all flex flex-col items-center justify-center gap-2"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-800">
                    Sélectionner le fichier préparé par l'enseignant
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Fichier au format <strong>.json</strong> exporté depuis le mode enseignant
                  </p>
                </div>
                <span className="inline-block px-3 py-1 bg-white border border-emerald-200 text-emerald-800 font-bold text-[11px] rounded-xl shadow-xs mt-1">
                  Parcourir mes fichiers
                </span>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json,application/json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {previewDeck && (
                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs font-black text-slate-900 truncate">
                      {previewDeck.name}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-1">
                    <p>• Situations prêtes à jouer : <strong>{previewDeck.problems.length}</strong></p>
                    <p>• Rubriques incluses : <strong>{previewDeck.categories.length}</strong></p>
                  </div>
                  <button
                    onClick={handleApplyPreview}
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Lancer ce jeu de photos maintenant</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Onglet 2 : Thématiques pré-configurées */}
          {activeTab === 'presets' && (
            <div className="space-y-2">
              <p className="text-[11px] text-slate-500 mb-1">
                Choisissez parmi les séries KeepCool officielles :
              </p>

              <button
                onClick={() => handleApplyPreset('all')}
                className="w-full text-left p-3 rounded-2xl border border-slate-200 hover:border-emerald-400 bg-white hover:bg-emerald-50/30 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🏆</span>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-900">
                      Jeu complet KeepCool
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Toutes les problématiques mixtes (bâtiment, toiture, abreuvement)
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {DEFAULT_PROBLEMS.length} cas
                </span>
              </button>

              <button
                onClick={() => handleApplyPreset('ventilation')}
                className="w-full text-left p-3 rounded-2xl border border-slate-200 hover:border-emerald-400 bg-white hover:bg-emerald-50/30 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">💨</span>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-900">
                      Spécial Ventilation & Flux d'air
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Faîtage, filets brise-vent, parois et circulation d'air
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                  Thématique
                </span>
              </button>

              <button
                onClick={() => handleApplyPreset('toiture')}
                className="w-full text-left p-3 rounded-2xl border border-slate-200 hover:border-emerald-400 bg-white hover:bg-emerald-50/30 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">☀️</span>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-900">
                      Spécial Toiture & Rayonnement
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Translucides solaires, isolation bac acier et ombrage
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                  Thématique
                </span>
              </button>

              <button
                onClick={() => handleApplyPreset('eau')}
                className="w-full text-left p-3 rounded-2xl border border-slate-200 hover:border-emerald-400 bg-white hover:bg-emerald-50/30 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">💧</span>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-900">
                      Spécial Eau & Attente de traite
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Débit d'abreuvoir, douchage et brumisation avant traite
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                  Thématique
                </span>
              </button>
            </div>
          )}

          {/* Onglet 3 : Coller le code JSON directement */}
          {activeTab === 'paste' && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-800 block">
                Coller le texte JSON reçu de l'enseignant :
              </label>
              <textarea
                rows={5}
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder='Collez ici le texte JSON commençant par { "categories": ...'
                className="w-full text-[11px] p-3 rounded-2xl border border-slate-300 font-mono focus:ring-2 focus:ring-emerald-500 bg-slate-50"
              />
              <button
                onClick={handleApplyPaste}
                disabled={!pasteText.trim()}
                className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all ${
                  pasteText.trim()
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Charger ce jeu collé</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Modal */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Vous pouvez recharger le jeu par défaut à tout moment.</span>
          <button
            onClick={() => handleApplyPreset('all')}
            className="text-emerald-700 font-bold hover:underline"
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
};
