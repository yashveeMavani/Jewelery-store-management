const { InvoiceTemplate } = require('../models');

exports.getInvoiceTemplate = async (user_id, template_name) => {
  try {
    const template = await InvoiceTemplate.findOne({
      where: { user_id, template_name },
    });

    if (!template) {
      throw new Error(`Invoice template '${template_name}' not found for user ${user_id}.`);
    }

    return template;
  } catch (error) {
    console.error("Error fetching invoice template:", error.message);
    throw error;
  }
};