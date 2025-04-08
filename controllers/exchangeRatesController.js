const { ExchangeRate } = require('../models');

exports.addExchangeRate = async (req, res, next) => {
  try {
    const { currency, rate } = req.body;

    // Validate input
    if (!currency || !rate) {
      return res.status(400).json({ success: false, message: 'Currency and rate are required.' });
    }

    // Create or update the exchange rate
    const [exchangeRate, created] = await ExchangeRate.upsert(
      { currency, rate },
      { returning: true }
    );

    const message = created ? 'Exchange rate added successfully.' : 'Exchange rate updated successfully.';
    res.status(201).json({ success: true, message, data: exchangeRate });
  } catch (error) {
    console.error('Error in addExchangeRate:', error.message);
    next(error);
  }
};