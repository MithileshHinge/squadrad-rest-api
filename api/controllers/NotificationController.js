const Notification = require('../models/Notification');

const NotificationController = () => {
	const createNotif = async (notifData) => {
		try {
			const notif = await Notification.create({
				user_id: notifData.user_id,
				description: notifData.description,
				link: notifData.link,
			});

			return notif;
		} catch (err) {
			console.log(err);
			return null;
		}
	};

	const getNotifs = async (req, res) => {
		try {
			const notifs = await Notification.findAll({
				where: {
					user_id: req.token.id,
				},
				order: [['createdAt', 'DESC']],
				offset: req.body.offset, // pagination, if set
				limit: req.body.limit, // pagination, if set
			});

			return res.status(200).json({ notifs });
		} catch (err) {
			console.log(err);
			return res.status(500).json({ msg: 'Internal server error' });
		}
	};

	const markAsRead = async (req, res) => {
		try {
			// eslint-disable-next-line no-unused-vars
			const nrows = await Notification.update({ read: true }, {
				where: {
					user_id: req.token.id,
				},
			});
			return res.status(200).json({});
		} catch (err) {
			console.log(err);
			return res.status(500).json({ msg: 'Internal server error' });
		}
	};

	const deleteNotif = async (notifData) => {
		try {
			const notif = await Notification.findOne({
				where: notifData,
			});
			if (notif) {
				notif.destroy();
			}
		} catch (err) {
			console.log(err);
		}
	};

	return {
		createNotif,
		getNotifs,
		markAsRead,
		deleteNotif,
	};
};

module.exports = NotificationController;
