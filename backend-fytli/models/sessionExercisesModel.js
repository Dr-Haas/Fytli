/**
 * Modèle SessionExercises - Gestion des requêtes SQL pour la table session_exercises
 */

const { pool } = require('../db');

/**
 * Récupère toutes les associations session-exercice
 * @returns {Promise<Array>} Liste des associations
 */
const findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM session_exercises ORDER BY session_id, `order` ASC');
  return rows;
};

/**
 * Récupère une association par son ID
 * @param {number} id - ID de l'association
 * @returns {Promise<Object|null>} Association trouvée ou null
 */
const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM session_exercises WHERE id = ?', [id]);
  return rows[0] || null;
};

/**
 * Récupère tous les exercices d'une session spécifique
 * @param {number} sessionId - ID de la session
 * @returns {Promise<Array>} Liste des exercices de la session
 */
const findBySessionId = async (sessionId) => {
  const [rows] = await pool.query(
    `SELECT se.*, e.name as exercise_name
     FROM session_exercises se
     LEFT JOIN exercises e ON se.exercise_id = e.id
     WHERE se.session_id = ?
     ORDER BY se.\`order\` ASC`,
    [sessionId]
  );
  return rows;
};

/**
 * Crée une nouvelle association session-exercice
 * @param {Object} data - Données de l'association
 * @returns {Promise<Object>} Association créée avec son ID
 */
const create = async (data) => {
  const { 
    session_id, 
    exercise_id, 
    order_index, 
    sets, 
    reps, 
    weight_kg,
    tempo,
    rest_time_sec,
    rest_sec
  } = data;
  
  // rest_time_sec (frontend) -> rest_sec (DB)
  const finalRestSec = rest_sec !== undefined ? rest_sec : rest_time_sec;
  
  const [result] = await pool.query(
    `INSERT INTO session_exercises (session_id, exercise_id, \`order\`, sets, reps, weight_kg, tempo, rest_sec) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [session_id, exercise_id, order_index, sets, reps, weight_kg, tempo, finalRestSec]
  );
  
  return {
    id: result.insertId,
    session_id,
    exercise_id,
    order: order_index,
    sets,
    reps,
    weight_kg,
    tempo,
    rest_sec: finalRestSec
  };
};

/**
 * Met à jour une association existante
 * @param {number} id - ID de l'association
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise<boolean>} true si mis à jour, false sinon
 */
const update = async (id, data) => {
  const fields = [];
  const values = [];
  
  if (data.session_id !== undefined) {
    fields.push('session_id = ?');
    values.push(data.session_id);
  }
  if (data.exercise_id !== undefined) {
    fields.push('exercise_id = ?');
    values.push(data.exercise_id);
  }
  if (data.order_index !== undefined) {
    fields.push('`order` = ?');
    values.push(data.order_index);
  }
  if (data.sets !== undefined) {
    fields.push('sets = ?');
    values.push(data.sets);
  }
  if (data.reps !== undefined) {
    fields.push('reps = ?');
    values.push(data.reps);
  }
  if (data.weight_kg !== undefined) {
    fields.push('weight_kg = ?');
    values.push(data.weight_kg);
  }
  if (data.tempo !== undefined) {
    fields.push('tempo = ?');
    values.push(data.tempo);
  }
  if (data.rest_time_sec !== undefined) {
    fields.push('rest_sec = ?');
    values.push(data.rest_time_sec);
  }
  if (data.rest_sec !== undefined) {
    fields.push('rest_sec = ?');
    values.push(data.rest_sec);
  }
  
  if (fields.length === 0) {
    return false;
  }
  
  values.push(id);
  
  const [result] = await pool.query(
    `UPDATE session_exercises SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  
  return result.affectedRows > 0;
};

/**
 * Supprime une association
 * @param {number} id - ID de l'association
 * @returns {Promise<boolean>} true si supprimé, false sinon
 */
const deleteById = async (id) => {
  const [result] = await pool.query('DELETE FROM session_exercises WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

module.exports = {
  findAll,
  findById,
  findBySessionId,
  create,
  update,
  deleteById
};

