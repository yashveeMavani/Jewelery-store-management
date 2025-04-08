/**
 * Generates a tax invoice for purchases or sales.
 * @param {Array} orderData - Array of order items with GST details.
 * @param {String} type - Type of invoice (e.g., "purchase" or "sale").
 * @returns {Object} - Invoice object with details and totals.
 */
const generateInvoice = (orderData, type) => {
    const invoice = {
      type,
      date: new Date(),
      items: orderData.map(order => ({
        category: order.category,
        gross_weight: order.gross_weight,
        net_weight: order.net_weight,
        rate: order.rate,
        amount: order.amount,
        gst_rate: order.gst_rate,
        gst_amount: order.gst_amount,
        total_with_gst: order.total_with_gst,
      })),
      total: orderData.reduce((sum, order) => sum + order.total_with_gst, 0),
    };
  
    return invoice;
  };
  
  module.exports = { generateInvoice };