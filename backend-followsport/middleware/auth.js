/**
 * Middleware d'authentification JWT
 * Vérifie la présence et la validité du token JWT dans les requêtes
 */

const jwt = require('jsonwebtoken');

/**
 * Middleware pour vérifier le token JWT
 * Ajoute req.user avec les données décodées du token si valide
 */
const authMiddleware = (req, res, next) => {
  try {
    // Récupérer le header Authorization
    const authHeader = req.headers['authorization'];
    
    // Format attendu: "Bearer TOKEN"
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'authentification requis'
      });
    }
    
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ajouter les informations de l'utilisateur à la requête
    req.user = decoded;
    
    // Continuer vers la route suivante
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({
        success: false,
        message: 'Token expiré'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({
        success: false,
        message: 'Token invalide'
      });
    }
    
    return res.status(403).json({
      success: false,
      message: 'Erreur d\'authentification',
      error: error.message
    });
  }
};

module.exports = authMiddleware;

