const privateRoutes = {
  //User API
  'GET /users': 'UserController.getAll', //DELETE this later, only for testing
  'PUT /user': 'UserController.updateFields',
  'DELETE /user': 'UserController.deleteUser',
};

module.exports = privateRoutes;
