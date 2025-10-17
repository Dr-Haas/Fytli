/**
 * Exemple : Contrôleur Programs avec pagination
 * Utilisation des utilitaires de pagination
 */

const programsModel = require('../models/programsModel');
const { getPaginationParams, formatPaginatedResponse } = require('../utils/pagination');
const { pool } = require('../db');

/**
 * Récupère tous les programmes avec pagination
 * GET /programs?page=1&limit=10
 */
const getAllPaginated = async (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    
    // Requête pour compter le total
    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM programs');
    const total = countResult[0].total;
    
    // Requête pour récupérer les programmes paginés
    const [programs] = await pool.query(
      'SELECT * FROM programs ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    
    // Formater la réponse avec métadonnées de pagination
    const response = formatPaginatedResponse(programs, total, page, limit);
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Erreur getAllPaginated programs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des programmes',
      error: error.message
    });
  }
};

module.exports = {
  getAllPaginated
};

