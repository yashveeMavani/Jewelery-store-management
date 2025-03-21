const purchaseservices = require("../services/purchaseservices");
const bilservices = require("../services/bilservices");
const purchaseService = require('../services/purchaseservices');
const billService = require('../services/bilservices');

exports.createPurchase = async (req, res, next) => {
  try {
    const { userrole, branch_id } = req.user; 

    // Super Admin can create purchases for any branch; Admins can only create for their assigned branch
    if (userrole !== 'super_admin' && req.body.branch_id && req.body.branch_id !== branch_id) {
      return res.status(403).json({ success: false, message: 'You are not authorized to create purchases for this branch.' });
    }

    const purchaseData = { ...req.body, branch_id };
    const purchase = await purchaseService.createPurchase(purchaseData);

    console.log('Purchase Created:', purchase);

    const report = await billService.getPurchaseBill(req.body.client_id, branch_id); 
    console.log('Purchase Report Generated:', report);

    res.status(201).json({ success: true, data: purchase });
  } catch (error) {
    console.error('Error Caught:', error.message);
    next(error);
  }
};


exports.listPurchases = async (req, res,next) => {
  try {
    const { userrole, branch_id } = req.user;
        const listData = userrole === 'super_admin'
      ? { ...req.query }
      : { ...req.query, branch_id };
    const purchases = await purchaseservices.listPurchase(listData);
    if (purchases.count == 0)
      return res
        .status(200)
        .json({ success: true, data: "not present any data of client" });

    res.status(200).json({ success: true, data: purchases });
  } catch (error) {
    next(error);
  }
};

exports.getPurchase = async (req, res,next) => {
  try {
    const { id } = req.params;
    const { userrole, branch_id } = req.user;

    const purchase = await purchaseservices.getPurchase(id, branch_id);

    if (!purchase) {
      return res
        .status(404)
        .json({ success: false, message: "Purchase not found" });
    }

    res.status(200).json({ success: true, data: purchase });
  } catch (error) {
    next(error);
   
  }
};
