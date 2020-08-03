const Post = require('../models/PostModels')

exports.listPost = async function (req, res) {
  // if (!req.isAuthenticated()) res.send("You must login to see this context.<br><a href='/login'>Login</a>")
  Post.find({}).populate('poster').exec(function (err, posts) {
    if (err) res.json({err})
    res.render('home', { posts: posts, user: req.user})
  })
}

exports.detailPost = function (req, res) {
  var isPoster = false
  Post.findById(req.params.id).populate('poster').exec(function (err, post) {
    if (err) res.json({err})
    if (req.user.username == post.poster.username) isPoster = true
    res.render('post-detail', { post: post, isPoster: isPoster, user: req.user})
  })
}

exports.createPost = function (req, res) {
  const post = new Post(req.body)
  post.poster = req.user._id
  post.save().then(function (result) {
    res.redirect('/post/' + result._id)
  })
}

exports.editPost = function (req, res) {
  Post.findById(req.params.id).populate('poster').exec(function (err, post) {
    if(err) return res.json({err})
    if (req.user.username == post.poster.username) {
      post.title = req.body.title
      post.content = req.body.content
      post.updated = Date.now()
      post.save().then(result => {
          res.redirect('/post/' + post._id)
      })
    } else res.json({err: "You are not author of the post."})
  })
}

exports.deletePost = function (req, res) {
  Post.findById(req.params.id).populate('poster').exec(function (err, post) {
    if(err) return res.json({err})
    if (req.user.username == post.poster.username) {
      Post.deleteOne({_id: req.params.id}, function (err) {
        if(err) {return res.json({err})}
        res.redirect('/home')
      })
    } else return res.json({err: "You are not author"})
  })
}