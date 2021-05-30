const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const Goal = sequelize.define('Goal', {
	goal_id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false,
	},
	user_id: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	title: {
		type: Sequelize.STRING(50),
		allowNull: false,
	},
	description: {
		type: Sequelize.STRING(2000),
	},
	amount: {
		type: Sequelize.INTEGER, // set null if supporter-based
	},
	supporters: {
		type: Sequelize.INTEGER, // set null if earning-based
	},
	reached: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false,
	},
	archived: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false,
	},
	blocked: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false,
	},
});

module.exports = Goal;
