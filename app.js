const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const usePassport = require('./config/passport')
const routes = require('./routes')
const { serverError } = require('./middleware/errorHandler')

const app = express()
const PORT = 3000


app.engine('hbs', engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(session({
  secret: '123',
  resave: false,
  saveUninitialized: true
}))

app.use(flash())
usePassport(app)

app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

app.use(routes)

app.use((err, req, res, next) => {
  console.log(err.stack)
  return serverError(res)
})


app.listen(PORT, () => {
  console.log(`App is running on http://127.0.0.1:${PORT}`)
})