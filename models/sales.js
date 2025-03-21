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
        references: { model: 'branch', key: 'id' } // Foreign Key
    }
  });

  return Sales;
};

  