const PDFDocument = require("pdfkit");

function generatePDF(reportData) {
  if (Buffer.isBuffer(reportData)) {
    console.log("Report Data is a Buffer. Decoding...");
    reportData = JSON.parse(reportData.toString("utf-8"));
  }

  console.log("Decoded Report Data:", reportData.stock);

  const doc = new PDFDocument();
  const buffers = [];

  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {});

  // Add content to the PDF
  doc.fontSize(16).text("Report", { align: "center" });
  doc.moveDown();

  // Add sales data
  console.log("Sales Data:", reportData.sales);
  if (reportData.sales && reportData.sales.length > 0) {
    doc.fontSize(14).text("Sales Data:", { underline: true });
    reportData.sales.forEach((sale, index) => {
      doc
        .fontSize(12)
        .text(
          `#${index + 1} - Date: ${sale.voucher_date}, Client ID: ${
            sale.client_id
          }, Total Amount: ${sale.total_amount}, Net Invoice Amount: ${
            sale.net_invoice_amount
          }`
        );
    });
    doc.moveDown();
  } else {
    doc.fontSize(12).text("No sales data available.");
    doc.moveDown();
  }

  // Add stock data
  if (reportData.stock && reportData.stock.length > 0) {
    doc.fontSize(14).text("Stock Data:", { underline: true });
    reportData.stock.forEach((stock, index) => {
      // Extract values correctly
      const stockCode = stock.get("stock_code") || "N/A";
      const quantity = stock.get("quantity") || "N/A";

      doc
        .fontSize(12)
        .text(
          `#${index + 1} - Stock Code: ${stockCode}, Quantity: ${quantity}`
        );
    });
    doc.moveDown();
  } else {
    doc.fontSize(12).text("No stock data available.");
    doc.moveDown();
  }

  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
  });
}

module.exports = { generatePDF };
