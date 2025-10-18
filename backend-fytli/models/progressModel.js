/**
 * Modèle Progress - Gestion des requêtes SQL pour la table progress
 */

const { pool } = require('../db');

/**
 * Récupère tous les enregistrements de progression
 * @returns {Promise<Array>} Liste des progressions
 */
const findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM progress ORDER BY date DESC');
  return rows;
};

/**
 * Récupère une progression par son ID
 * @param {number} id - ID de la progression
 * @returns {Promise<Object|null>} Progression trouvée ou null
 */
const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM progress WHERE id = ?', [id]);
  return rows[0] || null;
};

/**
 * Récupère toutes les progressions d'un utilisateur
 * @param {number} userId - ID de l'utilisateur
 * @returns {Promise<Array>} Liste des progressions de l'utilisateur
 */
const findByUserId = async (userId) => {
  const [rows] = await pool.query(
    'SELECT * FROM progress WHERE user_id = ? ORDER BY date DESC',
    [userId]
  );
  return rows;
};

/**
 * Récupère les progressions d'un utilisateur pour une session spécifique
 * @param {number} userId - ID de l'utilisateur
 * @param {number} sessionId - ID de la session
 * @returns {Promise<Array>} Liste des progressions
 */
const findByUserAndSession = async (userId, sessionId) => {
  const [rows] = await pool.query(
    'SELECT * FROM progress WHERE user_id = ? AND session_id = ? ORDER BY date DESC',
    [userId, sessionId]
  );
  return rows;
};

/**
 * Crée un nouvel enregistrement de progression
 * @param {Object} data - Données de la progression
 * @returns {Promise<Object>} Progression créée avec son ID
 */
const create = async (data) => {
  const { 
    user_id, 
    session_id, 
    date, 
    duration_minutes, 
    notes, 
    rating 
  } = data;
  
  const [result] = await pool.query(
    `INSERT INTO progress (user_id, session_id, date, duration_minutes, notes, rating) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [user_id, session_id, date, duration_minutes, notes, rating]
  );
  
  return {
    id: result.insertId,
    ...data
  };
};

/**
 * Met à jour une progression existante
 * @param {number} id - ID de la progression
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise<boolean>} true si mis à jour, false sinon
 */
const update = async (id, data) => {
  const fields = [];
  const values = [];
  
  if (data.user_id !== undefined) {
    fields.push('user_id = ?');
    values.push(data.user_id);
  }
  if (data.session_id !== undefined) {
    fields.push('session_id = ?');
    values.push(data.session_id);
  }
  if (data.date !== undefined) {
    fields.push('date = ?');
    values.push(data.date);
  }
  if (data.duration_minutes !== undefined) {
    fields.push('duration_minutes = ?');
    values.push(data.duration_minutes);
  }
  if (data.notes !== undefined) {
    fields.push('notes = ?');
    values.push(data.notes);
  }
  if (data.rating !== undefined) {
    fields.push('rating = ?');
    values.push(data.rating);
  }
  
  if (fields.length === 0) {
    return false;
  }
  
  values.push(id);
  
  const [result] = await pool.query(
    `UPDATE progress SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  
  return result.affectedRows > 0;
};

/**
 * Supprime une progression
 * @param {number} id - ID de la progression
 * @returns {Promise<boolean>} true si supprimé, false sinon
 */
const deleteById = async (id) => {
  const [result] = await pool.query('DELETE FROM progress WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

module.exports = {
  findAll,
  findById,
  findByUserId,
  findByUserAndSession,
  create,
  update,
  deleteById
};

