const cron = require('node-cron');
const { performStockAudit } = require('../services/Stockauditservices');



cron.schedule('* * * * *', async () => { 

    const branch_id = 1; 
    const financial_year_id = 1; 
  
    try {
      const auditResults = await performStockAudit(branch_id, financial_year_id);
      if (auditResults.length === 0) {
        // console.log('No variances found during the scheduled stock audit.');
      } else {
        // console.log('Scheduled stock audit completed with variances:', auditResults);
      }
    } catch (error) {
    //   console.error('Error during scheduled stock audit:', error);
    }
  });