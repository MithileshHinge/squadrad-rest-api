const {Op} = require('sequelize');
const Message = require('../models/Message');

//const allowedFields = ["read"];

const MessageController = () => {

	const saveMessage = async (req, res) => {
		try {
			const message = await Message.create({
				from_user_id: req.token.id,
				to_user_id: req.params.to_user_id,
				message: req.body.message,
			});

			return res.status(200).json({message});
		} catch (err) {
			console.log(err);
			return res.status(500).json({msg: 'Internal server error'});
		}
	};

	const getMessages = async (req, res) => {
		try {
			const messages = await Message.findAll({
				where: {
					[Op.or]: [{
						from_user_id: req.token.id,
						to_user_id: req.params.to_user_id,
					}, {
						from_user_id: req.params.to_user_id,
						to_user_id: req.token.id,
					}]
				},
				order: [['createdAt', 'DESC']],
				offset: req.body.offset, //pagination, if implemented
				limit: req.body.limit, // pagination, if implemented
			});
			return res.status(200).json({messages});
		} catch (err) {
			console.log(err);
			return res.status(500).json({msg: 'Internal server error'});
		}
	};

	/*
	const updateFields = async (req, res) => {
		const fields = Object.keys(req.body);
		let updateData = {};

		for (let field of fields){
			if (allowedFields.includes(field)){
				updateData[field] = req.body[field];
			}
		}

		try {
			const nrows = await Message.update(updateData, {
				where: {
					from_user_id: req.params.from_user_id,
					to_user_id: req.token.id,
				}
			});
		} catch (err) {
			console.log(err);
			return res.status(500).json({msg: 'Internal server error'});
		}
	}
	*/

	const markAsRead = async (req, res) => {
		try {
			const nrows = await Message.update({read: true}, {
				where: {
					from_user_id: req.params.from_user_id,
					to_user_id: req.token.id,
				}
			});
			return res.status(200).json({});
		} catch (err) {
			console.log(err);
			return res.status(500).json({msg: 'Internal server error'});
		}
	};

	return {
		saveMessage,
		getMessages,
		markAsRead,
	};
};

module.exports = MessageController;