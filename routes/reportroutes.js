const express = require('express');
const router = express.Router();
const { getPurchasePdfReport,getPurchaseCsvReport,getSalesCsvReport, getSalesPdfReport, getBalanceSheetPdfReport,getBalanceSheetCsvReport } = require('../controllers/reportcontrollers');

router.get('/purchase/pdf', getPurchasePdfReport);
router.get('/purchase/csv', getPurchaseCsvReport);

router.get('/sales/pdf', getSalesPdfReport);
router.get('/sales/csv', getSalesCsvReport);

router.get('/balance-sheet/pdf', getBalanceSheetPdfReport);
router.get('/balance-sheet/csv',getBalanceSheetCsvReport);

module.exports = router;

