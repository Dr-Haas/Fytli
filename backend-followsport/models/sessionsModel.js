/**
 * Modèle Sessions - Gestion des requêtes SQL pour la table sessions
 */

const { pool } = require('../db');

/**
 * Récupère toutes les sessions
 * @returns {Promise<Array>} Liste des sessions
 */
const findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM sessions ORDER BY session_number ASC');
  return rows;
};

/**
 * Récupère une session par son ID
 * @param {number} id - ID de la session
 * @returns {Promise<Object|null>} Session trouvée ou null
 */
const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM sessions WHERE id = ?', [id]);
  return rows[0] || null;
};

/**
 * Récupère toutes les sessions d'un programme spécifique
 * @param {number} programId - ID du programme
 * @returns {Promise<Array>} Liste des sessions du programme
 */
const findByProgramId = async (programId) => {
  const [rows] = await pool.query(
    'SELECT * FROM sessions WHERE program_id = ? ORDER BY session_number ASC',
    [programId]
  );
  return rows;
};

/**
 * Crée une nouvelle session
 * @param {Object} data - Données de la session
 * @returns {Promise<Object>} Session créée avec son ID
 */
const create = async (data) => {
  const { program_id, session_number, name, description, duration_minutes } = data;
  
  const [result] = await pool.query(
    `INSERT INTO sessions (program_id, session_number, name, description, duration_minutes) 
     VALUES (?, ?, ?, ?, ?)`,
    [program_id, session_number, name, description, duration_minutes]
  );
  
  return {
    id: result.insertId,
    ...data
  };
};

/**
 * Met à jour une session existante
 * @param {number} id - ID de la session
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise<boolean>} true si mis à jour, false sinon
 */
const update = async (id, data) => {
  const fields = [];
  const values = [];
  
  if (data.program_id !== undefined) {
    fields.push('program_id = ?');
    values.push(data.program_id);
  }
  if (data.session_number !== undefined) {
    fields.push('session_number = ?');
    values.push(data.session_number);
  }
  if (data.name !== undefined) {
    fields.push('name = ?');
    values.push(data.name);
  }
  if (data.description !== undefined) {
    fields.push('description = ?');
    values.push(data.description);
  }
  if (data.duration_minutes !== undefined) {
    fields.push('duration_minutes = ?');
    values.push(data.duration_minutes);
  }
  
  if (fields.length === 0) {
    return false;
  }
  
  values.push(id);
  
  const [result] = await pool.query(
    `UPDATE sessions SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  
  return result.affectedRows > 0;
};

/**
 * Supprime une session
 * @param {number} id - ID de la session
 * @returns {Promise<boolean>} true si supprimé, false sinon
 */
const deleteById = async (id) => {
  const [result] = await pool.query('DELETE FROM sessions WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

module.exports = {
  findAll,
  findById,
  findByProgramId,
  create,
  update,
  deleteById
};

