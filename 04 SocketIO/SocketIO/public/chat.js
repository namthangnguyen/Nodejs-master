// Client khởi tạo kết nối socket đến server
const socket = io('http://localhost:3000')

// Lấy thông tin từ client sau đó gửi lên server ~ emit
// Server lắng nghe sự kiện đó kèm dữ liệu gửi lên ~ on
// Server sẽ phải gửi toàn bộ dữ liệu xuống các client khác và cả client gửi lên socker.emit
// Client lắng nghe sự kiện đó và in ra kết quả ~ on

noidungtin = $('#message')
ten = $('#handle')
btn = $('#send')
justme = $('#send-private')
output = $('#output')
feedback = $('#feedback')

// Gửi event noidungchat
btn.click(function() {
  socket.emit('noidungchat', {
    ten: ten.val(),
    noidungtin: noidungtin.val()
  })
})

noidungtin.keypress(function() {
  socket.emit('typing', {
    ten: ten.val()
  })
})

noidungtin.focusout(function() {
  socket.emit('nontyping', {
    ten: ten.val()
  })
})

justme.click(function() {
  socket.emit('chatprivate', {
    ten: ten.val(),
    noidungtin: noidungtin.val()
  })
})

// Lắng nghe event dulieuchat_realtime từ server
socket.on('dulieuchat_realtime', function(data) {
  output.append('<p><strong>' + data.ten + '</strong>: '+ data.noidungtin +'</p>')
})

socket.on('typing', function(data) {
  feedback.html('<p><em>' + data.ten + '</em> is typing a message...</p>')
})

socket.on('nontyping', function(data) {
  feedback.html('')
})

socket.on('chatprivate', function(data) {
  output.append('<p><strong>' + data.ten + '</strong>: '+ data.noidungtin +'</p>')
})