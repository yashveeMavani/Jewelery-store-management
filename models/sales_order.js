module.exports = (sequelize, DataTypes) => {
  const SalesOrder = sequelize.define('SalesOrder', {
      sales_id: { type: DataTypes.INTEGER, allowNull: false },
      category: { type: DataTypes.STRING, allowNull: false },
      gross_weight: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      net_weight: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      stone_weight: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      rate: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      branch_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'branch',  
            key: 'id'
        }
}
  });

  return SalesOrder;
};
