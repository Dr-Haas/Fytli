/**
 * Modèle Sessions - Gestion des requêtes SQL pour la table sessions
 */

const { pool } = require('../db');

/**
 * Récupère toutes les sessions
 * @returns {Promise<Array>} Liste des sessions
 */
const findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM sessions ORDER BY `order_index` ASC');
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
    'SELECT * FROM sessions WHERE program_id = ? ORDER BY `order_index` ASC',
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
  const { program_id, title, order, order_index, day_number } = data;
  
  // Utiliser order_index en priorité, sinon order, sinon day_number
  const finalOrderIndex = order_index !== undefined ? order_index : (order !== undefined ? order : (day_number || 1));
  
  const [result] = await pool.query(
    `INSERT INTO sessions (program_id, title, order_index) 
     VALUES (?, ?, ?)`,
    [program_id, title, finalOrderIndex]
  );
  
  return {
    id: result.insertId,
    program_id,
    title,
    order_index: finalOrderIndex
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
  if (data.title !== undefined) {
    fields.push('title = ?');
    values.push(data.title);
  }
  if (data.order !== undefined) {
    fields.push('`order` = ?');
    values.push(data.order);
  }
  if (data.day_number !== undefined && data.order === undefined) {
    fields.push('`order` = ?');
    values.push(data.day_number);
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

