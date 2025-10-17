/**
 * Modèle Categories - Gestion des requêtes SQL pour la table categories
 */

const { pool } = require('../db');

/**
 * Récupère toutes les catégories
 * @returns {Promise<Array>} Liste des catégories
 */
const findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
  return rows;
};

/**
 * Récupère une catégorie par son ID
 * @param {number} id - ID de la catégorie
 * @returns {Promise<Object|null>} Catégorie trouvée ou null
 */
const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
  return rows[0] || null;
};

/**
 * Récupère une catégorie par son nom
 * @param {string} name - Nom de la catégorie
 * @returns {Promise<Object|null>} Catégorie trouvée ou null
 */
const findByName = async (name) => {
  const [rows] = await pool.query('SELECT * FROM categories WHERE name = ?', [name]);
  return rows[0] || null;
};

/**
 * Crée une nouvelle catégorie
 * @param {Object} data - Données de la catégorie
 * @returns {Promise<Object>} Catégorie créée avec son ID
 */
const create = async (data) => {
  const { name, description } = data;
  
  const [result] = await pool.query(
    `INSERT INTO categories (name, description) 
     VALUES (?, ?)`,
    [name, description]
  );
  
  return {
    id: result.insertId,
    ...data
  };
};

/**
 * Met à jour une catégorie existante
 * @param {number} id - ID de la catégorie
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
  
  if (fields.length === 0) {
    return false;
  }
  
  values.push(id);
  
  const [result] = await pool.query(
    `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  
  return result.affectedRows > 0;
};

/**
 * Supprime une catégorie
 * @param {number} id - ID de la catégorie
 * @returns {Promise<boolean>} true si supprimé, false sinon
 */
const deleteById = async (id) => {
  const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

module.exports = {
  findAll,
  findById,
  findByName,
  create,
  update,
  deleteById
};

