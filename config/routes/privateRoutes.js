const privateRoutes = {
  'GET /users': 'UserController.getAll', //DELETE this later, only for testing
  'POST /user/name': 'UserController.updateName',
  'POST /user/deactivate': 'UserController.toggleDeactivate',
  'DELETE /user': 'UserController.deleteUser',
};

module.exports = privateRoutes;
