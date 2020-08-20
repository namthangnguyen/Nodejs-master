const mongoose = require('mongoose')

var usersModel = new mongoose.Schema ({
  name: String,
  address: String
})

module.exports = mongoose.model('Users', usersModel)