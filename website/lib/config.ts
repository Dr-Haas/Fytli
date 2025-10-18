// Configuration des URLs selon l'environnement

export const config = {
  // URL de l'application frontend
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://app.fytli.fr',
  
  // URL de l'API backend
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.fytli.fr',
  
  // URL du site (landing page)
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://fytli.fr',
};

