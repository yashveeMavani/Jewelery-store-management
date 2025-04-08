module.exports = (sequelize, DataTypes) => {
    const InvoiceTemplate = sequelize.define('InvoiceTemplate', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      template_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      logo_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      branding_color: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      format: {
        type: DataTypes.JSON,
        allowNull: false,
      },
    }, {
      tableName: 'invoice_templates',
      timestamps: false,
    });
  
    return InvoiceTemplate;
  };