const express = require('express')
const port = process.env.PORT || 8080
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const bodyParser = require('body-parser')
const multer = require('multer')
const APP = express()
const fs = require('fs')

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
  if (err) return console.log(err)
  db = client.db('mongoose_huhu') 
  console.log("Successfull connected!")
})

console.log("a")
APP.use(bodyParser.json())
APP.use(bodyParser.urlencoded({extended: true}))
APP.set('view engine', 'ejs')

APP.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

// Khởi tạo biến cấu hình cho việc lưu trữ file upload
const multerStogare = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'uploads')
  },
  filename: function (req, file, callback) {
    callback(null, (Date.now() + "_" + file.originalname))
  }
})

// Khởi tạo middleware upload với cấu hình như ở trên,
const upload = multer({ storage: multerStogare})

// Hàm .single() nhận param là attribute name của thẻ input, ở đây là "myfile"
APP.post('/uploadfile', upload.single('myfile'), (req, res, next) => {
  const file = req.file
  console.log(req.body)
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  res.send(file)
})

APP.post('/uploadmultiple', upload.array('myfiles', 9), (req, res, next) => {
  const files = req.files
  if (!files) {
    const error = new Error('Please choose files')
    error.httpStatusCode = 400
    return next(error)
  }
  res.send(files)
})

APP.post('/upload/photo', upload.single('picture'), (req, res) => {
  var img = fs.readFileSync(req.file.path)
  var encode_img = img.toString('base64')
  // Define a JSONobject for the image attributes for saving to database
  var finalImg = {
    contentType: req.file.mimetype,
    image: new Buffer(encode_img, 'base64')
  }
  db.collection('images').insertOne(finalImg, (err, result) => {
    if (err) return console.log(err)
    console.log('Saved to database.')
    res.redirect('/')
  })
})

APP.get('/photos', (req, res) => {
  db.collection('images').find().toArray((err, result) => {
    const imgArr = result.map(element => element._id)
    if (err) return console.log(err)
    res.send(imgArr)
  })
})

APP.get('/photo/:id', (req, res) => {
  db.collection('images').findOne({_id: ObjectId(req.params.id)}, (err, result) => {
    if (err) return console.log(err)
    res.contentType('image/jpeg');
    res.send(result.image.buffer)
  })
})

APP.use(function (req, res) {
  res.status(404).send({url: req.originalUrl + ' not found!'})
})

APP.listen(port, function () {
  console.log('Server is running on PORT: ' + port);
});