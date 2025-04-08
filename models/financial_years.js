module.exports = (sequelize, DataTypes) => {
  const FinancialYear = sequelize.define('FinancialYear', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_closed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    current_flag: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, 
    },
  }, { tableName: 'financial_years' });

  return FinancialYear;
};