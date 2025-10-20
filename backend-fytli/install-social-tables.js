/**
 * Script pour installer les tables du système social
 * Basé sur social_system.sql et social_system_ovh.sql
 */

const { pool, testConnection } = require('./db');

const installTables = async () => {
  console.log('📦 Installation des tables du système social...\n');

  try {
    // Test de connexion
    const connected = await testConnection();
    if (!connected) {
      console.error('❌ Impossible de se connecter à la base de données');
      process.exit(1);
    }

    console.log('🔨 Création des tables...\n');

    // TABLE 1: CONNECTIONS
    console.log('   📌 Création de la table "connections"...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS connections (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        friend_id INT NOT NULL,
        status ENUM('pending', 'accepted', 'blocked') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (friend_id) REFERENCES users(user_id) ON DELETE CASCADE,
        UNIQUE KEY unique_connection (user_id, friend_id),
        INDEX idx_user_id (user_id),
        INDEX idx_friend_id (friend_id),
        INDEX idx_status (status),
        INDEX idx_both_users (user_id, friend_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('   ✅ Table "connections" créée');

    // TABLE 2: FEED_EVENTS
    console.log('   📌 Création de la table "feed_events"...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS feed_events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        type ENUM('session_completed', 'program_started', 'streak_achieved', 'goal_reached', 'badge_earned', 'connection_request') NOT NULL,
        message TEXT NOT NULL,
        emoji VARCHAR(10),
        metadata JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_type (type),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('   ✅ Table "feed_events" créée');

    // TABLE 3: FEED_UNLOCKS
    console.log('   📌 Création de la table "feed_unlocks"...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS feed_unlocks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        date DATE NOT NULL,
        unlocked_at TIMESTAMP NULL,
        streak INT DEFAULT 1,
        session_completion_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (session_completion_id) REFERENCES session_completions(id) ON DELETE SET NULL,
        UNIQUE KEY unique_user_date (user_id, date),
        INDEX idx_user_id (user_id),
        INDEX idx_date (date),
        INDEX idx_unlocked_at (unlocked_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('   ✅ Table "feed_unlocks" créée');

    console.log('\n✅ Installation terminée avec succès !');
    console.log('\n💡 Vous pouvez maintenant utiliser le système social (Cercle Fytli)');
    
    // Vérification
    console.log('\n🔍 Vérification des tables créées:');
    const tables = ['connections', 'feed_events', 'feed_unlocks'];
    for (const table of tables) {
      const [rows] = await pool.query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`   ✅ ${table}: ${rows[0].count} enregistrements`);
    }

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Erreur lors de l\'installation:', error);
    console.error('\nDétails:', error.message);
    
    if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === 'ER_NO_REFERENCED_ROW') {
      console.error('\n⚠️  Erreur de clé étrangère: Vérifiez que la table "users" existe et utilise "user_id" comme clé primaire');
    }
    
    process.exit(1);
  }
};

installTables();

