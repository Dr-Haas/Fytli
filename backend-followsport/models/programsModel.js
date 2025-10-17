/**
 * Modèle Programs - Gestion des requêtes SQL pour la table programs
 */

const { pool } = require('../db');

/**
 * Récupère tous les programmes
 * @returns {Promise<Array>} Liste des programmes
 */
const findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM programs ORDER BY created_at DESC');
  return rows;
};

/**
 * Récupère un programme par son ID
 * @param {number} id - ID du programme
 * @returns {Promise<Object|null>} Programme trouvé ou null
 */
const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM programs WHERE id = ?', [id]);
  return rows[0] || null;
};

/**
 * Crée un nouveau programme
 * @param {Object} data - Données du programme
 * @returns {Promise<Object>} Programme créé avec son ID
 */
const create = async (data) => {
  const { title, description, level, duration_weeks, goal } = data;
  
  const [result] = await pool.query(
    `INSERT INTO programs (title, description, level, duration_weeks, goal) 
     VALUES (?, ?, ?, ?, ?)`,
    [title, description, level, duration_weeks, goal]
  );
  
  return {
    id: result.insertId,
    ...data
  };
};

/**
 * Met à jour un programme existant
 * @param {number} id - ID du programme
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise<boolean>} true si mis à jour, false sinon
 */
const update = async (id, data) => {
  const fields = [];
  const values = [];
  
  if (data.title !== undefined) {
    fields.push('title = ?');
    values.push(data.title);
  }
  if (data.description !== undefined) {
    fields.push('description = ?');
    values.push(data.description);
  }
  if (data.level !== undefined) {
    fields.push('level = ?');
    values.push(data.level);
  }
  if (data.duration_weeks !== undefined) {
    fields.push('duration_weeks = ?');
    values.push(data.duration_weeks);
  }
  if (data.goal !== undefined) {
    fields.push('goal = ?');
    values.push(data.goal);
  }
  
  if (fields.length === 0) {
    return false;
  }
  
  values.push(id);
  
  const [result] = await pool.query(
    `UPDATE programs SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  
  return result.affectedRows > 0;
};

/**
 * Supprime un programme
 * @param {number} id - ID du programme
 * @returns {Promise<boolean>} true si supprimé, false sinon
 */
const deleteById = async (id) => {
  const [result] = await pool.query('DELETE FROM programs WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  deleteById
};

