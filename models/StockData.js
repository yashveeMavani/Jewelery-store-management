const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const StockData = sequelize.define('StockData', {
    stock_code: { type: DataTypes.STRING, allowNull: false, references: { model: 'StockMasters', key: 'stock_code' }},
    gross_weight: { type: DataTypes.FLOAT, defaultValue: 0 },
    net_weight: { type: DataTypes.FLOAT, defaultValue: 0 }
});

module.exports = StockData;
