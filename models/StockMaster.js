module.exports = (sequelize, DataTypes) => {
    const StockMaster = sequelize.define('StockMaster', {
        stock_code: { type: DataTypes.STRING, primaryKey: true },
        stock_name: { type: DataTypes.STRING, allowNull: false },
        category: { type: DataTypes.STRING, allowNull: false },
        branch_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'branch', key: 'id' } // Foreign Key
        }
       
    });

    return StockMaster;
};

