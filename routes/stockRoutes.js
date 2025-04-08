const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const { authenticate, authorize } = require('../middleware/authmiddleware');




router.post('/update-stock', authenticate, authorize('super_admin', 'admin'),stockController.updateStockFromPurchases);
// Create StockData
router.post('/data',authenticate, authorize('super_admin', 'admin'),stockController.createStockData);

// Create StockMaster
router.post('/master',authenticate, authorize('super_admin', 'admin'),stockController.createStockMaster);

// Verify stock by barcode
router.post('/verify-barcode', authenticate, authorize('super_admin', 'admin'), stockController.verifyStockByBarcode);

// Process sales by barcode
router.post('/process-sale', authenticate, authorize('super_admin', 'admin'), stockController.processSaleByBarcode);
// Get StockMaster by stock_code
router.get('/data/:stock_code',authenticate, authorize('super_admin', 'admin') ,stockController.getStockData);
router.get('/master/:stock_code',authenticate, authorize('super_admin', 'admin'), stockController.getStockMaster);
router.get('/barcode-qr/:stock_code',authenticate, authorize('super_admin', 'admin'),stockController.getBarcodeAndQRCode);

module.exports = router;
