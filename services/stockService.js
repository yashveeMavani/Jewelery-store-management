const {StockMaster} = require('../models');
async function createStockMaster(stockCode, stockName, category, branchId) {
    const existingStock = await StockMaster.findOne({ 
        where: { stock_code: stockCode, branch_id: branchId } 
    });

    if (!existingStock) {
        const newStock = await StockMaster.create({
            stock_code: stockCode,
            stock_name: stockName,
            category: category,
            branch_id: branchId  
        });
        return newStock;
    }
    return existingStock;
}

module.exports = {
    createStockMaster
};
