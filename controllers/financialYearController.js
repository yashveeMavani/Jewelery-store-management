const financialYearServices = require('../services/financialYearServices');

exports.closeFinancialYear = async (req, res, next) => {
  try {
    const result = await financialYearServices.closeFinancialYear();
    res.status(200).json({ success: true, message: result.message, data: result.newYear });
  } catch (error) {
    console.error('Error in closeFinancialYear:', error.message);
    next(error);
  }
};