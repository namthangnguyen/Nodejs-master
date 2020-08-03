const User = require('../models/UserModel')
const bcrypt = require('bcrypt')

exports.register = function (req, res) {
  User.findOne({email: req.body.username}, (err, user) => {
    if (err) res.json({err})
    if (user == null) {
      bcrypt.hash(req.body.password, 10, function (err, hash) {
        if (err) throw err
        var user = new User(req.body)
        user.role = 'customer'
        user.password = hash
        user.save((err, result) => {
          if (err) throw err
          res.redirect('/home')
        })
      })
    } else {
      res.json({err: "Email has been used"})
    }
  })
}

exports.detailUser = function (req, res) {
  var isOwner = false
  User.findOne({_id: req.params.id}).exec(function (err, user) {
    if (err) res.json({err})
    if (req.user.username == user.username) isOwner = true
    res.render('profile', {isOwner: isOwner, user: user})
  })
}

exports.editAvatar = (req, res) => {
  var avatar = req.file
  console.log(avatar)
  if(!avatar) res.status('400').send({err: "Please choose files"})
  User.findOne({_id: req.params.id} , function (err, user) {
    if (err) res.json({err})
    if (req.user.username == user.username) {
      user.avatar = avatar.filename
      user.save().then(result => {
        res.redirect('/user/' + user._id)
      })
    }
  })
}

exports.editUser = function (req, res) {
  User.findOne({_id: req.params.id}, function (err, user) {
    if (err) res.json({err})
    console.log(req.body)
    if (req.user.username == user.username) {
      user.name = req.body.name
      user.phone = req.body.phone
      user.email = req.body.email
      user.address = req.body.address
      user.save().then(result => {
        res.redirect('/user/' + user._id)
      })
    }
  })
}