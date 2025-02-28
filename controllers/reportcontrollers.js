const { Op } = require('sequelize');
const sequelize = require('../config/config')
const { exportToCSV, exportToPDF } = require('../utils/reports');
const Client=require('../models/client');
const PurchaseOrder=require('../models/purchase_order');
const SalesOrder=require('../models/sales_order');
const Sales=require('../models/sales');
const Purchase=require('../models/purchase');




// Utility Function for Pagination

// Purchase Reports
// exports.getPurchaseCsvReport = async (req, res) => {
//     try {
//         const { page = 1, limit = 10, client_id, date_from, date_to } = req.query;
         
//         let purchase={};
//         if(client_id)
//         {
//              purchase=await Purchase.findOne({where:{client_id}});
//         }
        
//         // console.log(purchase);
//         const  offset=(page-1)*limit;

//         const whereClause = {};
//         if (client_id && purchase) whereClause.purchase_id = purchase.id;
//         if(!purchase)
//             return res.json({msg:'data not found'});

//         if (date_from && date_to) {
//             whereClause.voucher_date = { [Op.between]: [date_from, date_to] };
//         }

        
//         // console.log(purchase);

//         const purchaseorders= await PurchaseOrder.findAndCountAll({
//             where:whereClause,
//             include: [{ model: Purchase, as: 'purchase', include: [ {model: Client, as: 'client'}] }],
//             limit: parseInt(limit),
//             offset: parseInt(offset)
//         });

//     const reportData = purchaseorders.rows.map(purchaseorders => ({
//         client_name: purchaseorders.purchase.client.name,
//         Categoryname:purchaseorders.category,
//         gross_weight: purchaseorders.gross_weight,
//         net_weight: purchaseorders.net_weight,
//         stone_weight: purchaseorders.stone_weight,
//         rate:purchaseorders.rate,
//         amount: purchaseorders.amount,
//     }));

//         return exportToCSV(res, reportData, 'purchase_report.csv');

//         res.json({ data: reportData});
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to fetch purchase reports' });
//     }
// };
// exports.getPurchasePdfReport = async (req, res) => {
//     try {
//         const { page = 1, limit = 10, client_id, date_from, date_to } = req.query;

//         let purchase={};
//         if(client_id)
//         {
//         purchase=await Purchase.findOne({where:{client_id:client_id}});
//         }
       

//         const  offset=(page-1)*limit;

//         const whereClause = {};
//         if (client_id && purchase) whereClause.purchase_id = purchase.id;
//         if(!purchase)
//             return res.json({msg:'data not found'});

//         if (date_from && date_to) {
//             whereClause.voucher_date = { [Op.between]: [date_from, date_to] };
//         }

//         const purchaseorders= await PurchaseOrder.findAndCountAll({
//             where:whereClause,
//             include: [{ model: Purchase, as: 'purchase', include: [ {model: Client, as: 'client'}] }],
//             limit: parseInt(limit),
//             offset: parseInt(offset)
//         });
//        console.log("hello Yashvee",purchaseorders);

//     const reportData = purchaseorders.rows.map(purchaseorders => ({
//         client_name: purchaseorders.purchase.client.name,
//         Categoryname:purchaseorders.category,
//         gross_weight: purchaseorders.gross_weight,
//         net_weight: purchaseorders.net_weight,
//         stone_weight: purchaseorders.stone_weight,
//         rate:purchaseorders.rate,
//         amount: purchaseorders.amount,
//     }));

//     return exportToPDF(res, reportData, 'purchase_report.hbs', 'purchase_report.pdf',purchaseorders.rows[0].purchase.client.email);

        
//         res.json({ data: reportData});
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to fetch purchase reports' });
//     }
// };


// exports.getSalesCsvReport = async (req, res) => {
//     try{
//     const { page = 1, limit = 10, client_id, date_from, date_to } = req.query;

//         let sale={};
//         if(client_id)
//         {
//         sale=await Sales.findOne({where:{client_id}});
//         }
//         console.log(sale);

//         const  offset=(page-1)*limit;

//         const whereClause = {};
//         if (client_id && sale) whereClause.sales_id = sale.id;
//         if(!sale)
//             return res.json({msg:'data not found'});

//         if (date_from && date_to) {
//             whereClause.voucher_date = { [Op.between]: [date_from, date_to] };
//         }

