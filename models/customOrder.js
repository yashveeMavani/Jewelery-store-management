const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("jwler", "root", "admin", {
  host: "localhost",
  dialect: "mysql",
  timezone: "+00:00",
  dialectOptions: {
    timezone: "Z",
  },
});

sequelize
  .sync({ alter: true })
  .then(() => console.log("Database synced successfully"))
  .catch((error) => console.error("Error syncing database:", error));

module.exports = sequelize;

const CustomOrder = sequelize.define("CustomOrder", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  orderNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  metalType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  kt: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  netWeight: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  grossWeight: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  approxValue: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
});

CustomOrder.associate = (models) => {
  CustomOrder.belongsTo(models.Client, { foreignKey: "clientId" });
  CustomOrder.hasMany(models.CustomOrderImage, { foreignKey: "orderId" });
};

module.exports = CustomOrder;
