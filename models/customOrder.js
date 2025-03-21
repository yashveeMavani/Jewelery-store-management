module.exports = (sequelize, DataTypes) => {
  const CustomOrder = sequelize.define('CustomOrder', {
      id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
      },
      orderNumber: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
      },
      clientId: {
          type: DataTypes.INTEGER,
          allowNull: false,
      },
      metalType: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      kt: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      netWeight: {
          type: DataTypes.FLOAT,
          allowNull: false,
      },
      grossWeight: {
          type: DataTypes.FLOAT,
          allowNull: true,
      },
      approxValue: {
          type: DataTypes.FLOAT,
          allowNull: true,
      },
      branch_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'branch',  
            key: 'id'
        }
    }
  }, {
      tableName: 'customorders',
      timestamps: true,
  });


  return CustomOrder;
};

