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
	'PUT /creator/pact/:pact_id': 'PactController.updateFields',
	'DELETE /creator/pact/:pact_id': 'PactController.deletePact',

	//Post API
	'POST /creator/post': 'PostController.createPost',
	'GET /creator/posts': 'PostController.getAllPosts',
	'GET /creator/post/:post_id': 'PostController.getPostByID',
	'PUT /creator/post/:post_id': 'PostController.updateFields',
	'DELETE /creator/post/:post_id': 'PostController.deletePost',

	//Post Like API
	'POST /post/:post_id/like': 'PostLikeController.likePost',
	'GET /post/:post_id/likes': 'PostLikeController.getPostLikes',
	'DELETE /post/:post_id/like': 'PostLikeController.unlikePost',

	//Comment API
	'POST /post/:post_id/comment': 'CommentController.createComment',
	'GET /post/:post_id/comment/:comment_id': 'CommentController.getAllComments',
	'PUT /post/:post_id/comment/:comment_id': 'CommentController.updateFields',
	'DELETE /post/:post_id/comment/:comment_id': 'CommentController.deleteComment',

	//Comment Like API
	'POST /post/:post_id/comment/:comment_id/like': 'CommentLikeController.likeComment',
	'GET /post/:post_id/comment/:comment_id/likes': 'CommentLikeController.getCommentLikes',
	'DELETE /post/:post_id/comment/:comment_id/like': 'CommentLikeController.unlikeComment',

	//Message API
	'POST /message/:to_user_id': 'MessageController.saveMessage',
	'GET /message/:to_user_id': 'MessageController.getMessages',
	'PUT /message/:from_user_id': 'MessageController.markAsRead',
};

module.exports = privateRoutes;
