const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salescontrollers');

router.post('/', salesController.createSales);
router.get('/', salesController.listSales);
router.get('/:id', salesController.getSales);
router.delete('/',salesController.deleteSales);

module.exports = router;
