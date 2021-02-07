const privateRoutes = {
	//User API
	'GET /users': 'UserController.getAll', //DELETE this later, only for testing
	'PUT /user': 'UserController.updateFields',
	'DELETE /user': 'UserController.deleteUser',

	// Creator API
	'POST /creator': 'CreatorController.becomeCreator',
	'GET /creator': 'CreatorController.getCreatorSelf',
	'PUT /creator': 'CreatorController.updateFields',
	//<Profile pic and cover pic routes in api.js>

	//Pact API
	'POST /creator/pact': 'PactController.createPact',
	'GET /creator/pacts': 'PactController.getAllPacts',
	'PUT /creator/pact': 'PactController.updateFields',
	'DELETE /creator/pact': 'PactController.deletePact',

	//Post API
	'POST /creator/post': 'PostController.createPost',
	'GET /creator/posts': 'PostController.getAllPosts',
	'PUT /creator/post': 'PostController.updateFields',
	'DELETE /creator/post': 'PostController.deletePost',
};

module.exports = privateRoutes;
