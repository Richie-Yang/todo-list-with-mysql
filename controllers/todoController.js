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
      .then(todo => res.render('detail', { todo: todo.toJSON() }))
      .catch(err => console.log(err))
  }
}