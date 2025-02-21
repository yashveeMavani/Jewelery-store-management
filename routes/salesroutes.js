const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salescontrollers');

router.post('/', salesController.createSales);
router.get('/', salesController.listSales);
router.delete('/',salesController.deleteSales);

// Partial Payment Endpoints
router.post('/partial-payment', salesController.createPartialPayment);
router.get('/borrowed-amounts', salesController.listBorrowedAmounts);
router.get('/paid-amount-report', salesController.getPaidAmountReport);
router.get('/unpaid-amount-report', salesController.getUnpaidAmountReport);

router.get('/:id', salesController.getSales);

module.exports = router;
