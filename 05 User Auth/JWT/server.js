const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
var PORT = process.env.PORT || 8080
var APP = express()

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useCreateIndex: true})
  .then(() => console.log("Connected to " + process.env.MONGODB_URL))
  .catch(err => console.log("Could not connect to MongoDB..."))

APP.use(bodyParser.json())
APP.use(bodyParser.urlencoded({extended: true}))

var routes = require('./src/routes/Routes')
routes(APP)

APP.use((req, res) => res.status(404).send({url: req.originalUrl + ' not found!'}))
APP.listen(PORT, () => console.log("Server started on http:localhost:" + PORT))