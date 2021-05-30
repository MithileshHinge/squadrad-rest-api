const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const CommentLike = sequelize.define('CommentLike', {
	like_id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false,
	},
	user_id: {
		type: Sequelize.INTEGER,
		allowNull: false,
		unique: 'compositeKey1', // make a unique user_id-comment_id pair, can't have duplicate entires
	},
	comment_id: {
		type: Sequelize.INTEGER,
		allowNull: false,
		unique: 'compositeKey1',
	},
});

module.exports = CommentLike;
