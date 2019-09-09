const logger = require('../../logger')
const poll = require('poll').default

let connections = []
let polling = false

function doPolling () {
  logger.debug('doPolling')
}

function stopPolling () {
  polling = (connections.length > 0)
  return !polling
}

const connect = function (ws, req) {
  connections.push(ws)
  logger.info(`open: connections=${connections.length}`)

  ws.on('message', function message (msg) {
    logger.info(`message: msg=${msg}`)
    connections.forEach(function (conn) {
      conn.send(msg)
    })
  })

  ws.on('close', function close () {
    connections = connections.filter(function (conn) {
      return conn !== ws
    })
    logger.info(`close: connections=${connections.length}`)
  })

  if (!polling) {
    poll(doPolling, 1000, stopPolling)
  }
}

module.exports = connect
