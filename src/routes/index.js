module.exports = (server, logger) => {
  return {
    build: require('./builds')(server, logger)
  }
}
