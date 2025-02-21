const salesservices = require("../services/salesservices");
const bilservices = require("../services/bilservices");
const { updateStockFromSales } = require("./stockController");
const partialPaymentServices = require("../services/partialPaymentServices");
exports.createSales = async (req, res) => {
  try {
    const { total_invoice_amount, borrowed_amount = 0 } = req.body;

    if (borrowed_amount > total_invoice_amount) {
      return res.status(400).json({ success: false, message: "Borrowed amount cannot exceed total invoice amount" });
    }

    // Calculate net invoice amount after deducting borrowed amount
    req.body.net_invoice_amount = total_invoice_amount - borrowed_amount;

    // Create sale entry
    const sales = await salesservices.createSales(req.body);
    

    // Generate sale bill
    await bilservices.getSaleBil(sales.client_id, res);

    // Update stock after sale
    const stockUpdateStatus = await updateStockFromSales();
    console.log("Stock Update Status => ", stockUpdateStatus);

    res.json({
      success: true,
      message: "Sale created successfully",
      sales,
      stockUpdateStatus,
    });
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

// Partial Payment Endpoints
exports.createPartialPayment = async (req, res) => {
  try {
    const paymentData = req.body;
    const result = await partialPaymentServices.createPartialPayment(paymentData);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating partial payment:", error);
    res.status(500).json({ message: "Failed to create partial payment", error: error.message });
  }
};

exports.listBorrowedAmounts = async (req, res) => {
  try {
    const result = await partialPaymentServices.listBorrowedAmounts();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error listing borrowed amounts:", error);
    res.status(500).json({ message: "Failed to list borrowed amounts", error: error.message });
  }
};

exports.getPaidAmountReport = async (req, res) => {
  try {
    const result = await partialPaymentServices.getPaidAmountReport();
    console.log(`Paid amount report result: ${JSON.stringify(result, null, 2)}`);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting paid amount report:", error);
    res.status(500).json({ message: "Failed to get paid amount report", error: error.message });
  }
};

exports.getUnpaidAmountReport = async (req, res) => {
  try {
    const result = await partialPaymentServices.getUnpaidAmountReport();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting unpaid amount report:", error);
    res.status(500).json({ message: "Failed to get unpaid amount report", error: error.message });
  }
};


