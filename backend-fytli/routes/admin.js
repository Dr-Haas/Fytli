/**
 * Routes Admin - Endpoints pour les opérations administratives
 * Toutes ces routes nécessitent l'authentification + rôle admin
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
const { checkAdmin } = require('../middleware/checkAdmin');

// Toutes les routes admin nécessitent auth + checkAdmin
router.use(authMiddleware);
router.use(checkAdmin);

// GET /admin/stats - Statistiques de l'application
router.get('/stats', adminController.getStats);

// GET /admin/users - Liste tous les utilisateurs
router.get('/users', adminController.getAllUsers);

// GET /admin/users/role/:role - Liste les utilisateurs par rôle
router.get('/users/role/:role', adminController.getUsersByRole);

// PUT /admin/users/:id/role - Modifie le rôle d'un utilisateur
router.put('/users/:id/role', adminController.updateUserRole);

// DELETE /admin/users/:id - Supprime un utilisateur
router.delete('/users/:id', adminController.deleteUser);

// GET /admin/completions - Liste toutes les completions
router.get('/completions', adminController.getAllCompletions);

module.exports = router;

