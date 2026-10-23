import React, { useState, useEffect } from 'react';
import { Category, ProblemItem, SolutionItem, SwipeDecision, GameSettings, CompletedCaseRecord } from '../types';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { 
  Check, 
  X, 
  RotateCcw, 
  ArrowRight, 
  Shuffle, 
  Sparkles, 
  Layers, 
  AlertCircle,
  MessageSquare,
  ZoomIn,
  Award,
  ChevronDown,
  ChevronUp,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateThreeProposedPhotos } from '../utils/storage';
import { PhotoZoomModal } from './PhotoZoomModal';

interface SwipeGameProps {
  categories: Category[];
  problems: ProblemItem[];
  settings: GameSettings;
  onOpenAdmin: () => void;
  isStudentMode: boolean;
}

export const SwipeGame: React.FC<SwipeGameProps> = ({
  categories,
  problems,
  settings,
  onOpenAdmin,
  isStudentMode
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Étape courante :
  // 1 = Écran 1 (Photo problème + saisie obligatoire du constat)
  // 2 = Écran 2 (Photos proposées avec swipe - 3 photos dont la solution et 2 aléatoires)
  // 3 = Écran 3 (Comparaison avec la mention de la base de données pour ce problème)
  // 4 = Écran 4 (Bilan final de la série terminée, ex: 10 cas)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Problème actif
  const [currentProblem, setCurrentProblem] = useState<ProblemItem | null>(null);
  const [studentProblemObservation, setStudentProblemObservation] = useState<string>('');

  // 3 photos proposées pour ce problème
  const [proposedPhotos, setProposedPhotos] = useState<SolutionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [decisions, setDecisions] = useState<SwipeDecision[]>([]);

  // Suivi de la série de photos (ex: 10 cas)
  const [seriesRecords, setSeriesRecords] = useState<CompletedCaseRecord[]>([]);
  const [currentCaseIndexInSeries, setCurrentCaseIndexInSeries] = useState<number>(1);
  const [showSeriesDetails, setShowSeriesDetails] = useState<boolean>(false);

  // Modal de saisie obligatoire d'amélioration quand l'élève retient une photo
  const [retainingSolution, setRetainingSolution] = useState<SolutionItem | null>(null);
  const [improvementText, setImprovementText] = useState<string>('');

  // Modal Zoom / Plein écran sur n'importe quelle photo
  const [zoomModal, setZoomModal] = useState<{
    isOpen: boolean;
    url: string;
    title?: string;
    subtitle?: string;
  }>({
    isOpen: false,
    url: ''
  });

  // Animation swipe
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-16, 16]);
  const opacityRight = useTransform(x, [0, 80], [0, 1]);
  const opacityLeft = useTransform(x, [-80, 0], [1, 0]);

  const targetSeriesLength = settings.seriesLength || 10;

  // Choisir un problème aléatoire
  const pickNextProblemInSeries = (isNewSeries: boolean = false) => {
    let pool = problems;
    if (selectedCategory !== 'all') {
      pool = problems.filter(p => p.categoryId === selectedCategory);
    }
    if (pool.length === 0) {
      pool = problems;
    }
    if (pool.length === 0) {
      setCurrentProblem(null);
      return;
    }

    if (isNewSeries) {
      setSeriesRecords([]);
      setCurrentCaseIndexInSeries(1);
    }

    const randomIndex = Math.floor(Math.random() * pool.length);
    const chosen = pool[randomIndex];
    setCurrentProblem(chosen);

    // Préparer les 3 photos (la vraie solution + 2 aléatoires)
    const three = generateThreeProposedPhotos(chosen, problems);
    setProposedPhotos(three);

    // Réinitialisation pour ce cas
    setStudentProblemObservation('');
    setCurrentIndex(0);
    setDecisions([]);
    setRetainingSolution(null);
    setImprovementText('');
    setStep(1); // Écran 1
  };

  useEffect(() => {
    pickNextProblemInSeries(true);
  }, [selectedCategory, problems]);

  // Validation Écran 1 -> passage à l'Écran 2
  const handleValidateProblemObservation = () => {
    if (!studentProblemObservation.trim()) {
      return;
    }
    setStep(2);
  };

  // Traiter un rejet (swipe gauche)
  const handleReject = () => {
    if (currentIndex >= proposedPhotos.length || !currentProblem) return;
    const currentCard = proposedPhotos[currentIndex];
    const isCorrectDecision = (currentCard.id !== currentProblem.solution.id);

    const newDecision: SwipeDecision = {
      solution: currentCard,
      action: 'rejected',
      isCorrectDecision
    };

    advanceAfterDecision(newDecision);
  };

  // Traiter une intention de retenir (swipe droite)
  const handleInitiateKeep = () => {
    if (currentIndex >= proposedPhotos.length) return;
    const currentCard = proposedPhotos[currentIndex];
    setRetainingSolution(currentCard);
    setImprovementText('');
  };

  // Valider la description de l'amélioration pour la photo retenue
  const handleConfirmKeepWithImprovement = () => {
    if (!retainingSolution || !currentProblem) return;
    if (!improvementText.trim()) {
      return;
    }

    const isCorrectDecision = (retainingSolution.id === currentProblem.solution.id);

    const newDecision: SwipeDecision = {
      solution: retainingSolution,
      action: 'kept',
      isCorrectDecision,
      studentImprovementDescription: improvementText.trim()
    };

    setRetainingSolution(null);
    setImprovementText('');
    advanceAfterDecision(newDecision);
  };

  const advanceAfterDecision = (decision: SwipeDecision) => {
    const nextDecisions = [...decisions, decision];
    setDecisions(nextDecisions);

    if (currentIndex + 1 < proposedPhotos.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Toutes les 3 photos ont été swipées pour ce problème
      // On enregistre ce cas dans l'historique de la série
      if (currentProblem) {
        const isFullyCorrect = nextDecisions.some(
          d => d.action === 'kept' && d.solution.id === currentProblem.solution.id
        );
        const record: CompletedCaseRecord = {
          problem: currentProblem,
          studentObservation: studentProblemObservation,
          decisions: nextDecisions,
          isFullyCorrect
        };
        setSeriesRecords(prev => [...prev, record]);
      }

      setStep(3); // Écran de comparaison pour ce problème
    }
  };

  // Passer au cas suivant de la série ou au bilan final
  const handleProceedAfterComparison = () => {
    if (targetSeriesLength > 0 && currentCaseIndexInSeries >= targetSeriesLength) {
      // Fin de la série de 10 cas !
      setStep(4);
      try {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
      } catch {
        // ignore
      }
    } else {
      // Cas suivant dans la série
      setCurrentCaseIndexInSeries(prev => prev + 1);
      pickNextProblemInSeries(false);
    }
  };

  const handleDragEnd = (_: any, info: any) => {
    const threshold = 70;
    if (info.offset.x > threshold) {
      handleInitiateKeep();
    } else if (info.offset.x < -threshold) {
      handleReject();
    }
  };

  if (!currentProblem) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-sm mx-auto my-12 bg-white rounded-3xl border border-slate-200">
        <AlertCircle className="w-12 h-12 text-amber-500" />
        <h3 className="font-bold text-slate-800">Aucune photo dans la base</h3>
        <p className="text-xs text-slate-500">
          Ajoutez des photos ou réinitialisez les données d'exemple.
        </p>
        <button
          onClick={onOpenAdmin}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
        >
          Ouvrir les paramètres & charger un jeu
        </button>
      </div>
    );
  }

  const currentProposedCard = proposedPhotos[currentIndex];
  const totalCorrectInSeries = seriesRecords.filter(r => r.isFullyCorrect).length;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col min-h-[calc(100vh-80px)] justify-between pb-3 select-none">
      
      {/* Modal Zoom Plein Écran */}
      <PhotoZoomModal
        isOpen={zoomModal.isOpen}
        onClose={() => setZoomModal({ ...zoomModal, isOpen: false })}
        imageUrl={zoomModal.url}
      />

      {/* Barre de Progression de la Série (Cas X / 10) */}
      {step !== 4 && (
        <div className="bg-white rounded-2xl px-3 py-2 border border-slate-200/90 shadow-xs flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-[11px] font-black flex items-center justify-center shadow-xs">
              {currentCaseIndexInSeries}
            </span>
            <div className="leading-none">
              <span className="text-xs font-black text-slate-900">
                Photo {currentCaseIndexInSeries} {targetSeriesLength > 0 ? `sur ${targetSeriesLength}` : ''}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {targetSeriesLength > 0 ? `Série en cours (${Math.round((currentCaseIndexInSeries / targetSeriesLength) * 100)}%)` : 'Mode défi libre'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Score : {totalCorrectInSeries} / {seriesRecords.length}
            </span>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ÉCRAN 1 : PHOTO PROBLÈME + SAISIE OBLIGATOIRE DU CONSTAT */}
      {/* ======================================================== */}
      {step === 1 && (
        <div className="flex-1 flex flex-col justify-between space-y-3 animate-in fade-in">
          {/* Rubrique & Aléatoire */}
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full">
              Écran 1 : Photo Problème
            </span>
            <button
              onClick={() => pickNextProblemInSeries(false)}
              className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
              title="Changer de photo"
            >
              <Shuffle className="w-3 h-3" />
              <span>Autre photo</span>
            </button>
          </div>

          {/* Photo Problème avec bouton Loupe / Zoom Plein Écran */}
          <div className="bg-white rounded-3xl p-3 border border-slate-200/90 shadow-sm space-y-2">
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 h-56 sm:h-64 flex items-center justify-center group">
              <img
                src={currentProblem.imageUrl}
                alt={currentProblem.title}
                onClick={() => setZoomModal({
                  isOpen: true,
                  url: currentProblem.imageUrl
                })}
                className="w-full h-full object-contain cursor-pointer"
              />

              {/* Bouton Agrandir discret */}
              <button
                onClick={() => setZoomModal({
                  isOpen: true,
                  url: currentProblem.imageUrl
                })}
                className="absolute top-2.5 right-2.5 bg-black/60 hover:bg-black/90 text-white p-2 rounded-xl backdrop-blur-xs flex items-center gap-1 text-[11px] font-bold shadow-md"
                title="Plein écran"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-3 pointer-events-none">
                <h2 className="text-white font-extrabold text-xs sm:text-sm leading-snug drop-shadow-md">
                  {currentProblem.title}
                </h2>
              </div>
            </div>
          </div>

          {/* Saisie obligatoire de ce que l'élève constate */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-2">
            <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Que constatez-vous sur cette photo ?</span>
              <span className="text-rose-500">*</span>
            </label>
            <p className="text-[11px] text-slate-500">
              Décrivez ce qui semble poser problème :
            </p>
            <textarea
              rows={3}
              value={studentProblemObservation}
              onChange={(e) => setStudentProblemObservation(e.target.value)}
              placeholder="Ex : Le mur en parpaings est fermé et bloque l'air, les vaches ont chaud et halètent..."
              className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            />
          </div>

          {/* Bouton pour passer à l'écran 2 */}
          <button
            onClick={handleValidateProblemObservation}
            disabled={!studentProblemObservation.trim()}
            className={`w-full py-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all ${
              studentProblemObservation.trim()
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-700/20 active:scale-98'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>Valider mon constat & voir les solutions</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* ÉCRAN 2 : 3 PHOTOS PROPOSÉES AVEC SWIPE + ZOOM POSSIBLE */}
      {/* ======================================================== */}
      {step === 2 && (
        <div className="flex-1 flex flex-col justify-between relative animate-in fade-in">
          {/* Rappel du problème avec miniature zoomable */}
          <div className="bg-white rounded-2xl p-2 border border-slate-200 flex items-center gap-2.5 mb-2 shadow-xs">
            <div className="relative group shrink-0">
              <img
                src={currentProblem.imageUrl}
                alt="Problème"
                onClick={() => setZoomModal({
                  isOpen: true,
                  url: currentProblem.imageUrl,
                  title: currentProblem.title,
                  subtitle: 'Photo Problème'
                })}
                className="w-11 h-11 rounded-xl object-cover border cursor-pointer"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-extrabold uppercase text-rose-800 bg-rose-50 px-2 py-0.2 rounded-full">
                Problème :
              </span>
              <p className="text-xs font-bold text-slate-800 truncate mt-0.5">
                {currentProblem.title}
              </p>
              <p className="text-[10px] text-slate-500 truncate italic">
                Votre constat : « {studentProblemObservation} »
              </p>
            </div>
          </div>

          {/* Indicateur de la photo candidate (1/3, 2/3, 3/3) */}
          <div className="text-center mb-1">
            <span className="text-[11px] font-bold text-slate-500">
              Photo proposée {currentIndex + 1} sur {proposedPhotos.length}
            </span>
          </div>

          {/* Carte Swipeable */}
          <div className="relative w-full h-[310px] sm:h-[330px] flex items-center justify-center my-auto">
            <AnimatePresence mode="wait">
              {currentProposedCard && (
                <motion.div
                  key={currentProposedCard.id}
                  style={{ x, rotate }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={handleDragEnd}
                  whileTap={{ cursor: 'grabbing' }}
                  initial={{ scale: 0.95, opacity: 0, y: 15 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute w-full h-full bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden flex flex-col cursor-grab active:cursor-grabbing"
                >
                  {/* Badges de swipe */}
                  <motion.div
                    style={{ opacity: opacityRight }}
                    className="absolute top-4 right-4 z-20 bg-emerald-600 text-white font-black text-xs sm:text-sm px-3.5 py-1.5 rounded-full border-2 border-white shadow-lg pointer-events-none transform rotate-12"
                  >
                    RETENIR ✅
                  </motion.div>

                  <motion.div
                    style={{ opacity: opacityLeft }}
                    className="absolute top-4 left-4 z-20 bg-rose-600 text-white font-black text-xs sm:text-sm px-3.5 py-1.5 rounded-full border-2 border-white shadow-lg pointer-events-none transform -rotate-12"
                  >
                    REJETER ❌
                  </motion.div>

                  {/* Bouton Plein écran discret */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoomModal({
                        isOpen: true,
                        url: currentProposedCard.imageUrl
                      });
                    }}
                    className="absolute top-3 left-3 z-10 bg-black/60 hover:bg-black/90 text-white p-2 rounded-xl text-xs flex items-center justify-center backdrop-blur-xs shadow-md"
                    title="Plein écran"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>

                  {/* Image candidate */}
                  <div className="relative flex-1 bg-slate-900 flex items-center justify-center overflow-hidden">
                    <img
                      src={currentProposedCard.imageUrl}
                      alt={currentProposedCard.title}
                      className="w-full h-full object-contain pointer-events-none"
                    />
                  </div>

                  {/* Titre */}
                  <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm text-slate-800 leading-snug">
                      {currentProposedCard.title}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Boutons d'action tactiles */}
          <div className="flex items-center justify-center gap-4 mt-3">
            <button
              onClick={handleReject}
              className="flex-1 py-3 px-3 bg-rose-50 hover:bg-rose-100 active:scale-95 text-rose-700 font-bold rounded-2xl border-2 border-rose-200 flex items-center justify-center gap-2 shadow-xs"
            >
              <div className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center">
                <X className="w-4 h-4 stroke-[3]" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-black">Rejeter</span>
                <span className="text-[10px] text-rose-600 font-normal">Inutile / Aléatoire</span>
              </div>
            </button>

            <button
              onClick={handleInitiateKeep}
              className="flex-1 py-3 px-3 bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-800 font-bold rounded-2xl border-2 border-emerald-200 flex items-center justify-center gap-2 shadow-xs"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-black">Retenir</span>
                <span className="text-[10px] text-emerald-700 font-normal">C'est une solution</span>
              </div>
            </button>
          </div>

          {/* MODAL DE SAISIE DE L'AMÉLIORATION QUAND ON RETIENT */}
          {retainingSolution && (
            <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 animate-in fade-in duration-150">
              <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-3.5 border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <img
                    src={retainingSolution.imageUrl}
                    alt={retainingSolution.title}
                    className="w-12 h-12 rounded-xl object-cover border shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Solution retenue
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 mt-0.5 line-clamp-1">
                      {retainingSolution.title}
                    </h4>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-800 block">
                    En quoi cette photo constitue-t-elle une amélioration ? <span className="text-rose-500">*</span>
                  </label>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Décrivez ce qui améliore la situation par rapport au problème constaté :
                  </p>
                  <textarea
                    rows={3}
                    autoFocus
                    value={improvementText}
                    onChange={(e) => setImprovementText(e.target.value)}
                    placeholder="Ex : L'ouverture avec filet permet à la brise d'aérer toute la stabulation..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => { setRetainingSolution(null); setImprovementText(''); }}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleConfirmKeepWithImprovement}
                    disabled={!improvementText.trim()}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs ${
                      improvementText.trim()
                        ? 'bg-emerald-700 hover:bg-emerald-800'
                        : 'bg-slate-300 cursor-not-allowed'
                    }`}
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* ÉCRAN 3 : COMPARAISON AVEC LES MENTIONS DE LA BASE */}
      {/* ======================================================== */}
      {step === 3 && (
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-md space-y-4 animate-in fade-in">
          <div className="text-center space-y-0.5">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 mx-auto">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-black text-sm sm:text-base text-slate-900">
              Bilan & Comparaison des Mentions
            </h3>
            <p className="text-[11px] text-slate-500">
              Photo {currentCaseIndexInSeries} {targetSeriesLength > 0 ? `sur ${targetSeriesLength}` : ''}
            </p>
          </div>

          {/* Comparaison 1 : Sur le problème */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                Constat du problème
              </span>
              <button
                onClick={() => setZoomModal({
                  isOpen: true,
                  url: currentProblem.imageUrl,
                  title: currentProblem.title,
                  subtitle: 'Photo Problème'
                })}
                className="text-[10px] text-emerald-700 hover:underline flex items-center gap-0.5 font-bold"
              >
                <ZoomIn className="w-3 h-3" />
                <span>Voir photo</span>
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-0.5">
              <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wide">
                Votre constat :
              </span>
              <p className="text-slate-800 italic">« {studentProblemObservation} »</p>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-0.5">
              <span className="text-[10px] font-extrabold text-emerald-950 uppercase tracking-wide">
                Mention de l'éleveur dans la base :
              </span>
              <p className="text-emerald-900 font-medium leading-relaxed">
                {currentProblem.expectedProblemDescription}
              </p>
            </div>
          </div>

          {/* Comparaison 2 : Sur les solutions */}
          <div className="space-y-2">
            <span className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">2</span>
              Solutions & Améliorations retenues
            </span>

            <div className="space-y-2">
              {decisions.map((dec, idx) => {
                const isReal = (dec.solution.id === currentProblem.solution.id);
                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-2xl border text-xs space-y-1.5 ${
                      dec.isCorrectDecision
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : 'bg-amber-50/60 border-amber-200'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <img
                        src={dec.solution.imageUrl}
                        alt={dec.solution.title}
                        onClick={() => setZoomModal({
                          isOpen: true,
                          url: dec.solution.imageUrl,
                          title: dec.solution.title,
                          subtitle: isReal ? 'Solution associée' : 'Photo aléatoire'
                        })}
                        className="w-10 h-10 rounded-lg object-cover border shrink-0 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900 truncate">
                            {dec.solution.title}
                          </h4>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                            dec.isCorrectDecision ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-900'
                          }`}>
                            {dec.isCorrectDecision ? 'Correct ✅' : 'À ajuster ⚠️'}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 block">
                          Vous avez : <strong>{dec.action === 'kept' ? 'Retenu' : 'Rejeté'}</strong> cette photo
                          {isReal ? ' (C\'était la solution associée)' : ' (C\'était une photo aléatoire)'}
                        </span>
                      </div>
                    </div>

                    {dec.action === 'kept' && (
                      <div className="pt-1.5 border-t border-slate-200 space-y-1 text-[11px]">
                        <div className="p-2 bg-white rounded-lg border border-slate-200">
                          <span className="text-[9px] font-bold text-slate-500 uppercase block">
                            Votre description de l'amélioration :
                          </span>
                          <p className="text-slate-800 italic">« {dec.studentImprovementDescription} »</p>
                        </div>
                        <div className="p-2 bg-emerald-100/60 rounded-lg border border-emerald-200">
                          <span className="text-[9px] font-bold text-emerald-950 uppercase block">
                            Mention dans la base de données :
                          </span>
                          <p className="text-emerald-950 font-medium">
                            {dec.solution.expectedImprovement}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bouton pour continuer la série */}
          <button
            onClick={handleProceedAfterComparison}
            className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20"
          >
            <span>
              {targetSeriesLength > 0 && currentCaseIndexInSeries >= targetSeriesLength
                ? 'Voir le bilan final de la série 🏆'
                : 'Passer à la photo suivante ➡️'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* ÉCRAN 4 : BILAN FINAL BIENVEILLANT DE LA SÉRIE (10 CAS) */}
      {/* ======================================================== */}
      {step === 4 && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md space-y-4 animate-in fade-in">
          {/* Célébration bienveillante */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 text-white mx-auto shadow-md shadow-emerald-700/20">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="font-black text-lg text-slate-900">
              Série de {seriesRecords.length} photos terminée !
            </h3>
            <p className="text-xs text-slate-500">
              Bravo pour votre implication dans l'adaptation des élevages laitiers !
            </p>
          </div>

          {/* Score valorisant */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-900 text-white text-center shadow-inner space-y-1">
            <span className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wide block">
              Score de réussite de la série
            </span>
            <div className="text-4xl font-black text-white">
              {totalCorrectInSeries} <span className="text-xl text-emerald-300 font-normal">/ {seriesRecords.length}</span>
            </div>
            <p className="text-xs text-emerald-100 pt-1">
              {totalCorrectInSeries >= seriesRecords.length * 0.8
                ? '🌟 Excellent coup d\'œil ! Vous identifiez parfaitement les bons aménagements.'
                : totalCorrectInSeries >= seriesRecords.length * 0.5
                ? '👏 Très bon travail ! Vos observations techniques progressent bien.'
                : '💡 Un bel entraînement ! Prenez le temps de revoir les comparaisons ci-dessous.'}
            </p>
          </div>

          {/* Détails dépliables de toutes les photos de la série */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowSeriesDetails(!showSeriesDetails)}
              className="w-full p-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-bold text-slate-700"
            >
              <span>Récapitulatif des {seriesRecords.length} cas de la série</span>
              {showSeriesDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showSeriesDetails && (
              <div className="p-3 space-y-2.5 max-h-64 overflow-y-auto bg-white border-t border-slate-200">
                {seriesRecords.map((rec, i) => (
                  <div key={i} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 text-xs flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={rec.problem.imageUrl} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0">
                        <span className="font-bold text-slate-800 block truncate">{rec.problem.title}</span>
                        <span className="text-[10px] text-slate-500 truncate block italic">« {rec.studentObservation} »</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      rec.isFullyCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rec.isFullyCorrect ? 'Réussi ✅' : 'À revoir ⚠️'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommencer une nouvelle série */}
          <button
            onClick={() => pickNextProblemInSeries(true)}
            className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 active:scale-98"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Lancer une nouvelle série de {targetSeriesLength} photos</span>
          </button>
        </div>
      )}

      {/* Mini barre inférieure */}
      {!isStudentMode && (
        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 px-2">
          <span>Série de {targetSeriesLength} photos</span>
          <button onClick={onOpenAdmin} className="text-emerald-700 font-semibold hover:underline">
            ⚙️ Paramètres & Photos
          </button>
        </div>
      )}
    </div>
  );
};
