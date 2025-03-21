const { Client, SalesOrder, Sales } = require('../models');
const { partialpayment } = require('../models'); 

exports.createSales = async (salesData) => {
    try {
      const { voucher_date, client_id, branch_id, orders, borrowed_amount = 0 } = salesData;
  
     
      const client = await Client.findByPk(client_id);
  
      if (!client) {
        console.error(`Client with ID ${client_id} not found.`);
        throw new Error("Client not found or invalid.");
      }
      const existingSales = await Sales.findOne({ where: { client_id, branch_id } });
      if (!existingSales || existingSales.opposite_account !== "Sales") {
        console.error(`Client with ID ${client_id} has invalid opposite_account.`);
        throw new Error("Invalid opposite account in sales entry.");
      }
  
      console.log(`Client found: ${JSON.stringify(client)}`);
      let total_amount = 0;
      orders.forEach(order => {
        total_amount += (order.net_weight * order.rate) / 10;
      });
  
      const net_invoice_amount = total_amount - borrowed_amount;
  
      const sales = await Sales.create({
        voucher_date,
        client_id,
        branch_id,
        total_amount,
        borrowed_amount,
        net_invoice_amount,
      });
  
      const orderData = orders.map(order => ({
        sales_id: sales.id,
        category: order.category,
        gross_weight: order.gross_weight,
        net_weight: order.net_weight,
        stone_weight: order.stone_weight,
        rate: order.rate,
        amount: (order.net_weight * order.rate) / 10,
        branch_id,
      }));
  
      await SalesOrder.bulkCreate(orderData);
  
      return sales;
    } catch (err) {
      console.error("Error in createSales:", err.message);
      throw err;
    }
  };

exports.getSales = async (id, branch_id) => {
  try {
    return await Sales.findOne({
      where: { id, branch_id },
      include: [{ model: Client, as: "client" }],
    });
  } catch (err) {
    console.error("Error in getSales:", err.message);
    throw err;
  }
};

exports.listSales = async (listData) => {
  try {
    const { page = 1, limit = 10, client_id, date, branch_id } = listData;
    const offset = (page - 1) * limit;

    const where = { branch_id };
    if (client_id) where.client_id = client_id;
    if (date) where.voucher_date = date;

    return await Sales.findAndCountAll({
      where,
      include: [{ model: Client, as: "client" }],
      order: [["voucher_date", "ASC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (err) {
    console.error("Error in listSales:", err.message);
    throw err;
  }
};

exports.deleteSales = async (id,branch_id) => {
  try {
    await SalesOrder.destroy({ where: { id,branch_id } });
    return await Sales.destroy({ where: {id, branch_id } });
  } catch (err) {
    console.error("Error in deleteSales:", err.message);
    throw err;
  }
};

exports.listBorrowedAmounts = async (branch_id) => {
    try {
     
      const borrowedAmounts = await Sales.findAll({
        attributes: [
          'client_id',
          [fn('SUM', col('borrowed_amount')), 'total_borrowed_amount']
        ],
        where: {
          branch_id,
          borrowed_amount: { [Op.gt]: 0 } 
        },
        group: ['client_id'],
        include: [{ model: Client, as: 'client', attributes: ['id', 'name'] }]
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
          borrowed_amount: 0 
        },
        include: [{ model: Client, as: 'client', attributes: ['id', 'name'] }]
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
          borrowed_amount: { [Op.gt]: 0 } 
        },
        include: [{ model: Client, as: 'client', attributes: ['id', 'name'] }]
      });
    
      return unpaidClients;
    } catch (err) {
      console.error("Error in getUnpaidAmountReport:", err.message);
      throw err;
    }
  };