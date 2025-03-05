const { createStockMaster } = require("../services/stockService");
const PurchaseOrder = require("../models/purchase_order");
const StockData = require("../models/StockData");
const SalesOrder = require("../models/sales_order");
const { Sequelize } = require("sequelize");

exports.updateStockFromPurchases = async (req, res,next) => {
  try {
    // Aggregate total stock purchased
    const stockSummary = await PurchaseOrder.findAll({
      attributes: [
        "category",
        [
          Sequelize.fn("SUM", Sequelize.col("gross_weight")),
          "total_gross_weight",
        ],
        [Sequelize.fn("SUM", Sequelize.col("net_weight")), "total_net_weight"],
      ],
      group: ["category"],
    });

    for (const stock of stockSummary) {
      const stockCode = stock.dataValues.category;
      const stockName = stockCode; // Adjust if necessary

      // Ensure stock exists in StockMaster (create if not exists)
      await createStockMaster(stockCode, stockName, stockCode);

      // Check if stock data already exists in StockData table
      let existingStock = await StockData.findOne({
        where: { stock_code: stockCode },
      });

      if (!existingStock) {
        // If no existing stock, create a new record
        await StockData.create({
          stock_code: stockCode,
          gross_weight: stock.dataValues.total_gross_weight,
          net_weight: stock.dataValues.total_net_weight,
        });
      } else {
        // If stock exists, update the existing record
        await StockData.update(
          {
            gross_weight: stock.dataValues.total_gross_weight,
            net_weight: stock.dataValues.total_net_weight,
          },
          { where: { stock_code: stockCode } }
        );
      }

      console.log(`Processed StockData for stock_code ${stockCode}`);
    }

    res.json({ message: "Stock data updated successfully!" });
  } catch (error) {
    console.error("Error updating stock data:", error);
    next(error);
    // res.status(500).json({ error: error.message });
  }
};


exports.updateStockFromSales = async () => {
  try {
    // Aggregate total stock sold
    const salesSummary = await SalesOrder.findAll({
      attributes: [
        "category",
        [
          Sequelize.fn("SUM", Sequelize.col("gross_weight")),
          "total_gross_weight_sold",
        ],
        [
          Sequelize.fn("SUM", Sequelize.col("net_weight")),
          "total_net_weight_sold",
        ],
      ],
      group: ["category"],
    });

    let stockUpdated = false; // Flag to check if at least one stock was updated
    let errorMessages = []; // Accumulate errors for invalid stocks

    for (const sale of salesSummary) {
      const stockCode = sale.dataValues.category;

      // Check if stock exists in StockData
      let existingStock = await StockData.findOne({
        where: { stock_code: stockCode },
      });
      console.log("existingStock => ", existingStock);

      if (!existingStock) {
        // Accumulate error if stock not found
        errorMessages.push(
          `Stock entry not found for ${stockCode}, sale cannot be processed.`
        );
        continue; // Skip this iteration
      }

      // Calculate new stock values

      let newGrossWeight =
        existingStock.gross_weight - sale.dataValues.total_gross_weight_sold;
      let newNetWeight =
        existingStock.net_weight - sale.dataValues.total_net_weight_sold;

      // Prevent negative stock values
      if (newGrossWeight < 0 || newNetWeight < 0) {
        // Accumulate error if stock is insufficient
        errorMessages.push(
          `Not enough stock for ${stockCode}, sale exceeds available quantity.`
        );
        continue; // Skip this iteration
      }

      // Update the stock_data table
      await StockData.update(
        {
          gross_weight: newGrossWeight,
          net_weight: newNetWeight,
        },
        { where: { stock_code: stockCode } }
      );

      stockUpdated = true;
      console.log(
        `Stock updated after sale for ${stockCode}: Gross ${newGrossWeight}, Net ${newNetWeight}`
      );
    }

    // If errors occurred, send them in the response
    if (errorMessages.length > 0) {
      throw new Error(errorMessages.join("\n"));
    }

    // If no stock was updated, send an error response
    if (!stockUpdated) {
      throw new Error("No stock updates were performed.");
    }

    // Send success response only once at the end
    return {
      success: true,
      message: "Stock data updated after sales successfully!",
    };
  } catch (error) {
    // console.error('Error updating stock data from sales:', error);
    throw new Error(error.message);
  }
};
