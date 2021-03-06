const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User


module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy({
    usernameField: 'email', passReqToCallback: true
  }, (req, email, password, done) => {
    return User.findOne({ where: { email } })
      .then(user => {
        if (!user) {
          req.flash('warning_msg', 'email or password incorrect')
          return done(null, false)
        }

        if (!bcrypt.compareSync(password, user.password)) {
          req.flash('warning_msg', 'email or password incorrect')
          return done(null, false)
        }

        return done(null, user)
      })
      .catch(err => done(err, false))
  }))

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['email', 'displayName']
  },
    (accessToken, refreshToken, profile, done) => {
      const { email, name } = profile._json

      return User.findOne({ where: { email } })
        .then(user => {
          if (user) return done(null, user)

          const randomPassword = Math.random().toString(36).slice(-8)
          return bcrypt.genSalt(10)
            .then(salt => bcrypt.hash(randomPassword, salt))
            .then(hash => {
              return User.create({ name, email, password: hash })
            })
            .then(user => done(null, user))
        })
        .catch(err => done(err, false))
    }
  ))

  passport.serializeUser((user, done) => {
    return done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    return User.findByPk(id)
      .then(user => {
        user = user.toJSON()
        return done(null, user)
      })
      .catch(err => done(err, false))
  })
}