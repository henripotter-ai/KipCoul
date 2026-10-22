export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export interface SolutionItem {
  id: string;
  title: string;
  imageUrl: string;
  expectedImprovement: string; // Mention dans la base de ce qui constitue une amélioration
  isDistractor?: boolean;
}

export interface ProblemItem {
  id: string;
  categoryId: string;
  title: string;
  imageUrl: string;
  expectedProblemDescription: string; // Mention saisie lors de l'alimentation dans la base
  solution: SolutionItem; // La vraie solution associée à ce problème
}

export interface SwipeDecision {
  solution: SolutionItem;
  action: 'kept' | 'rejected'; // 'kept' = swipe droite, 'rejected' = swipe gauche
  isCorrectDecision: boolean; // true si kept pour la vraie solution, ou rejected pour aléatoire
  studentImprovementDescription?: string; // Saisie obligatoire si l'élève retient la photo
}

export interface GameSettings {
  seriesLength: number; // 3, 5, 10 ou 0 pour infini
}

export interface CompletedCaseRecord {
  problem: ProblemItem;
  studentObservation: string;
  decisions: SwipeDecision[];
  isFullyCorrect: boolean;
}
