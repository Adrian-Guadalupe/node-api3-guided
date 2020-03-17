const express = require('express') // importing a CommonJS module
const helmet = require('helmet')
const morgan = require('morgan')

const hubsRouter = require('./hubs/hubs-router.js')

const app = express()


// built in middleware
app.use(express.json())

// 3rd part middleware
app.use(helmet())

// custom middleware
app.use(methodLogger)
app.use(addName)
app.use(lockout)

app.use('/api/hubs', hubsRouter)

app.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : ''

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

function methodLogger(req, res, next) {
  console.log(`${req.method} Request`)
  next()
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
