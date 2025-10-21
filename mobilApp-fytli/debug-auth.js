// Script de debug pour vérifier l'état de l'authentification
import AsyncStorage from '@react-native-async-storage/async-storage';

async function checkAuth() {
  try {
    console.log('🔍 Vérification de l\'authentification...\n');
    
    const token = await AsyncStorage.getItem('token');
    const user = await AsyncStorage.getItem('user');
    
    console.log('📝 Token présent:', !!token);
    if (token) {
      console.log('📝 Token (20 premiers caractères):', token.substring(0, 20) + '...');
    }
    
    console.log('\n📝 User présent:', !!user);
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        console.log('📝 User parsé:', parsedUser);
        console.log('📝 User ID:', parsedUser.id);
        console.log('📝 User Email:', parsedUser.email);
        console.log('📝 User Name:', parsedUser.firstname, parsedUser.lastname);
      } catch (e) {
        console.error('❌ Erreur parsing user:', e);
      }
    }
    
    console.log('\n✅ Vérification terminée');
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Fonction pour nettoyer le storage
async function clearAuth() {
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    console.log('✅ Storage nettoyé');
  } catch (error) {
    console.error('❌ Erreur nettoyage:', error);
  }
}

export { checkAuth, clearAuth };

