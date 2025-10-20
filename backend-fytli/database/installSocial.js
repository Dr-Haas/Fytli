/**
 * Script d'installation automatique du système social
 * Exécute le fichier social_system.sql dans la base de données
 */

const fs = require('fs');
const path = require('path');
const pool = require('../db');

async function installSocialSystem() {
  console.log('\n🚀 Installation du système social - Cercle Fytli\n');
  
  try {
    // Lire le fichier SQL
    const sqlFilePath = path.join(__dirname, 'social_system.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Diviser les requêtes (séparées par des lignes vides ou des commentaires)
    const queries = sql
      .split(';')
      .map(q => q.trim())
      .filter(q => q.length > 0 && !q.startsWith('--'));
    
    console.log(`📄 ${queries.length} requêtes SQL à exécuter\n`);
    
    const connection = await pool.getConnection();
    
    try {
      let successCount = 0;
      let errorCount = 0;
      
      for (let i = 0; i < queries.length; i++) {
        const query = queries[i];
        
        // Ignorer les commentaires et lignes vides
        if (query.startsWith('--') || query.length === 0) {
          continue;
        }
        
        try {
          console.log(`⏳ Exécution de la requête ${i + 1}/${queries.length}...`);
          await connection.query(query);
          successCount++;
          console.log(`✅ Succès\n`);
        } catch (error) {
          // Ignorer les erreurs "already exists"
          if (error.message.includes('already exists') || 
              error.message.includes('Duplicate column')) {
            console.log(`⚠️  Déjà existant (ignoré)\n`);
            successCount++;
          } else {
            console.error(`❌ Erreur: ${error.message}\n`);
            errorCount++;
          }
        }
      }
      
      console.log('\n' + '='.repeat(60));
      console.log(`✅ Installation terminée !`);
      console.log(`   Succès : ${successCount}/${queries.length}`);
      console.log(`   Erreurs : ${errorCount}/${queries.length}`);
      console.log('='.repeat(60) + '\n');
      
      // Vérification
      console.log('🔍 Vérification des tables créées...\n');
      
      const [tables] = await connection.query(`
        SHOW TABLES LIKE '%connection%'
        UNION
        SHOW TABLES LIKE '%feed%'
      `);
      
      if (tables.length >= 3) {
        console.log('✅ Tables sociales créées avec succès :');
        tables.forEach(table => {
          const tableName = Object.values(table)[0];
          console.log(`   - ${tableName}`);
        });
      } else {
        console.log('⚠️  Certaines tables n\'ont pas été créées. Vérifiez les erreurs ci-dessus.');
      }
      
      // Vérifier les colonnes ajoutées à users
      console.log('\n🔍 Vérification des colonnes sociales dans users...\n');
      
      const [columns] = await connection.query(`
        SHOW COLUMNS FROM users 
        WHERE Field IN ('username', 'avatar_url', 'profile_visibility')
      `);
      
      if (columns.length >= 3) {
        console.log('✅ Colonnes sociales ajoutées à la table users :');
        columns.forEach(col => {
          console.log(`   - ${col.Field} (${col.Type})`);
        });
      } else {
        console.log('⚠️  Certaines colonnes n\'ont pas été ajoutées. Vérifiez les erreurs ci-dessus.');
      }
      
      // Suggestion pour les usernames
      console.log('\n💡 Étape suivante :');
      console.log('   Si vous avez des utilisateurs existants sans username,');
      console.log('   exécutez cette requête pour générer des usernames :');
      console.log('\n   UPDATE users SET username = CONCAT(');
      console.log('     SUBSTRING_INDEX(email, \'@\', 1), \'_\', id');
      console.log('   ) WHERE username IS NULL;\n');
      
    } finally {
      connection.release();
    }
    
  } catch (error) {
    console.error('\n❌ Erreur lors de l\'installation:', error.message);
    console.error('\nVérifiez :');
    console.error('- Que le fichier social_system.sql existe');
    console.error('- Que la connexion à la base de données est correcte');
    console.error('- Que vous avez les permissions nécessaires\n');
    process.exit(1);
  }
  
  process.exit(0);
}

// Exécuter l'installation
installSocialSystem();

