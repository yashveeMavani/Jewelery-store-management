const axios = require('axios');

const fetchExchangeRate = async (currency) => {
  try {
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/INR`);
    const rates = response.data.rates;
    return rates[currency] || null;
  } catch (error) {
    console.error('Error fetching exchange rate:', error.message);
    throw new Error('Failed to fetch exchange rate.');
  }
};

module.exports = { fetchExchangeRate };