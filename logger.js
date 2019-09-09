const appRoot = require('app-root-path')
const { createLogger, format, transports } = require('winston')
const { combine, timestamp, label, printf } = format

const apiFormat = printf(function ({ level, message, label, timestamp }) {
  return `${timestamp} [${label}] ${level}: ${message}`
})

const options = {
  file: {
    level: 'info',
    filename: `${appRoot}/log/app.log`,
    handleExceptions: true,
    json: false,
    maxsize: 5242880,
    maxFiles: 5,
    colorize: false,
    format: combine(
      label({ label: 'apis' }),
      timestamp(),
      apiFormat
    )
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
    format: combine(
      label({ label: 'apis' }),
      timestamp(),
      apiFormat
    )
  }
}

const logger = createLogger({
  exitOnError: false,
  transports: [
    new transports.File(options.file)
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console(options.console))
}

logger.stream = {
  write: function (message, encoding) {
    logger.info(message)
  }
}

module.exports = logger
