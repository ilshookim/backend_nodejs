const app = require('../api/app')
const config = require('config')
const logger = require('../logger')

const port = config.get('APP.port')
app.listen(port, function () {
  logger.info(`API server is running on ${port} [${process.env.NODE_ENV}]`)
})
