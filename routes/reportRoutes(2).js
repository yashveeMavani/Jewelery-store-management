const express = require('express');
const router = express.Router();
const { getReportData } = require('../controllers/reportController');

router.get('/data', getReportData);

module.exports = router;