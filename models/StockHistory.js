module.exports = (sequelize, DataTypes) => {
    const StockHistory = sequelize.define('StockHistory', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      stock_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      branch_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      movement_type: { 
        type: DataTypes.ENUM('purchase', 'sale', 'adjustment'),
        allowNull: false,
      },
      quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      remarks: {
        type: DataTypes.STRING,
        allowNull: true,
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
  
    return StockHistory;
  };