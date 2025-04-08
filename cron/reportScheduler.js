const cron = require('node-cron');
const { generatePDF } = require('../utils/pdfGenerator');
const { generateReport } = require('../services/reportService');
const { sendEmail } = require('../utils/emailService');

// Schedule reports
cron.schedule('0 0 * * *', async () => { 
  console.log('Generating daily report...');
  await handleReportGeneration('daily');
});

cron.schedule('0 0 * * 0', async () => { 
  console.log('Generating weekly report...');
  await handleReportGeneration('weekly');
});

cron.schedule('0 0 1 * *', async () => {
  console.log('Generating monthly report...');
  await handleReportGeneration('monthly');
});

// Function to handle report generation and email
async function handleReportGeneration(reportType) {
    try {
      const reportData = await generateReport(reportType); 
      console.log('Raw Report Data:', reportData); 

      // Ensure reportData is JSON, not a PDF buffer
      if (Buffer.isBuffer(reportData)) {
          console.error("Error: Expected JSON but received a PDF buffer.");
          return;
      }

      const pdfBuffer = await generatePDF(reportData); 
      console.log('PDF Buffer Generated:', pdfBuffer);

      const emailBody = `Attached is your ${reportType} report.`;
      const emailSubject = `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`;
      const emailAttachment = {
        filename: `${reportType}-report.pdf`,
        content: pdfBuffer,
      };

      await sendEmail('yashveemavani@gmail.com', emailSubject, emailBody, [emailAttachment]);
      console.log(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report sent successfully.`);
    } catch (error) {
      console.error(`Error generating or sending ${reportType} report:`, error);
    }
}
