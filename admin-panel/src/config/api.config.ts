// Configuration API pour l'admin-panel

export const API_CONFIG = {
  // URL de l'API selon l'environnement
  baseURL: import.meta.env.VITE_API_URL || getDefaultApiUrl(),
  
  // Timeout des requêtes (30 secondes)
  timeout: 30000,
};

function getDefaultApiUrl(): string {
  // En production, utiliser l'API Render
  if (import.meta.env.PROD) {
    return 'https://fytli-backend.onrender.com';
  }
  
  // En développement, utiliser localhost
  return 'http://localhost:9001';
}

export default API_CONFIG;

