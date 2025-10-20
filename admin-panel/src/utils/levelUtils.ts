/**
 * Utilitaires pour gérer la conversion entre les anciennes et nouvelles conventions
 * de niveau de difficulté
 */

type LevelEN = 'beginner' | 'intermediate' | 'advanced';
type LevelFR = 'débutant' | 'intermédiaire' | 'avancé';

/**
 * Convertir niveau anglais → français (pour affichage)
 */
export function levelToFrench(level: LevelEN | undefined | null): LevelFR {
  if (!level) return 'débutant';
  
  const map: Record<LevelEN, LevelFR> = {
    beginner: 'débutant',
    intermediate: 'intermédiaire',
    advanced: 'avancé',
  };
  
  return map[level] || 'débutant';
}

/**
 * Convertir niveau français → anglais (pour API)
 */
export function levelToEnglish(level: LevelFR | undefined | null): LevelEN {
  if (!level) return 'beginner';
  
  const map: Record<LevelFR, LevelEN> = {
    débutant: 'beginner',
    intermédiaire: 'intermediate',
    avancé: 'advanced',
  };
  
  return map[level] || 'beginner';
}

/**
 * Obtenir le label français pour affichage
 */
export function getLevelLabel(level: LevelEN | LevelFR | undefined | null): string {
  if (!level) return 'Débutant';
  
  // Si déjà en français
  if (level === 'débutant') return 'Débutant';
  if (level === 'intermédiaire') return 'Intermédiaire';
  if (level === 'avancé') return 'Avancé';
  
  // Sinon convertir depuis anglais
  return levelToFrench(level as LevelEN).charAt(0).toUpperCase() + levelToFrench(level as LevelEN).slice(1);
}

/**
 * Obtenir la classe de badge selon le niveau
 */
export function getLevelBadgeClass(level: LevelEN | LevelFR | undefined | null): string {
  const normalizedLevel = typeof level === 'string' && ['débutant', 'intermédiaire', 'avancé'].includes(level)
    ? levelToEnglish(level as LevelFR)
    : level as LevelEN;
  
  const classes: Record<LevelEN, string> = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-blue-100 text-blue-800',
    advanced: 'bg-purple-100 text-purple-800',
  };
  
  return classes[normalizedLevel as LevelEN] || classes.beginner;
}

