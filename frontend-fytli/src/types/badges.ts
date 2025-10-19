/**
 * Types pour le système de badges Fytli
 */

export type BadgeId = 
  | 'constance'
  | 'progression'
  | 'serenite'
  | 'niveau_superieur'
  | 'sante_cardiaque'
  | 'routine_matinale'
  | 'routine_soir'
  | 'objectif_atteint'
  | 'challenge_reussi'
  | 'esprit_fytli';

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  requirement: string;
  category: 'routine' | 'performance' | 'health' | 'achievement';
  is_secret?: boolean;
}

export interface UserBadge {
  badge_id: BadgeId;
  earned_at: string;
  progress?: number; // 0-100 pour les badges en cours
  // Données enrichies du badge
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  gradient?: string;
}

export const BADGES: Record<BadgeId, Badge> = {
  constance: {
    id: 'constance',
    name: 'Constance',
    description: 'Enchaîne 7 jours d\'entraînement sans interruption',
    icon: '🔥',
    color: '#FF4D3A',
    gradient: 'from-fytli-red to-fytli-orange',
    requirement: '7 jours consécutifs',
    category: 'routine',
  },
  progression: {
    id: 'progression',
    name: 'Progression',
    description: 'Améliore tes performances de 20%',
    icon: '💪',
    color: '#FF8A3D',
    gradient: 'from-fytli-orange to-amber-500',
    requirement: '+20% de performances',
    category: 'performance',
  },
  serenite: {
    id: 'serenite',
    name: 'Sérénité',
    description: 'Complète 5 séances de stretching ou yoga',
    icon: '🧘',
    color: '#FBFAF7',
    gradient: 'from-fytli-cream to-fytli-orange',
    requirement: '5 séances zen',
    category: 'health',
  },
  niveau_superieur: {
    id: 'niveau_superieur',
    name: 'Niveau Supérieur',
    description: 'Passe du niveau débutant à intermédiaire',
    icon: '🚀',
    color: '#FF6B3D',
    gradient: 'from-fytli-red via-fytli-orange to-amber-400',
    requirement: 'Level up',
    category: 'achievement',
  },
  sante_cardiaque: {
    id: 'sante_cardiaque',
    name: 'Santé Cardiaque',
    description: 'Maintiens ton pouls dans la zone optimale pendant 30 min',
    icon: '❤️',
    color: '#FF4D3A',
    gradient: 'from-red-500 to-fytli-red',
    requirement: '30 min zone optimale',
    category: 'health',
  },
  routine_matinale: {
    id: 'routine_matinale',
    name: 'Routine Matinale',
    description: 'Entraîne-toi avant 9h pendant 5 jours',
    icon: '🌅',
    color: '#FFB84D',
    gradient: 'from-amber-400 to-fytli-orange',
    requirement: '5 matins actifs',
    category: 'routine',
  },
  routine_soir: {
    id: 'routine_soir',
    name: 'Routine du Soir',
    description: 'Entraîne-toi après 18h pendant 5 jours',
    icon: '🌙',
    color: '#8B7355',
    gradient: 'from-amber-600 to-fytli-orange',
    requirement: '5 soirs actifs',
    category: 'routine',
  },
  objectif_atteint: {
    id: 'objectif_atteint',
    name: 'Objectif Atteint',
    description: 'Atteins ton objectif de la semaine',
    icon: '🎯',
    color: '#2BB673',
    gradient: 'from-fytli-success to-green-600',
    requirement: 'Objectif hebdo',
    category: 'achievement',
  },
  challenge_reussi: {
    id: 'challenge_reussi',
    name: 'Challenge Réussi',
    description: 'Complète un programme d\'entraînement du début à la fin',
    icon: '🏆',
    color: '#FFD700',
    gradient: 'from-yellow-400 to-amber-600',
    requirement: 'Programme complété',
    category: 'achievement',
  },
  esprit_fytli: {
    id: 'esprit_fytli',
    name: 'Esprit Fytli',
    description: 'Incarne la philosophie Fytli : régularité, bienveillance, progression',
    icon: '💫',
    color: '#FF6B3D',
    gradient: 'from-fytli-red via-fytli-orange to-amber-400',
    requirement: 'Badge légendaire',
    category: 'achievement',
  },
};

export const BADGE_CATEGORIES = {
  routine: {
    name: 'Routine',
    icon: '📅',
    color: 'text-blue-600',
  },
  performance: {
    name: 'Performance',
    icon: '💪',
    color: 'text-fytli-orange',
  },
  health: {
    name: 'Santé',
    icon: '❤️',
    color: 'text-fytli-success',
  },
  achievement: {
    name: 'Accomplissement',
    icon: '🏆',
    color: 'text-amber-600',
  },
};

