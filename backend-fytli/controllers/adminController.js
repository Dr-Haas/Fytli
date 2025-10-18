/**
 * Contrôleur Admin - Gestion des opérations administratives
 * Toutes ces routes nécessitent le middleware checkAdmin
 */

const usersModel = require('../models/usersModel');

/**
 * Récupère tous les utilisateurs (admin uniquement)
 * GET /admin/users
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await usersModel.getAllUsers();
    
    // Ne pas retourner les mots de passe
    const sanitizedUsers = users.map(user => {
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.status(200).json({
      success: true,
      count: sanitizedUsers.length,
      data: sanitizedUsers
    });
  } catch (error) {
    console.error('Erreur getAllUsers (admin):', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des utilisateurs',
      error: error.message
    });
  }
};

/**
 * Récupère les utilisateurs par rôle
 * GET /admin/users/role/:role
 */
const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    
    // Validation du rôle
    if (!['user', 'admin', 'coach'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Rôle invalide. Rôles autorisés: user, admin, coach'
      });
    }
    
    const users = await usersModel.getUsersByRole(role);
    
    res.status(200).json({
      success: true,
      role,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Erreur getUsersByRole:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des utilisateurs',
      error: error.message
    });
  }
};

/**
 * Modifie le rôle d'un utilisateur
 * PUT /admin/users/:id/role
 */
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    // Validation du rôle
    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Le champ role est obligatoire'
      });
    }
    
    if (!['user', 'admin', 'coach'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Rôle invalide. Rôles autorisés: user, admin, coach'
      });
    }
    
    // Vérifier que l'utilisateur existe
    const user = await usersModel.getUserById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `Utilisateur avec l'ID ${id} non trouvé`
      });
    }
    
    // Empêcher un admin de se rétrograder lui-même
    if (parseInt(id) === req.user.userId && role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Vous ne pouvez pas modifier votre propre rôle administrateur'
      });
    }
    
    // Mettre à jour le rôle
    const updated = await usersModel.updateUserRole(id, role);
    
    if (!updated) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du rôle'
      });
    }
    
    // Récupérer l'utilisateur mis à jour
    const updatedUser = await usersModel.getUserById(id);
    delete updatedUser.password_hash;
    
    res.status(200).json({
      success: true,
      message: `Rôle de ${updatedUser.email} changé en ${role}`,
      data: updatedUser
    });
  } catch (error) {
    console.error('Erreur updateUserRole:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la modification du rôle',
      error: error.message
    });
  }
};

/**
 * Supprime un utilisateur (admin uniquement)
 * DELETE /admin/users/:id
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier que l'utilisateur existe
    const user = await usersModel.getUserById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `Utilisateur avec l'ID ${id} non trouvé`
      });
    }
    
    // Empêcher un admin de se supprimer lui-même
    if (parseInt(id) === req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Vous ne pouvez pas supprimer votre propre compte'
      });
    }
    
    // Supprimer l'utilisateur
    const deleted = await usersModel.deleteUser(id);
    
    if (!deleted) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression'
      });
    }
    
    res.status(200).json({
      success: true,
      message: `Utilisateur ${user.email} supprimé avec succès`
    });
  } catch (error) {
    console.error('Erreur deleteUser (admin):', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'utilisateur',
      error: error.message
    });
  }
};

/**
 * Obtient les statistiques de l'application
 * GET /admin/stats
 */
const getStats = async (req, res) => {
  try {
    const { pool } = require('../db');
    
    // Compter les utilisateurs par rôle
    const [userStats] = await pool.query(`
      SELECT 
        role,
        COUNT(*) as count
      FROM users
      GROUP BY role
    `);
    
    // Compter le total d'utilisateurs
    const [totalUsers] = await pool.query('SELECT COUNT(*) as total FROM users');
    
    // Compter le total de programmes
    const [totalPrograms] = await pool.query('SELECT COUNT(*) as total FROM programs');
    
    // Compter le total d'exercices
    const [totalExercises] = await pool.query('SELECT COUNT(*) as total FROM exercises');
    
    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers[0].total,
          byRole: userStats
        },
        programs: totalPrograms[0].total,
        exercises: totalExercises[0].total
      }
    });
  } catch (error) {
    console.error('Erreur getStats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};

/**
 * Récupérer toutes les completions (admin uniquement)
 * GET /admin/completions
 */
const getAllCompletions = async (req, res) => {
  try {
    const { pool } = require('../db');
    
    const [completions] = await pool.query(`
      SELECT 
        sc.*,
        CONCAT(u.first_name, ' ', u.last_name) as user_name,
        s.title as session_title,
        p.title as program_title
      FROM session_completions sc
      LEFT JOIN users u ON sc.user_id = u.id
      LEFT JOIN sessions s ON sc.session_id = s.id
      LEFT JOIN programs p ON sc.program_id = p.id
      ORDER BY sc.completed_at DESC
    `);
    
    res.status(200).json({
      success: true,
      count: completions.length,
      data: completions
    });
  } catch (error) {
    console.error('Erreur getAllCompletions:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des completions',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUsersByRole,
  updateUserRole,
  deleteUser,
  getStats,
  getAllCompletions
};

