const { generateReport } = require('../services/reportService');

exports.getReportData = async (req, res) => {
  try {
    const { reportType } = req.query; // e.g., daily, weekly, monthly
    const reportData = await generateReport(reportType);
    res.status(200).json({ success: true, data: reportData });
  } catch (error) {
    console.error('Error fetching report data:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch report data.' });
  }
};