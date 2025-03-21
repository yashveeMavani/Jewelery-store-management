const express = require('express');
const router = express.Router();
const categorycontrollers = require('../controllers/categorycontrollers');
const { authenticate, authorize } = require('../middleware/authmiddleware');

router.post('/', authenticate, authorize('super_admin', 'admin'), categorycontrollers.createCategory); 
router.get('/', authenticate, authorize('super_admin', 'admin', 'manager'), categorycontrollers.getCategory); 
router.put('/:id', authenticate, authorize('super_admin', 'admin'), categorycontrollers.updateCategory); 
router.delete('/:id', authenticate, authorize('super_admin'), categorycontrollers.deleteCategory); 


module.exports = router;

