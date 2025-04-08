const { Op, fn, col } = require("sequelize");
const { sequelize } = require("../models"); 
const { exportToCSV, exportToPDF } = require('../utils/reports');
const { Purchase, PurchaseOrder, Sales, SalesOrder, Client } = require('../models');

exports.getPurchaseCsvReport = async (req, res, next) => {
  try {
      const { page = 1, limit = 10, client_id, date_from, date_to } = req.query;
      const branch_id = req.user.branch_id; 
      const financial_year_id = req.user.financial_year;

      const [purchaseOrders] = await sequelize.query(
          `CALL GetPurchaseReport(:client_id, :date_from, :date_to, :page, :limit, :branch_id)`,
          {
              replacements: { 
                  client_id, 
                  date_from, 
                  date_to, 
                  page: parseInt(page), 
                  limit: parseInt(limit), 
                  branch_id,
                  financial_year_id,
              }
          }
      );

      if (!purchaseOrders || purchaseOrders.length === 0) {
          return res.json({ msg: 'data not found' });
      }

      return exportToCSV(res, purchaseOrders, 'purchase_report.csv');

  } catch (error) {
      console.error(error);
      next(error);
  }
};

exports.getPurchasePdfReport = async (req, res, next) => {
  try {
      const { page = 1, limit = 10, client_id, date_from, date_to} = req.query;
      const branch_id = req.user.branch_id;
      const financial_year_id = req.user.financial_year;

      const [purchaseOrders] = await sequelize.query(
          `CALL GetPurchasePdfReport(:client_id, :date_from, :date_to, :page, :limit_value, :branch_id)`,
          {
              replacements: {
                  client_id: client_id || null,
                  date_from: date_from || null,
                  date_to: date_to || null,
                  page: parseInt(page) || 1,
                  limit_value: parseInt(limit) || 10,
                  branch_id,
                  financial_year_id,
              }
          }
      );
      console.log("Raw purchaseOrders data:", purchaseOrders);

      const purchaseOrdersData = Array.isArray(purchaseOrders) ? purchaseOrders : [purchaseOrders];

      if (!purchaseOrdersData.length) {
          return res.json({ msg: "data not found" });
      }

      const reportData = purchaseOrdersData.map((row) => ({
          client_name: row.client_name,
          Categoryname: row.Categoryname,
          gross_weight: row.gross_weight,
          net_weight: row.net_weight,
          stone_weight: row.stone_weight,
          rate: row.rate,
          amount: row.amount
      }));

      return exportToPDF(
          res,
          reportData,
          "purchase_report.hbs",
          "purchase_report.pdf"
      );

  } catch (error) {
      console.error("Error in getPurchasePdfReport:", error);
      next(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


exports.getSalesCsvReport = async (req, res, next) => {
  try {
      const { 
          page = 1, 
          limit = 10, 
          client_id, 
          date_from, 
          date_to,    
      } = req.query;

      const branch_id = req.user.branch_id;
      const financial_year_id = req.user.financial_year;
      console.log("Query Parameters:", {
        client_id,
        date_from,
        date_to,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        branch_id,
        financial_year_id,
      });

      const [salesOrders] = await sequelize.query(
          `CALL GetSalesReport(:client_id, :date_from, :date_to, :page, :limit, :branch_id)`,
          
          {
              replacements: { 
                client_id: client_id || null, 
              date_from: date_from || null,
             date_to: date_to || null,
              page: parseInt(page, 10),
              limit: parseInt(limit, 10),
              branch_id,
              financial_year_id,
              }
          }
      );

      console.log("Sales Orders:", salesOrders); 

      if (!salesOrders || salesOrders.length === 0) {
          return res.status(404).json({ msg: "data not found" });
      }
    
      res.status(200).json(salesOrders);
      return exportToCSV(res, salesOrders, "sales_report.csv");
  } catch (error) {
      console.error("Error fetching sales report:", error);
      next(error);
  }
};

exports.getSalesPdfReport = async (req, res, next) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            client_id, 
            date_from, 
            date_to 
        } = req.query;
  
        const branch_id = req.user.branch_id; 
        const financial_year_id = req.user.financial_year;
        if (!branch_id) {
            return res.status(400).json({ success: false, message: "Branch ID is required" });
        }
  
        const parsedPage = parseInt(page, 10);
        const parsedLimit = parseInt(limit, 10);
        const [salesOrders] = await sequelize.query(
            `CALL GetSalesPdfReport(:client_id, :date_from, :date_to, :page, :limit, :branch_id)`,
            {
                replacements: {
                    client_id: client_id || null,
                    date_from: date_from || null,
                    date_to: date_to || null,
                    page: parsedPage || 1,
                    limit: parsedLimit || 10,
                    branch_id ,
                    financial_year_id,
                }
            }
        );
  
        console.log("Raw salesOrders data:", salesOrders);
     
        if (!salesOrders) {
            return res.status(404).json({ success: false, message: "No sales data found for the given criteria" });
        }
        const reportData = {
            client_name: salesOrders.client_name || "N/A", 
            Categoryname:  salesOrders.Categoryname || "N/A", 
            gross_weight:  salesOrders.gross_weight || 0,
            net_weight:  salesOrders.net_weight || 0,
            stone_weight:  salesOrders.stone_weight || 0,
            rate:  salesOrders.rate || 0,
            amount:  salesOrders.amount || 0
        }
        return exportToPDF(
            res,
            reportData,
            "sales_report.hbs",
            "sales_report.pdf"
        );
  
    } catch (error) {
        console.error("Error in getSalesPdfReport:", error);
        next(error);
    }
  };