//         const salesorders= await SalesOrder.findAndCountAll({
//             where:whereClause,
//             include: [{ model: Sales, as: 'sales', include: [ {model: Client, as: 'client'}] }],
//             limit: parseInt(limit),
//             offset: parseInt(offset)
//         });
//     const reportData = salesorders.rows.map(salesorders => ({
//         client_name: salesorders.sales.client.name,
//         Categoryname:salesorders.category,
//         gross_weight: salesorders.gross_weight,
//         net_weight: salesorders.net_weight,
//         stone_weight:salesorders.stone_weight,
//         rate:salesorders.rate,
//         amount: salesorders.amount,
//     }));
//     return exportToCSV(res, reportData, 'sales_report.csv');

//         res.json({ data: reportData });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to fetch sales reports' });
//     }
// };


// exports.getSalesPdfReport = async (req, res) => {
//     try {
//         const { page = 1, limit = 10, client_id, date_from, date_to } = req.query;

//         let sale={};
//         if(client_id)
//         {
//         sale=await Sales.findOne({where:{client_id}});
//         }
//         console.log(sale);

//         const  offset=(page-1)*limit;

//         const whereClause = {};
//         if (client_id && sale) whereClause.sales_id = sale.id;
//         if(!sale)
//             return res.json({msg:'data not found'});

//         if (date_from && date_to) {
//             whereClause.voucher_date = { [Op.between]: [date_from, date_to] };
//         }

//         const salesorders= await SalesOrder.findAndCountAll({
//             where:whereClause,
//             include: [{ model: Sales, as: 'sales', include: [ {model: Client, as: 'client'}] }],
//             limit: parseInt(limit),
//             offset: parseInt(offset)
//         });
    

//     const reportData = salesorders.rows.map(salesorders => ({
//         client_name: salesorders.sales.client.name,
//         Categoryname:salesorders.category,
//         gross_weight: salesorders.gross_weight,
//         net_weight: salesorders.net_weight,
//         stone_weight:salesorders.stone_weight,
//         rate:salesorders.rate,
//         amount: salesorders.amount,
//     }));
//     return exportToPDF(res, reportData,'sales_report.hbs','sales_report.pdf');


        
//         res.json({ data: salesorders });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to fetch sales reports' });
//     }
// };



// exports.getBalanceSheetCsvReport = async (req, res) => { 
//     try {

//         // Fetch Purchases
//         const purchases = await Purchase.findAll({
          
//             include: [{ model: Client, as: 'client' }],
//         });

//         // Fetch Sales
//         const sales = await Sales.findAll({
            
//             include: [{ model: Client, as: 'client' }],
//         });

//         const reportData = [];

//         purchases.forEach(purchase => {
//             reportData.push({
//                 party_name: purchase.client.name,
//                 credit: purchase.total_amount,
//                 debit: 0,
//             });
//             reportData.push({
//                 party_name: purchase.opposite_account,
//                 credit: 0,
//                 debit: purchase.total_amount,
//             });
//         });

//         sales.forEach(sale => {
//             reportData.push({
//                 party_name: sale.client.name,
//                 credit: 0,
//                 debit: sale.total_amount,
//             });
//             reportData.push({
//                 party_name: sale.opposite_account,
//                 credit: sale.total_amount,
//                 debit: 0,
//             });
//         });

//         const totalCredit = reportData.reduce((sum, row) => sum + parseFloat(row.credit), 0);
//         const totalDebit = reportData.reduce((sum, row) => sum + parseFloat(row.debit), 0);

//         reportData.push({
//             party_name: 'Total',
//             credit: totalCredit,
//             debit: totalDebit,
//         });
        

//         return exportToCSV(res, reportData, 'balance_sheet.csv');

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to fetch balance sheet report' });
//     }
// };
// exports.getBalanceSheetPdfReport = async (req, res) => {
//     try {

//         const purchases = await Purchase.findAll({
          
//             include: [{ model: Client, as: 'client' }],
//         });


//         const sales = await Sales.findAll({
            
//             include: [{ model: Client, as: 'client' }],
//         });

//         const reportData = [];

//         purchases.forEach(purchase => {
//             reportData.push({
//                 party_name: purchase.client.name,
//                 credit: purchase.total_amount,
//                 debit: 0,
//             });
//             reportData.push({
//                 party_name: purchase.opposite_account,
//                 credit: 0,
//                 debit: purchase.total_amount,
//             });
//         });

//         sales.forEach(sale => {
//             reportData.push({
//                 party_name: sale.client.name,
//                 credit: 0,
//                 debit: sale.total_amount,
//             });
//             reportData.push({
//                 party_name: sale.opposite_account,
//                 credit: sale.total_amount,
//                 debit: 0,
//             });
//         });

