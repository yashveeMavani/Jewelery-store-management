const StockMaster = require('../models/StockMaster');
// const StockData = require('../models/StockData');

async function createStockMaster(stockCode, stockName, category) {
    // Check if stock exists in the StockMaster table
    const existingStock = await StockMaster.findOne({ where: { stock_code: stockCode } });

    if (!existingStock) {
        // If stock doesn't exist, create a new record
        const newStock = await StockMaster.create({
            stock_code: stockCode,
            stock_name: stockName,  // Ensure stock_name is provided
            category: category
        });
        return newStock;
    }
    return existingStock; // Return existing stock if found
}


module.exports = {
    createStockMaster
};
