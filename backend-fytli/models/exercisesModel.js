/**
 * Modèle Exercises - Gestion des requêtes SQL pour la table exercises
 */

const { pool } = require('../db');

/**
 * Récupère tous les exercices
 * @returns {Promise<Array>} Liste des exercices
 */
const findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM exercises ORDER BY name ASC');
  return rows;
};

/**
 * Récupère un exercice par son ID
 * @param {number} id - ID de l'exercice
 * @returns {Promise<Object|null>} Exercice trouvé ou null
 */
const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM exercises WHERE id = ?', [id]);
  return rows[0] || null;
};

/**
 * Récupère tous les exercices d'une catégorie spécifique
 * @param {number} categoryId - ID de la catégorie
 * @returns {Promise<Array>} Liste des exercices de la catégorie
 */
const findByCategoryId = async (categoryId) => {
  const [rows] = await pool.query(
    'SELECT * FROM exercises WHERE category_id = ? ORDER BY name ASC',
    [categoryId]
  );
  return rows;
};

/**
 * Crée un nouvel exercice
 * @param {Object} data - Données de l'exercice
 * @returns {Promise<Object>} Exercice créé avec son ID
 */
const create = async (data) => {
  const { 
    name, 
    description, 
    category_id, 
    difficulty, 
    video_url, 
    image_url, 
    instructions 
  } = data;
  
  const [result] = await pool.query(
    `INSERT INTO exercises (name, description, category_id, difficulty, video_url, image_url, instructions) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, description, category_id, difficulty, video_url, image_url, instructions]
  );
  
  return {
    id: result.insertId,
    ...data
  };
};

/**
 * Met à jour un exercice existant
 * @param {number} id - ID de l'exercice
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise<boolean>} true si mis à jour, false sinon
 */
const update = async (id, data) => {
  const fields = [];
  const values = [];
  
  if (data.name !== undefined) {
    fields.push('name = ?');
    values.push(data.name);
  }
  if (data.description !== undefined) {
    fields.push('description = ?');
    values.push(data.description);
  }
  if (data.category_id !== undefined) {
    fields.push('category_id = ?');
    values.push(data.category_id);
  }
  if (data.difficulty !== undefined) {
    fields.push('difficulty = ?');
    values.push(data.difficulty);
  }
  if (data.video_url !== undefined) {
    fields.push('video_url = ?');
    values.push(data.video_url);
  }
  if (data.image_url !== undefined) {
    fields.push('image_url = ?');
    values.push(data.image_url);
  }
  if (data.instructions !== undefined) {
    fields.push('instructions = ?');
    values.push(data.instructions);
  }
  
  if (fields.length === 0) {
    return false;
  }
  
  values.push(id);
  
  const [result] = await pool.query(
    `UPDATE exercises SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  
  return result.affectedRows > 0;
};

/**
 * Supprime un exercice
 * @param {number} id - ID de l'exercice
 * @returns {Promise<boolean>} true si supprimé, false sinon
 */
const deleteById = async (id) => {
  const [result] = await pool.query('DELETE FROM exercises WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

module.exports = {
  findAll,
  findById,
  findByCategoryId,
  create,
  update,
  deleteById
};

