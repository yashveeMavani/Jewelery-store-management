const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchasecontrollers');

router.post('/', purchaseController.createPurchase);
router.get('/', purchaseController.listPurchases);
router.get('/:id', purchaseController.getPurchase);

module.exports = router;
