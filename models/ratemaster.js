module.exports = (sequelize, DataTypes) => {
    const RateMaster = sequelize.define('RateMaster', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        rate: {
            type: DataTypes.DECIMAL(10, 2),
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

    return RateMaster;
};
