/**
 * Routes Sessions - Définition des endpoints pour les sessions
 */

const express = require('express');
const router = express.Router();
const sessionsController = require('../controllers/sessionsController');

// GET /sessions - Récupère toutes les sessions
// Query params: ?program_id=X pour filtrer par programme
router.get('/', sessionsController.getAll);

// GET /sessions/:id - Récupère une session spécifique
router.get('/:id', sessionsController.getById);

// POST /sessions - Crée une nouvelle session
router.post('/', sessionsController.create);

// PUT /sessions/:id - Met à jour une session
router.put('/:id', sessionsController.update);

// DELETE /sessions/:id - Supprime une session
router.delete('/:id', sessionsController.deleteById);

module.exports = router;

