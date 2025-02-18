const { DataTypes } = require('sequelize');
const sequelize = require('../config/config'); // Adjust as per your setup

const StockMaster = sequelize.define('StockMaster', {
    stock_code: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    stock_name: {
        type: DataTypes.STRING,
        allowNull: false, // Make sure this field cannot be null
        validate: {
            notNull: { msg: "Stock name cannot be null" },
            notEmpty: { msg: "Stock name cannot be empty" }
        }
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = StockMaster;
