const { StockData, StockMaster, StockHistory } = require("../models");
module.exports = { performStockAudit };
async function performStockAudit(branch_id, financial_year_id) {
  try {
    const stockData = await StockData.findAll({
      where: { branch_id, financial_year_id },
    });
    // console.log('Fetched stock data:', stockData);

    const auditResults = [];

    for (const stock of stockData) {
      const { stock_code, gross_weight, net_weight } = stock;

      const stockMovements = await StockHistory.findAll({
        where: { stock_code, branch_id, financial_year_id },
      });
      // console.log(`Stock movements for stock_code ${stock_code}:`, stockMovements);

      let expectedGrossWeight = 0;
      let expectedNetWeight = 0;

      for (const movement of stockMovements) {
        if (movement.type === "purchase") {
          expectedGrossWeight += movement.quantity;
          expectedNetWeight += movement.quantity;
        } else if (movement.type === "sale") {
          expectedGrossWeight -= movement.quantity;
          expectedNetWeight -= movement.quantity;
        }
      }

      const grossVariance = gross_weight - expectedGrossWeight;
      const netVariance = net_weight - expectedNetWeight;

      if (grossVariance !== 0 || netVariance !== 0) {
        auditResults.push({
          stock_code,
          actualGrossWeight: gross_weight,
          expectedGrossWeight,
          grossVariance,
          actualNetWeight: net_weight,
          expectedNetWeight,
          netVariance,
        });
      }
    }

    return auditResults;
  } catch (error) {
    console.error("Error performing stock audit:", error);
    throw error;
  }
}
