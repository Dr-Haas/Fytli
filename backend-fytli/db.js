/**
 * Configuration et connexion à la base de données MySQL
 * Utilise mysql2/promise pour les requêtes async/await
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// Création du pool de connexions avec configuration robuste pour connexions distantes
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Gestion des timeouts et reconnexions
  connectTimeout: 60000, // 60 secondes
  acquireTimeout: 60000,
  timeout: 60000,
  // Reconnexion automatique en cas de perte de connexion
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  // SSL pour OVH (si nécessaire)
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Gestionnaire d'erreurs du pool
pool.on('error', (err) => {
  console.error('❌ [MySQL Pool Error]:', err.code, err.message);
  if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
    console.log('🔄 [MySQL] Reconnexion automatique en cours...');
  }
});

/**
 * Teste la connexion à la base de données
 * @returns {Promise<boolean>} true si connexion réussie
 */
const testConnection = async () => {
  try {
    // Vérifier que les variables d'environnement sont définies
    if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
      console.error('❌ Variables d\'environnement manquantes:');
      console.error('   DB_HOST:', process.env.DB_HOST ? '✓' : '✗ MANQUANT');
      console.error('   DB_USER:', process.env.DB_USER ? '✓' : '✗ MANQUANT');
      console.error('   DB_PASSWORD:', process.env.DB_PASSWORD ? '✓' : '✗ MANQUANT');
      console.error('   DB_NAME:', process.env.DB_NAME ? '✓' : '✗ MANQUANT');
      console.error('   DB_PORT:', process.env.DB_PORT || '3306 (default)');
      console.error('\n⚠️  Sur Render: Définir les variables dans Dashboard → Environment');
      console.error('⚠️  En local: Créer un fichier .env avec ces variables');
      return false;
    }
    
    console.log('🔄 Tentative de connexion à MySQL...');
    console.log('   Host:', process.env.DB_HOST);
    console.log('   User:', process.env.DB_USER);
    console.log('   Database:', process.env.DB_NAME);
    console.log('   Port:', process.env.DB_PORT || 3306);
    
    const connection = await pool.getConnection();
    console.log('✅ Connexion MySQL établie avec succès');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion MySQL:', error.message);
    console.error('   Code:', error.code);
    console.error('   Errno:', error.errno);
    if (error.code === 'ENOTFOUND') {
      console.error('   → Le serveur MySQL est introuvable. Vérifiez DB_HOST');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('   → Accès refusé. Vérifiez DB_USER et DB_PASSWORD');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('   → Connexion refusée. Vérifiez que MySQL est accessible');
    }
    return false;
  }
};

module.exports = { pool, testConnection };

