// Cách không cần load tại server.js mà load tại đây
const Users = require('../models/Users.model')
// Or use a Users model (has been loaded at server.js)
// const  Users = mongoose.model('Users')

exports.list_all_users = async function (req, res) {
  // đoạn trên này là có cả phân trang
  // var page = parseInt(req.query.page) || 1
  // var size = parseInt(req.query.size) || 6
  // var totalPage
  // await Users.count((err, items) => {
  //   if (err) throw err
  //   totalPage = Math.ceil(items / size)
  // })
  // if (page < 1 || page > totalPage) {
  //   response = {
  //     error: true,
  //     message: "Invalid page number, should start with 1 and less total pages"
  //   };
  //   return res.json(response)
  // }
  // Users.find({})
  // .skip(size * (page - 1))
  // .limit(size)
  // .exec(function(err, user) {
  //   if (err) throw err
  //   res.json({user: user, totalPage: totalPage, page: page})
  // })
  Users.find({})
    .exec(function (err, user) {
      if (err) throw err
      res.json({ user: user})
    })
}

exports.create_a_user = function (req, res) {
  console.log(req.body)
  var newUser = new Users(req.body)
  newUser.save(function (err, user) {
    if (err) throw err
    res.json(user)
  })
}

exports.search_user = function (req, res) {
  var name_search = new RegExp(req.query.name, 'gi')
  Users.find({ name: name_search }, function (err, user) {
    if (err) throw err
    res.json(user)
  })
}

exports.read_a_user = function (req, res) {
  Users.findById(req.params.userID, function (err, user) {
    if (err) throw err
    res.json(user)
  })
}

exports.update_a_user = function (req, res) {
  Users.findOneAndUpdate({ _id: req.params.userID }, req.body, { new: true }, function (err, user) {
    if (err) throw err
    res.json(user)
  })
}

exports.delete_a_user = function (req, res) {
  Users.remove({ _id: req.params.userID }, function (err) {
    if (err) throw err
    res.json({ message: 'Successfully deleted' })
  });
};