const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User


module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy({
    usernameField: 'email'
  }, (email, password, done) => {
    return User.findOne({ where: { email } })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' })
        }

        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, { message: 'Email or password not corrected' })
        }

        return done(null, user)
      })
      .catch(err => done(err, false))
  }))

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