const Sequelize = require('sequelize');
const bcryptService = require('../services/bcrypt.service');

const sequelize = require('../../config/database');

const hooks = {
  beforeCreate(user) {
    user.password = bcryptService().password(user); // eslint-disable-line no-param-reassign
  },
};

const tableName = 'users';

const User = sequelize.define('User', {
  user_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING(320),
    unique: true,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING(50),
    allowNull: false,
  },
  profile_pic: {
    type: Sequelize.STRING,
  },
  last_login_timestamp: {
    type: Sequelize.DATE,
  },
  registered_ip: {
    type: Sequelize.STRING,
  },
  deactivated: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  blocked: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  }
}, { hooks, tableName });

// eslint-disable-next-line
User.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  delete values.password;

  return values;
};

module.exports = User;