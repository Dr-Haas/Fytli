/**
 * Routes Exercises - Définition des endpoints pour les exercices
 */

const express = require('express');
const router = express.Router();
const exercisesController = require('../controllers/exercisesController');

// GET /exercises - Récupère tous les exercices
// Query params: ?category_id=X pour filtrer par catégorie
router.get('/', exercisesController.getAll);

// GET /exercises/:id - Récupère un exercice spécifique
router.get('/:id', exercisesController.getById);

// POST /exercises - Crée un nouvel exercice
router.post('/', exercisesController.create);

// PUT /exercises/:id - Met à jour un exercice
router.put('/:id', exercisesController.update);

// DELETE /exercises/:id - Supprime un exercice
router.delete('/:id', exercisesController.deleteById);

module.exports = router;

