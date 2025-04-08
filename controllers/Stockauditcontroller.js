const { performStockAudit } = require('../services/Stockauditservices');

exports.performStockAudit = async (req, res, next) => {
  try {
    const branch_id = req.user.branch_id;
    const financial_year_id = req.user.financial_year;

    const auditResults = await performStockAudit(branch_id, financial_year_id);

    if (auditResults.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No variances found during the stock audit.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Stock audit completed with variances.',
      data: auditResults,
    });
  } catch (error) {
    console.error('Error performing stock audit:', error);
    next(error);
  }
};