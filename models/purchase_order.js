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
      branch_id: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: 'branch',  
            key: 'id'
        }
    }
  });

  return PurchaseOrder;
};
