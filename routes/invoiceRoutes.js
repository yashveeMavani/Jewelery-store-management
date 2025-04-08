const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { authenticate } = require('../middleware/authmiddleware');


router.post('/send-invoice',authenticate, invoiceController.sendInvoice);

module.exports = router;


