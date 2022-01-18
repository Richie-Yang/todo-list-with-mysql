const db = require('../models')
const Todo = db.Todo


module.exports = {
  getTodos: (req, res) => {
    const { user } = req

    return Todo.findAll({
      where: { userId: user.id },
      raw: true,
      nest: true
    })
      .then(todos => res.render('index', { todos }))
      .catch(err => res.status(422).json(err))
  },

  getTodo: (req, res) => {
    const { id } = req.params

    return Todo.findByPk(id)
      .then(todo => {
        return res.render('detail', { 
          isDetail: true,
          todo: todo.toJSON() 
        })
      })
      .catch(err => console.log(err))
  },

  editTodo: (req, res) => {
    const { id } = req.params

    return Todo.findByPk(id)
      .then(todo => {
        return res.render('detail', {
          todo: todo.toJSON() 
        })
      })
  },

  putTodo: (req, res) => {
    const userId = req.user.id
    const { id } = req.params
    const { name } = req.body
    const isDone = req.body.isDone === 'on'

    return Todo.findOne({ where: { userId, id } })
      .then(todo => {
        return todo.update({ isDone, name })
          .then(() => res.redirect(`/todos/${id}`))
      })
      .catch(err => console.log(err))
  }
}