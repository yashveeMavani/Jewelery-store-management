module.exports = (sequelize, DataTypes) => {
    const LogError = sequelize.define('log_error', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        route: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        payload: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        error_message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }
    }, {
        tableName: 'log_errors',
        timestamps: false, 
    });

    return LogError;
};
