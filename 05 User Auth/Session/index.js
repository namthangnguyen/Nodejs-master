const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./src/routes/routes')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const APP = express()
const DB_URI = 'mongodb://localhost/user-auth'
const PORT = process.env.PORT || 8080

mongoose.connect(DB_URI, {useNewUrlParser: true}, (err) => {
  if (err) res.status(400).json(err)
  console.log("Connected to database " + DB_URI)
})
mongoose.set('useCreateIndex', true)

APP.use(bodyParser.json())
APP.use(bodyParser.urlencoded({ extended: true }))

/*
  Mỗi khi có request: Kiểm tra xem có cookie chứa id session không (cookie.sid) nếu có thì tìm xem có session này hay không.
  Session có thể lưu ở database, cache, app memory (RAM), hoặc đâu đó tùy theo mình config (default is RAM, nhưng điều này được 
  khuyến cáo là không nên vì khi restart lại server data sẽ bị mất) (Ở vd này ta sẽ lưu vào database - dùng connect-mongoose)

  Nếu không tạo một obj session có chứa một cookie với các property default (dùng để gửi tới client) 
  và một expires để lưu thời gian tồn tại của session mặc định là 15 ngày (nhưng chưa lưu).

  Nếu request cần lưu thông tin của client thì ta mới thêm tt vào session sau đó lưu session vào DB. 
  Rồi setCookie chứa session id trong header (cookie.sid) và gửi lại cho client. Browser sẽ lưu cookie ở đâu đó 
  và gửi cookie kèm theo mỗi khi nó gửi request tới sever
*/

/* 
  NOTE: mặc định nếu ko set maxAge (expires) thì cookie sẽ mất khi đóng Browser, nếu set maxAge thì khi đóng Browser
  cookie sẽ không bị mất, mà chỉ mất khi qua thời gian expires
*/

APP.use(session({
  secret: 'nam thang nguyen',
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000*60*3
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}))

APP.get('/', function(req, res) {
  console.log(req.session)
  if (req.session.views) {
    req.session.views++
    res.setHeader('Content-Type', 'text/html')
    res.write('<p>views: ' + req.session.views + '</p>')
    res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
    res.end()
  } else {
    req.session.views = 1
    console.log(req.session)
    res.end('welcome to the session demo. refresh!')
  }
})

APP.use('/', routes)

APP.listen(PORT, () => console.log("Server started on http:localhost:" + PORT))
