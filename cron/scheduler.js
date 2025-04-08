const schedule = require('node-schedule');
const financialYearServices = require('../services/financialYearServices');

// Schedule the job to run at midnight on March 31st every year
schedule.scheduleJob('0 0 31 3 *', async () => {
  try {
    console.log('Running scheduled job to close financial year...');
    await financialYearServices.closeFinancialYear();
    console.log('Financial year closed successfully.');
  } catch (error) {
    console.error('Error in scheduled job:', error.message);
  }
});