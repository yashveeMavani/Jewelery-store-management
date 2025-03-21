module.exports = (sequelize, DataTypes) => {
    const DailyData = sequelize.define('DailyData', {
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            unique: true,
        },
        total_sales: {
            type: DataTypes.FLOAT,  
            defaultValue: 0,
        },
        total_purchases: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
        },
        branch_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'branch',   
                key: 'id'
            }
    }}, 
    {
        tableName: 'daily_data',
        timestamps: false
    });

    return DailyData;
};

