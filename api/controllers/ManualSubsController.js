const ManualSub = require('../models/ManualSub');
const rzpService = require('../services/rzp.service');
const PactController = require('./PactController');

const ManualSubsController = () => {
	const createSubscription = async (req, res) => {
		try {
			const pact = PactController().getPactById(req.params.pact_id);

			const manualSub = ManualSub.create({
				user_id: req.token.id,
				creator_user_id: pact.user_id,
				pact_id: pact.pact_id,
			});

			const rzpOrder = rzpService.createOrder(req.rzpInstance, {
				amount: pact.amount * 100, // in paise
				currency: 'INR',
				notes: {
					user_id: req.token.id,
					creator_user_id: req.params.creator_user_id,
					pact_id: req.params.pact_id,
				},
			});

			manualSub.subscription_status = rzpOrder.status;
			await manualSub.save();

			return res.status(200).json(rzpOrder);
		} catch (err) {
			console.log(err);
			return res.status(500).json({ msg: 'Internal server error' });
		}
	};

	const cancelSubscription = async (req, res) => {
		try {
			const nrows = await ManualSub.update({ status: 'cancelled' }, {
				where: {
					user_id: req.token.id,
					pact_id: req.params.pact_id,
				},
			});
			if (nrows[0] > 0) {
				return res.status(200).json({});
			}
			return res.status(400).json({ msg: 'Bad Request: Subscription not found' });
		} catch (err) {
			console.log(err);
			return res.status(500).json({ msg: 'Internal server error' });
		}
	};

	return {
		createSubscription,
		cancelSubscription,
	};
};

module.exports = ManualSubsController;
