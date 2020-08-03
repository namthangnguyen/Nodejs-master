const User = require('../models/UsersModel')
const bcrypt = require('bcrypt')

exports.register = function (req, res) {
  User.findOne({email: req.body.email}, (err, user) => {
    if (err) res.json({err})
    // Tìm trong Collection xem có user dùng mail này chưa
    if (user == null) {
      // Mã hóa mật khẩu
      bcrypt.hash(req.body.password, 10, function (err, hash) {
        if (err) throw err
        const user = new User(req.body)
        // Sau khi register thì role auto là customer
        user.role = 'customer'
        // Lưu mật khẩu người dùng đã mã hóa => tránh nv, hacker ăn chộm dễ dàng (vào db xem sẽ rõ)
        user.password = hash
        user.save((err, result) => {
          if (err) throw err
          res.json({user: result})
        })
      })
    } else {
      res.json({err: "Email has been used"})
    }
  })
}

exports.login = function(req, res) {
  User.findOne({email: req.body.email}).exec(function (err, user) {
    if (err) res.json({err})
    if (!user) return res.json({err: 'Email is incorrect'})
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if(result === true){
        // Tạo một session cho user (với nội dung là userID)
        req.session.userID = user._id
        res.json({
          user: user,
          "login": "success"
        })
      } else {
        return res.json({err: 'Password is incorrect'})
      }
    })
  })
}

exports.logout = function (req, res) {
  if (req.session) {
    // Delete session object
    req.session.destroy(function (err) {
      if (err) res.json({err})
      res.json({logout: "Success"})
    })
  }
}

