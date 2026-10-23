import React, { useState, useRef } from 'react';
import { Category, ProblemItem, SolutionItem, GameSettings } from '../types';
import { 
  Plus, 
  Trash2, 
  Upload, 
  Download, 
  RotateCcw, 
  ArrowLeft, 
  Check, 
  Image as ImageIcon,
  CheckCircle2,
  Sliders,
  Smartphone,
  ZoomIn
} from 'lucide-react';
import { 
  saveCategories, 
  saveProblems, 
  saveSettings,
  resetAllData, 
  exportBackupJson, 
  importBackupJson 
} from '../utils/storage';
import { PhotoZoomModal } from './PhotoZoomModal';
import { AndroidApkModal } from './AndroidApkModal';

interface PhotoManagerProps {
  categories: Category[];
  problems: ProblemItem[];
  settings: GameSettings;
  onDataChange: (cats: Category[], probs: ProblemItem[], settings: GameSettings) => void;
  onBackToGame: () => void;
}

export const PhotoManager: React.FC<PhotoManagerProps> = ({
  categories,
  problems,
  settings,
  onDataChange,
  onBackToGame
}) => {
  const [activeTab, setActiveTab] = useState<'problems' | 'categories' | 'settings'>('problems');
  const [showApkModal, setShowApkModal] = useState<boolean>(false);

  // Gestion des rubriques
  const [newCatName, setNewCatName] = useState<string>('');
  const [newCatIcon, setNewCatIcon] = useState<string>('📁');

  // Gestion de la série
  const [seriesLength, setSeriesLength] = useState<number>(settings.seriesLength || 10);

  // Formulaire de création / édition d'un problème + sa solution associée
  const [isEditingProblem, setIsEditingProblem] = useState<boolean>(false);
  const [problemForm, setProblemForm] = useState<{
    id: string;
    categoryId: string;
    title: string;
    imageUrl: string;
    expectedProblemDescription: string;
    solutionTitle: string;
    solutionImageUrl: string;
    solutionExpectedImprovement: string;
  }>({
    id: '',
    categoryId: categories[0]?.id || 'ventilation',
    title: '',
    imageUrl: '',
    expectedProblemDescription: '',
    solutionTitle: '',
    solutionImageUrl: '',
    solutionExpectedImprovement: ''
  });

  const [zoomModal, setZoomModal] = useState<{
    isOpen: boolean;
    url: string;
    title?: string;
  }>({
    isOpen: false,
    url: ''
  });

  const [statusToast, setStatusToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const probImgInputRef = useRef<HTMLInputElement>(null);
  const solImgInputRef = useRef<HTMLInputElement>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusToast({ text, type });
    setTimeout(() => setStatusToast(null), 3000);
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'problem' | 'solution'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Veuillez sélectionner un fichier image valide.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (type === 'problem') {
        setProblemForm(prev => ({ ...prev, imageUrl: dataUrl }));
      } else {
        setProblemForm(prev => ({ ...prev, solutionImageUrl: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const startCreateProblem = () => {
    setProblemForm({
      id: `prob-${Date.now()}`,
      categoryId: categories[0]?.id || 'ventilation',
      title: '',
      imageUrl: '',
      expectedProblemDescription: '',
      solutionTitle: '',
      solutionImageUrl: '',
      solutionExpectedImprovement: ''
    });
    setIsEditingProblem(true);
  };

  const handleSaveProblem = () => {
    if (!problemForm.title.trim()) {
      alert('Veuillez renseigner un titre pour le problème.');
      return;
    }
    if (!problemForm.imageUrl.trim()) {
      alert('Veuillez fournir une photo pour le problème.');
      return;
    }
    if (!problemForm.expectedProblemDescription.trim()) {
      alert('Veuillez renseigner la mention attendue pour le problème.');
      return;
    }
    if (!problemForm.solutionTitle.trim() || !problemForm.solutionImageUrl.trim()) {
      alert('Veuillez renseigner le titre et la photo de la solution associée.');
      return;
    }
    if (!problemForm.solutionExpectedImprovement.trim()) {
      alert('Veuillez renseigner la mention attendue pour l\'amélioration.');
      return;
    }

    const newProblemItem: ProblemItem = {
      id: problemForm.id,
      categoryId: problemForm.categoryId,
      title: problemForm.title.trim(),
      imageUrl: problemForm.imageUrl.trim(),
      expectedProblemDescription: problemForm.expectedProblemDescription.trim(),
      solution: {
        id: `sol-${problemForm.id}`,
        title: problemForm.solutionTitle.trim(),
        imageUrl: problemForm.solutionImageUrl.trim(),
        expectedImprovement: problemForm.solutionExpectedImprovement.trim()
      }
    };

    const existingIdx = problems.findIndex(p => p.id === problemForm.id);
    let updated: ProblemItem[];
    if (existingIdx >= 0) {
      updated = [...problems];
      updated[existingIdx] = newProblemItem;
    } else {
      updated = [newProblemItem, ...problems];
    }

    saveProblems(updated);
    onDataChange(categories, updated, settings);
    setIsEditingProblem(false);
    showToast('Situation enregistrée avec succès !');
  };

  const handleDeleteProblem = (probId: string) => {
    const updated = problems.filter(p => p.id !== probId);
    saveProblems(updated);
    onDataChange(categories, updated, settings);
    showToast('Situation supprimée.');
  };

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      icon: newCatIcon || '📁'
    };
    const updated = [...categories, newCat];
    saveCategories(updated);
    onDataChange(updated, problems, settings);
    setNewCatName('');
    showToast(`Rubrique « ${newCat.name} » ajoutée.`);
  };

  const handleDeleteCategory = (catId: string) => {
    if (categories.length <= 1) {
      showToast('Il faut conserver au moins une rubrique.', 'error');
      return;
    }
    const updated = categories.filter(c => c.id !== catId);
    saveCategories(updated);
    onDataChange(updated, problems, settings);
    showToast('Rubrique supprimée.');
  };

  const handleSaveSettings = (newVal: number) => {
    setSeriesLength(newVal);
    const newSettings: GameSettings = { seriesLength: newVal };
    saveSettings(newSettings);
    onDataChange(categories, problems, newSettings);
    showToast(`Nombre de cas par série réglé à ${newVal}.`);
  };

  const handleReset = () => {
    const res = resetAllData();
    onDataChange(res.categories, res.problems, settings);
    setIsEditingProblem(false);
    showToast('Base réinitialisée avec les photos par défaut !');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importBackupJson(content);
      if (res.success && res.data) {
        onDataChange(res.data.categories, res.data.problems, settings);
        showToast(`Import réussi : ${res.data.problems.length} photos chargées !`);
      } else {
        showToast(res.error || 'Erreur lors de l\'import.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="max-w-md mx-auto space-y-4 pb-12">
      <PhotoZoomModal
        isOpen={zoomModal.isOpen}
        onClose={() => setZoomModal({ ...zoomModal, isOpen: false })}
        imageUrl={zoomModal.url}
      />

      {/* En-tête de retour */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToGame}
          className="text-xs font-bold text-slate-700 hover:text-emerald-800 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Mode Élève</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              exportBackupJson();
              showToast('Fichier JSON exporté pour les élèves !');
            }}
            className="p-1.5 px-2.5 text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs"
            title="Télécharger le fichier .json contenant toutes les photos et textes pour les élèves"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporter pour élèves (.json)</span>
          </button>
          <label className="p-1.5 px-2 text-slate-700 bg-white border border-slate-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-slate-50">
            <Upload className="w-3.5 h-3.5" />
            <span>Importer</span>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />
          </label>
          <button
            onClick={handleReset}
            className="p-1.5 text-slate-400 hover:text-rose-600 bg-white border border-slate-200 rounded-lg"
            title="Réinitialiser avec les exemples par défaut"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Message Toast */}
      {statusToast && (
        <div className={`p-3 rounded-2xl text-xs flex items-center gap-2 border animate-in fade-in ${
          statusToast.type === 'error'
            ? 'bg-rose-50 border-rose-200 text-rose-800'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <span>{statusToast.type === 'error' ? '⚠️' : '✅'}</span>
          <span className="font-semibold">{statusToast.text}</span>
        </div>
      )}

      {/* Onglets : Photos vs Rubriques vs Paramètres de série */}
      <div className="flex bg-slate-200/80 p-1 rounded-2xl text-xs font-bold">
        <button
          onClick={() => { setActiveTab('problems'); setIsEditingProblem(false); }}
          className={`flex-1 py-2 rounded-xl transition-all ${
            activeTab === 'problems'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-slate-600'
          }`}
        >
          📸 Photos ({problems.length})
        </button>
        <button
          onClick={() => { setActiveTab('categories'); setIsEditingProblem(false); }}
          className={`flex-1 py-2 rounded-xl transition-all ${
            activeTab === 'categories'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-slate-600'
          }`}
        >
          📁 Rubriques ({categories.length})
        </button>
        <button
          onClick={() => { setActiveTab('settings'); setIsEditingProblem(false); }}
          className={`flex-1 py-2 rounded-xl transition-all ${
            activeTab === 'settings'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-slate-600'
          }`}
        >
          ⚙️ Série ({seriesLength})
        </button>
      </div>

      {/* ======================================================== */}
      {/* ONGLET 1 : PHOTOS & FORMULAIRE */}
      {/* ======================================================== */}
      {activeTab === 'problems' && (
        isEditingProblem ? (
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-md space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900">
                Alimenter une Photo Problème & Solution
              </h3>
              <button
                onClick={() => setIsEditingProblem(false)}
                className="text-xs text-slate-400 font-semibold"
              >
                Annuler
              </button>
            </div>

            {/* Rubrique */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Rubrique :</label>
              <select
                value={problemForm.categoryId}
                onChange={e => setProblemForm({ ...problemForm, categoryId: e.target.value })}
                className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white font-medium"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>

            {/* Photo Problème */}
            <div className="p-3 bg-rose-50/60 rounded-2xl border border-rose-200 space-y-2.5">
              <span className="text-xs font-black text-rose-900 uppercase tracking-wide block">
                1. Photo Problème (Écran 1)
              </span>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Titre du problème :</label>
                <input
                  type="text"
                  value={problemForm.title}
                  onChange={e => setProblemForm({ ...problemForm, title: e.target.value })}
                  placeholder="Ex : Mur plein bloquant la ventilation"
                  className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Photo du problème :</label>
                <label className="w-full text-center py-2 px-3 bg-white text-emerald-800 rounded-xl text-xs font-bold border border-slate-300 cursor-pointer block">
                  <span>📸 Télécharger depuis le téléphone</span>
                  <input
                    type="file"
                    ref={probImgInputRef}
                    accept="image/*"
                    onChange={e => handleImageUpload(e, 'problem')}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  value={problemForm.imageUrl}
                  onChange={e => setProblemForm({ ...problemForm, imageUrl: e.target.value })}
                  placeholder="Ou URL de l'image..."
                  className="w-full text-[11px] p-1.5 rounded-lg border border-slate-200 bg-white mt-1"
                />

                {problemForm.imageUrl && (
                  <div className="rounded-xl overflow-hidden bg-slate-950 h-28 flex items-center justify-center border mt-2 relative">
                    <img src={problemForm.imageUrl} alt="Aperçu" className="w-full h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => setZoomModal({ isOpen: true, url: problemForm.imageUrl, title: 'Aperçu Problème' })}
                      className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-md text-[10px]"
                    >
                      <ZoomIn className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-rose-950 block mb-0.5">
                  Mention du problème dans la base (comparée à la saisie élève) : <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows={2}
                  value={problemForm.expectedProblemDescription}
                  onChange={e => setProblemForm({ ...problemForm, expectedProblemDescription: e.target.value })}
                  placeholder="Ex : Le mur bloque l'air frais, créant une poche d'air chaud stagnant sur les animaux..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>

            {/* Photo Solution associée */}
            <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2.5">
              <span className="text-xs font-black text-emerald-950 uppercase tracking-wide block">
                2. Photo Solution Associée (Écran 2)
              </span>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Titre de la solution :</label>
                <input
                  type="text"
                  value={problemForm.solutionTitle}
                  onChange={e => setProblemForm({ ...problemForm, solutionTitle: e.target.value })}
                  placeholder="Ex : Filet brise-vent déroulant amovible"
                  className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Photo de la solution :</label>
                <label className="w-full text-center py-2 px-3 bg-white text-emerald-800 rounded-xl text-xs font-bold border border-slate-300 cursor-pointer block">
                  <span>📷 Télécharger la photo solution</span>
                  <input
                    type="file"
                    ref={solImgInputRef}
                    accept="image/*"
                    onChange={e => handleImageUpload(e, 'solution')}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  value={problemForm.solutionImageUrl}
                  onChange={e => setProblemForm({ ...problemForm, solutionImageUrl: e.target.value })}
                  placeholder="Ou URL image solution..."
                  className="w-full text-[11px] p-1.5 rounded-lg border border-slate-200 bg-white mt-1"
                />

                {problemForm.solutionImageUrl && (
                  <div className="rounded-xl overflow-hidden bg-slate-950 h-28 flex items-center justify-center border mt-2 relative">
                    <img src={problemForm.solutionImageUrl} alt="Aperçu solution" className="w-full h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => setZoomModal({ isOpen: true, url: problemForm.solutionImageUrl, title: 'Aperçu Solution' })}
                      className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-md text-[10px]"
                    >
                      <ZoomIn className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-emerald-950 block mb-0.5">
                  Mention de l'amélioration dans la base (comparée à la saisie élève) : <span className="text-emerald-700">*</span>
                </label>
                <textarea
                  rows={2}
                  value={problemForm.solutionExpectedImprovement}
                  onChange={e => setProblemForm({ ...problemForm, solutionExpectedImprovement: e.target.value })}
                  placeholder="Ex : L'ouverture avec filet permet à la brise d'aérer toute la stabulation et d'abaisser la température..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => setIsEditingProblem(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveProblem}
                className="flex-1 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/20"
              >
                <Check className="w-4 h-4" />
                <span>Enregistrer</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={startCreateProblem}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Ajouter une photo problème & solution</span>
            </button>

            <div className="space-y-2">
              {problems.map((prob) => {
                const cat = categories.find(c => c.id === prob.categoryId);
                return (
                  <div
                    key={prob.id}
                    className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={prob.imageUrl}
                        alt={prob.title}
                        onClick={() => setZoomModal({ isOpen: true, url: prob.imageUrl, title: prob.title })}
                        className="w-12 h-12 rounded-xl object-cover border shrink-0 cursor-pointer"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {cat ? `${cat.icon} ${cat.name}` : 'Rubrique'}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900 truncate mt-0.5">
                          {prob.title}
                        </h4>
                        <span className="text-[10px] text-slate-500 block truncate">
                          Solution : {prob.solution.title}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteProblem(prob.id)}
                      className="p-2 text-slate-400 hover:text-rose-600"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )
      )}

      {/* ======================================================== */}
      {/* ONGLET 2 : RUBRIQUES */}
      {/* ======================================================== */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
          <div className="space-y-1">
            <h3 className="font-extrabold text-sm text-slate-900">
              Définir vos Rubriques
            </h3>
            <p className="text-xs text-slate-500">
              Adaptez les catégories selon les photos d'élevages dont vous disposez.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-slate-700 block">Nouvelle rubrique :</span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newCatIcon}
                onChange={e => setNewCatIcon(e.target.value)}
                placeholder="Émoji"
                className="w-12 text-center text-sm p-2 rounded-xl border border-slate-300 bg-white"
              />
              <input
                type="text"
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                placeholder="Nom (ex : Brumisation)"
                className="flex-1 text-xs p-2 rounded-xl border border-slate-300 bg-white"
              />
            </div>
            <button
              onClick={handleAddCategory}
              className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter cette rubrique</span>
            </button>
          </div>

          <div className="space-y-2">
            {categories.map(cat => {
              const count = problems.filter(p => p.categoryId === cat.id).length;
              return (
                <div
                  key={cat.id}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{cat.icon || '📁'}</span>
                    <span className="font-bold text-slate-800">{cat.name}</span>
                    <span className="text-[10px] text-slate-400">({count} cas)</span>
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1 text-slate-400 hover:text-rose-600"
                    title="Supprimer la rubrique"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ONGLET 3 : RÉGLAGE DE LA SÉRIE & DÉPLOIEMENT ANDROID */}
      {/* ======================================================== */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
          <div className="space-y-1">
            <h3 className="font-extrabold text-sm text-slate-900">
              Paramètres de la Série d'Exercices
            </h3>
            <p className="text-xs text-slate-500">
              Configurez le nombre de photos problèmes proposées aux élèves par session de jeu.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-800 block">
              Nombre de photos par série :
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[3, 5, 10].map(nb => (
                <button
                  key={nb}
                  onClick={() => handleSaveSettings(nb)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    seriesLength === nb
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {nb} photos {nb === 10 ? '(Standard)' : ''}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 italic">
              Actuellement : une série comporte <strong>{seriesLength} photos</strong> avec un bilan bienveillant à la fin.
            </p>
          </div>

          {/* Guide d'installation Android APK pour les élèves */}
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-900 font-bold">
                <Smartphone className="w-4 h-4 text-emerald-700" />
                <span>Tester sur Mobile & Fichier APK</span>
              </div>
              <button
                onClick={() => setShowApkModal(true)}
                className="px-2.5 py-1 bg-emerald-700 text-white rounded-lg font-bold text-[11px] shadow-xs hover:bg-emerald-800"
              >
                Afficher QR Code / APK
              </button>
            </div>
            <p className="text-emerald-950/80 leading-relaxed text-[11px]">
              • <strong>Installation directe (PWA) :</strong> Projetez le QR Code en classe. Les élèves le scannent et installent l'application en 1 clic sans passer par un store.
            </p>
            <p className="text-emerald-950/80 leading-relaxed text-[11px]">
              • <strong>Fichier .APK autonome :</strong> Vous pouvez générer un fichier APK téléchargeable pour distribution par clé USB ou ENT.
            </p>
          </div>
        </div>
      )}

      {/* Modal APK Android pour enseignant */}
      <AndroidApkModal
        isOpen={showApkModal}
        onClose={() => setShowApkModal(false)}
      />
    </div>
  );
};
