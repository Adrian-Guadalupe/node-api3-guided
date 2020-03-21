const express = require('express') // importing a CommonJS module
const helmet = require('helmet')
const morgan = require('morgan')

const hubsRouter = require('./hubs/hubs-router.js')

const app = express()

// global middleware
// app.use(morgan('dev')) // 3rd paty middleware: must nmp install
app.use(helmet()) // 3rd part middleware: must nmp install
app.use(express.json()) // built in middleware: no need to npm install

// custom middleware
app.use(methodLogger)
app.use(addName)
app.use(lockout)

app.use('/api/hubs', hubsRouter)

app.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : ''

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome ${nameInsert} to the Lambda Hubs API</p>
    `);
});

function methodLogger(req, res, next) { // The three Amigas
  const method = req.method
  const endpoint = req.originalURL

  console.log(`${method} to ${endpoint}`)
  next() // moves the request to the next middleware
}

function addName(req, res, next) {
  req.name = req.name || 'Rufus'
  next()
}

// function lockout(req, res, next) {
//   res.status(403).json({ message: 'api lockout in force' })
// }

function lockout(req, res, next) {
  const d = new Date().getSeconds()
  (d % 2 !== 0)
    ? res.status(403).send('You shall not pass!')
    : next()
}

app.use((error, req, res, next) => {
  res.status(400).json({ message: 'bad panda!', error })
})

module.exports = app
