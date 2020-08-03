const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  title: {type: String, required: true, minlength: 4, maxlength: 150},
  content: {type: String, required: true, minlength: 4, maxlength: 2000},
  poster: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
  created: {type: Date, default: Date.now},
  updated: {type: Date}
})

module.exports = mongoose.model('Posts', postSchema)
