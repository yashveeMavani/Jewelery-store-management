const salesservices = require("../services/salesservices");
const bilservices = require("../services/bilservices");
const { updateStockFromSales } = require("./stockController");
const partialPaymentServices = require("../services/partialPaymentServices");

exports.createSales = async (req, res,next) => {
  try {
    const userrole = req.user.userrole; 
    const branch_id = req.user.branch_id; 
    const { total_invoice_amount, borrowed_amount = 0 ,discount = 0 } = req.body;

    if (userrole !== "super_admin" && userrole !== "admin") {
      return res.status(403).json({ success: false, message: "You are not authorized to create sales." });
    }

    if (borrowed_amount > total_invoice_amount) {
      return res.status(400).json({ success: false, message: "Borrowed amount cannot exceed total invoice amount." });
    }
    if (discount > total_invoice_amount) {
      return res.status(400).json({ success: false, message: "Discount cannot exceed total invoice amount." });
    }
    req.body.branch_id = branch_id;
    req.body.net_invoice_amount = total_invoice_amount - discount - borrowed_amount;

    const sales = await salesservices.createSales(req.body,req);
    await bilservices.getSaleBil(sales.client_id, res);
    const stockUpdateStatus = await updateStockFromSales(branch_id);

    res.status(201).json({
      success: true,
      message: "Sale created successfully.",
      sales,
      stockUpdateStatus,
    });
  } catch (error) {
    console.error("Error in createSales:", error.message);
   
    next(error);
  }
};



exports.listSales = async (req, res, next) => {
  try {
    const { userrole, branch_id } = req.user; 
    const listData = { ...req.query, branch_id };


    if (userrole !== "super_admin") {
      listData.branch_id = branch_id;
    }

    const sales = await salesservices.listSales(listData,req);

    if (sales.count === 0) {
      return res.status(200).json({ success: true, message: "No sales data found." });
    }

    res.status(200).json({ success: true, data: sales });
  } catch (error) {
    console.error("Error in listSales:", error.message);
    next(error);
  }
};

exports.getSales = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { branch_id } = req.user; 

    const sales = await salesservices.getSales(id, branch_id,req);

    if (!sales) {
      return res.status(404).json({ success: false, message: "Sales not found." });
    }

    res.status(200).json({ success: true, data: sales });
  } catch (error) {
    console.error("Error in getSales:", error.message);
    next(error);
  }
};

exports.deleteSales = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userrole, branch_id } = req.user; 

   
    if (userrole !== "super_admin" && userrole !== "admin") {
      return res.status(403).json({ success: false, message: "You are not authorized to delete sales." });
    }

    await salesservices.deleteSales(id,branch_id,req);

    res.status(200).json({ success: true, message: "Sales deleted successfully." });
  } catch (error) {
    console.error("Error in deleteSales:", error.message);
    next(error);
  }
};

// Partial Payment Endpoints
exports.createPartialPayment = async (req, res, next) => {
  try {
    const paymentData = { ...req.body, branch_id: req.user.branch_id,financial_year_id: req.user.financial_year  };
    console.log("Payment Data in Controller:", paymentData);
    const result = await partialPaymentServices.createPartialPayment(paymentData);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error("Error creating partial payment:", error.message);
    next(error);
  }
};

exports.listBorrowedAmounts = async (req, res, next) => {
  try {
    const { userrole, branch_id ,financial_year } = req.user;
   

    if (userrole !== "super_admin" && userrole !== "admin") {
      return res.status(403).json({ success: false, message: "You are not authorized to view borrowed amounts." });
    }

    const result = await partialPaymentServices.listBorrowedAmounts(branch_id,financial_year);
  
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error listing borrowed amounts:", error.message);
    next(error);
  }
};

exports.getPaidAmountReport = async (req, res, next) => {
  try {
    const { userrole, branch_id,financial_year } = req.user;
  
    if (userrole !== "super_admin" && userrole !== "admin") {
      return res.status(403).json({ success: false, message: "You are not authorized to view the paid amount report." });
    }

    const result = await partialPaymentServices.getPaidAmountReport(branch_id,financial_year);
    
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error getting paid amount report:", error.message);
    next(error);
  }
};

exports.getUnpaidAmountReport = async (req, res, next) => {
  try {
    const { userrole, branch_id,financial_year } = req.user;
  
    if (userrole !== "super_admin" && userrole !== "admin") {
      return res.status(403).json({ success: false, message: "You are not authorized to view the unpaid amount report." });
    }

    const result = await partialPaymentServices.getUnpaidAmountReport(branch_id,financial_year);
   
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error getting unpaid amount report:", error.message);
    next(error);
  }
};