/**
 * Routes Programs - Définition des endpoints pour les programmes
 */

const express = require('express');
const router = express.Router();
const programsController = require('../controllers/programsController');

// GET /programs - Récupère tous les programmes
router.get('/', programsController.getAll);

// GET /programs/:id - Récupère un programme spécifique
router.get('/:id', programsController.getById);

// POST /programs - Crée un nouveau programme
router.post('/', programsController.create);

// PUT /programs/:id - Met à jour un programme
router.put('/:id', programsController.update);

// DELETE /programs/:id - Supprime un programme
router.delete('/:id', programsController.deleteById);

module.exports = router;

