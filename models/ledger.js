// models/Client.js
const {  DataTypes } = require('sequelize');
const sequelize = require('../config/config');

exports.Ledger = sequelize.define('Ledger', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Name is required' },
      notEmpty: { msg: 'Name cannot be empty' },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firm_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Firm Name is required' },
      notEmpty: { msg: 'Firm Name cannot be empty' },
    },
  },
  gst_number: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'GST Number is required' },
      notEmpty: { msg: 'GST Number cannot be empty' },
      is: {
        args: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[A-Z]{1}[A-Z0-9]{1}$/,
        msg: 'Invalid GST number format',
      },
    },
  },
  pan_number: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'PAN Number is required' },
      notEmpty: { msg: 'PAN Number cannot be empty' },
      is: {
        args: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
        msg: 'Invalid PAN number format',
      },
    },
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Phone Number is required' },
      notEmpty: { msg: 'Phone Number cannot be empty' },
      is: {
        args: /^[0-9]{10}$/,
        msg: 'Phone number must be 10 digits',
      },
    },
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pincode: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: {
        args: /^[0-9]{6}$/,
        msg: 'Invalid Pincode format',
      },
    },
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true, // Image URL or file path
  }
});

