
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const SalesOrder=sequelize.define('SalesOrder', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
      sales_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Sales',
          key: 'id'
        },onDelete: 'CASCADE'
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false
      },
      gross_weight: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      net_weight: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      stone_weight: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      }
    });
  


  module.exports=SalesOrder;