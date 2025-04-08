const { createStockMaster } = require("../services/stockService");
const { StockHistory } = require('../models');
const { recordStockMovement } = require('../services/stockService');
const { checkLowStock, sendLowStockAlerts } = require('../services/stockService');
const { StockData, SalesOrder, PurchaseOrder, StockMaster, User } = require("../models"); // Import User model
const { Sequelize } = require("sequelize");
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');

// Update stock from purchases
exports.updateStockFromPurchases = async (req, res, next) => {
  try {
    const branch_id = req.user.branch_id;
    const financial_year_id = req.user.financial_year;

    const stockSummary = await PurchaseOrder.findAll({
      attributes: [
        "category",
        [Sequelize.fn("SUM", Sequelize.col("gross_weight")), "total_gross_weight"],
        [Sequelize.fn("SUM", Sequelize.col("net_weight")), "total_net_weight"],
      ],
      where: { branch_id ,financial_year_id},
      group: ["category"],
    });

    for (const stock of stockSummary) {
      const stockCode = stock.dataValues.category;
      // const stockName = stockCode;

      // await createStockMaster(stockCode, stockName, stockCode, branch_id); 

      let existingStock = await StockData.findOne({
        where: { stock_code: stockCode, branch_id, financial_year_id },
      });

      if (!existingStock) {
        await StockData.create({
          stock_code: stockCode,
          gross_weight: stock.dataValues.total_gross_weight,
          net_weight: stock.dataValues.total_net_weight,
          branch_id,
          financial_year_id ,
        });
        await recordStockMovement(stockCode, branch_id, 'purchase', stock.dataValues.total_gross_weight, 'New stock added from purchase', financial_year_id );
      } else {
        await StockData.update(
          {
            gross_weight: stock.dataValues.total_gross_weight,
            net_weight: stock.dataValues.total_net_weight,
          },
          { where: { stock_code: stockCode, branch_id,financial_year_id  } }
        );
        await recordStockMovement(stockCode, branch_id, 'purchase', stock.dataValues.total_gross_weight, 'Stock updated from purchase', financial_year_id );
      }

      console.log(`Processed StockData for stock_code ${stockCode}`);
    }

    res.json({ message: "Stock data updated successfully!" });
  } catch (error) {
    console.error("Error updating stock data:", error);
    next(error);
  }
};

