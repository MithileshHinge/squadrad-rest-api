const publicRoutes = {
	'POST /user': 'UserController.register',
	'POST /register': 'UserController.register', // alias for POST /user
	'POST /login': 'UserController.login',
	'POST /validate': 'UserController.validate',
	'GET /auth/verify-email': 'UserController.verifyEmail',

	'GET /creator/:user_id/goals': 'GoalController.getAllGoals',
};

module.exports = publicRoutes;
