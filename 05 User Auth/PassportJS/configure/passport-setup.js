var LocalStrategy = require('passport-local').Strategy
var GoogleStrategy = require('passport-google-oauth20').Strategy
var FacebookStrategy = require('passport-facebook').Strategy
var keys = require('../configure/keys')
var passport = require('passport')
var bcrypt = require('bcrypt')
var User = require('../src/models/UserModel')

// Tham số đầu tiên (user) là kết quả trả về của chiến lược xác thực (user trong done(null, user) của LocalStrategy or GoogleStrategy)
passport.serializeUser(function (user, done) {
  done(null, user._id)
})

// Tham số đầu tiên là kết quả trả về của hàm serializeUser (ở đây là id của user)
passport.deserializeUser(function (id, done) {
  User.findById(id).exec((err, user) => {
    if (err) return done(err)
    done(null, user)
  })
})

passport.use(
  new LocalStrategy(
  function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) return done(err)
      if (!user) return done(null, false, {message: "Username not found."})
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) return done(err)
        if (!result) return done(null, false, { message: 'Password is incorect!' })
        return done(null, user);
      })
    })
  }
))

passport.use(
  new GoogleStrategy({
  // Thiết lập các options, methods cho Google Oauth
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: '/auth/google/callback'
  },
  function (accessToken, refeshToken, profile, done) {
    User.findOne({ googleId: profile.id }, function (err, user) {
      if (err) return done(err)
      if (user) return done(null, user)
      else {
        new User({
          username: profile.id,
          name: profile._json.name,
          googleId: profile.id
        }).save().then(function (err, user) {
          if (err) done(err)
        })
      }
    })
  })
)

passport.use(
  new FacebookStrategy({
    clientID: keys.facebook.clientID,
    clientSecret: keys.facebook.clientSecret,
    callbackURL: '/auth/facebook/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ facebookId: profile.id }, function (err, user) {
      if (err) return done(err)
      if (user) return done(null, user)
      else {
        new User({
          name: profile.displayName,
          username: profile.id,
          facebookId: profile.id
        }).save().then(function (err, user) {
          if (err) done(err)
        })
      }
    })
  }
))