//         const totalCredit = reportData.reduce((sum, row) => sum + parseFloat(row.credit), 0);
//         const totalDebit = reportData.reduce((sum, row) => sum + parseFloat(row.debit), 0);

//         reportData.push({
//             party_name: 'Total',
//             credit: totalCredit,
//             debit: totalDebit,
//         });


//         return exportToPDF(res, reportData, 'balance_sheet.hbs', 'balance_sheet.pdf');

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to fetch balance sheet report' });
//     }
// };

exports.getPurchaseCsvReport = async (req, res) => {
    try {
        const { page = 1, limit = 10, client_id, date_from, date_to } = req.query;
 
        const parsedPage = parseInt(page, 10);
        const parsedLimit = parseInt(limit, 10);
        const parsedClientId = client_id ? parseInt(client_id, 10) : null;

        const [purchaseOrders] = await sequelize.query(
            `CALL GetPurchaseReport(:client_id, :date_from, :date_to, :page, :limit)`,
            {
                replacements: { client_id: parsedClientId, date_from, date_to, page: parsedPage, limit: parsedLimit }
            }
        );

        console.log("Raw Response:", purchaseOrders); 

        if (!purchaseOrders || purchaseOrders.length === 0) {
            return res.json({ msg: 'data not found' });
        }

        return exportToCSV(res, purchaseOrders, 'purchase_report.csv');

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch purchase reports' });
    }
};

exports.getPurchasePdfReport = async (req, res) => {
    try {
        const { page = 1, limit = 10, client_id, date_from, date_to } = req.query;

     
        const [purchaseOrders] = await sequelize.query(
            `CALL GetPurchasePdfReport(:client_id, :date_from, :date_to, :page, :limit)`,
            {
                replacements: { client_id, date_from, date_to, page, limit }
            }
        );

        console.log("Purchase Orders Raw:", purchaseOrders);
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

        return exportToPDF(res, reportData, "purchase_report.hbs", "purchase_report.pdf", purchaseOrdersData[0].client_email);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch purchase reports" });
    }
};

exports.getSalesCsvReport = async (req, res) => {
    try {
        const { page = 1, limit = 10, client_id, date_from, date_to } = req.query;

        const [salesOrders] = await sequelize.query(
            `CALL GetSalesReport(:client_id, :date_from, :date_to, :page, :limit)`,
            {
                replacements: { client_id, date_from, date_to, page, limit }
            }
        );

        console.log("Sales Orders:", salesOrders); 

        const salesData = Array.isArray(salesOrders) ? salesOrders : [salesOrders];

        // Check if data exists
        if (!salesData.length || (salesData.length === 1 && Object.keys(salesData[0]).length === 0)) {
            return res.status(404).json({ msg: "data not found" });
        }

        res.status(200).json(salesData);

    } catch (error) {
        console.error("Error fetching sales report:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getSalesPdfReport = async (req, res) => {
    try {
      const { page = 1, limit = 10, client_id, date_from, date_to } = req.query;
      const parsedPage = parseInt(page, 10);
      const parsedLimit = parseInt(limit, 10);
  
      const [salesOrders] = await sequelize.query(
        `CALL GetSalesPdfReport(:client_id, :date_from, :date_to, :page, :limit)`,
        {
          replacements: {
            client_id,
            date_from,
            date_to,
            page: parsedPage,
            limit: parsedLimit
          }
        }
      );
      const salesOrdersData = Array.isArray(salesOrders) ? salesOrders : [salesOrders];
  
      if (!salesOrdersData.length) {
        return res.json({ msg: "data not found" });
      }
  
      const reportData = salesOrdersData.map((row) => ({
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
        "sales_report.hbs",
        "sales_report.pdf"
       
      );
  
    } catch (error) {
      console.error("Error in getSalesPdfReport:", error);
      return res.status(500).json({ error: "Failed to fetch sales reports" });
    }
}; 
  

exports.getBalanceSheetCsvReport = async (req, res) => {
    try {
        const { date_from, date_to } = req.query;
        console.log("Query Params:", { date_from, date_to });
        const [balanceSheet] = await sequelize.query(
            `CALL GetBalanceSheetReport(:date_from, :date_to)`,
            {
                replacements: { date_from, date_to },
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
        res.status(500).json({ error: 'Failed to fetch balance sheet report' });
    }
};
  
exports.getBalanceSheetPdfReport = async (req, res) => {
    try {
      const [rowsRaw] = await sequelize.query("CALL GetBalanceSheetPdfReport()");
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
      res.status(500).json({ error: "Failed to fetch balance sheet report" });
    }
  };
  