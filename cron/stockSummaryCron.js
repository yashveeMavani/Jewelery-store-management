const sequelize = require('../config/config');
const StockData = require('../models/StockData');
const DailyData = require('../models/daily_data');

async function generateDailyStockSummary() {
    try {
        console.log("Running daily stock summary job...");

        // Aggregate total gross weight and net weight from stockdata table
        const summary = await StockData.findAll({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('gross_weight')), 'total_gross_weight'],
                [sequelize.fn('SUM', sequelize.col('net_weight')), 'total_net_weight']
            ],
            raw: true
        });

        await DailyData.create({
            date: new Date(),
            total_sales: summary[0].total_gross_weight || 0,  
            total_purchases: summary[0].total_net_weight || 0  
        });

        console.log("Daily stock summary updated successfully.");
    } catch (error) {
        console.error("Error generating daily stock summary:", error.message);
    }
}

module.exports = generateDailyStockSummary;


