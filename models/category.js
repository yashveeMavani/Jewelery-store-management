const sequelize=require('../config/config');
const {DataTypes}=require('sequelize');

exports.Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    material: {
      type: DataTypes.ENUM('gold', 'silver'),
      allowNull: false,
    },
    category_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
