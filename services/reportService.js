const { StockMaster, Sales, Purchases } = require("../models");
const { Sequelize } = require("sequelize");
const { generatePDF } = require("../utils/pdfGenerator");
const { Op } = require("sequelize");
async function generateReport(reportType) {
  try {
    let reportData;

    switch (reportType) {
      case "daily":
        reportData = await getDailyReport();
        break;
      case "weekly":
        reportData = await getWeeklyReport();
        break;
      case "monthly":
        reportData = await getMonthlyReport();
        break;
      default:
        throw new Error("Invalid report type");
    }
    return reportData;
  } catch (error) {
    console.error("Error generating report:", error);
    throw error;
  }
}

async function getDailyReport() {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const sales = await Sales.findAll({
    where: {
      createdAt: {
        [Op.between]: [startOfDay, endOfDay],
      },
    },
  });
  console.log(
    "Sales Data:",
    sales.map((sale) => sale.get({ plain: true }))
  );

  const stock = await StockMaster.findAll({
    attributes: [
      "stock_code",
      [
        Sequelize.literal(`(
            SELECT COALESCE(SUM(
              CASE
                WHEN movement_type = 'purchase' THEN quantity
                WHEN movement_type = 'sale' THEN -quantity
                ELSE 0
              END
            ), 0)
            FROM StockHistories
            WHERE StockHistories.stock_code = StockMaster.stock_code
          )`),
        "quantity",
      ],
    ],
  });
  console.log(
    "Stock Data:",
    stock.map((s) => s.get({ plain: true }))
  );

  return { sales, stock };
}
function getStartOfMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function getEndOfMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0);
}

async function getMonthlyReport() {
  const startOfMonth = getStartOfMonth();
  const endOfMonth = getEndOfMonth();

  const sales = await Sales.findAll({
    where: {
      createdAt: {
        [Op.between]: [startOfMonth, endOfMonth],
      },
    },
  });
  console.log(
    "Monthly Sales Data:",
    sales.map((sale) => sale.get({ plain: true }))
  );

  const stock = await StockMaster.findAll({
    attributes: [
      "stock_code",
      [
        Sequelize.literal(`(
            SELECT COALESCE(SUM(
              CASE
                WHEN movement_type = 'purchase' THEN quantity
                WHEN movement_type = 'sale' THEN -quantity
                ELSE 0
              END
            ), 0)
            FROM StockHistories
            WHERE StockHistories.stock_code = StockMaster.stock_code
          )`),
        "quantity",
      ],
    ],
  });
  console.log(
    "Monthly Stock Data:",
    stock.map((s) => s.get({ plain: true }))
  );

  return { sales, stock };
}
async function getMonthlyReport() {
  const sales = await Sales.findAll({
    where: { createdAt: { [Op.gte]: getStartOfMonth() } },
  });
  const stock = await StockMaster.findAll();
  return { sales, stock };
}

function getStartOfWeek() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  return new Date(now.setDate(diff));
}

function getEndOfWeek() {
  const startOfWeek = getStartOfWeek();
  return new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);
}

// Define the getWeeklyReport function
async function getWeeklyReport() {
  const startOfWeek = getStartOfWeek();
  const endOfWeek = getEndOfWeek();

  // Fetch sales data for the current week
  const sales = await Sales.findAll({
    where: {
      createdAt: {
        [Op.between]: [startOfWeek, endOfWeek],
      },
    },
  });
  console.log(
    "Weekly Sales Data:",
    sales.map((sale) => sale.get({ plain: true }))
  );

  const stock = await StockMaster.findAll({
    attributes: [
      "stock_code",
      [
        Sequelize.literal(`(
          SELECT COALESCE(SUM(
            CASE
              WHEN movement_type = 'purchase' THEN quantity
              WHEN movement_type = 'sale' THEN -quantity
              ELSE 0
            END
          ), 0)
          FROM StockHistories
          WHERE StockHistories.stock_code = StockMaster.stock_code
        )`),
        "quantity",
      ],
    ],
  });
  console.log(
    "Weekly Stock Data:",
    stock.map((s) => s.get({ plain: true }))
  );

  return { sales, stock };
}

module.exports = { generateReport };
