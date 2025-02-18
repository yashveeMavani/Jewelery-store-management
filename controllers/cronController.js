const pool = require('../config/config'); // Import database configuration

// Daily stock log (runs at 11:00 PM via cron job)
exports.generateDailyStockLog = async (req, res) => {
  try {
    // Fetch all stock data
    const stockData = await pool.query('SELECT * FROM stock_data');

    // Insert each stock into the stock_logs table with the current date
    const date = new Date();
    for (const stock of stockData.rows) {
      const { stock_name, gross_weight, net_weight } = stock;

      await pool.query(
        'INSERT INTO stock_logs (stock_name, date, gross_weight, net_weight) VALUES ($1, $2, $3, $4)',
        [stock_name, date, gross_weight, net_weight]
      );
    }

    res.status(200).json({ message: 'Daily stock log generated successfully.' });
  } catch (error) {
    console.error('Error generating stock log:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Update Rate Master (runs at 1:00 AM via cron job)
exports.updateRateMaster = async (req, res) => {
  try {
    // Delete the old record
    await pool.query('DELETE FROM rate_master');

    // Insert a new rate (example: hardcoded; replace with dynamic data if needed)
    const newRate = {
      gold_rate: 6000, // Example rate for gold
      silver_rate: 750, // Example rate for silver
      updated_at: new Date(),
    };

    await pool.query(
      'INSERT INTO rate_master (gold_rate, silver_rate, updated_at) VALUES ($1, $2, $3)',
      [newRate.gold_rate, newRate.silver_rate, newRate.updated_at]
    );

    res.status(200).json({ message: 'Rate master updated successfully.' });
  } catch (error) {
    console.error('Error updating rate master:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
