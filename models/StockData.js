module.exports = (sequelize, DataTypes) => {
    const StockData = sequelize.define('StockData', {
        stock_code: { type: DataTypes.STRING, allowNull: false },
        gross_weight: { type: DataTypes.FLOAT, defaultValue: 0 },
        net_weight: { type: DataTypes.FLOAT, defaultValue: 0 },
        branch_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'branch', key: 'id' } 
        },
        financial_year_id: {
            type: DataTypes.INTEGER,
            allowNull: false, 
            references: {
              model: 'financial_years',
              key: 'id',
            },
          },
    }, {
        tableName: 'stockdata',  
        timestamps: true
    });

    return StockData;
};


