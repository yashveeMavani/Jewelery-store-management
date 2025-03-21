const express = require('express');
const router = express.Router();
const { DailyData } = require('../models');
const { authenticate } = require('../middleware/authmiddleware'); 

// API to get daily stock summary
router.get('/daily-stock-summary', authenticate,async (req, res) => {
    try {
        const branch_id = req.branch_id;
        
        const dailySummary = await DailyData.findAll({
            where: { branch_id },
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
