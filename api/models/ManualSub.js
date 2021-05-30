const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const ManualSub = sequelize.define('ManualSub', {
	manual_sub_id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false,
	},
	user_id: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	creator_user_id: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	pact_id: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	subscription_status: {
		type: Sequelize.INTEGER(5), // 0-created, 1-active, 2-payment pending
	},
});

module.exports = ManualSub;
