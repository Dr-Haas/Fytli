/**
 * Routes pour gérer les sessions complétées
 */

const express = require('express');
const router = express.Router();
const completionsController = require('../controllers/sessionCompletionsController');
const auth = require('../middleware/auth');

// Toutes les routes nécessitent une authentification
router.use(auth);

// POST /completions - Enregistrer une session complétée
router.post('/', completionsController.create);

// GET /completions/user/:userId - Completions d'un utilisateur
router.get('/user/:userId', completionsController.getByUser);

// GET /completions/program/:programId - Completions d'un programme
router.get('/program/:programId', completionsController.getByProgram);

// GET /completions/session/:sessionId - Completions d'une session
router.get('/session/:sessionId', completionsController.getBySession);

// GET /completions/:id - Une completion spécifique
router.get('/:id', completionsController.getById);

// DELETE /completions/:id - Supprimer une completion
router.delete('/:id', completionsController.deleteById);

// GET /completions/stats/:userId/:programId - Stats utilisateur/programme
router.get('/stats/:userId/:programId', completionsController.getUserProgramStats);

// GET /completions/feed/:programId - Feed d'activité d'un programme
router.get('/feed/:programId', completionsController.getProgramActivityFeed);

module.exports = router;

