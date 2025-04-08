const { Client, Purchase, PurchaseOrder, Supplier } = require("../models");
const { generateInvoice } = require("../utils/invoiceUtils");
const { sendEmail } = require("../utils/emailUtils");
const { fetchExchangeRate } = require("../utils/exchangeRateUtils");

exports.createPurchase = async (purchaseData) => {
  try {
    const {
      voucher_date,
      client_id,
      branch_id,
      supplier_id,
      orders,
      currency = "INR",
      financial_year_id,
    } = purchaseData;

    const exchange_rate =
      currency === "INR" ? 1.0 : await fetchExchangeRate(currency);
    if (!exchange_rate)
      throw new Error(`Exchange rate for ${currency} not found.`);

    const client = await Client.findByPk(client_id);
    if (!client) throw new Error("Client not found or invalid.");

    const supplier = await Supplier.findByPk(supplier_id);
    if (!supplier) throw new Error("Supplier not found or invalid.");

    let total_amount = 0;
    const orderData = orders.map((order) => {
      const amount = order.net_weight * order.rate;
      const gst_rate = order.gst_rate || 18;
      const gst_amount = (amount * gst_rate) / 100;
      const total_with_gst = amount + gst_amount;

      total_amount += total_with_gst;

      return {
        purchase_id: null,
        category: order.category,
        gross_weight: order.gross_weight,
        net_weight: order.net_weight,
        stone_weight: order.stone_weight,
        rate: order.rate,
        amount,
        gst_rate,
        gst_amount,
        total_with_gst,
        branch_id,
        currency,
        exchange_rate,
        financial_year_id,
      };
    });

    const purchase = await Purchase.create({
      voucher_date,
      client_id,
      branch_id,
      supplier_id,
      total_amount: total_amount * exchange_rate,
      currency,
      exchange_rate,
      financial_year_id,
    });

    orderData.forEach((order) => (order.purchase_id = purchase.id));
    await PurchaseOrder.bulkCreate(orderData);

    // Generate the invoice
    const invoice = generateInvoice(orderData, "purchase");

    // Prepare email details
    const emailSubject = `Invoice for Purchase - ${purchase.id}`;
    const emailBody = `
      <h1>Invoice</h1>
      <p>Invoice Number: ${purchase.id}</p>
      <p>Date: ${voucher_date}</p>
      <p>Total Amount (with GST): ${total_amount}</p>
      <h2>Order Details:</h2>
      <ul>
        ${orderData
          .map(
            (order) => `
          <li>
            ${order.category}: ${order.net_weight} x ${order.rate} = ${order.amount} (GST: ${order.gst_amount})
          </li>
        `
          )
          .join("")}
      </ul>
    `;

    const recipientEmail = supplier.email || "yashveemavani@gmail.com";
    try {
      await sendEmail(recipientEmail, emailSubject, "", emailBody);
      console.log(`Invoice sent to: ${recipientEmail}`);
    } catch (error) {
      console.error("Failed to send email:", error.message);
    }

    return purchase;
  } catch (err) {
    console.error("Error in createPurchase:", err);
    throw err;
  }
};
exports.getPurchase = async (id, branch_id, req) => {
  try {
    return await Purchase.findOne({
      where: { id, branch_id, financial_year_id: req.user.financial_year },
      include: [
        { model: Client, as: "client" },
        { model: Supplier, as: "supplier" },
      ],
    });
  } catch (err) {
    return err;
  }
};

exports.listPurchase = async (listData) => {
  try {
    const {
      page = 1,
      limit = 10,
      client_id,
      date,
      branch_id,
      financial_year_id,
    } = listData;
    const offset = (page - 1) * limit;
    const where = { financial_year_id };
    if (branch_id) where.branch_id = branch_id;
    if (client_id) where.client_id = client_id;
    if (date) where.voucher_date = date;
    console.log("Filters applied:", where);
    const purchase = await Purchase.findAndCountAll({
      where,
      include: [
        { model: Client, as: "client" },
        { model: Supplier, as: "supplier" },
      ],
      order: [["voucher_date", "ASC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    console.log("Purchases found:", purchase);

    console.log(purchase);
    return purchase;
  } catch (err) {
    return err;
  }
};
