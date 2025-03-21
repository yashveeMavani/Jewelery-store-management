module.exports = (sequelize, DataTypes) => {
    const Branch = sequelize.define('Branch', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        location: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active'
        }
        

    }, { tableName: 'branch' });

    Branch.associate = (models) => {
        Branch.hasMany(models.User, { foreignKey: 'branch_id' });
        Branch.hasMany(models.Purchase, { foreignKey: 'branch_id' });
        Branch.hasMany(models.Sale, { foreignKey: 'branch_id' });
        Branch.hasMany(models.Stock, { foreignKey: 'branch_id' });
    };

    return Branch;
};

