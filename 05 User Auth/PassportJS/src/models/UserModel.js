const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  name: String,
  role: {
    type: String,
    enum: ['admin', 'customer']
  },
  password: {
    type: String,
  },
  avatar: String,
  googleId: String,
  facebookId: String,
  phone: String,
  address: String,
  email: String
})

module.exports = mongoose.model('Users', userSchema)