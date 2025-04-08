module.exports = (sequelize, DataTypes) => {
  const SalesOrder = sequelize.define('SalesOrder', {
      sales_id: { type: DataTypes.INTEGER, allowNull: false },
      category: { type: DataTypes.STRING, allowNull: false },
      gross_weight: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      net_weight: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      stone_weight: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      rate: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      discount: {
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: true,
        defaultValue: 0.00,
      },
      total_with_discount: {
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false,
      },
      
      gst_rate: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0.00,
      },
      gst_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
      },
      total_with_gst: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
      },
      branch_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
  });

  return SalesOrder;
};
