const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchasecontrollers');
const { authenticate,authorize } = require('../middleware/authmiddleware');

router.post('/', authenticate, authorize('super_admin', 'admin'), purchaseController.createPurchase);
router.get('/', authenticate, authorize('super_admin', 'admin', 'manager', 'sales_executive', 'accountant'), purchaseController.listPurchases);
router.get('/:id', authenticate, authorize('super_admin', 'admin', 'manager', 'sales_executive', 'accountant'), purchaseController.getPurchase);

module.exports = router;

