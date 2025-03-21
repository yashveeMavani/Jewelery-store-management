const { Op, fn, col } = require("sequelize");
const { Sales, Client } = require('../models');

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