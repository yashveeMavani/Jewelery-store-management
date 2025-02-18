const {  DataTypes } = require('sequelize');
const sequelize = require('../config/config');
   
   const dailyData = sequelize.define('DailyData', {
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            unique: true,
        },
        total_sales: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
        },
        total_purchases: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
        }
    });

    
module.exports=dailyData;
