const { Op } = require("sequelize");
const { CustomOrder } = require("../models");

const generateOrderNumber = async () => {
  try {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().slice(-2);
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const financialYear = `${year}-${(parseInt(year) + 1)
      .toString()
      .slice(-2)}`;

    console.log(
      "Generating order number for financial year:",
      financialYear,
      "and month:",
      month
    );

    const orderCount = await getOrderCountForCurrentMonth();

    console.log("Order count for current month:", orderCount);

    if (orderCount === undefined) {
      throw new Error("Failed to retrieve order count");
    }

    const sequenceNumber = (orderCount + 1).toString().padStart(3, "0");
    const orderNumber = `ORD/${financialYear}/${month}/${sequenceNumber}`;

    console.log("Generated order number:", orderNumber);

    return orderNumber;
  } catch (error) {
    console.error("Error generating order number:", error);
    throw new Error("Failed to generate order number");
  }
};
const getOrderCountForCurrentMonth = async () => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    console.log("Counting orders from", startOfMonth, "to", endOfMonth);

    const result = await CustomOrder.count({
      where: {
        createdAt: {
          [Op.gte]: startOfMonth,
          [Op.lt]: endOfMonth,
        },
      },
    });

    console.log("Count result:", result);
    return result;
  } catch (error) {
    console.error("Error counting documents:", error.message, error.stack);
    throw new Error("Failed to count documents");
  }
};

module.exports = {
  createOrder: async (req, res, next) => {
    try {
      console.log("Incoming request body:", req.body);
  
      const { clientId, metalType, kt, netWeight, grossWeight, approxValue } = req.body;
      const branch_id = req.user.branch_id;
      const financial_year_id = req.user.financial_year;
      
      if (!clientId || !metalType || !kt || !netWeight || !branch_id) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      const orderNumber = await generateOrderNumber();
  
      const newOrder = await CustomOrder.create({
        orderNumber,
        clientId,
        metalType,
        kt,
        netWeight,
        grossWeight: grossWeight || null,
        approxValue: approxValue || null,
        branch_id,
        financial_year_id,
      });
  
      res
        .status(201)
        .json({ message: "Order created successfully", order: newOrder });
    } catch (error) {
      console.error("Error creating order:", error);
      next(error);
    }
  },
  listOrders: async (req, res, next) => {
    try {
      const { fromDate, toDate, search } = req.query;
      const branch_id = req.user.branch_id;
      const financial_year_id = req.user.financial_year;
      const query = {branch_id, financial_year_id};
  
      if (fromDate && toDate) {
        query.createdAt = {
          [Op.gte]: new Date(fromDate),
          [Op.lte]: new Date(toDate),
        };
      }
  
      if (search) {
        query.orderNumber = { [Op.like]: `%${search}%` };
      }
  
      const orders = await CustomOrder.findAll({
        where: query,
        order: [["createdAt", "DESC"]],
      });
  
      res.status(200).json(orders);
    } catch (error) {
      console.error("Error listing orders:", error);
      next(error);
    }
  },
  viewOrder: async (req, res, next) => {
    try {
      const branch_id  = req.user.branch_id;
      const financial_year_id = req.user.financial_year;

      const order = await CustomOrder.findOne({
        where: {
          id: req.params.id,
          branch_id,
          financial_year_id,
        },
      });
  
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      res.status(200).json(order);
    } catch (error) {
      console.error("Error viewing order:", error);
      next(error);
    }
  },
  deleteOrder: async (req, res, next) => {
    try {
      const branch_id  = req.user.branch_id;
      const financial_year_id = req.user.financial_year;
  
      const order = await CustomOrder.findOne({
        where: {
          id: req.params.id,
          branch_id,
          financial_year_id,
        },
      });
  
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      await order.destroy();
      res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
      console.error("Error deleting order:", error);
      next(error);
    }
  }
        
};