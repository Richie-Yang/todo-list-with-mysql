const express = require('express')
const router = express.Router()
const passport = require('passport')
const userController = require('../controllers/userController')
const todoController = require('../controllers/todoController')


router.get('/users/login', userController.loginPage)
router.post('/users/login', passport.authenticate('local', { failureRedirect: '/users/login' }), userController.login)
router.get('/users/register', userController.registerPage)
router.post('/users/register', userController.register)
router.get('/users/logout', userController.logout)

router.get('/todos/:id', todoController.getTodo)
router.get('/', todoController.getTodos)


module.exports = router