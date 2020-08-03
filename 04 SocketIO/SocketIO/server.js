const express = require('express')
const PORT = process.env.PORT || 3000
const APP = express()

APP.use(express.static('public'))

const server = APP.listen(PORT, () => console.log('Server running on the port ' + PORT))

const io = require('socket.io')(server)

// Bắt sự kiện một client kết nối đến server
io.on('connection', function (socket) {
  console.log("realtime")
  // io là đối tượng socket tại server, param socket là socket của client đòi kết nối

  // Lắng nghe event 'noidungchat' từ client kết nối
  socket.on('noidungchat', function(data) {
    // Gửi sự kiện (và data) lại cho tất cả client
    io.sockets.emit('dulieuchat_realtime', data)
  })

  socket.on('typing', function(data) {
    // Gửi sự kiện (và data) lại cho tất cả client khác (trừ client kết nối)
    socket.broadcast.emit('typing', data)
  })

  socket.on('nontyping', function(data) {
    socket.broadcast.emit('nontyping', data)
  })

  socket.on('chatprivate', function (data) {
    // Chỉ gửi sự kiện (và data) lại cho client kết nối
    socket.emit('chatprivate', data)
  })

})
