/**
 * Middleware checkAdmin
 * Vérifie si l'utilisateur connecté a le rôle 'admin'
 * À utiliser après le middleware 'auth' qui injecte req.user
 */

const checkAdmin = (req, res, next) => {
  // Vérifier que l'utilisateur est authentifié
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentification requise'
    });
  }

  // Vérifier que l'utilisateur a le rôle admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé. Droits administrateur requis.',
      userRole: req.user.role
    });
  }

  // L'utilisateur est admin, continuer
  next();
};

/**
 * Middleware checkCoach
 * Vérifie si l'utilisateur connecté a le rôle 'coach' ou 'admin'
 */
const checkCoach = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentification requise'
    });
  }

  if (req.user.role !== 'coach' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé. Droits coach ou administrateur requis.',
      userRole: req.user.role
    });
  }

  next();
};

/**
 * Middleware checkRole
 * Vérifie si l'utilisateur a l'un des rôles spécifiés
 * @param {Array<string>} allowedRoles - Liste des rôles autorisés
 */
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Accès refusé. Rôles autorisés: ${allowedRoles.join(', ')}`,
        userRole: req.user.role
      });
    }

    next();
  };
};

module.exports = {
  checkAdmin,
  checkCoach,
  checkRole
};

