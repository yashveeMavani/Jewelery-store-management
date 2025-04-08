const { FinancialYear, Account } = require('../models');

exports.closeFinancialYear = async () => {
  try {
    // Get the current financial year
    const currentYear = await FinancialYear.findOne({ where: { is_closed: false } });
    if (!currentYear) {
      throw new Error('No active financial year found.');
    }

    // Mark the current financial year as closed
    currentYear.is_closed = true;
    await currentYear.save();

    // Calculate closing balances and carry forward as opening balances
    const accounts = await Account.findAll();
    for (const account of accounts) {
      const closingBalance = account.balance; 
      account.opening_balance = closingBalance; 
      await account.save();
    }

    // Create a new financial year
    const newStartDate = new Date(currentYear.end_date);
    const newEndDate = new Date(newStartDate);
    newEndDate.setFullYear(newEndDate.getFullYear() + 1);

    const newYear = await FinancialYear.create({
      start_date: newStartDate,
      end_date: newEndDate,
    });

    return { success: true, message: 'Financial year closed and new year created.', newYear };
  } catch (error) {
    console.error('Error in closeFinancialYear:', error.message);
    throw error;
  }
};