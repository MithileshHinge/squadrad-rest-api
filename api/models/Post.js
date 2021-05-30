const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const Post = sequelize.define('Post', {
	post_id: {
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
	is_link: {
		type: Sequelize.BOOLEAN, // 0-file, 1-link
		allowNull: false,
	},
	path: {
		type: Sequelize.STRING,
	},
	pact_id: {
		type: Sequelize.INTEGER,
	},
	otp_amount: {
		type: Sequelize.INTEGER,
	},
	archived: {
		type: Sequelize.BOOLEAN,
		defaultValue: false,
		allowNull: false,
	},
	blocked: {
		type: Sequelize.BOOLEAN,
		defaultValue: false,
		allowNull: false,
	},
});

module.exports = Post;
