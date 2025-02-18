const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const RateMaster = sequelize.define('RateMaster', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    }
});

module.exports = RateMaster;
