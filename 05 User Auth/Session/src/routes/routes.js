const express = require('express')
const Router = express.Router()
const UserController = require('../controllers/UserController')
const PostController = require('../controllers/PostController')
const {check, validationResult} = require('express-validator')
const User = require('../models/UsersModel')

function requiresLogout(req, res, next) {
  if (req.session && req.session.user) return res.json({err: 'You must be Logout in to Login continue'});        
  return next()
}

function requiresLogin(req, res, next) {
  if (req.session && req.session.userID) return next()
  return res.json({err: "You must be logged in to view this page."})
}

let checkk = [
  check('email', 'Invalid email.').isEmail(),
  check('email', 'Email is required.').not().isEmpty(),
  check('name', 'Username is required.').not().isEmpty(),
  check('name', 'Username must be more than 2 characters').isLength({min:2}),
  check('password', 'Password is required.').not().isEmpty(),
  check('password', 'Password must be more than 6 characters').isLength({min:6})
]

async function loginValidate (req, res, next){

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  return next()
}

const validate = validations => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(422).json({ errors: errors.array() });
  };
};

Router.get('/login', (req, res) => {
  console.log(req.cookie)
  res.render('login')
})

Router.post('/login', validate(checkk), UserController.login)
Router.post('/register', requiresLogout, UserController.register)
Router.get('/logout', requiresLogin, UserController.logout)

Router.get('/posts', requiresLogin, PostController.listPost)
Router.get('/users', requiresLogin, PostController.listPostByUser)
Router.get('/post/:id', requiresLogin, PostController.detailPost)
Router.post('/post/new', requiresLogin, PostController.createPost)
Router.put('/post/:id/edit', requiresLogin, PostController.editPost)
Router.delete('/post/:id', requiresLogin, PostController.deletePost)

module.exports = Router
