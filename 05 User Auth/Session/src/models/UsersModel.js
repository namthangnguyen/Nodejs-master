const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  role: {
    type: String,
    enum: ['admin', 'customer']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
})

module.exports = mongoose.model('Users', userSchema)