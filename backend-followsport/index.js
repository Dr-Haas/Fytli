/**
 * Point d'entrée du serveur Backend FollowSport
 * Serveur Express avec MySQL pour gérer les programmes sportifs personnalisés
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const { testConnection } = require('./db');
const { logger } = require('./config/logger');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const programsRoutes = require('./routes/programs');
const sessionsRoutes = require('./routes/sessions');
const categoriesRoutes = require('./routes/categories');
const exercisesRoutes = require('./routes/exercises');
const sessionExercisesRoutes = require('./routes/sessionExercises');
const progressRoutes = require('./routes/progress');
const uploadsRoutes = require('./routes/uploads');

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 9001;

// Middlewares
app.use(cors()); // Active CORS pour toutes les routes
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
    message: 'Backend FollowSport API - Serveur fonctionnel',
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
    
    // Démarrage du serveur HTTP
    app.listen(PORT, () => {
      console.log('\n🚀 =======================================');
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`🚀 URL: http://localhost:${PORT}`);
      console.log(`🚀 Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log('🚀 =======================================\n');
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

// Lancement du serveur
startServer();

module.exports = app;

