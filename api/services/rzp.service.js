const Razorpay = require('razorpay')

const getInstance = (key_id, key_secret) => {
	return new Razorpay({
		key_id: key_id,
		key_secret: key_secret
	});
};

const createOrder = (rzpInstance, options) => {
	return rzpInstance.orders.create(options);
};

module.exports = {getInstance, createOrder};