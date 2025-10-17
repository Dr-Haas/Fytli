/**
 * Routes Users - Définition des endpoints pour les utilisateurs
 */

const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// GET /users - Récupère tous les utilisateurs
router.get('/', usersController.getUsers);

// GET /users/:id - Récupère un utilisateur spécifique
router.get('/:id', usersController.getUserById);

// POST /users - Crée un nouvel utilisateur
router.post('/', usersController.createUser);

// PUT /users/:id - Met à jour un utilisateur
router.put('/:id', usersController.updateUser);

// DELETE /users/:id - Supprime un utilisateur
router.delete('/:id', usersController.deleteUser);

module.exports = router;

