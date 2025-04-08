const { Client, SalesOrder, Sales } = require("../models");
const { partialpayment } = require("../models");
const { generateInvoice } = require("../utils/invoiceUtils");
const { sendEmail } = require("../utils/emailUtils");
const { fetchExchangeRate } = require("../utils/exchangeRateUtils");

exports.createSales = async (salesData, req) => {
  try {
    const {
      voucher_date,
      client_id,
      branch_id,
      orders,
      borrowed_amount = 0,
      discount = 0,
      currency = "INR",
    } = salesData;
    const financial_year_id = req.user.financial_year;
    const exchange_rate =
      currency === "INR" ? 1.0 : await fetchExchangeRate(currency);
    if (!exchange_rate)
      throw new Error(`Exchange rate for ${currency} not found.`);

    const client = await Client.findByPk(client_id);
    if (!client) throw new Error("Client not found or invalid.");

    let total_amount = 0;
    const orderData = orders.map((order) => {
      const amount = order.net_weight * order.rate;
      const gst_rate = order.gst_rate || 18;
      const gst_amount = (amount * gst_rate) / 100;
      const total_with_gst = amount + gst_amount;

      const total_with_discount = amount - (order.discount || 0);
      total_amount += total_with_gst;

      return {
        sales_id: null,
        category: order.category,
        gross_weight: order.gross_weight,
        net_weight: order.net_weight,
        stone_weight: order.stone_weight,
        rate: order.rate,
        amount,
        discount: order.discount || 0,
        total_with_discount,
        gst_rate,
        gst_amount,
        total_with_gst,
        branch_id,
        currency,
        exchange_rate,
        financial_year_id,
      };
    });

    const discounted_amount = total_amount - discount;
    const net_invoice_amount = discounted_amount - borrowed_amount;

    if (net_invoice_amount < 0) {
      throw new Error("Net invoice amount cannot be negative.");
    }
    const sales = await Sales.create({
      voucher_date,
      client_id,
      branch_id,
      total_amount: total_amount * exchange_rate,
      discount,
      borrowed_amount,
      net_invoice_amount,
      currency,
      exchange_rate,
      financial_year_id,
    });

    orderData.forEach((order) => (order.sales_id = sales.id));
    await SalesOrder.bulkCreate(orderData);

    const invoice = generateInvoice(orderData, "sale");

    const emailSubject = `Invoice for Sale - ${sales.id}`;
    const emailBody = `
      <h1>Invoice</h1>
      <p>Invoice Number: ${sales.id}</p>
      <p>Date: ${voucher_date}</p>
      <p>Total Amount (with GST): ${total_amount}</p>
      <p>Discount: ${discount}</p>
      <p>Net Invoice Amount: ${net_invoice_amount}</p>
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

    await sendEmail(client.email, emailSubject, "", emailBody);

    console.log("Invoice sent to client:", client.email);

    return sales;
  } catch (err) {
    console.error("Error in createSales:", err);
    throw err;
  }
};
exports.getSales = async (id, branch_id, req) => {
  try {
    const financial_year_id = req.user.financial_year;
    return await Sales.findOne({
      where: { id, branch_id, financial_year_id },
      include: [
        { model: Client, as: "client" },
        {
          model: SalesOrder,
          as: "sale_orders",
          attributes: [
            "category",
            "gross_weight",
            "net_weight",
            "rate",
            "amount",
            "gst_rate",
            "gst_amount",
            "total_with_gst",
          ],
        },
      ],
    });
  } catch (err) {
    console.error("Error in getSales:", err.message);
    throw err;
  }
};

exports.listSales = async (listData, req) => {
  try {
    const { page = 1, limit = 10, client_id, date, branch_id } = listData;
    const offset = (page - 1) * limit;
    const financial_year_id = req.user.financial_year;

    const where = { branch_id, financial_year_id };
    if (client_id) where.client_id = client_id;
    if (date) where.voucher_date = date;

    const result = await Sales.findAndCountAll({
      where,
      include: [
        { model: Client, as: "client" },
        {
          model: SalesOrder,
          as: "sale_orders",
          attributes: [
            "category",
            "gross_weight",
            "net_weight",
            "rate",
            "amount",
            "gst_rate",
            "gst_amount",
            "total_with_gst",
          ],
        },
      ],
      order: [["voucher_date", "ASC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    // console.log("listSales result:", JSON.stringify(result, null, 2));
    return result;
  } catch (err) {
    console.error("Error in listSales:", err.message);
    throw err;
  }
};
exports.deleteSales = async (id, branch_id, req) => {
  try {
    const financial_year_id = req.user.financial_year;
    await SalesOrder.destroy({ where: { id, branch_id, financial_year_id } });
    return await Sales.destroy({ where: { id, branch_id, financial_year_id } });
  } catch (err) {
    console.error("Error in deleteSales:", err.message);
    throw err;
  }
};

exports.listBorrowedAmounts = async (branch_id, req) => {
  try {
    const financial_year_id = req.user.financial_year;
    const borrowedAmounts = await Sales.findAll({
      attributes: [
        "client_id",
        [fn("SUM", col("borrowed_amount")), "total_borrowed_amount"],
        [fn("SUM", col("total_amount")), "total_with_gst"],
      ],
      where: {
        branch_id,
        borrowed_amount: { [Op.gt]: 0 },
        financial_year_id,
      },
      group: ["client_id"],
      include: [{ model: Client, as: "client", attributes: ["id", "name"] }],
    });

    return borrowedAmounts;
  } catch (err) {
    console.error("Error in listBorrowedAmounts:", err.message);
    throw err;
  }
};

exports.getPaidAmountReport = async (branch_id, req) => {
  try {
    const financial_year_id = req.user.financial_year;
    const paidClients = await Sales.findAll({
      where: {
        branch_id,
        borrowed_amount: 0,
        financial_year_id,
      },
      include: [
        { model: Client, as: "client", attributes: ["id", "name"] },
        {
          model: SalesOrder,
          as: "sale_orders",
          attributes: [
            "category",
            "amount",
            "gst_rate",
            "gst_amount",
            "total_with_gst",
          ],
        },
      ],
    });

    return paidClients;
  } catch (err) {
    console.error("Error in getPaidAmountReport:", err.message);
    throw err;
  }
};

exports.getUnpaidAmountReport = async (branch_id, req) => {
  try {
    const financial_year_id = req.user.financial_year;
    const unpaidClients = await Sales.findAll({
      where: {
        branch_id,
        borrowed_amount: { [Op.gt]: 0 },
        financial_year_id,
      },
      include: [
        { model: Client, as: "client", attributes: ["id", "name"] },
        {
          model: SalesOrder,
          as: "sale_orders",
          attributes: [
            "category",
            "amount",
            "gst_rate",
            "gst_amount",
            "total_with_gst",
          ],
        },
      ],
    });

    return unpaidClients;
  } catch (err) {
    console.error("Error in getUnpaidAmountReport:", err.message);
    throw err;
  }
};

exports.createPartialPayment = async (paymentData) => {
  try {
    const {
      client_id,
      branch_id,
      amount_paid,
      payment_date,
      sales_id,
      financial_year_id,
    } = paymentData;

    // Fetch the sales record to calculate the remaining balance
    const sale = await Sales.findByPk(sales_id);
    if (!sale) {
      throw new Error("Sale not found.");
    }

    const remaining_balance = sale.net_invoice_amount - amount_paid;


    const partialPayment = await PartialPayment.create({
      client_id,
      branch_id,
      sales_id,
      amount_paid,
      remaining_balance,
      payment_date,
      financial_year_id,
    });

    await Sales.update(
      { borrowed_amount: remaining_balance },
      { where: { id: sales_id } }
    );

    return partialPayment;
  } catch (error) {
    console.error("Error in createPartialPayment:", error.message);
    throw error;
  }
};
