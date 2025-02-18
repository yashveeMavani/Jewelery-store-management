const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Client=require('./client');
const PurchaseOrder=require('./purchase_order');


const Purchase = sequelize.define('Purchase', {
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
        defaultValue: 'Purchase'
      },
      total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      }
    });
  
      Purchase.hasMany(PurchaseOrder, { foreignKey: 'purchase_id', as: 'orders' });
      PurchaseOrder.belongsTo(Purchase, { foreignKey: 'purchase_id', as: 'purchase' });
      Client.hasMany(Purchase, { foreignKey: 'client_id', as: 'purchases' });
      Purchase.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });
       
      //purchase belogsto ()



  
   module.exports=Purchase;
  
  