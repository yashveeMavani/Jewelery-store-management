module.exports = (sequelize, DataTypes) => {
    const CustomOrderImage = sequelize.define('CustomOrderImage', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      imagePath: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    CustomOrderImage.associate = (models) => {
      CustomOrderImage.belongsTo(models.CustomOrder, { foreignKey: 'orderId' });
    };
  
    return CustomOrderImage;
  };
  
