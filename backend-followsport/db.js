/**
 * Configuration et connexion à la base de données MySQL
 * Utilise mysql2/promise pour les requêtes async/await
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// Création du pool de connexions
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * Teste la connexion à la base de données
 * @returns {Promise<boolean>} true si connexion réussie
 */
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connexion MySQL établie avec succès');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion MySQL:', error.message);
    return false;
  }
};

module.exports = { pool, testConnection };

