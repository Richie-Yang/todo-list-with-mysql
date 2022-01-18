const db = require('../models')
const Todo = db.Todo


module.exports = {
  getTodos: (req, res, next) => {
    const { user } = req

    return Todo.findAll({
      where: { userId: user.id },
      raw: true,
      nest: true
    })
      .then(todos => res.render('index', { todos }))
      .catch(err => next(err))
  },

  getTodo: async (req, res, next) => {
    try {
      const UserId = req.user.id
      const { id } = req.params

      const todo = await Todo.findOne({ where: { UserId, id } })
      return res.render('detail', { 
        isDetail: true,
        todo: todo.toJSON() 
      })

    } catch (err) { next(err) }
  },

  createTodo: (req, res) => {
    return res.render('new')
  },

  postTodo: (req, res, next) => {
    const UserId = req.user.id
    const { name } = req.body

    return Todo.create({ name, UserId })
      .then(() => res.redirect('/'))
      .catch(err => next(err))
  },

  editTodo: async (req, res, next) => {
    try {
      const UserId = req.user.id
      const { id } = req.params

      const todo = await Todo.findOne({ where: { UserId, id } })
      return res.render('detail', { todo: todo.toJSON() })

    } catch (err) { next(err) }
  },

  putTodo: async (req, res, next) => {
    try {
      const UserId = req.user.id
      const { id } = req.params
      const { name } = req.body
      const isDone = req.body.isDone === 'on'

      const todo = await Todo.findOne({ where: { UserId, id } })
      await todo.update({ isDone, name })
      return res.redirect(`/todos/${id}`)

    } catch(err) { next(err) }
  },

  deleteTodo: (req, res, next) => {
    const UserId = req.user.id
    const { id } = req.params

    return Todo.findOne({ where: { UserId, id } })
      .then(todo => todo.destroy())
      .then(() => res.redirect('/'))
      .catch(err => next(err))
  }
}