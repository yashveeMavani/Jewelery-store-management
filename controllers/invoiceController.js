
const { generateInvoiceAndSendEmail } = require('../services/invoiceService');

exports.sendInvoice = async (req, res, next) => {
  try {
    const { userid,salesId, purchaseId, clientEmail,template_name ,username} = req.body;
console.log("user",username)
    if (!salesId || !purchaseId || !clientEmail) {
      return res.status(400).json({ error: 'Missing required fields: salesId, purchaseId, or clientEmail.' });
    }

    const result = await generateInvoiceAndSendEmail(userid,salesId, purchaseId, clientEmail,template_name,username);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in sendInvoice:', error.message);
    next(error);
  }
};