module.exports = (sequelize, DataTypes) => {
    const StockMaster = sequelize.define('StockMaster', {
        stock_code: { type: DataTypes.STRING, primaryKey: true },
        stock_name: { type: DataTypes.STRING, allowNull: false },
        category: { type: DataTypes.STRING, allowNull: false },
        branch_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'branch', key: 'id' } 
        },
        barcode: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          qr_code: { 
            type: DataTypes.TEXT,
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
          threshold: { 
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 10, 
        },
    });

    return StockMaster;
};

