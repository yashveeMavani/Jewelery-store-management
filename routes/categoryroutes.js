// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const categorycontrollers = require('../controllers/categorycontrollers');
const { authenticate, authorize } = require('../middleware/authmiddleware');

// Routes
router.post('/',authenticate,authorize('super_admin'),categorycontrollers.createCategory);
router.get('/', authenticate, authorize('super_admin'),categorycontrollers.getCategory);
router.put('/:id', authenticate, authorize('super_admin'),categorycontrollers.updateCategory);
router.delete('/:id', authenticate, authorize('super_admin'),categorycontrollers.deleteCategory);

module.exports = router;
