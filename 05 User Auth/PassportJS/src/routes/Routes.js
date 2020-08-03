'use strict'
const passport = require('passport')
const multer = require('multer')


module.exports = function (APP) {
  var UserController = require('../controllers/UserController')
  var PostController = require('../controllers/PostController')

  const multerStogare = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, 'public/images')
    },
    filename: function (req, file, callback) {
      callback(null, (Date.now() + "_" + file.originalname))
    }
  })

  const upload = multer({ storage: multerStogare})

  function requireLogin(req, res, next) {
    if (req.isAuthenticated()) return next()
    res.redirect('/login')
  }

  function requireLogout (req, res, next) {
    if (!req.isAuthenticated()) return next()
    res.redirect('/home')
  }

  APP.get('/', (req, res) => {
    if (req.isAuthenticated()) res.redirect('/home')
    else res.render('index')
  })

  APP.route('/login')
    .get(requireLogout , (req, res) => res.render('login'))
    .post(requireLogout , passport.authenticate('local', {successRedirect: '/home', failureRedirect: '/login'})  
  )

  APP.get('/register', requireLogout , (req, res) => res.render('register'))
  APP.post('/register', requireLogout , UserController.register)

  APP.get('/logout', requireLogin, (req, res) => {
    req.logout()
    res.redirect('/')
  })
  
  APP.get('/user/:id', requireLogin, UserController.detailUser)
  APP.post('/user/:id', requireLogin, UserController.editUser)
  APP.post('/user/:id/upload-avatar', requireLogin, upload.single('avatar'), UserController.editAvatar)

  APP.get('/home', requireLogin, PostController.listPost)

  APP.get('/post/:id', requireLogin, PostController.detailPost)
  APP.post('/post/:id', requireLogin, PostController.editPost)
  APP.get('/post/:id/delete', requireLogin, PostController.deletePost)
  APP.post('/new-post', requireLogin, PostController.createPost)

  APP.get('/auth/google', requireLogout, passport.authenticate('google', { scope: 'profile' }))
  APP.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/home')
  })

  APP.get('/auth/facebook', requireLogout, passport.authenticate('facebook', { scope: 'email' }))
  APP.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login', successRedirect: '/home' }))

}