// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontrollers');
const { authenticate, authorize } = require('../middleware/authmiddleware');

// Routes
router.post('/',authenticate,authorize('super_admin'), userController.createUser);
router.get('/', authenticate, userController.getUsers);
router.put('/:id', authenticate, authorize('super_admin'), userController.updateUser);
router.delete('/:id', authenticate, authorize('super_admin'), userController.deleteUser);

module.exports = router;
