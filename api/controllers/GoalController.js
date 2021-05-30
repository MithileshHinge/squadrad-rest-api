const Goal = require('../models/Goal');

const allowedFields = ['title', 'description', 'amount', 'supporters', 'reached', 'archived'];

const GoalController = () => {
	const createGoal = async (req, res) => {
		try {
			if (!req.isCreator) {
				return res.status(401).json({ msg: 'Unauthorized' });
			}
			if ((req.body.amount && !req.creator.goals_type_earnings) || (req.body.supporters && req.creator.goals_type_earnings)) {
				return res.status(400).json({ msg: 'Incorrect goal type' });
			}

			const goal = await Goal.create({
				user_id: req.token.id,
				title: req.body.title,
				description: req.body.description,
				amount: req.body.amount,
				supporters: req.body.supporters,
			});

			return res.status(200).json(goal);
		} catch (err) {
			console.log(err);
			return res.status(500).json({ msg: 'Internal server error' });
		}
	};

	const getAllGoals = async (req, res) => {
		try {
			const goals = await Goal.findAll({
				where: {
					user_id: req.params.user_id,
				},
			});

			return res.status(200).json(goals);
		} catch (err) {
			console.log(err);
			return res.status(500).json({ msg: 'Internal server error' });
		}
	};

	const updateFields = async (req, res) => {
		const fields = Object.keys(req.body);
		console.log(fields);
		const updateData = {};

		fields.forEach((field) => {
			if (allowedFields.includes(field)) {
				updateData[field] = req.body[field];
			}
		});

		console.log(updateData);

		try {
			const nrows = await Goal.update(updateData, {
				where: {
					goal_id: req.params.goal_id,
					user_id: req.token.id,
				},
			});
			if (nrows[0] > 0) {
				return res.status(200).json({});
			}
			return res.status(400).json({ msg: 'Bad Request' });
		} catch (err) {
			console.log(err);
			return res.status(500).json({ msg: 'Internal server error' });
		}
	};

	const deleteGoal = async (req, res) => {
		try {
			const goal = await Goal.findByPk(req.params.goal_id);

			if (!goal) {
				return res.status(404).json({ msg: 'Goal not found' });
			}

			if (goal.user_id === req.token.id) {
				goal.destroy();
				return res.status(200).json({ goal });
			}

			return res.status(401).json({ msg: 'Unauthorized' });
		} catch (err) {
			console.log(err);
			return res.status(500).json({ msg: 'Internal server error' });
		}
	};

	return {
		createGoal,
		getAllGoals,
		updateFields,
		deleteGoal,
	};
};

module.exports = GoalController;
