/**
 * Script pour vérifier un utilisateur dans la base de données
 */

require('dotenv').config();
const db = require('./db');

async function checkUser(userId) {
  try {
    const query = 'SELECT id, email, firstname, lastname, role, created_at FROM users WHERE id = ?';
    const [results] = await db.query(query, [userId]);
    
    if (results.length === 0) {
      console.log(`❌ Aucun utilisateur trouvé avec l'ID ${userId}`);
      return;
    }
    
    const user = results[0];
    console.log('\n✅ Utilisateur trouvé :');
    console.log('========================');
    console.log(`ID        : ${user.id}`);
    console.log(`Email     : ${user.email}`);
    console.log(`Nom       : ${user.firstname} ${user.lastname}`);
    console.log(`Rôle      : ${user.role} ${user.role === 'admin' ? '👑' : '👤'}`);
    console.log(`Créé le   : ${user.created_at}`);
    console.log('========================\n');
    
    if (user.role === 'admin') {
      console.log('✅ Cet utilisateur est ADMINISTRATEUR\n');
    } else {
      console.log('ℹ️  Cet utilisateur est un utilisateur normal\n');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message);
    process.exit(1);
  }
}

// Récupérer l'ID de l'utilisateur depuis les arguments
const userId = process.argv[2] || 3;

console.log(`\n🔍 Vérification de l'utilisateur ID ${userId}...\n`);
checkUser(userId);

