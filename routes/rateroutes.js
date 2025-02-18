// routes/rateMasterRoutes.js
const express = require('express');
const router = express.Router();
const rateMasterController = require('../controllers/ratemastercontrollers');

router.post('/', rateMasterController.createRate); // Upsert Rate
router.get('/', rateMasterController.getRate);    // Get Rate
router.delete('/', rateMasterController.deleteRate); // Delete Rate

module.exports = router;
