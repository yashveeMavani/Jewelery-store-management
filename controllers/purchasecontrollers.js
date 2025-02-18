const purchaseservices = require("../services/purchaseservices");
const bilservices = require("../services/bilservices");

exports.createPurchase = async (req, res) => {
  try {
    const purchase = await purchaseservices.createPurchase(req.body);
    if (purchase == "not client present in a database")
      return res
        .status(400)
        .json({ success: false, message: "client not present in a database" });
    const bilsend = await bilservices.getPurchaseBill(purchase.client_id);
    res.status(201).json({ success: true, data: purchase });
  } catch (error) {
    console.log(error);

    res.status(400).json({ success: false, message: error.message });
  }
};

// List Purchases with Filters
exports.listPurchases = async (req, res) => {
  try {
    const purchases = await purchaseservices.listPurchase(req.query);
    if (purchases.count == 0)
      return res
        .status(200)
        .json({ success: true, data: "not present any data of client" });

    res.status(200).json({ success: true, data: purchases });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get Single Purchase Voucher
exports.getPurchase = async (req, res) => {
  try {
    const purchase = await purchaseservices.getPurchase();

    if (!purchase) {
      return res
        .status(404)
        .json({ success: false, message: "Purchase not found" });
    }

    res.status(200).json({ success: true, data: purchase });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
