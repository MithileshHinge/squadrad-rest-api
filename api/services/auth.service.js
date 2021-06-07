const jwt = require('jsonwebtoken');

const secret = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'secret';

const authService = () => {
	const issue = (payload) => jwt.sign(payload, secret, { expiresIn: payload.verify_id ? 86400 /* Email verification - One day expiry */ : 10800 });
	const verify = (token, cb) => jwt.verify(token, secret, {}, cb);

	return {
		issue,
		verify,
	};
};

module.exports = authService;
