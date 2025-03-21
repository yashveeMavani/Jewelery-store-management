const express = require('express');
const router = express.Router();
const { getPurchasePdfReport,getPurchaseCsvReport,getSalesCsvReport, getSalesPdfReport, getBalanceSheetPdfReport,getBalanceSheetCsvReport } = require('../controllers/reportcontrollers');
const { authenticate,authorize  } = require('../middleware/authmiddleware');

router.get('/purchase/pdf',authenticate, authorize('super_admin', 'admin'),getPurchasePdfReport);
router.get('/purchase/csv',authenticate, authorize('super_admin', 'admin'),getPurchaseCsvReport);

router.get('/sales/pdf',authenticate,authorize('super_admin', 'admin'), getSalesPdfReport);
router.get('/sales/csv',authenticate,authorize('super_admin', 'admin'), getSalesCsvReport);

router.get('/balance-sheet/pdf',authenticate,authorize('super_admin', 'admin'), getBalanceSheetPdfReport);
router.get('/balance-sheet/csv',authenticate,authorize('super_admin', 'admin'),getBalanceSheetCsvReport);

router.get('/reports/purchase/csv',authenticate,authorize('super_admin', 'admin'),getPurchaseCsvReport);
module.exports = router; 

