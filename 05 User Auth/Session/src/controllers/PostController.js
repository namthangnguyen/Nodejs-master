const Post = require('../models/PostModels')

exports.listPost = function (req, res) {

  var projection = 'title content poster updated'
  Post.find({}, projection, function (err, posts) {
    if (err) res.json({err})
    res.json({posts: posts})
  })
}
exports.listPostByUser = function (req, res) {
  var projection = 'title content poster updated'
  Post.find({poster: req.session.user._id}, projection, function (err, posts) {
    if (err) res.json({err})
    res.json({post: posts})
  })
}

exports.detailPost = function (req, res) {
  // post.poster chỉ lưu _id của poster => muốn lôi cả poster ra dùng populate('poster')
  Post.findById(req.params.id).populate('poster').exec(function (err, post) {
    if (err) res.json({err})
    res.json({
      title: post.title,
      content: post.content,
      poster: post.poster.username,
      created: post.created,
      updated: post.updated
    })
  })
}

exports.createPost = function (req, res) {
  const post = new Post(req.body)
  post.poster = req.session.userID
  post.save().then(function (result) {
    res.json({post: result})
  })
}

exports.editPost = function (req, res) {
  Post.findById(req.params.id, function (err, post) {
    if(err) return res.json({err})
    if (post.poster == req.session.user._id) {
      post.title = req.body.title
      post.content = req.body.content
      post.updated = Date.now()
      post.save().then(result => {
          res.json({post: result})
      })
    } else res.json({err: "You are not author of the post."})
  })
}

exports.deletePost = function (req, res) {
  Post.findById(req.params.id, function (err, post) {
    if(err) return res.json({err})
    if (post.poster == req.session.user._id) {
      Post.deleteOne({_id: req.params.id}, function (err) {
        if(err) {return res.json({err})}
        res.json({'mess': 'Delete success'})
      })
    } else return res.json({err: "You are not author"})
  })

}