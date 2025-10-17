/**
 * Modèle Users - Gestion des requêtes SQL pour la table users
 */

const { pool } = require('../db');

/**
 * Récupère tous les utilisateurs
 * @returns {Promise<Array>} Liste des utilisateurs
 */
const getAllUsers = async () => {
  const [rows] = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
  return rows;
};

/**
 * Récupère un utilisateur par son ID
 * @param {number} id - ID de l'utilisateur
 * @returns {Promise<Object|null>} Utilisateur trouvé ou null
 */
const getUserById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0] || null;
};

/**
 * Récupère un utilisateur par son email
 * @param {string} email - Email de l'utilisateur
 * @returns {Promise<Object|null>} Utilisateur trouvé ou null
 */
const getUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
};

/**
 * Crée un nouvel utilisateur
 * @param {Object} userData - Données de l'utilisateur
 * @returns {Promise<Object>} Utilisateur créé avec son ID
 */
const createUser = async (userData) => {
  const { first_name, last_name, email, password } = userData;
  
  const [result] = await pool.query(
    `INSERT INTO users (first_name, last_name, email, password_hash) 
     VALUES (?, ?, ?, ?)`,
    [first_name, last_name, email, password]
  );
  
  return {
    id: result.insertId,
    first_name,
    last_name,
    email,
    created_at: new Date()
  };
};

/**
 * Met à jour un utilisateur existant
 * @param {number} id - ID de l'utilisateur
 * @param {Object} userData - Données à mettre à jour
 * @returns {Promise<boolean>} true si mis à jour, false sinon
 */
const updateUser = async (id, userData) => {
  const fields = [];
  const values = [];
  
  // Construction dynamique de la requête UPDATE
  if (userData.first_name !== undefined) {
    fields.push('first_name = ?');
    values.push(userData.first_name);
  }
  if (userData.last_name !== undefined) {
    fields.push('last_name = ?');
    values.push(userData.last_name);
  }
  if (userData.email !== undefined) {
    fields.push('email = ?');
    values.push(userData.email);
  }
  if (userData.password !== undefined) {
    fields.push('password_hash = ?');
    values.push(userData.password);
  }
  if (userData.birthdate !== undefined) {
    fields.push('birthdate = ?');
    values.push(userData.birthdate);
  }
  if (userData.gender !== undefined) {
    fields.push('gender = ?');
    values.push(userData.gender);
  }
  if (userData.fitness_level !== undefined) {
    fields.push('fitness_level = ?');
    values.push(userData.fitness_level);
  }
  
  if (fields.length === 0) {
    return false; // Aucune donnée à mettre à jour
  }
  
  values.push(id);
  
  const [result] = await pool.query(
    `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  
  return result.affectedRows > 0;
};

/**
 * Supprime un utilisateur
 * @param {number} id - ID de l'utilisateur
 * @returns {Promise<boolean>} true si supprimé, false sinon
 */
const deleteUser = async (id) => {
  const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser
};

