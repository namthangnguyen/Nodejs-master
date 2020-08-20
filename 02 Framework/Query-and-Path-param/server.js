const express = require('express')
const app = express()
const port = 8080

const userRoute = require('./app/routes/users')

// Set thư mục views nằm cùng cấp với file app.js => khi trỏ đến app/views/users/name chỉ cần users/name
app.set('views', './app/views')
app.set('view engine', 'pug') // Sử dụng pug làm view engine

// Hàm không khai báo đường dẫn cụ thể => nó sẽ được thực hiện mỗi lần request:
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Hàm được thực hiện mỗi khi truy cập đến đường dẫn / bằng phương thức GET
app.get('/', function(req, res){
	res.send("<h1>This is my first app</h1><a href='users'>Show All Users</a>")
})

// Hàm use đến đường dẫn /users. Hàm này sẽ được thực hiện mỗi khi request đến đường dẫn /users bất kể phương thức nào (GET, POST,...):
// Dùng userRoute cho tất cả các route bắt đầu bằng '/users'
app.use('/users', userRoute)

// Khi client nhập sai url => trả về "urlsai not found" (ý tưởng: hàm này sẽ được gọi mỗi khi có req => khi nó có status = 400 => url ko not fourd)
app.use((req, res) => res.status(404).send({url: req.originalUrl + ' not found'}));

app.listen(port, function(){
  console.log('Your app running on port '+ port)
})
