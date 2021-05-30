const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const Comment = sequelize.define('Comment', {
	comment_id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false,
	},
	user_id: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	post_id: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	parent_id: {
		type: Sequelize.INTEGER,
	},
	is_reply: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false,
		validate: {
			isParentIDSet(value) { // if this is a reply, check if parent comment's id is given
				if (value && this.parent_id == null) {
					throw new Error('No parent_id provided');
				}
			},
		},
	},
	comment: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
		},
	},
	blocked: {
		type: Sequelize.BOOLEAN,
		defaultValue: false,
		allowNull: false,
	},
});

module.exports = Comment;
