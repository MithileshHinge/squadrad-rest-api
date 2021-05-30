const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const Message = sequelize.define('Message', {
	message_id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false,
	},
	from_user_id: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	to_user_id: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	message: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
		},
	},
	read: {
		type: Sequelize.BOOLEAN,
		defaultValue: false,
		allowNull: false,
	},
});

module.exports = Message;
