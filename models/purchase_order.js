module.exports = (sequelize, DataTypes) => {
  const PurchaseOrder = sequelize.define('PurchaseOrder', {
      id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
      },
      purchase_id: {
          type: DataTypes.INTEGER,
          references: {
              model: 'Purchases',
              key: 'id',
          },
          onDelete: 'CASCADE',
      },
      category: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      gross_weight: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
      },
      net_weight: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
      },
      stone_weight: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
      },
      rate: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
      },
      amount: {
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
  });

  return PurchaseOrder;
};
