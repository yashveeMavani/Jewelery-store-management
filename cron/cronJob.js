const cron = require('node-cron');
const generateDailyStockSummary = require('../cron/stockSummaryCron');

// Schedule job to run daily at 11:00 PM (23:00)
cron.schedule('0 23 * * *', () => {
    console.log('Running scheduled stock summary update...');
    generateDailyStockSummary();
}, {
    scheduled: true,
    timezone: "Asia/Kolkata" 
});

console.log("Cron job scheduled for daily stock summary at 11:00 PM.");
