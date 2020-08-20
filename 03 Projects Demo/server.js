var express = require('express'),
  app = express(),
  port = process.env.PORT || 3001,
  mongoose = require('mongoose'),
  bodyParser = require('body-parser');

Tasks = require('./api/models/todoListModel');
fileUpload = require('express-fileupload');
path = require('path');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/todolist',
  { useNewUrlParser: true }).then(() => {
    console.log("Connected !!!")
  }).catch(err => {
    console.log(err);
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public/images')));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

var routes = require('./api/routes/todoListRoutes');
routes(app);

app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + ' not found' })
});

var server = app.listen(port, function (req, res) {
  var host = server.address().address
  var port = server.address().port
  
  console.log("TODO list RESTful API server started at http://%s:%s", host, port)
});
