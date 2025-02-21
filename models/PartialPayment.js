const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/config');

class PartialPayment extends Model {}

PartialPayment.init({
  client_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount_paid: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  remaining_balance: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  payment_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'PartialPayment',
});

module.exports = PartialPayment;