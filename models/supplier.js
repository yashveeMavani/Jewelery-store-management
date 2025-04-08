module.exports = (sequelize, DataTypes) => {
    const Supplier = sequelize.define('Supplier', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gst: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contact: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ledger: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      branch_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  
    return Supplier;
  };