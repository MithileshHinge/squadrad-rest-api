const privateRoutes = {
  'GET /users': 'UserController.getAll', //DELETE this later, only for testing
  'POST /user/name': 'UserController.updateName',
  'POST /user/deactivate': 'UserController.toggleDeactivate',
  'DELETE /user': 'UserController.deleteUser',

  // Creator API
  'POST /creator': 'CreatorController.becomeCreator',
  'GET /creator': 'CreatorController.getCreatorSelf',
  'PUT /creator': 'CreatorController.updateFields',
  //<Profile pic and cover pic routes in api.js>
};

module.exports = privateRoutes;
