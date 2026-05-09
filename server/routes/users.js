const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/manage', userController.getUsers);
router.post('/create', userController.createUser);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.patch('/:id/toggle-status', userController.toggleUserStatus);
router.delete('/:id', userController.deleteUser);

module.exports = router;
