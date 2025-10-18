/**
 * Script pour créer un utilisateur administrateur
 * Usage: node createAdmin.js
 * 
 * Ce script crée un compte admin avec les identifiants par défaut.
 * ATTENTION : À utiliser une seule fois pour créer le premier admin !
 */

const bcrypt = require('bcrypt');
const { pool, testConnection } = require('./db');

const createAdmin = async () => {
  try {
    console.log('\n🔐 Création d\'un compte administrateur...\n');
    
    // Test de connexion à la DB
    const connected = await testConnection();
    if (!connected) {
      console.error('❌ Impossible de se connecter à la base de données');
      process.exit(1);
    }
    
    // Données de l'admin
    const adminData = {
      email: 'admin@followsport.com',
      password: 'admin123',  // ⚠️ À CHANGER IMMÉDIATEMENT après connexion !
      first_name: 'Admin',
      last_name: 'FollowSport',
      role: 'admin'
    };
    
    // Vérifier si un admin existe déjà avec cet email
    const [existing] = await pool.query(
      'SELECT id, email, role FROM users WHERE email = ?',
      [adminData.email]
    );
    
    if (existing.length > 0) {
      console.log('⚠️  Un utilisateur avec cet email existe déjà :');
      console.log(`   Email: ${existing[0].email}`);
      console.log(`   Rôle: ${existing[0].role}`);
      
      if (existing[0].role === 'admin') {
        console.log('\n✅ Cet utilisateur est déjà administrateur.\n');
      } else {
        console.log('\n💡 Voulez-vous le promouvoir en admin ?');
        console.log('   Utilisez : UPDATE users SET role = \'admin\' WHERE id = ' + existing[0].id + ';\n');
      }
      
      process.exit(0);
    }
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    
    // Créer l'admin
    const [result] = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        adminData.email,
        hashedPassword,
        adminData.first_name,
        adminData.last_name,
        adminData.role
      ]
    );
    
    console.log('✅ Compte administrateur créé avec succès !\n');
    console.log('📧 Email     :', adminData.email);
    console.log('🔑 Mot de passe :', adminData.password);
    console.log('👑 Rôle      :', adminData.role);
    console.log('🆔 ID        :', result.insertId);
    console.log('\n⚠️  IMPORTANT : Changez le mot de passe dès la première connexion !\n');
    
    // Vérification
    const [newAdmin] = await pool.query(
      'SELECT id, email, role, created_at FROM users WHERE id = ?',
      [result.insertId]
    );
    
    console.log('✅ Vérification en base de données :');
    console.log(newAdmin[0]);
    console.log('');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erreur lors de la création de l\'admin:', error.message);
    console.error(error);
    process.exit(1);
  }
};

// Exécuter
createAdmin();

