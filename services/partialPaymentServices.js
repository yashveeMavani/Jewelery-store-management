const { Op, fn, col } = require("sequelize");
const { Sales, Client } = require("../models");
const { PartialPayment } = require("../models");
exports.listBorrowedAmounts = async (branch_id) => {
  try {
    const borrowedAmounts = await Sales.findAll({
      attributes: [
        "client_id",
        [fn("SUM", col("borrowed_amount")), "total_borrowed_amount"],
      ],
      where: {
        branch_id,
        borrowed_amount: { [Op.gt]: 0 },
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

exports.getPaidAmountReport = async (branch_id) => {
  try {
    const paidClients = await Sales.findAll({
      where: {
        branch_id,
        borrowed_amount: 0,
      },
      include: [{ model: Client, as: "client", attributes: ["id", "name"] }],
    });

    return paidClients;
  } catch (err) {
    console.error("Error in getPaidAmountReport:", err.message);
    throw err;
  }
};

exports.getUnpaidAmountReport = async (branch_id) => {
  try {
    const unpaidClients = await Sales.findAll({
      where: {
        branch_id,
        borrowed_amount: { [Op.gt]: 0 },
      },
      include: [{ model: Client, as: "client", attributes: ["id", "name"] }],
    });

    return unpaidClients;
  } catch (err) {
    console.error("Error in getUnpaidAmountReport:", err.message);
    throw err;
  }
};

exports.createPartialPayment = async (paymentData) => {
  try {
    const { client_id, branch_id, amount_paid, payment_date, sales_id } =
      paymentData;

    const sale = await Sales.findByPk(sales_id);
    if (!sale) {
      throw new Error("Sale not found.");
    }

    const remaining_balance = sale.net_invoice_amount - amount_paid;

    // Debugging to ensure all fields are calculated correctly
    console.log("Remaining Balance:", remaining_balance);

    // Create the partial payment
    const partialPayment = await PartialPayment.create({
      client_id,
      branch_id,
      sales_id,
      amount_paid,
      remaining_balance,
      payment_date,
    });

    // Update the borrowed amount in the Sales table
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
