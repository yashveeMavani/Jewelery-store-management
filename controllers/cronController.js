const pool = require('../config/config'); 

exports.generateDailyStockLog = async (req, res,next) => {
  try {
   const stockData = await pool.query('SELECT * FROM stock_data');
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
    next(error);
    console.error('Error generating stock log:', error);
  }
};

// Update Rate Master (runs at 1:00 AM via cron job)
exports.updateRateMaster = async (req, res,next) => {
  try {
    await pool.query('DELETE FROM rate_master');
    const newRate = {
      gold_rate: 6000, 
      silver_rate: 750, 
      updated_at: new Date(),
    };

    await pool.query(
      'INSERT INTO rate_master (gold_rate, silver_rate, updated_at) VALUES ($1, $2, $3)',
      [newRate.gold_rate, newRate.silver_rate, newRate.updated_at]
    );

    res.status(200).json({ message: 'Rate master updated successfully.' });
  } catch (error) { 
    next(error);
    console.error('Error updating rate master:', error);
  }
};
