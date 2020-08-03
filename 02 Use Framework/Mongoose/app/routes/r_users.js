const express = require('express')
const user_router = express.Router()
const usersController = require('../controllers/c_users');

user_router.route('/')
  .get(usersController.list_all_users)
  .post(usersController.create_a_user)

user_router.route('/search')
  .get(usersController.search_user)

user_router.route('/:userID')
  .get(usersController.read_a_user)
  .put(usersController.update_a_user)
  .delete(usersController.delete_a_user)

module.exports = user_router