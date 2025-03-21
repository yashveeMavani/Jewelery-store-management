const rateMasterService = require('../services/rateservices');

exports.createRate = async (req, res, next) => {
  try {
    const { rate } = req.body; 
    const { branch_id, userrole } = req.user; 

    // Only super_admin or admin can create rates
    if (userrole !== 'super_admin' && userrole !== 'admin') {
      return res.status(403).json({ success: false, message: 'You are not authorized to create rates.' });
    }

    const newRate = await rateMasterService.createRate(rate, branch_id);
    res.status(201).json({ success: true, data: newRate });
  } catch (error) {
    console.error('Error in createRate:', error.message);
    next(error);
  }
};

exports.getRate = async (req, res, next) => {
  try {
    const { branch_id } = req.user;
    const rate = await rateMasterService.getRate(branch_id);

    if (!rate) {
      return res.status(404).json({ success: false, message: 'No rate found for this branch.' });
    }

    res.status(200).json({ success: true, data: rate });
  } catch (error) {
    console.error('Error in getRate:', error.message);
    next(error);
  }
};

exports.deleteRate = async (req, res, next) => {
  try {
    const { branch_id, userrole } = req.user; 

    // Only super_admin or admin can delete rates
    if (userrole !== 'super_admin' && userrole !== 'admin') {
      return res.status(403).json({ success: false, message: 'You are not authorized to delete rates.' });
    }

    await rateMasterService.deleteRate(branch_id);
    res.status(200).json({ success: true, message: 'Rate deleted successfully.' });
  } catch (error) {
    console.error('Error in deleteRate:', error.message);
    next(error);
  }
};