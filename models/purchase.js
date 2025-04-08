module.exports = (sequelize, DataTypes) => {
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
              key: 'id',
          },
      },
      supplier_id: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Suppliers',
            key: 'id',
        },
    },
      opposite_account: {
          type: DataTypes.STRING,
          defaultValue: 'Purchase',
      },
      total_amount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
      },
   
 branch_id: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: 'branch',
        key: 'id'
    }
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
}, { tableName: 'purchases' });
Purchase.associate = (models) => {
    Purchase.belongsTo(models.Branch, { foreignKey: 'branch_id' });
    Purchase.belongsTo(models.Supplier, { foreignKey: 'supplier_id', as: 'supplier' }); 
};

  return Purchase;
};

  