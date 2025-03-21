module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM("super_admin", "admin", 'manager', 'sales_executive', 'accountant'),
            allowNull: false,
            defaultValue: "admin",
        },
        branch_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'branch',   
                key: 'id'
            }
        }
    }, {
        tableName: 'users',   
        timestamps: true      
    });

    return User;
};