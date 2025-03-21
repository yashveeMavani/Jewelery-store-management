const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salescontrollers');
const { authenticate, authorize } = require('../middleware/authmiddleware');

router.post('/', authenticate, authorize('super_admin', 'admin'), salesController.createSales);

router.get('/', authenticate, salesController.listSales);

router.get('/borrowed-amounts', authenticate, authorize('super_admin', 'admin'), salesController.listBorrowedAmounts);
router.get('/paid-amount-report', authenticate, authorize('super_admin', 'admin'), salesController.getPaidAmountReport);
router.get('/unpaid-amount-report', authenticate, authorize('super_admin', 'admin'), salesController.getUnpaidAmountReport);
router.get('/:id', authenticate, salesController.getSales);

router.delete('/', authenticate, authorize('super_admin', 'admin'), salesController.deleteSales);


module.exports = router;
