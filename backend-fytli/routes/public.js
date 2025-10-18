/**
 * Routes Publiques - Endpoints accessibles sans authentification
 * Pour la landing page et autres besoins publics
 */

const express = require('express');
const router = express.Router();

/**
 * GET /public/stats - Statistiques publiques de l'application
 * Pour affichage sur la landing page
 */
router.get('/stats', async (req, res) => {
  try {
    const { pool } = require('../db');
    
    // Compter le total d'utilisateurs
    const [totalUsers] = await pool.query('SELECT COUNT(*) as total FROM users');
    
    // Compter le total de programmes
    const [totalPrograms] = await pool.query('SELECT COUNT(*) as total FROM programs');
    
    // Compter le total d'exercices
    const [totalExercises] = await pool.query('SELECT COUNT(*) as total FROM exercises');
    
    // Compter le total de badges
    const [totalBadges] = await pool.query('SELECT COUNT(*) as total FROM badges');
    
    // Compter le total de sessions
    const [totalSessions] = await pool.query('SELECT COUNT(*) as total FROM sessions');
    
    res.status(200).json({
      success: true,
      data: {
        users: totalUsers[0].total,
        programs: totalPrograms[0].total,
        exercises: totalExercises[0].total,
        badges: totalBadges[0].total,
        sessions: totalSessions[0].total
      }
    });
  } catch (error) {
    console.error('Erreur getPublicStats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
});

module.exports = router;

