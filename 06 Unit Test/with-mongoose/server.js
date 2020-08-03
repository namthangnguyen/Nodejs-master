let express = require('express')
let app = express();
let mongoose = require('mongoose')
let morgan = require('morgan')
let bodyParser = require('body-parser')
let port = 8080
let book = require('./routes/index')
let config = require('./config') 
//we load the db location from the JSON files
var mongoURI

// don't show the log and using test database when it is test
if (process.env.NODE_ENV !== 'test') {
  var mongoURI = config.mongoURI.development
  //use morgan to log at command line
  app.use(morgan('combined')) 
  //'combined' outputs the Apache style LOGs
} else {
  mongoURI = config.mongoURI.test
}

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to: " + mongoURI))
  .catch(err => res.status(400).json(err))

//parse application/json and look for raw text                                        
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => res.json({ message: "Welcome to our Bookstore!" }))

app.route("/book")
  .get(book.getBooks)
  .post(book.postBook)
app.route("/book/:id")
  .get(book.getBook)
  .delete(book.deleteBook)
  .put(book.updateBook)

app.listen(port)
console.log("Listening on port " + port)

// for testing
module.exports = app