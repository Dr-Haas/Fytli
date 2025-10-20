/**
 * Formate une durée en minutes en format lisible
 * @param minutes - La durée en minutes
 * @returns Une chaîne formatée (ex: "1h 30min" ou "45min")
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};

/**
 * Formate une date en format lisible
 * @param date - La date à formater
 * @returns Une chaîne formatée (ex: "15 janvier 2024")
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  };
  return d.toLocaleDateString('fr-FR', options);
};

/**
 * Capitalise la première lettre d'une chaîne
 * @param str - La chaîne à capitaliser
 * @returns La chaîne capitalisée
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Vérifie si un email est valide
 * @param email - L'email à vérifier
 * @returns true si l'email est valide
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Vérifie si un mot de passe est valide (minimum 8 caractères)
 * @param password - Le mot de passe à vérifier
 * @returns true si le mot de passe est valide
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

