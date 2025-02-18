const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Client=require('./client');
const SalesOrder=require('./sales_order');


const Sales = sequelize.define('Sales', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
      voucher_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      client_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Clients',
          key: 'id'
        }
      },
      opposite_account: {
        type: DataTypes.STRING,
        defaultValue: 'Sales'
      },
      total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      }
    });
  
      Sales.hasMany(SalesOrder, { foreignKey: 'sales_id', as: 'sale_orders' });
      SalesOrder.belongsTo(Sales, { foreignKey: 'sales_id', as: 'sales' });
      Client.hasMany(Sales, { foreignKey: 'client_id', as: 'sales' });
      Sales.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });



  
   module.exports=Sales;
  
  