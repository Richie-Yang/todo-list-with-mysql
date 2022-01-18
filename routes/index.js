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

router.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/users/login' }))
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }))

router.get('/todos/new', authenticator, todoController.createTodo)
router.post('/todos', authenticator, todoController.postTodo)
router.get('/todos/:id/edit', authenticator, todoController.editTodo)
router.put('/todos/:id', authenticator, todoController.putTodo)
router.delete('/todos/:id', authenticator, todoController.deleteTodo)
router.get('/todos/:id', authenticator, todoController.getTodo)
router.get('/', authenticator, todoController.getTodos)


module.exports = router