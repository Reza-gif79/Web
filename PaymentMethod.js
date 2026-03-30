const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PaymentMethod = sequelize.define('PaymentMethod', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  holder: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING
  },
  type: {
    type: DataTypes.ENUM('bank', 'ewallet', 'credit_card'),
    defaultValue: 'bank'
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  logo: {
    type: DataTypes.STRING, // URL to the logo image
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = PaymentMethod;