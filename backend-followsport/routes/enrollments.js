/**
 * Routes pour gérer les inscriptions aux programmes
 */

const express = require('express');
const router = express.Router();
const enrollmentsController = require('../controllers/enrollmentsController');
const auth = require('../middleware/auth');

// Toutes les routes nécessitent une authentification
router.use(auth);

// POST /enrollments - S'inscrire à un programme
router.post('/', enrollmentsController.enroll);

// DELETE /enrollments/:programId - Se désinscrire d'un programme
router.delete('/:programId', enrollmentsController.unenroll);

// PUT /enrollments/:programId/status - Mettre à jour le statut
router.put('/:programId/status', enrollmentsController.updateStatus);

// GET /enrollments/program/:programId/users - Utilisateurs inscrits à un programme
router.get('/program/:programId/users', enrollmentsController.getUsersByProgram);

// GET /enrollments/user/:userId/programs - Programmes d'un utilisateur
router.get('/user/:userId/programs', enrollmentsController.getProgramsByUser);

// GET /enrollments/check/:programId - Vérifier si inscrit
router.get('/check/:programId', enrollmentsController.checkEnrollment);

// GET /enrollments/program/:programId/stats - Stats d'un programme
router.get('/program/:programId/stats', enrollmentsController.getProgramStats);

module.exports = router;

