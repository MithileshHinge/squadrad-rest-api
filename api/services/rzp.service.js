const Razorpay = require('razorpay');

const getInstance = (keyId, keySecret) => new Razorpay({
	key_id: keyId,
	key_secret: keySecret,
});

const createOrder = (rzpInstance, options) => rzpInstance.orders.create(options);

module.exports = { getInstance, createOrder };
