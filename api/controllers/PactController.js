const Pact = require('../models/Pact');

const allowedFields = ['title', 'description', 'supporters_limit'];

const PactController = () => {

	const createPact = async (req, res) => {
		try{
			const pact = await Pact.create({
				user_id: req.token.id,
				title: req.body.title,
				description: req.body.description,
				amount: req.body.amount,
				supporters_limit: req.body.supporters_limit,
			});

			return res.status(200).json({pact});
		} catch (err) {
			console.log(err);
			return res.status(500).json({ msg: 'Internal server error' });
		}
	};

	const getAllPacts = async (req, res) => {
		try {
			const pacts = await Pact.findAll({
				where: {
					user_id: req.body.user_id
				}
			});

			return res.status(200).json(pacts);
		} catch (err) {
			console.log(err);
			return res.status(500).json({ msg: 'Internal server error' });
		}
	}

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
			const nrows = await Pact.update(updateData,
				{ where: {
					pact_id: req.body.pact_id,
					user_id: req.token.id
				}
			});
			if (nrows[0] > 0)
				return res.status(200).json({});
			else
				return res.status(500).json({ msg: 'Internal server error'});
		} catch (err) {
			console.log(err);
			return res.status(500).json({ msg: 'Internal server error' });
		}
	};

	const deletePact = async (req, res) => {
		try {
			const pact = await User.findByPk(req.body.pact_id);

			if (!pact) {
				return res.status(400).json({ msg: 'Bad Request: Pact not found' });
			}

			if (pact.user_id === req.token.id) {
				pact.destroy();
				return res.status(200).json({ pact });
			}

			return res.status(401).json({ msg: 'Unauthorized' });
		} catch (err) {
			console.log(err);
			return res.status(500).json({ msg: 'Internal server error' });
		}
	};

	return {
		createPact,
		getAllPacts,
		updateFields,
		deletePact,
	};
};

module.exports = PactController;