const Errors = require('restify-errors')

const handleGenericError = (errIn, res, logger) => {
  logger.error(errIn)
  res.send(new Errors.InternalServerError(errIn))
}

module.exports.handleGenericError = handleGenericError
