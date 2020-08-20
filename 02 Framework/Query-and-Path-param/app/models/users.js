var mongoose = require('mongoose')

var users = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  address: String
})

module.exports = mongoose.model('Users', users)