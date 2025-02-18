const express = require('express');
const stockController = require('../controllers/stockController');
const router = express.Router();

router.post('/update-stock', stockController.updateStockFromPurchases);

module.exports = router;
