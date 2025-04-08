const QRCode = require("qrcode");
const JsBarcode = require("jsbarcode");
const { createCanvas } = require("canvas");
const { StockMaster } = require("../models");
const { StockHistory } = require("../models");
const nodemailer = require("nodemailer");
const { Sequelize } = require("sequelize");
async function createStockMaster(
  stockCode,
  stockName,
  category,
  branchId,
  financial_year_id
) {
  const existingStock = await StockMaster.findOne({
    where: { stock_code: stockCode, branch_id: branchId, financial_year_id },
  });

  if (!existingStock) {
    // Generate QR Code
    const qrCode = await QRCode.toDataURL(stockCode);

    // Generate Barcode
    const canvas = createCanvas();
    JsBarcode(canvas, stockCode, { format: "CODE128" });
    const barcode = canvas.toDataURL();

    const newStock = await StockMaster.create({
      stock_code: stockCode,
      stock_name: stockName,
      category: category,
      branch_id: branchId,
      barcode,
      qr_code: qrCode,
      financial_year_id,
    });

    return newStock;
  }

  return existingStock;
}

async function recordStockMovement(
  stockCode,
  branchId,
  movementType,
  quantity,
  remarks = null,
  financial_year_id
) {
  console.log("Recording Stock Movement with:", {
    stockCode,
    branchId,
    movementType,
    quantity,
    remarks,
    financial_year_id,
  });
  if (!financial_year_id) {
    throw new Error(
      "financial_year_id is required for recording stock movement."
    );
  }

  await StockHistory.create({
    stock_code: stockCode,
    branch_id: branchId,
    movement_type: movementType, 
    quantity,
    remarks,
    financial_year_id,
  });
}
async function sendLowStockAlerts(lowStockItems, email) {
  try {
    if (!email) {
      console.warn("No email provided. Skipping low stock alert email.");
      return; 
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "yashveemavani@gmail.com", 
        pass: "cohs hlwa hmte tvqu", 
      },
    });

    const itemList = lowStockItems
      .map(
        (item) =>
          `- ${item.stock_name} (Code: ${item.stock_code}): ${item.current_quantity} units left`
      ) 
      .join("\n");

    const mailOptions = {
      from: "yashveemavani@gmail.com",
      to: email,
      subject: "Low Stock Alert",
      text: `The following items are running low on stock:\n\n${itemList}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Low stock alert email sent successfully.");
  } catch (error) {
    console.error("Error sending low stock alert email:", error);
    throw error;
  }
}
async function checkLowStock(branch_id) {
  try {
    const lowStockItems = await StockMaster.findAll({
      where: { branch_id },
      attributes: [
        "stock_code",
        "stock_name",
        "threshold",
        [
          Sequelize.literal(`(
            SELECT SUM(
              CASE
                WHEN movement_type = 'purchase' THEN quantity
                WHEN movement_type = 'sale' THEN -quantity
                ELSE 0
              END
            )
            FROM StockHistories
            WHERE StockHistories.stock_code = StockMaster.stock_code
            AND StockHistories.branch_id = StockMaster.branch_id
          )`),
          "current_quantity", 
        ],
      ],
      having: Sequelize.literal("current_quantity < threshold"), 
    });

    console.log(
      "Low stock items:",
      lowStockItems.map((item) => item.get({ plain: true }))
    );

    return lowStockItems.map((item) => item.get({ plain: true }));
  } catch (error) {
    console.error("Error checking low stock levels:", error);
    throw error;
  }
}

module.exports = {
  createStockMaster,
  recordStockMovement,
  sendLowStockAlerts,
  checkLowStock,
};
