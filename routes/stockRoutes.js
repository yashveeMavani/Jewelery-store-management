const express = require('express');
const stockController = require('../controllers/stockController');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authmiddleware');

router.post('/update-stock',authenticate, authorize('super_admin', 'admin'), stockController.updateStockFromPurchases);

module.exports = router;
