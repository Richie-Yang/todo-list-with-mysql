const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const usePassport = require('./config/passport')
const routes = require('./routes')

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

usePassport(app)
app.use(routes)


app.listen(PORT, () => {
  console.log(`App is running on http://127.0.0.1:${PORT}`)
})