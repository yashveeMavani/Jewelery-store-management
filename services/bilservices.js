const Purchase = require("../models/purchase");
const PurchaseOrder = require("../models/purchase_order");
const Sales = require("../models/sales");
const SalesOrder = require("../models/sales_order");
const Client = require("../models/client");
const { exportToCSV, exportToPDF } = require("../utils/bilsend");

exports.getPurchaseBill = async (client_id) => {
  try {
    let purchase = {};
    if (client_id) {
      purchase = await Purchase.findOne({ where: { client_id: client_id } });
    }

    // console.log(purchase);

    const whereClause = {};
    if (client_id && purchase) whereClause.purchase_id = purchase.id;
    if (!purchase) throw new Error("data not found");

    const purchaseorders = await PurchaseOrder.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Purchase,
          as: "purchase",
          include: [{ model: Client, as: "client" }],
        },
      ],
    });
    console.log("hello Deep", purchaseorders);

    const reportData = purchaseorders.rows.map((purchaseorders) => ({
      client_name: purchaseorders.purchase.client.name,
      Categoryname: purchaseorders.category,
      gross_weight: purchaseorders.gross_weight,
      net_weight: purchaseorders.net_weight,
      stone_weight: purchaseorders.stone_weight,
      rate: purchaseorders.rate,
      amount: purchaseorders.amount,
    }));
    let total_amount = 0;

    reportData.forEach((reportData) => {
      total_amount += parseInt(reportData.amount);
    });
    console.log(total_amount);
    return exportToPDF(
      reportData,
      total_amount,
      "purchase_bill.hbs",
      "purchase_report.pdf",
      purchaseorders.rows[0].purchase.client.email
    );
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch purchase reports");
  }
};

exports.getSaleBil = async (client_id) => {
  try {
    let sale = {};
    if (client_id) {
      sale = await Sales.findOne({ where: { client_id } });
    }
    // console.log(sale);

    const whereClause = {};
    if (client_id && sale) whereClause.sales_id = sale.id;
    if (!sale) throw new Error("data not found");

    const salesorders = await SalesOrder.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Sales,
          as: "sales",
          include: [{ model: Client, as: "client" }],
        },
      ],
    });
    //    console.log("hello Deep",salesorders);

    const reportData = salesorders.rows.map((salesorders) => ({
      client_name: salesorders.sales.client.name,
      Categoryname: salesorders.category,
      gross_weight: salesorders.gross_weight,
      net_weight: salesorders.net_weight,
      stone_weight: salesorders.stone_weight,
      rate: salesorders.rate,
      amount: salesorders.amount,
    }));

    let total_amount = 0;

    reportData.forEach((reportData) => {
      total_amount += parseInt(reportData.amount);
    });
    return exportToPDF(
      reportData,
      total_amount,
      "sales_bill.hbs",
      "sales_report.pdf",
      salesorders.rows[0].sales.client.email
    );
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch sales reports");
  }
};
