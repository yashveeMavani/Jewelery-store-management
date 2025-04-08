const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { authenticate, authorize } = require('../middleware/authmiddleware');

// Create a new supplier
router.post('/', authenticate, authorize('super_admin', 'admin'), supplierController.createSupplier);

// List all suppliers
router.get('/', authenticate, authorize('super_admin', 'admin'), supplierController.listSuppliers);

// Update a supplier
router.put('/:id', authenticate, authorize('super_admin', 'admin'), supplierController.updateSupplier);

// Delete a supplier
router.delete('/:id', authenticate, authorize('super_admin', 'admin'), supplierController.deleteSupplier);

module.exports = router;