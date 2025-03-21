const { Purchase, PurchaseOrder } = require("../models");
const { Sales, SalesOrder } = require("../models");
const { Client } = require("../models");
const { exportToCSV, exportToPDF } = require("../utils/bilsend");


exports.getPurchaseBill = async (client_id, branch_id) => {
  try {
    console.log(`Fetching purchase report for client_id=${client_id}, branch_id=${branch_id}`);

    const purchase = await Purchase.findOne({ where: { client_id, branch_id } });
    if (!purchase) {
      console.error(`No purchase found for client_id=${client_id} and branch_id=${branch_id}`);
      throw new Error("Data not found");
    }

    console.log(`Purchase found: ${JSON.stringify(purchase)}`);

    const purchaseorders = await PurchaseOrder.findAndCountAll({
      where: { purchase_id: purchase.id },
      include: [
        {
          model: Purchase,
          as: "purchase",
          include: [{ model: Client, as: "client" }],
        },
      ],
    });

    if (!purchaseorders.rows.length) {
      console.error(`No purchase orders found for purchase_id=${purchase.id}`);
      throw new Error("No purchase orders found for the given client.");
    }

    console.log(`Purchase orders found: ${purchaseorders.rows.length}`);

    const reportData = purchaseorders.rows.map(order => ({
      client_name: order.purchase.client.name,
      Categoryname: order.category,
      gross_weight: order.gross_weight,
      net_weight: order.net_weight,
      stone_weight: order.stone_weight,
      rate: order.rate,
      amount: order.amount,
    }));

    console.log(`Report data: ${JSON.stringify(reportData)}`);

    let total_amount = reportData.reduce((sum, order) => sum + parseInt(order.amount), 0);
    console.log(`Total amount: ${total_amount}`);

    return exportToPDF(
      reportData,
      total_amount,
      "purchase_bill.hbs",
      "purchase_report.pdf",
      purchaseorders.rows[0].purchase.client.email
    );
  } catch (error) {
    console.error("Error in getPurchaseBill:", error.message);
    throw new Error("Failed to fetch purchase reports");
  }
};

exports.getSaleBil = async (client_id, branch_id) => {
  try {
    console.log(`Fetching sales report for client_id=${client_id}, branch_id=${branch_id}`);

    const sale = await Sales.findOne({ where: { client_id, branch_id } }); 
    if (!sale) {
      return { success: false, message: `No sales found for client_id=${client_id} and branch_id=${branch_id}` };
    }

    const salesorders = await SalesOrder.findAndCountAll({
      where: { sales_id: sale.id },
      include: [
        {
          model: Sales,
          as: "sales",
          include: [{ model: Client, as: "client" }],
        },
      ],
    });

    if (!salesorders.rows.length) {
      return { success: false, message: "No sales orders found for the given client." };
    }

    const reportData = salesorders.rows.map(order => ({
      client_name: order.sales.client.name,
      Categoryname: order.category,
      gross_weight: order.gross_weight,
      net_weight: order.net_weight,
      stone_weight: order.stone_weight,
      rate: order.rate,
      amount: order.amount,
    }));

    let total_amount = reportData.reduce((sum, order) => sum + parseInt(order.amount), 0);

    return exportToPDF(
      reportData,
      total_amount,
      "sales_bill.hbs",
      "sales_report.pdf",
      salesorders.rows[0].sales.client.email
    );
  } catch (error) {
    console.error("Error in getSaleBil:", error);
    throw new Error("Failed to fetch sales reports");
  }
};