exports.getBalanceSheetCsvReport = async (req, res, next) => {
  try {
      const { date_from, date_to} = req.query;  
      const branch_id = req.user.branch_id; 
      const financial_year_id = req.user.financial_year;
      console.log("Query Params:", { date_from, date_to, branch_id });

      const [balanceSheet] = await sequelize.query(
          `CALL GetBalanceSheetReport(:date_from, :date_to, :branch_id)`,  
          {
              replacements: { 
                  date_from, 
                  date_to,
                  branch_id ,
                  financial_year_id,
              },
          }
      );

      console.log("Balance Sheet Raw Result:", balanceSheet);
      const balanceSheetData = Array.isArray(balanceSheet) ? balanceSheet : [balanceSheet];

      if (!balanceSheetData.length || Object.keys(balanceSheetData[0]).length === 0) {
          return res.json({ msg: 'data not found' });
      }

      return exportToCSV(res, balanceSheetData, 'balance_sheet_report.csv');

  } catch (error) {
      console.error("Error fetching balance sheet report:", error);
      next(error);
  }
};


exports.getBalanceSheetPdfReport = async (req, res, next) => {
  try {
    
      const branch_id = req.user.branch_id; 
      const financial_year_id = req.user.financial_year;
      const [rowsRaw] = await sequelize.query(
          `CALL GetBalanceSheetPdfReport(:branch_id)`, 
          {
              replacements: { branch_id ,financial_year_id}
          }
      );

      console.log("Raw rows from procedure:", rowsRaw);

      const rows = Array.isArray(rowsRaw) ? rowsRaw : [rowsRaw];

      if (!rows.length || Object.keys(rows[0]).length === 0) {
          return res.json({ msg: "data not found" });
      }

      let totalCredit = 0;
      let totalDebit = 0;
      rows.forEach((row) => {
          totalCredit += parseFloat(row.credit);
          totalDebit += parseFloat(row.debit);
      });

      rows.push({
          party_name: "Total",
          credit: totalCredit,
          debit: totalDebit,
      });

      return exportToPDF(
          res,
          rows,
          "balance_sheet.hbs",
          "balance_sheet.pdf"
      );
  } catch (error) {
      console.error("Error in getBalanceSheetPdfReport:", error);
      next(error);
  }
};
