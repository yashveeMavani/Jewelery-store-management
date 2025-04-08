const express = require('express');
const router = express.Router();
const exchangeRatesController = require('../controllers/exchangeRatesController');

router.post('/exchange-rates', exchangeRatesController.addExchangeRate);

module.exports = router;