/**
 * Routes SessionExercises - Définition des endpoints pour les associations session-exercice
 */

const express = require('express');
const router = express.Router();
const sessionExercisesController = require('../controllers/sessionExercisesController');

// GET /session-exercises - Récupère toutes les associations
// Query params: ?session_id=X pour filtrer par session
router.get('/', sessionExercisesController.getAll);

// GET /session-exercises/:id - Récupère une association spécifique
router.get('/:id', sessionExercisesController.getById);

// POST /session-exercises - Crée une nouvelle association
router.post('/', sessionExercisesController.create);

// PUT /session-exercises/:id - Met à jour une association
router.put('/:id', sessionExercisesController.update);

// DELETE /session-exercises/:id - Supprime une association
router.delete('/:id', sessionExercisesController.deleteById);

module.exports = router;

