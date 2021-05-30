const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const PostLike = sequelize.define('PostLike', {
	like_id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false,
	},
	user_id: {
		type: Sequelize.INTEGER,
		allowNull: false,
		unique: 'compositeKey1', // make a unique user_id-post_id pair, can't have duplicate entries
	},
	post_id: {
		type: Sequelize.INTEGER,
		allowNull: false,
		unique: 'compositeKey1',
	},
});

module.exports = PostLike;
