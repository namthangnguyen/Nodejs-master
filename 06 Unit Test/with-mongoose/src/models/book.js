const mongoose = require('mongoose')

let BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: { type: Number, required: true },
  pages: { type: Number, required: true, min: 1 },
  created: { type: Date, default: Date.now }
})

// Sets the created parameter equal to the current time
BookSchema.pre('save', next => {
  now = new Date();
  if (!this.created) {
    this.created = now
  }
  next()
})

//Exports the BookSchema for use elsewhere.
module.exports = mongoose.model('Books', BookSchema)