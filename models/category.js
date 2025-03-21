const db=require("../models/index")
const {DataTypes}=require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
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
      branch_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'branch',  
            key: 'id'
        }
    }
  });

  return Category;
};

