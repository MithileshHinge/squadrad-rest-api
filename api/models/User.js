const Sequelize = require('sequelize');
// eslint-disable-next-line import/no-extraneous-dependencies
const Validator = require('validator');
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
		validate: {
			isEmail: {
				domain_specific_validation: true,
			},
		},
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	name: {
		type: Sequelize.STRING(50),
		allowNull: false,
		validate: {
			isAlphaSplit(value) {
				if (!value.split(' ').every((word) => Validator.isAlpha(word))) {
					throw new Error('Only alphabets are allowed in a name');
				}
			},
		},
	},
	profile_pic: {
		type: Sequelize.STRING,
	},
	google_token: {
		type: Sequelize.STRING,
	},
	google_refresh_token: {
		type: Sequelize.STRING,
	},
	youtube_token: {
		type: Sequelize.STRING,
	},
	youtube_refresh_token: {
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
	},
}, { hooks, tableName });

// eslint-disable-next-line
User.prototype.toJSON = function () {
	const values = Object.assign({}, this.get());

	delete values.password;
	delete values.google_token;
	delete values.google_refresh_token;
	delete values.youtube_token;
	delete values.youtube_refresh_token;
	delete values.last_login_timestamp;
	delete values.registered_ip;


	return values;
};

module.exports = User;
