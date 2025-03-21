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
}
}, { tableName: 'purchases' });
Purchase.associate = (models) => {
    Purchase.belongsTo(models.Branch, { foreignKey: 'branch_id' });
};

  return Purchase;
};

  