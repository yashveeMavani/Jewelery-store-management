const express = require('express');
const router = express.Router();
const rateMasterController = require('../controllers/ratemastercontrollers');
const { authenticate, authorize } = require('../middleware/authmiddleware');


router.post('/', authenticate, authorize('super_admin', 'admin'), rateMasterController.createRate);
router.get('/', authenticate, rateMasterController.getRate);
router.delete('/', authenticate, authorize('super_admin', 'admin'), rateMasterController.deleteRate);

module.exports = router;