const Creator = require('../models/Creator');

const allowedFields = ['page_name', 'plural', 'creating_what', 'about', 'intro_video', 'slug', 'supporters_visibility', 'earnings_visibility', 'otp_visibility', 'thanks_message', 'goals_type_earnings', 'account_holder_name', 'account_no', 'ifsc', 'upi_id', 'review_submitted', 'deactivated'];

// NEVER USE creator_id or primary key (findByPk)
const CreatorController = () => {

	const becomeCreator = async (req, res) => {
		try {
			const creator = await Creator.create({
				user_id: req.token.id,
				page_name: req.body.page_name,
				plural: req.body.plural,
				creating_what: req.body.creating_what, 
			});

			return res.status(200).json({creator});
		} catch (err) {
			console.log(err);
			return res.status(500).json({ msg: 'Internal server error' });
		}
	};

	const getCreatorSelf = async (req, res) => {
		try {
			const creator = await Creator.findOne({where: {user_id: req.token.id}});
			if (!creator) {
				return res.status(500).json({ msg: 'Internal server error'});
			}

			return res.status(200).json(creator);
		} catch (err) {
			return res.status(500).json({ msg: 'Internal server error'});
		}
	};

	const updateProfilePic = async (req, res) => {
		try {
			const nrows = await Creator.update(
				{ profile_pic: req.file.filename },
				{ where: {user_id: req.token.id}}
			);
			if (nrows[0] > 0)
				return res.status(200).json({});
			else
				return res.status(500).json({ msg: 'Internal server error'});
		} catch (err) {
			console.log(err);
			return res.status(500).json({ msg: 'Internal server error' });
		}
	};

	const updateCoverPic = async (req, res) => {
		try {
			const nrows = await Creator.update(
				{ cover_pic: req.file.filename },
				{ where: {user_id: req.token.id}}
			);
			if (nrows[0] > 0)
				return res.status(200).json({});
			else
				return res.status(500).json({ msg: 'Internal server error'});
		} catch (err) {
			console.log(err);
			return res.status(500).json({ msg: 'Internal server error' });
		}
	};

	const updateFields = async (req, res) => {
		const fields = Object.keys(req.body);
		console.log(fields);
		let updateData = {};

		for (let field of fields){
			if (allowedFields.includes(field)){
				updateData[field] = req.body[field];    
			}
		}

		console.log(updateData);

		try {
			const nrows = await Creator.update(updateData, { where: {user_id: req.token.id}} );
			if (nrows[0] > 0)
				return res.status(200).json({});
			else
				return res.status(500).json({ msg: 'Internal server error'});
		} catch (err) {
			console.log(err);
			return res.status(500).json({ msg: 'Internal server error' });
		}
	};

	return {
		becomeCreator,
		getCreatorSelf,
		updateFields,
		updateProfilePic,
		updateCoverPic,
	};
};


module.exports = CreatorController;