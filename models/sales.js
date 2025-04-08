module.exports = (sequelize, DataTypes) => {
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
          allowNull: false,
      },
      opposite_account: {
          type: DataTypes.STRING,
          defaultValue: 'Sales',
      },
      total_amount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
      },
      discount: {
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: true,
        defaultValue: 0.00,
      },
      borrowed_amount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 0.00,
      },
      net_invoice_amount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
      },
      branch_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'branch', key: 'id' } 
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'INR', 
      },
      exchange_rate: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        defaultValue: 1.0, 
      },
      financial_year_id: {
        type: DataTypes.INTEGER,
        allowNull: false, 
        references: {
          model: 'financial_years',
          key: 'id',
        },
      },
  });

  return Sales;
};

  