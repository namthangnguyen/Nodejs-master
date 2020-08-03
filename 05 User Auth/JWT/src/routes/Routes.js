'use strict'

module.exports = function (APP) {
  const UserController = require('../controllers/UserController')
  const Authenticate = require('../middleware/Authenticate')

  APP.route('/register')
    .post(UserController.register)

  APP.route('/login')
    .post(UserController.login)

  APP.route('/')
    .get(Authenticate, UserController.show)

  APP.route('/logout')
   .get(Authenticate, async (req, res) => {
    // Log user out of the application
    try {
      req.user.tokens = req.user.tokens.filter((token) => {
        return token.token != req.token
      })
      await req.user.save()
      res.send()
    } catch (error) {
      res.status(500).send(error)
    }
  })

  APP.post('/logoutall', Authenticate, async (req, res) => {
    // Log user out of all devices
    try {
      req.user.tokens.splice(0, req.user.tokens.length)
      await req.user.save()
      res.send()
    } catch (error) {
      res.status(500).send(error)
    }
  })
} 