const express = require('express');
const router = express.Router();
const financialYearController = require('../controllers/financialYearController');


router.post('/financial-year/close', financialYearController.closeFinancialYear);

module.exports = router;