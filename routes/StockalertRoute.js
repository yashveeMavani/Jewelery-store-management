const express = require('express');
const router = express.Router();
const { getLowStockAlerts } = require('../controllers/stockController');
const { authenticate, authorize } = require('../middleware/authmiddleware');

// Route to get low stock alerts
router.get('/low-stock-alerts', authenticate, authorize('super_admin', 'admin'), getLowStockAlerts);

module.exports = router;