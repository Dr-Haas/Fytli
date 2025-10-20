/**
 * Script pour vérifier l'existence des tables du système social
 */

const { pool, testConnection } = require('./db');

const checkTables = async () => {
  console.log('🔍 Vérification des tables du système social...\n');

  try {
    // Test de connexion
    const connected = await testConnection();
    if (!connected) {
      console.error('❌ Impossible de se connecter à la base de données');
      process.exit(1);
    }

    // Liste des tables requises
    const requiredTables = [
      'connections',
      'feed_events',
      'feed_unlocks'
    ];

    console.log('📋 Tables à vérifier:');
    for (const tableName of requiredTables) {
      try {
        const [rows] = await pool.query(
          `SELECT COUNT(*) as count FROM information_schema.tables 
           WHERE table_schema = ? AND table_name = ?`,
          [process.env.DB_NAME, tableName]
        );

        if (rows[0].count > 0) {
          // Compter les enregistrements
          const [countResult] = await pool.query(`SELECT COUNT(*) as total FROM ${tableName}`);
          console.log(`   ✅ ${tableName} (${countResult[0].total} enregistrements)`);
        } else {
          console.log(`   ❌ ${tableName} - TABLE MANQUANTE`);
        }
      } catch (error) {
        console.log(`   ❌ ${tableName} - Erreur: ${error.message}`);
      }
    }

    console.log('\n📊 Structure des tables:');
    
    // Vérifier la structure de chaque table
    for (const tableName of requiredTables) {
      try {
        const [columns] = await pool.query(
          `SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_KEY 
           FROM information_schema.columns 
           WHERE table_schema = ? AND table_name = ?
           ORDER BY ORDINAL_POSITION`,
          [process.env.DB_NAME, tableName]
        );

        if (columns.length > 0) {
          console.log(`\n   📌 ${tableName}:`);
          columns.forEach(col => {
            const key = col.COLUMN_KEY === 'PRI' ? ' 🔑 PRIMARY' : col.COLUMN_KEY === 'UNI' ? ' 🔒 UNIQUE' : '';
            console.log(`      - ${col.COLUMN_NAME}: ${col.DATA_TYPE}${key}`);
          });
        }
      } catch (error) {
        // Table n'existe pas, c'est OK
      }
    }

    console.log('\n✅ Vérification terminée');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Erreur:', error);
    process.exit(1);
  }
};

checkTables();

