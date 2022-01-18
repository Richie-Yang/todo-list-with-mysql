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

  register: async (req, res, next) => {
    try {
      const { name, email, password, confirmPassword } = req.body
      const errors = []

      if (!name.trim() || !email || !password.trim() || !confirmPassword.trim()) {
        errors.push({ message: 'All fields are required' })
      }

      if (password !== confirmPassword) {
        errors.push({ message: 'Both password input are not matched' })
      }

      if (errors.length) {
        return res.render('register', { name, email, errors })
      }

      const user = await User.findOne({ where: { email } })
      if (user) {
        errors.push({ message: 'User already exists' })
        return res.render('register', { name, email, errors })
      }

      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      await User.create({ name, email, password: hash })

      return res.redirect('/users/login')
      
    } catch (err) { next(err) }
  },

  logout: (req, res) => {
    req.flash('success_msg', 'You have successfully logout')
    req.logout()
    return res.redirect('/users/login')
  }
}