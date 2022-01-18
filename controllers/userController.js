const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User


module.exports = {
  loginPage: (req, res) => {
    return res.render('login')
  },

  login: (req, res) => {
    return res.redirect('/')
  },

  registerPage: (req, res) => {
    return res.render('register')
  },

  register: (req, res) => {
    const { name, email, password, confirmPassword } = req.body

    return User.findOne({ where: { email } })
      .then(user => {
        if (user) {
          console.log('User already exists')
          return res.render('register', { name, email })
        }

        return bcrypt.genSalt(10)
          .then(salt => bcrypt.hash(salt, password))
          .then(hash => {
            return User.create({ name, email, password: hash })
          })
          .then(() => res.redirect('/users/login'))
      })
      .catch(err => console.log(err))
  },

  logout: (req, res) => {
    req.logout()
    return res.redirect('/users/login')
  }
}