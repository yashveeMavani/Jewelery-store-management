const salesservices = require("../services/salesservices");
const bilservices = require("../services/bilservices");
const { updateStockFromSales } = require("./stockController");

exports.createSales = async (req, res) => {
  try {
    const sales = await salesservices.createSales(req.body);
    // if (sales == "not client present in a database")
      // return res
      //   .status(400)
      //   .json({ success: false, message: "client not present in a database" });
    const bilsend = await bilservices.getSaleBil(sales.client_id, res);
    const data = await updateStockFromSales();
    console.log("data => ", data);

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.listSales = async (req, res) => {
  try {
    const sales = await salesservices.listSales(req.query);
    if (sales.count == 0)
      return res
        .status(200)
        .json({ success: true, data: "not present any data of client" });

    res.status(200).json({ success: true, data: sales });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get Single Purchase Voucher
exports.getSales = async (req, res) => {
  try {
    const sales = await salesservices.getSales();

    if (!sales) {
      return res
        .status(404)
        .json({ success: false, message: "sales not found" });
    }
    res.status(200).json({ success: true, data: sales });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteSales = async (req, res) => {
  try {
    const sales = await salesservices.deleteSales();

    res.status(200).json({ success: true, msg: "delete successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
