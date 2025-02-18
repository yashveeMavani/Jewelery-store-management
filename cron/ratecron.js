
const cron = require('node-cron');
const Purchase=require('../models/purchase');
const DailyData=require('../models/daily_data');
const Sales=require('../models/sales');
const { Op } = require('sequelize');


cron.schedule('59 23 * * *', async () => {

    const today = new Date().toLocaleDateString();

    try {
        const totalSales = await Sales.sum('total_amount', {
            where: {
                createdAt: {
                    [Op.gte]: new Date(`${today} 00:00:00`),
                    [Op.lte]: new Date(`${today} 23:59:59`)
                }
            }
        }) || 0;

        const totalPurchases = await Purchase.sum('total_amount', {
            where: {
                createdAt: {
                    [Op.gte]: new Date(`${today}T00:00:00`),
                    [Op.lte]: new Date(`${today}T23:59:59`)
                }
            }
        }) || 0;

        await DailyData.upsert({
            date: today,
            total_sales: totalSales,
            total_purchases: totalPurchases
        });

        console.log(' Daily sales and purchase data recorded successfully!');
    } catch (error) {
        console.error('Error running daily cron job:', error);
    }

});
