const { Op } = require("sequelize");
const sequelize = require("../config/config");
const PartialPayment = require('../models/PartialPayment');
const Sales = require('../models/sales');
const Client = require('../models/client');

exports.createPartialPayment = async (paymentData) => {
    try {
        const { client_id, amount_paid, payment_date } = paymentData;

        const sales = await Sales.findOne({ where: { client_id } });
        if (!sales) {
            return "Sales record not found for the client";
        }
 
        const remaining_balance = sales.borrowed_amount - amount_paid;

        const partialPayment = await PartialPayment.create({
            client_id,
            amount_paid,
            remaining_balance,
            payment_date
        });

        // Update the borrowed amount in Sales
        sales.borrowed_amount = remaining_balance;
        await sales.save();
        console.log(`Partial payment created for client ${client_id}. Remaining balance: ${remaining_balance}`);
        return partialPayment;
    } catch (err) {
        console.error("Error in createPartialPayment:", err);
        return err;
    }
};

exports.listBorrowedAmounts = async () => {
    try {
        const borrowedAmounts = await Sales.findAll({
            attributes: ['client_id', [sequelize.fn('sum', sequelize.col('borrowed_amount')), 'total_borrowed_amount']],
            group: ['client_id'],
            include: [{ model: Client, as: 'client' }]
        });
        return borrowedAmounts;
    } catch (err) {
        console.error("Error in listBorrowedAmounts:", err);
        return err;
    }
};

exports.getPaidAmountReport = async () => {
    try {
        console.log("Getting paid amount report");
        const allSales = await Sales.findAll({
            include: [{ model: Client, as: 'client' }]
        });
        console.log(`All sales: ${JSON.stringify(allSales, null, 2)}`);

        const paidClients = allSales.filter(sale => sale.borrowed_amount == 0);
        console.log(`Paid clients: ${JSON.stringify(paidClients, null, 2)}`);
        return paidClients;
    } catch (err) {
        console.error("Error in getPaidAmountReport:", err);
        return err;
    }
};

exports.getUnpaidAmountReport = async () => {
    try {
        console.log("Getting unpaid amount report");
        const allSales = await Sales.findAll({
            include: [{ model: Client, as: 'client' }]
        });
        console.log(`All sales: ${JSON.stringify(allSales, null, 2)}`);

        const unpaidClients = allSales.filter(sale => sale.borrowed_amount > 0);
        console.log(`Unpaid clients: ${JSON.stringify(unpaidClients, null, 2)}`);
        return unpaidClients;
    } catch (err) {
        console.error("Error in getUnpaidAmountReport:", err);
        return err;
    }
};