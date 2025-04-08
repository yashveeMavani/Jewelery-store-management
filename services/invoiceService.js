const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const {
  Sales,
  SalesOrder,
  Purchase,
  PurchaseOrder,
  InvoiceTemplate,
} = require("../models");
const { console } = require("inspector");

exports.generateInvoiceAndSendEmail = async (
  user_id,
  salesId,
  purchaseId,
  clientEmail,
  templateDefaults,
  username
) => {
  try {
    // Extract template_name from templateDefaults
    const template_name = templateDefaults || "Default";
    console.log(template_name);
    const sales = await Sales.findOne({
      where: { id: salesId },
      include: [{ model: SalesOrder, as: "sale_orders" }],
    });

    if (!sales) {
      throw new Error(`Sales record with ID ${salesId} not found.`);
    }

    // Fetch purchase data
    const purchase = await Purchase.findOne({
      where: { id: purchaseId },
      include: [{ model: PurchaseOrder, as: "orders" }],
    });

    if (!purchase) {
      throw new Error(`Purchase record with ID ${purchaseId} not found.`);
    }

    // Fetch the invoice template
    console.log(
      "Fetching template for user_id:",
      sales.client_id,
      "template_name:",
      template_name
    );
    let template = await InvoiceTemplate.findOne({
      where: { user_id: user_id, template_name },
    });

    if (!template) {
      throw new Error(
        `Invoice template with name '${template_name}' not found for user_id ${sales.client_id}.`
      );
    }

    // Ensure the invoices directory exists
    const invoicesDir = path.join(__dirname, "../invoices");
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir);
    }

    // Generate PDF
    const pdfPath = path.join(
      invoicesDir,
      `invoice-${salesId}-${purchaseId}.pdf`
    );
    const doc = new PDFDocument({ margin: 50 });

    // Write PDF to file
    doc.pipe(fs.createWriteStream(pdfPath));

    // Add logo to the header
    if (template.logo_url) {
      try {
        console.log("t", template);
        doc.image(template.logo_url, 50, 50, { width: 100 });
      } catch (error) {
        console.error("Error adding logo:", error.message);
      }
    }

    // Add branding color to the header
    doc.fillColor(template.branding_color || "black");
    doc.fontSize(20).text("Purchase Invoice", { align: "center" });
    doc.moveDown();
    console.log(username);

    // Add client details
    doc.fontSize(12).text(`Client Name: ${username || "N/A"}`);
    doc.text(`Date: ${sales.voucher_date}`);
    doc.moveDown();

    // Draw table for Sales Orders
    doc.fontSize(14).text("Sales Orders:", { underline: true });
    const salesTableTop = doc.y + 10;

    // Draw table headers
    doc.fontSize(12);
    doc.text("Category", 50, salesTableTop);
    doc.text("Amount", 200, salesTableTop);
    if (template.format.gst_details) {
      doc.text("GST", 300, salesTableTop);
    }
    doc.text("Total", 400, salesTableTop);
    doc
      .moveTo(50, salesTableTop + 15)
      .lineTo(550, salesTableTop + 15)
      .stroke();

    // Add sales order rows
    let y = salesTableTop + 25;
    sales.sale_orders.forEach((order, index) => {
      const amount = parseFloat(order.amount) || 0;
      const gstAmount = parseFloat(order.gst_amount) || 0;

      doc.text(order.category, 50, y);
      doc.text(`₹${amount.toFixed(2)}`, 200, y);
      if (template.format.gst_details) {
        doc.text(`₹${gstAmount.toFixed(2)}`, 300, y);
      }
      doc.text(`₹${(amount + gstAmount).toFixed(2)}`, 400, y);
      y += 20;
    });

    doc.moveDown(2);

    // Add total amounts
    doc.fontSize(14).text("Total Amounts:", { underline: true });

    const salesTotalAmount = parseFloat(sales.total_amount) || 0;
    doc
      .fontSize(12)
      .text(`Sales Total: ₹${salesTotalAmount.toFixed(2)}`, 400, doc.y, {
        align: "right",
        width: 150,
      });

    const purchaseTotalAmount = parseFloat(purchase.total_amount) || 0;
    doc.text(
      `Purchase Total: ₹${purchaseTotalAmount.toFixed(2)}`,
      400,
      doc.y + 15,
      { align: "right", width: 150 }
    );

    // Add currency details if enabled
    if (template.format.currency_details) {
      doc.moveDown();
      doc.text(`Currency: ${sales.currency || "N/A"}`, { align: "left" });
    }

    // Finalize PDF
    doc.end();

    // Send email with PDF attachment
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "yashveemavani@gmail.com",
        pass: "cohs hlwa hmte tvqu",
      },
    });

    const mailOptions = {
      from: "yashveemavani@gmail.com",
      to: clientEmail,
      subject: "Invoice",
      text: "Please find the attached invoice.",
      attachments: [
        {
          filename: `invoice-${salesId}-${purchaseId}.pdf`,
          path: pdfPath,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log("Invoice sent successfully.");

    return {
      success: true,
      message: "Invoice generated and sent successfully.",
      template,
    };
  } catch (error) {
    console.error("Error generating invoice and sending email:", error.message);
    throw error;
  }
};
