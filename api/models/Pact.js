const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const Pact = sequelize.define('Pact', {
	pact_id: {
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
		type: Sequelize.INTEGER,
		allowNull: false,
		validate: {
			isGreaterThanMinAmount(value) {
				if (value < 30) {
					throw new Error('Amount must be greater than 30');
				}
			}
		}
	},
	supporters_limit: {
		type: Sequelize.INTEGER,
	},
	blocked: {
		type: Sequelize.BOOLEAN,
		defaultValue: false,
		allowNull: false,
	}
});

module.exports = Pact;