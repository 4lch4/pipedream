const config = require('./config')

const Logger = require('simple-node-logger')
const manager = new Logger()
manager.createConsoleAppender()
manager.createRollingFileAppender({
  logDirectory: './logs',
  fileNamePattern: 'ado-<DATE>.log',
  dateFormat: 'YYYY.MM.DD'
})
const logger = manager.createLogger()

const restify = require('restify')
const morgan = require('morgan')
const server = restify.createServer({
  name: config.APP_NAME,
  version: config.APP_VERSION
})

server.use(restify.plugins.jsonBodyParser({ mapParams: true }))
server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser({ mapParams: true }))
server.use(restify.plugins.fullResponse())
server.use(morgan('combined'))

server.listen(config.APP_PORT, () => {
  require('./routes')(server)
  logger.info(`${config.APP_NAME} is now listening on port ${config.APP_PORT}...`)
})
