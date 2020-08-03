const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/UserModel')
const { secretKey } = require('../config/Default')

// exports.register = function (req, res) {
//   var newUser = new Users({
//     email: req.body.email,
//     name: req.body.name
//   })
//   newUser.hash_password = bcrypt.hashSync(req.body.password, 11)
//   newUser.save(function (err, user) {
//     if (err) return res.status(400).send({ message: err })
//     else res.status(200).json(user)
//   })
// }

// exports.login = function (req, res) {
//   Users.findOne({ email: req.body.email }, function (err, user) {
//     if (err) throw err
//     if (!user) res.status(401).json({ message: 'Authentication failed. User not found.' })
//     else {
//       if (!user.comparePassword(req.body.password)) {
//         res.status(401).json({ message: 'Authentication failed. Wrong password' })
//       } else {
//         // Hàm sign: tạo token với header {typ: "JWT", alg: "HS256"} (default), payload và secretKey
//         // Tất nhiên là theo lý thuyết JWT
//         var exp = Math.floor(Date.now() / 1000) + (60 * 1)
//         var payload = { email: user.email, _id: user._id, exp: exp }
//         var token = jwt.sign(payload, secretKey)

//         res.status(200).header("Authorization", token).json(user)
//       }
//     }
//   })
// }

exports.register = async function (req, res) {
  try {
    const user = new User(req.body)
    await user.save()
    const token = await user.generateAuthToken()
    res.status(201).send({ user, token })
  } catch (error) {
    res.status(400).send(error)
  }
}

exports.login = async function (req, res) {
  try {
    const { email, password } = req.body
    const user = await User.findByCredentials(email, password)
    if (!user) {
      return res.status(401).send({ error: 'Login failed! Check authentication credentials' })

    }
    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch (error) {
    res.status(400).send(error)
  }
}

exports.show = function (req, res) {
  res.json(req.user)
}
