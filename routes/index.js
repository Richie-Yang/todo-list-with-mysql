const express = require('express')
const router = express.Router()
const passport = require('passport')
const userController = require('../controllers/userController')
const todoController = require('../controllers/todoController')
const { authenticator } = require('../middleware/auth')


router.get('/users/login', userController.loginPage)
router.post('/users/login', passport.authenticate('local', { failureRedirect: '/users/login' }), userController.login)
router.get('/users/register', userController.registerPage)
router.post('/users/register', userController.register)
router.get('/users/logout', authenticator, userController.logout)

router.get('/todos/:id', authenticator, todoController.getTodo)
router.get('/', authenticator, todoController.getTodos)


module.exports = router