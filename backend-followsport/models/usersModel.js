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
  const { first_name, last_name, email, password, role = 'user' } = userData;
  
  const [result] = await pool.query(
    `INSERT INTO users (first_name, last_name, email, password_hash, role) 
     VALUES (?, ?, ?, ?, ?)`,
    [first_name, last_name, email, password, role]
  );
  
  return {
    id: result.insertId,
    first_name,
    last_name,
    email,
    role,
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
  if (userData.role !== undefined) {
    fields.push('role = ?');
    values.push(userData.role);
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

/**
 * Met à jour le rôle d'un utilisateur
 * @param {number} id - ID de l'utilisateur
 * @param {string} role - Nouveau rôle ('user', 'admin', 'coach')
 * @returns {Promise<boolean>} true si mis à jour, false sinon
 */
const updateUserRole = async (id, role) => {
  // Vérifier que le rôle est valide
  if (!['user', 'admin', 'coach'].includes(role)) {
    throw new Error(`Rôle invalide: ${role}. Rôles autorisés: user, admin, coach`);
  }
  
  const [result] = await pool.query(
    'UPDATE users SET role = ? WHERE id = ?',
    [role, id]
  );
  
  return result.affectedRows > 0;
};

/**
 * Récupère tous les utilisateurs par rôle
 * @param {string} role - Rôle à filtrer ('user', 'admin', 'coach')
 * @returns {Promise<Array>} Liste des utilisateurs avec ce rôle
 */
const getUsersByRole = async (role) => {
  const [rows] = await pool.query(
    'SELECT id, email, first_name, last_name, role, created_at FROM users WHERE role = ? ORDER BY created_at DESC',
    [role]
  );
  return rows;
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  updateUserRole,
  getUsersByRole
};

