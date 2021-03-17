const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const Payment = sequelize.define('Payment', {
	payment_id: {
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
	paid_amount: { //in paise
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	rzp_transaction_id: {
		type: Sequelize.STRING,
	},
	rzp_subscription_id: {
		type: Sequelize.STRING,
	},
	rzp_order_id: {
		type: Sequelize.STRING,
	},
	manual_sub_id: {
		type: Sequelize.INTEGER,
	},
	payment_status: {
		type: Sequelize.BOOLEAN,
	},
});

module.exports = Payment;