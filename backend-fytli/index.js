/**
 * Point d'entrée du serveur Backend Fytli
 * Serveur Express avec MySQL pour gérer les programmes sportifs personnalisés
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();

const { testConnection, pool } = require('./db');
const { logger } = require('./config/logger');
const notificationScheduler = require('./services/notificationScheduler');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const programsRoutes = require('./routes/programs');
const sessionsRoutes = require('./routes/sessions');
const categoriesRoutes = require('./routes/categories');
const exercisesRoutes = require('./routes/exercises');
const sessionExercisesRoutes = require('./routes/sessionExercises');
const progressRoutes = require('./routes/progress');
const uploadsRoutes = require('./routes/uploads');
const badgesRoutes = require('./routes/badges');
const adminRoutes = require('./routes/admin');
const enrollmentsRoutes = require('./routes/enrollments');
const completionsRoutes = require('./routes/completions');
const publicRoutes = require('./routes/public');
const pushNotificationsRoutes = require('./routes/pushNotifications');
const bodyCompositionRoutes = require('./routes/bodyComposition');
const scheduleRoutes = require('./routes/schedule');
const socialRoutes = require('./routes/social');

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 9001;

// Middlewares
// Configuration CORS pour autoriser frontend local et production
const corsOptions = {
  origin: function (origin, callback) {
    // Liste des origines autorisées 
    const allowedOrigins = [
      // Développement local (tous les ports possibles)
      'http://localhost:5173',           // Frontend local
      'http://localhost:5174',           // Admin local
      'http://localhost:5175',           // Admin local (port alternatif)
      'http://localhost:5183',           // Frontend local (alternatif)
      'http://localhost:5184',           // Admin local (alternatif)
      'http://localhost:3000',           // Alternative locale
      
      // Domaines personnalisés Fytli
      'https://fytli.fr',                // Site principal
      'http://fytli.fr',
      'https://www.fytli.fr',
      'http://www.fytli.fr',
      'https://app.fytli.fr',            // Application
      'http://app.fytli.fr',
      'https://admin.fytli.fr',          // Admin panel
      'http://admin.fytli.fr',
      
      // URLs Render (temporaires)
      'https://fytli-frontend.onrender.com',
      'https://fytli-admin.onrender.com',
      'https://fytli.onrender.com',         // Backend Render (pour tests)
      
      // Variable d'environnement
      process.env.FRONTEND_URL           // Frontend production configurable
    ].filter(Boolean); // Retire les undefined
    
    // Autoriser les requêtes sans origin (Postman, apps mobiles, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // En développement, autoriser quand même
      if (process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Non autorisé par CORS'));
      }
    }
  },
  credentials: true, // Autoriser les cookies/credentials
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions)); // Active CORS avec configuration personnalisée
app.use(express.json()); // Parse le body JSON
app.use(express.urlencoded({ extended: true })); // Parse les données URL-encoded

// Middleware de logging HTTP avec Morgan
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
} else {
  app.use(morgan('dev'));
}

// Servir les fichiers statiques (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route de santé / test
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Backend Fytli API - Serveur fonctionnel',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Routes API
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/programs', programsRoutes);
app.use('/sessions', sessionsRoutes);
app.use('/categories', categoriesRoutes);
app.use('/exercises', exercisesRoutes);
app.use('/session-exercises', sessionExercisesRoutes);
app.use('/progress', progressRoutes);
app.use('/uploads', uploadsRoutes);
app.use('/badges', badgesRoutes);
app.use('/admin', adminRoutes);
app.use('/enrollments', enrollmentsRoutes);
app.use('/completions', completionsRoutes);
app.use('/public', publicRoutes);
app.use('/push', pushNotificationsRoutes);
app.use('/body-composition', bodyCompositionRoutes);
app.use('/schedule', scheduleRoutes);
app.use('/social', socialRoutes);

logger.info('✅ Routes enregistrées avec succès');
logger.info('📍 Route body-composition disponible sur /body-composition');
logger.info('📅 Route schedule disponible sur /schedule');
logger.info('🤝 Route social disponible sur /social (Cercle Fytli)');

// Route 404 - Non trouvé
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
    path: req.path
  });
});

// Middleware de gestion d'erreurs global
app.use((err, req, res, next) => {
  logger.error(`${err.message}`, { stack: err.stack, path: req.path });
  
  // Gestion des erreurs Multer
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'Fichier trop volumineux'
    });
  }
  
  if (err.message && err.message.includes('autorisées')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

/**
 * Exécute les migrations de la base de données en local
 */
