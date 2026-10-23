import { Category, ProblemItem, SolutionItem } from '../types';
import { BARN_ILLUSTRATIONS } from './barnImages';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'ventilation', name: 'Ventilation & Murs', icon: '💨' },
  { id: 'toiture', name: 'Toiture & Rayonnement', icon: '☀️' },
  { id: 'eau', name: 'Abreuvoirs & Débit', icon: '💧' },
  { id: 'attente', name: 'Aire d\'attente traite', icon: '🐄' }
];

export const DEFAULT_PROBLEMS: ProblemItem[] = [
  {
    id: 'prob-1-mur-ventilation',
    categoryId: 'ventilation',
    title: 'Mur plein bloquant la circulation d\'air',
    imageUrl: BARN_ILLUSTRATIONS.pignon_plein_etouffant,
    expectedProblemDescription: 'Le pignon en parpaings pleins bloque totalement le passage du vent. L\'air chaud et l\'humidité dégagés par les vaches stagnent au fond du bâtiment, provoquant halètement et surchauffe.',
    solution: {
      id: 'sol-1-filet',
      title: 'Filets brise-vent déroulants et ouverture du mur',
      imageUrl: BARN_ILLUSTRATIONS.filet_brise_vent_ouvert,
      expectedImprovement: 'L\'ouverture de la paroi avec rideaux déroulants permet à la brise d\'aérer l\'étable, évacue la vapeur d\'eau et apporte un flux d\'air frais continu sur le troupeau.'
    }
  },
  {
    id: 'prob-2-toiture-translucides',
    categoryId: 'toiture',
    title: 'Plaques translucides zénithales surchauffées',
    imageUrl: BARN_ILLUSTRATIONS.translucides_surchauffe,
    expectedProblemDescription: 'Les plaques translucides en toiture sans protection créent un effet de serre direct sur les logettes. Le sol chauffe à plus de 50°C et les vaches refusent de se coucher pour ruminer.',
    solution: {
      id: 'sol-2-blanchiment',
      title: 'Blanchiment réflectif solaire des plaques translucides',
      imageUrl: BARN_ILLUSTRATIONS.blanchiment_translucides,
      expectedImprovement: 'L\'application d\'une couche réflective blanche renvoie plus de 80% des rayons infrarouges vers le ciel, supprimant la surchauffe au sol tout en préservant une lumière diffuse.'
    }
  },
  {
    id: 'prob-3-abreuvoir-soleil',
    categoryId: 'eau',
    title: 'Petit abreuvoir saturé en plein soleil',
    imageUrl: BARN_ILLUSTRATIONS.abreuvoir_surcharge,
    expectedProblemDescription: 'Un seul abreuvoir minuscule à faible débit placé en plein soleil pour tout le troupeau. L\'eau tiédit, des bousculades éclatent et les vaches manquent d\'eau en période de canicule.',
    solution: {
      id: 'sol-3-inox-debit',
      title: 'Grand bac basculant inox grand débit à l\'ombre',
      imageUrl: BARN_ILLUSTRATIONS.abreuvoir_inox_grand_debit,
      expectedImprovement: 'Le bac inox de grande capacité permet à plusieurs vaches de s\'abreuver simultanément à l\'ombre avec une eau toujours fraîche et un renouvellement rapide supérieur à 35 L/min.'
    }
  },
  {
    id: 'prob-4-attente-traite',
    categoryId: 'attente',
    title: 'Vaches entassées sous un toit bas avant traite',
    imageUrl: BARN_ILLUSTRATIONS.attente_traite_etouffante,
    expectedProblemDescription: 'Forte densité d\'animaux serrés sous une toiture basse en tôle non isolée pendant 45 minutes avant la traite. Accumulation aiguë de chaleur corporelle et détresse respiratoire.',
    solution: {
      id: 'sol-4-douchage',
      title: 'Douchage intermittent grosses gouttes + ventilation pulsée',
      imageUrl: BARN_ILLUSTRATIONS.douchage_ventilation_attente,
      expectedImprovement: 'Le mouillage du cuir couplé à une ventilation active évapore l\'eau directement sur la peau de la vache et évacue très rapidement la chaleur accumulée avant la traite.'
    }
  },
  {
    id: 'prob-5-faitage-ferme',
    categoryId: 'ventilation',
    title: 'Faîtage borgne fermé sans extraction de chaleur',
    imageUrl: BARN_ILLUSTRATIONS.faitage_borgne_bloque,
    expectedProblemDescription: 'Absence d\'ouverture au sommet du toit : l\'air chaud monte par convection naturelle et reste bloqué sous la toiture, créant une chape d\'air étouffante au-dessus du troupeau.',
    solution: {
      id: 'sol-5-lanterneau',
      title: 'Lanterneau d\'extraction faîtière ouverte avec pare-pluie',
      imageUrl: BARN_ILLUSTRATIONS.lanterneau_faitiere_ouvert,
      expectedImprovement: 'L\'ouverture du faîtage déclenche l\'effet cheminée continu : l\'air chaud monte et s\'échappe vers le haut, aspirant l\'air frais latéral à travers tout le bâtiment.'
    }
  },
  {
    id: 'prob-6-tole-brulante',
    categoryId: 'toiture',
    title: 'Toiture en bac acier nu non isolée rayonnant à 68°C',
    imageUrl: BARN_ILLUSTRATIONS.tole_brulante_sans_isolation,
    expectedProblemDescription: 'La tôle métallique nue exposée au soleil d\'été chauffe intensément et se comporte comme un immense radiateur infrarouge rayonnant directement sur le dos des vaches.',
    solution: {
      id: 'sol-6-isolation',
      title: 'Isolation sous toiture en panneaux sandwich 40 mm',
      imageUrl: BARN_ILLUSTRATIONS.isolation_sous_toiture,
      expectedImprovement: 'Les panneaux isolants stoppent la transmission de la chaleur solaire, maintiennent la sous-face du toit à température modérée et réduisent la charge thermique sur les animaux de 8 à 10°C.'
    }
  },
  {
    id: 'prob-7-aire-exercice',
    categoryId: 'attente',
    title: 'Aire d\'exercice bétonnée sans ombre aux heures chaudes',
    imageUrl: BARN_ILLUSTRATIONS.cour_exterieure_soleil,
    expectedProblemDescription: 'La dalle extérieure en béton absorbe le plein soleil et restitue une chaleur étouffante. Sans aucun ombrage, les animaux évitent l\'extérieur et s\'agglutinent à l\'intérieur.',
    solution: {
      id: 'sol-7-voiles',
      title: 'Voiles d\'ombrage et auvent de protection solaire',
      imageUrl: BARN_ILLUSTRATIONS.voiles_ombrage_auvent,
      expectedImprovement: 'La pose de toiles d\'ombrage et d\'avancées de toiture bloque 80% des UV, crée une zone de circulation ombragée et permet aux vaches d\'évoluer sans stress.'
    }
  }
];

