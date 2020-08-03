const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const PORT = process.env.PORT || 8080
const APP = express()
const pet = require('./controller/routes/Pet')

// Don't show the log when it is the 'test'
if (process.env.NODE_ENV != 'test') {
  // User morgan to log at command line
  APP.use(morgan('dev')) // 'conbined' outputs the Apache style LOGs
}

// Parse application/json and look for raw text
APP.use(bodyParser.json())
APP.use(bodyParser.urlencoded({extended: true}))

APP.get('/', (req, res) => res.send("Welcom to our Perstore!"))

APP.route("/pets")
  .get(pet.getPets)
  .post(pet.postPet)
APP.route("/pets/:id")
  .get(pet.getPet)
  .delete(pet.deletePet)
  .put(pet.updatePet)

APP.use((req, res) => res.status(404).send({url: req.originalUrl + ' not found!'}))

APP.listen(PORT, () => console.log("Server started on http://localhost:" + PORT))

module.exports = APP