const runMigrations = async () => {
  // Ne pas exécuter en production
  if (process.env.NODE_ENV === 'production') {
    console.log('ℹ️  Mode production: migrations désactivées');
    return;
  }

  try {
    console.log('\n📦 Exécution des migrations de base de données...');
    
    // Sélectionner la base de données
    await pool.query(`USE ${process.env.DB_NAME || 'followSport_app'}`);
    console.log(`✅ Base de données sélectionnée: ${process.env.DB_NAME || 'followSport_app'}`);
    
    // Lire le fichier de migration
    const migrationPath = path.join(__dirname, 'database', 'migration_social_features.sql');
    const migrationSQL = await fs.readFile(migrationPath, 'utf8');
    
    // Diviser le fichier en commandes SQL individuelles
    // On ignore les commentaires et on divise par DELIMITER
    const commands = migrationSQL
      .split(/DELIMITER\s+/i)
      .map(block => block.trim())
      .filter(block => block.length > 0);
    
    // Exécuter chaque bloc de commandes
    for (const block of commands) {
      if (block.startsWith('//')) {
        // C'est un nouveau délimiteur, on traite les procédures/fonctions/triggers
        const statements = block.replace(/^\/\/\s*/i, '').split('//');
        for (const stmt of statements) {
          const trimmed = stmt.trim();
          if (trimmed && !trimmed.match(/^(--|\/\*|DELIMITER)/i)) {
            try {
              await pool.query(trimmed);
            } catch (err) {
              // Ignorer les erreurs si la procédure/fonction existe déjà
              if (!err.message.includes('already exists') && !err.code === 'ER_SP_ALREADY_EXISTS') {
                console.warn(`⚠️  Avertissement migration:`, err.message);
              }
            }
          }
        }
      } else {
        // Commandes SQL normales
        const statements = block.split(';').filter(s => {
          const trimmed = s.trim();
          return trimmed.length > 0 && !trimmed.startsWith('--') && !trimmed.startsWith('/*');
        });
        
        for (const stmt of statements) {
          const trimmed = stmt.trim();
          if (trimmed) {
            try {
              await pool.query(trimmed);
            } catch (err) {
              // Ignorer certaines erreurs si les tables/colonnes existent déjà
              if (!err.message.includes('already exists') && 
                  !err.message.includes('Duplicate key name') &&
                  !err.code === 'ER_DUP_FIELDNAME' &&
                  !err.code === 'ER_TABLE_EXISTS_ERROR') {
                console.warn(`⚠️  Avertissement migration:`, err.message);
              }
            }
          }
        }
      }
    }
    
    console.log('✅ Migrations exécutées avec succès\n');
  } catch (error) {
    console.warn('⚠️  Erreur lors des migrations (non bloquante):', error.message);
    // Ne pas bloquer le démarrage du serveur si les migrations échouent
  }
};

// Démarrage du serveur
const startServer = async () => {
  try {
    // Test de connexion à la base de données
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('⚠️  Impossible de se connecter à la base de données');
      console.error('Vérifiez vos variables d\'environnement dans le fichier .env');
      process.exit(1);
    }
    
    // Exécuter les migrations en local uniquement
    await runMigrations();
    
    // Démarrage du serveur HTTP
    app.listen(PORT, () => {
      console.log('\n🚀 =======================================');
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`🚀 URL: http://localhost:${PORT}`);
      console.log(`🚀 Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log('🚀 =======================================\n');
      
      // Démarrer le planificateur de notifications
      notificationScheduler.start();
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

// Lancement du serveur
startServer();

module.exports = app;

