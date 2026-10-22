import { Category, ProblemItem, SolutionItem, GameSettings } from '../types';
import { DEFAULT_CATEGORIES, DEFAULT_PROBLEMS, RANDOM_PHOTO_POOL } from '../data/defaultData';

const STORAGE_CATS = 'thermilait_cats_v3';
const STORAGE_PROBS = 'thermilait_probs_v3';
const STORAGE_SETTINGS = 'thermilait_settings_v3';

export const DEFAULT_SETTINGS: GameSettings = {
  seriesLength: 10
};

export function getSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(STORAGE_SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed.seriesLength === 'number' ? parsed : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Erreur sauvegarde réglages', e);
  }
}

export function getCategories(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_CATS);
    if (!raw) {
      localStorage.setItem(STORAGE_CATS, JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export function saveCategories(cats: Category[]): void {
  try {
    localStorage.setItem(STORAGE_CATS, JSON.stringify(cats));
  } catch (e) {
    console.error('Erreur sauvegarde catégories', e);
  }
}

export function getProblems(): ProblemItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_PROBS);
    if (!raw) {
      localStorage.setItem(STORAGE_PROBS, JSON.stringify(DEFAULT_PROBLEMS));
      return DEFAULT_PROBLEMS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PROBLEMS;
  } catch {
    return DEFAULT_PROBLEMS;
  }
}

export function saveProblems(problems: ProblemItem[]): void {
  try {
    localStorage.setItem(STORAGE_PROBS, JSON.stringify(problems));
  } catch (e) {
    console.error('Erreur sauvegarde problèmes', e);
  }
}

/**
 * Génère exactement 3 photos pour le problème courant :
 * - 1 photo issue de la base correspondant à la solution associée à la photo problème
 * - 2 photos tirées aléatoirement parmi les autres photos de la base
 */
export function generateThreeProposedPhotos(
  problem: ProblemItem,
  allProblems: ProblemItem[]
): SolutionItem[] {
  const correctSolution = problem.solution;

  // Créer un vivier d'autres photos potentielles (solutions d'autres problèmes + distracteurs)
  const otherCandidates: SolutionItem[] = [];

  // Solutions des autres problèmes
  allProblems.forEach(p => {
    if (p.id !== problem.id && p.solution && p.solution.id !== correctSolution.id) {
      otherCandidates.push(p.solution);
    }
  });

  // Distracteurs généraux
  RANDOM_PHOTO_POOL.forEach(r => {
    if (r.id !== correctSolution.id) {
      otherCandidates.push(r);
    }
  });

  // Mélanger les autres candidats
  const shuffledOthers = [...otherCandidates].sort(() => Math.random() - 0.5);

  // En retenir 2 distinctes
  const randomPicks = shuffledOthers.slice(0, 2);

  // Assembler les 3 photos et les mélanger
  const threePhotos = [correctSolution, ...randomPicks];
  return threePhotos.sort(() => Math.random() - 0.5);
}

export function resetAllData(): { categories: Category[]; problems: ProblemItem[] } {
  localStorage.setItem(STORAGE_CATS, JSON.stringify(DEFAULT_CATEGORIES));
  localStorage.setItem(STORAGE_PROBS, JSON.stringify(DEFAULT_PROBLEMS));
  return { categories: DEFAULT_CATEGORIES, problems: DEFAULT_PROBLEMS };
}

export function exportBackupJson(): void {
  const data = {
    categories: getCategories(),
    problems: getProblems(),
    exportDate: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `thermilait_banque_photos_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importBackupJson(jsonString: string): { success: boolean; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || !Array.isArray(parsed.categories) || !Array.isArray(parsed.problems)) {
      return { success: false, error: 'Format de fichier non reconnu.' };
    }
    saveCategories(parsed.categories);
    saveProblems(parsed.problems);
    return { success: true };
  } catch (e) {
    return { success: false, error: 'Fichier JSON corrompu ou illisible.' };
  }
}