// Update stock from sales
exports.updateStockFromSales = (branch_id) => {
  return async (req, res, next) => {
    try {
      const branch_id = req.user.branch_id;
      const financial_year_id = req.user.financial_year;
      const salesSummary = await SalesOrder.findAll({
        attributes: [
          "category",
          [Sequelize.fn("SUM", Sequelize.col("gross_weight")), "total_gross_weight_sold"],
          [Sequelize.fn("SUM", Sequelize.col("net_weight")), "total_net_weight_sold"],
        ],
        where: { branch_id , financial_year_id },
        group: ["category"],
      });

      let stockUpdated = false;
      let errorMessages = [];

      for (const sale of salesSummary) {
        const stockCode = sale.dataValues.category;

        let existingStock = await StockData.findOne({
          where: { stock_code: stockCode, branch_id,financial_year_id  },
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
          { where: { stock_code: stockCode, branch_id,financial_year_id } }
        );

        // Record stock movement for sales
        await recordStockMovement(stockCode, branch_id, 'sale', sale.dataValues.total_gross_weight_sold, 'Stock reduced from sales');

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
};

// Fetch barcode and QR code for a stock item
exports.getBarcodeAndQRCode = async (req, res, next) => {
  try {
    const { stock_code } = req.params;
    const financial_year_id = req.user.financial_year;
    const stock = await StockMaster.findOne({ where: { stock_code , financial_year_id} });

    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock item not found.' });
    }

    res.status(200).json({
      success: true,
      data: {
        barcode: stock.barcode,
        qr_code: stock.qr_code,
      },
    });
  } catch (error) {
    console.error('Error fetching barcode/QR code:', error);
    next(error);
  }
};

// Create StockData
exports.createStockData = async (req, res, next) => {
  try {
    const { stock_code, gross_weight, net_weight } = req.body;
    const branch_id = req.user.branch_id; 
    const financial_year_id = req.user.financial_year;
    const newStockData = await StockData.create({
      stock_code,
      gross_weight,
      net_weight,
      branch_id,
      financial_year_id,
    });

    res.status(201).json({
      success: true,
      message: 'StockData created successfully',
      data: newStockData,
    });
  } catch (error) {
    console.error('Error creating StockData:', error);
    next(error);
  }
};



exports.createStockMaster = async (req, res, next) => {
  try {
    const { stock_code, stock_name, category } = req.body;
    const branch_id = req.user.branch_id;
    const financial_year_id = req.user.financial_year;
    // Generate a unique barcode
    const barcode = `${stock_code}-${uuidv4()}`;

    // Generate a QR code (e.g., encoding a URL or stock_code)
    const qr_code = await QRCode.toDataURL(`https://example.com/stock/${stock_code}`);

    // Create StockMaster
    const newStockMaster = await StockMaster.create({
      stock_code,
      stock_name,
      category,
      branch_id,
      barcode,
      qr_code,
      financial_year_id,
    });

    // Automatically create or update StockData
    const existingStockData = await StockData.findOne({
      where: { stock_code, branch_id, financial_year_id },
    });

    if (!existingStockData) {
      await StockData.create({
        stock_code,
        gross_weight: 0, 
        net_weight: 0,   
        branch_id,
        financial_year_id,
      });
    }

    res.status(201).json({
      success: true,
      message: 'StockMaster created successfully',
      data: newStockMaster,
    });
  } catch (error) {
    console.error('Error creating StockMaster:', error);
    next(error);
  }
};

exports.getBarcodeAndQRCode = async (req, res, next) => {
  try {
    const { stock_code } = req.params;
    const financial_year_id = req.user.financial_year;
    const stock = await StockMaster.findOne({ where: { stock_code ,financial_year_id} });

    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock item not found.' });
    }

    res.status(200).json({
      success: true,
      data: {
        barcode: stock.barcode,
        qr_code: stock.qr_code,
      },
    });
  } catch (error) {
    console.error('Error fetching barcode/QR code:', error);
    next(error);
  }
};


// Get StockData by stock_code
exports.getStockData = async (req, res, next) => {
  try {
    const { stock_code } = req.params;
    const financial_year_id = req.user.financial_year;

    const stockData = await StockData.findOne({ where: { stock_code ,financial_year_id} });

    if (!stockData) {
      return res.status(404).json({
        success: false,
        message: 'StockData not found',
      });
    }

    res.status(200).json({
      success: true,
      data: stockData,
    });
  } catch (error) {
    console.error('Error fetching StockData:', error);
    next(error);
  }
};

// Get StockMaster by stock_code
exports.getStockMaster = async (req, res, next) => {
  try {
    const { stock_code } = req.params;
    const financial_year_id = req.user.financial_year;
    const stockMaster = await StockMaster.findOne({ where: { stock_code ,financial_year_id } });

    if (!stockMaster) {
      return res.status(404).json({
        success: false,
        message: 'StockMaster not found',
      });
    }

    res.status(200).json({
      success: true,
      data: stockMaster,
    });
  } catch (error) {
    console.error('Error fetching StockMaster:', error);
    next(error);
  }
};

exports.verifyStockByBarcode = async (req, res, next) => {
  try {
    const { barcode } = req.body; // Scanned barcode from the request
    const financial_year_id = req.user.financial_year;
    // Find the stock item by barcode
    const stock = await StockMaster.findOne({ where: { barcode, financial_year_id  } });

    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock item not found.' });
    }

    // Fetch stock data for the stock_code
    const stockData = await StockData.findOne({ where: { stock_code: stock.stock_code,financial_year_id } });

    if (!stockData) {
      return res.status(404).json({ success: false, message: 'Stock data not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Stock item verified successfully.',
      data: {
        stock_code: stock.stock_code,
        stock_name: stock.stock_name,
        gross_weight: stockData.gross_weight,
        net_weight: stockData.net_weight,
      },
    });
  } catch (error) {
    console.error('Error verifying stock by barcode:', error);
    next(error);
  }
};
exports.processSaleByBarcode = async (req, res, next) => {
  try {
    const { barcode, quantity } = req.body; 
    const branch_id = req.user.branch_id;
    const financial_year_id = req.user.financial_year; 
    
    // Find the stock item by barcode
    const stock = await StockMaster.findOne({ where: { barcode ,financial_year_id } });

    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock item not found.' });
    }

    // Fetch stock data for the stock_code
    const stockData = await StockData.findOne({ where: { stock_code: stock.stock_code, branch_id , financial_year_id} });

    if (!stockData) {
      return res.status(404).json({ success: false, message: 'Stock data not found.' });
    }

    // Check if there is enough stock
    if (stockData.gross_weight < quantity) {
      return res.status(400).json({ success: false, message: 'Not enough stock available.' });
    }

    // Update stock quantities
    const newGrossWeight = stockData.gross_weight - quantity;
    await StockData.update(
      { gross_weight: newGrossWeight },
      { where: { stock_code: stock.stock_code, branch_id, financial_year_id  } }
    );

    // Record stock movement
    await recordStockMovement(stock.stock_code, branch_id, 'sale', quantity, 'Stock reduced from sales',financial_year_id);

    res.status(200).json({
      success: true,
      message: 'Sale processed successfully.',
      data: {
        stock_code: stock.stock_code,
        remaining_stock: newGrossWeight,
      },
    });
  } catch (error) {
    console.error('Error processing sale by barcode:', error);
    next(error);
  }
};
const DEFAULT_EMAIL = process.env.DEFAULT_EMAIL || 'yashveemavani@gmail.com'; 

exports.getLowStockAlerts = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is not defined. Cannot fetch low stock alerts.',
      });
    }

    const branch_id = req.user.branch_id; // Extract branch_id from the authenticated user

    // Fetch the user's email from the database
    const user = await User.findOne({ where: { id: req.user.id } });
    const email = user && user.email ? user.email : 'yashveemavani@gmail.com'; // Use default email if user's email is not defined

    const lowStockItems = await checkLowStock(branch_id);

    if (lowStockItems.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No low stock alerts.',
      });
    }

    // Send email alerts
    await sendLowStockAlerts(lowStockItems, email);

    res.status(200).json({
      success: true,
      message: 'Low stock alerts found and email sent.',
      data: lowStockItems,
    });
  } catch (error) {
    console.error('Error fetching low stock alerts:', error);
    next(error);
  }
};