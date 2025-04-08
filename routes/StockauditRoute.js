const express = require('express');
const router = express.Router();
const { performStockAudit } = require('../controllers/Stockauditcontroller');
const { authenticate, authorize } = require('../middleware/authmiddleware');

// Route to perform stock audit
router.get('/audit', authenticate, authorize('super_admin', 'admin'), performStockAudit);

module.exports = router;