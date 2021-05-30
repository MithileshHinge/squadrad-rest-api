const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const Creator = sequelize.define('Creator', {
	creator_id: { // DO NOT USE for anything
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false,
	},
	user_id: {
		type: Sequelize.INTEGER,
		unique: true,
		allowNull: false,
	},
	page_name: {
		type: Sequelize.STRING(50),
		allowNull: false,
	},
	plural: {
		type: Sequelize.BOOLEAN,
		defaultValue: false,
		allowNull: false,
	},
	creating_what: {
		type: Sequelize.STRING(50),
		allowNull: false,
	},
	profile_pic: {
		type: Sequelize.STRING,
	},
	cover_pic: {
		type: Sequelize.STRING,
	},
	about: {
		type: Sequelize.TEXT,
	},
	intro_video: {
		type: Sequelize.STRING,
	},
	slug: {
		type: Sequelize.STRING(50),
		unique: true,
	},
	supporters_visibility: {
		type: Sequelize.BOOLEAN,
		defaultValue: true,
	},
	earnings_visibility: {
		type: Sequelize.BOOLEAN,
		defaultValue: true,
	},
	otp_visibility: {
		type: Sequelize.BOOLEAN,
		defaultValue: true,
	},
	thanks_message: {
		type: Sequelize.TEXT,
	},
	goals_type_earnings: {
		type: Sequelize.BOOLEAN,
	},
	account_holder_name: {
		type: Sequelize.STRING(50),
	},
	account_no: {
		type: Sequelize.STRING(50),
	},
	ifsc: {
		type: Sequelize.STRING(50),
	},
	upi_id: {
		type: Sequelize.STRING(50),
	},
	youtube_link: {
		type: Sequelize.STRING,
	},
	instagram_link: {
		type: Sequelize.STRING,
	},
	facebook_link: {
		type: Sequelize.STRING,
	},
	review_submitted: {
		type: Sequelize.BOOLEAN,
		defaultValue: false,
		allowNull: false,
	},
	review_submit_timestamp: {
		type: Sequelize.DATE,
	},
	review_accepted: {
		type: Sequelize.BOOLEAN,
		defaultValue: false,
		allowNull: false,
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
});

// eslint-disable-next-line
Creator.prototype.toJSON = function () {
	const values = Object.assign({}, this.get());

	delete values.account_holder_name;
	delete values.account_no;
	delete values.ifsc;
	delete values.upi_id;
	delete values.youtube_token;
	delete values.instagram_token;
	delete values.facebook_token;
	delete values.google_token;

	return values;
};

module.exports = Creator;
