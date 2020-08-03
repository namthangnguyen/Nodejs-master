var express = require('express'),
  app = express(),
  port = process.env.PORT || 3001,
  mongoose = require('mongoose'),
  bodyParser = require('body-parser');
  Tasks = require('./api/models/todoListModel');
  fileUpload = require('express-fileupload');
  path = require('path');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/abc',
{useNewUrlParser: true}).then(() => {
  console.log("Connected !!!")
}).catch(err => {
  console.log(err);
});
//socket
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3002);
io.on('connection',function(socket){
  io.sockets.emit("user_online", socket.id + ' is connected');
  socket.on('message',function(msg){
    socket.broadcast.emit("re_message", socket.id +": "+ msg);
  });
  socket.on('disconnect',function(msg){
    socket.broadcast.emit("re_message", socket.id +": is disconnected");
  });
});
//
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public/images')));
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));

var routes = require('./api/routes/todoListRoutes');
routes(app);

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);

console.log('todo list RESTful API server started on:!!!!!!!!!! ' + port);