// Pool de photos aléatoires / distracteurs pour compléter la sélection à 3 photos
export const RANDOM_PHOTO_POOL: SolutionItem[] = [
  {
    id: 'rand-distracteur-fermer',
    title: 'Fermeture hermétique des portes et portails',
    imageUrl: BARN_ILLUSTRATIONS.distracteur_fermeture_hermetique,
    expectedImprovement: 'Fausse idée : Calfeutrer le bâtiment piège l\'humidité et la chaleur des animaux, créant un effet de serre toxique.',
    isDistractor: true
  },
  {
    id: 'rand-distracteur-arroser-litiere',
    title: 'Arrosage direct de la litière de paille au jet',
    imageUrl: BARN_ILLUSTRATIONS.distracteur_arroser_litiere,
    expectedImprovement: 'Fausse idée : Mouiller la paille déclenche une fermentation chaude et multiplie les bactéries responsables des mammites.',
    isDistractor: true
  },
  {
    id: 'rand-brasseurs-air',
    title: 'Brasseurs d\'air hélicoïdaux au-dessus des logettes',
    imageUrl: BARN_ILLUSTRATIONS.brasseur_air_helicoide,
    expectedImprovement: 'Crée une vitesse d\'air de 2 m/s sur le dos des vaches pour rompre la couche d\'air chaud superficielle.',
    isDistractor: false
  }
];
