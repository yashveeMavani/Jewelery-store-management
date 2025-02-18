const express = require('express');
const router = express.Router();
const DailyData = require('../models/daily_data');

// API to get daily stock summary
router.get('/daily-stock-summary', async (req, res) => {
    try {
        const dailySummary = await DailyData.findAll({
            
            order: [['date', 'DESC']] 
        });
        console.log('Daily Stock Summary:', dailySummary);
        res.status(200).json({
            success: true,
            data: dailySummary
        });
    } catch (error) {
        console.error('Error fetching daily stock summary:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

module.exports = router;
