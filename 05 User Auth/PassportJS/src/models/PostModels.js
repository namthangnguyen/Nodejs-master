const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  poster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: Date
})

module.exports = mongoose.model('Posts', postSchema)
