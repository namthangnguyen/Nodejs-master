const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
require('./configure/passport-setup')

var PORT = process.env.PORT || 8080
var APP = express()

mongoose.connect('mongodb://localhost:27017/passport', { useNewUrlParser: true, useCreateIndex: true })
  .then(() => console.log("Connected MongoDB!!!"))
  .catch(err => res.status(400).json({ message: 'Could not connect to MongoDB...', error: err }))

// Set thư mục chứa files html & template engine
APP.set('views', './src/views')
APP.set('view engine', 'ejs')
APP.use(express.static('public'))

APP.use(bodyParser.json())
APP.use(bodyParser.urlencoded({ extended: true }))

APP.use(session({
  secret: 'namthangnguyen',
  saveUninitialized: false,
  resave: true
}))

APP.use(passport.initialize())
APP.use(passport.session())

var route = require('./src/routes/Routes')
route(APP)

APP.use((req, res) => res.status(404).send({url: req.originalUrl + ' not found!' }))
APP.listen(PORT, () => console.log("Server started on http:localhost:" + PORT))
