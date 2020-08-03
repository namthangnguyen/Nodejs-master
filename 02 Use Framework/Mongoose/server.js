const express = require('express')
const APP = express()
const port = process.env.PORT || 8080
const bodyParser = require('body-parser')

const mongoose = require('mongoose')
// Load the created model, sau đó khi muốn dùng ở đâu chỉ cần require mongoose và dùng mongoose.model("NameModel") để lấy collection
// const Users = require('./app/models/Users.model')
// Or không cần load tại đây mà load Model trực tiếp tại mơi mình dùng (trong project này dùng cách này)
mongoose.connect('mongodb://localhost/test_mongoose', function (err) {
  if (err) throw err
  console.log("Successfull connected!")
})

APP.use(bodyParser.urlencoded({ extended: true }));
APP.use(bodyParser.json());

const userRoute = require('./app/routes/r_users')
APP.use('/users', userRoute)

APP.use((req, res) => res.status(404).send({url: req.originalUrl + ' not found'}));

APP.listen(port, () => console.log('Your app running on port '+ port))
