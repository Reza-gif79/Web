const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Alumni = sequelize.define('Alumni', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING
  },
  graduationYear: {
    type: DataTypes.INTEGER
  },
  major: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.STRING
  },
  photo: {
    type: DataTypes.STRING,
    defaultValue: ''
  }
}, {
  timestamps: true
});

module.exports = Alumni;