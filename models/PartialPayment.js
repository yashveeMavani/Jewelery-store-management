module.exports = (sequelize, DataTypes) => {
  const PartialPayment = sequelize.define('PartialPayment', {
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
      branch_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'branch',  
            key: 'id'
        }
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

  return PartialPayment;
};
