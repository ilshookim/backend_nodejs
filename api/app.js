const express = require('express')
const expressWS = require('express-ws')
const morgan = require('morgan')
const logger = require('../logger')
const bodyParser = require('body-parser')
const serveStatic = require('serve-static')
const users = require('./users')
const ws = require('./ws')

const app = express()
app.websocket = expressWS(app)

app.use(morgan('combined', { stream: logger.stream }))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.header('Access-Control-Allow-Headers', 'content-type')
  next()
})

app.use('/api/users', users)

app.use('/', serveStatic(`${__dirname}/public`))
app.ws('/ws', ws)

module.exports = app
