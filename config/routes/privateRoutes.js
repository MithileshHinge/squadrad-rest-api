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
};

module.exports = privateRoutes;
