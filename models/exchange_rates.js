module.exports = (sequelize, DataTypes) => {
  const ExchangeRate = sequelize.define('ExchangeRate', {
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    rate: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: false,
    },
  }, { tableName: 'exchange_rates' ,
    timestamps: false,
  });

  return ExchangeRate;
};