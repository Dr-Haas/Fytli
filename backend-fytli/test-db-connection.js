/**
 * Script de test de connexion à la base de données
 * Usage: node test-db-connection.js
 */

require('dotenv').config();
const { testConnection, pool } = require('./db');

async function testDB() {
  console.log('\n🧪 Test de connexion à la base de données\n');
  console.log('Configuration:');
  console.log('  Host:', process.env.DB_HOST || 'non défini');
  console.log('  User:', process.env.DB_USER || 'non défini');
  console.log('  Database:', process.env.DB_NAME || 'non défini');
  console.log('  Port:', process.env.DB_PORT || '3306 (défaut)');
  console.log('\n');

  // Test de connexion
  const connected = await testConnection();
  
  if (!connected) {
    console.error('\n❌ Échec de la connexion\n');
    process.exit(1);
  }

  // Test de quelques requêtes
  try {
    console.log('\n✅ Connexion réussie ! Test de quelques requêtes...\n');

    // Test 1: Compter les utilisateurs
    const [users] = await pool.execute('SELECT COUNT(*) as count FROM users');
    console.log('✓ Nombre d\'utilisateurs:', users[0].count);

    // Test 2: Compter les programmes
    const [programs] = await pool.execute('SELECT COUNT(*) as count FROM programs');
    console.log('✓ Nombre de programmes:', programs[0].count);

    // Test 3: Vérifier les tables sociales
    const [socialTables] = await pool.execute(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? 
        AND TABLE_NAME IN ('user_connections', 'user_feed', 'social_unlocks')
    `, [process.env.DB_NAME]);
    
    console.log('✓ Tables sociales trouvées:', socialTables.length, '/ 3');
    socialTables.forEach(t => console.log('  -', t.TABLE_NAME));

    console.log('\n🎉 Tous les tests sont réussis !\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erreur lors des tests:', error.message);
    process.exit(1);
  }
}

testDB();

