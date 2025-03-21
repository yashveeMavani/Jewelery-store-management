const { createStockMaster } = require("../services/stockService");
const { StockData, SalesOrder, PurchaseOrder } = require("../models");
const { Sequelize } = require("sequelize");

exports.updateStockFromPurchases = async (req, res, next) => {
  try {
    const branch_id = req.user.branch_id; 

    // Aggregate total stock purchased
    const stockSummary = await PurchaseOrder.findAll({
      attributes: [
        "category",
        [Sequelize.fn("SUM", Sequelize.col("gross_weight")), "total_gross_weight"],
        [Sequelize.fn("SUM", Sequelize.col("net_weight")), "total_net_weight"],
      ],
      where: { branch_id }, 
      group: ["category"],
    });

    for (const stock of stockSummary) {
      const stockCode = stock.dataValues.category;
      const stockName = stockCode;

      
      await createStockMaster(stockCode, stockName, stockCode, branch_id);

      // Check if stock data already exists in StockData table
      let existingStock = await StockData.findOne({
        where: { stock_code: stockCode, branch_id },
      });

      if (!existingStock) {
        await StockData.create({
          stock_code: stockCode,
          gross_weight: stock.dataValues.total_gross_weight,
          net_weight: stock.dataValues.total_net_weight,
          branch_id 
        });
      } else {
        await StockData.update(
          {
            gross_weight: stock.dataValues.total_gross_weight,
            net_weight: stock.dataValues.total_net_weight,
          },
          { where: { stock_code: stockCode, branch_id } }
        );
      }

      console.log(`Processed StockData for stock_code ${stockCode}`);
    }

    res.json({ message: "Stock data updated successfully!" });
  } catch (error) {
    console.error("Error updating stock data:", error);
    next(error);
  }
};

exports.updateStockFromSales = async (req, res, next) => {
  try {
    const branch_id = req.user.branch_id;

    const salesSummary = await SalesOrder.findAll({
      attributes: [
        "category",
        [Sequelize.fn("SUM", Sequelize.col("gross_weight")), "total_gross_weight_sold"],
        [Sequelize.fn("SUM", Sequelize.col("net_weight")), "total_net_weight_sold"],
      ],
      where: { branch_id },  
      group: ["category"],
    });

    let stockUpdated = false;
    let errorMessages = [];

    for (const sale of salesSummary) {
      const stockCode = sale.dataValues.category;

      let existingStock = await StockData.findOne({
        where: { stock_code: stockCode, branch_id }
      });

      if (!existingStock) {
        errorMessages.push(`Stock entry not found for ${stockCode}, sale cannot be processed.`);
        continue;
      }

      let newGrossWeight = existingStock.gross_weight - sale.dataValues.total_gross_weight_sold;
      let newNetWeight = existingStock.net_weight - sale.dataValues.total_net_weight_sold;

      if (newGrossWeight < 0 || newNetWeight < 0) {
        errorMessages.push(`Not enough stock for ${stockCode}, sale exceeds available quantity.`);
        continue;
      }

      await StockData.update(
        { gross_weight: newGrossWeight, net_weight: newNetWeight },
        { where: { stock_code: stockCode, branch_id } }
      );

      stockUpdated = true;
      console.log(`Stock updated for ${stockCode} in branch ${branch_id}`);
    }

    if (errorMessages.length > 0) {
      throw new Error(errorMessages.join("\n"));
    }

    if (!stockUpdated) {
      throw new Error("No stock updates were performed.");
    }

    res.json({ success: true, message: "Stock data updated successfully!" });
  } catch (error) {
    console.error("Error updating stock data from sales:", error);
    next(error);
  }
};