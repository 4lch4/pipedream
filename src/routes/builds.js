const Errors = require('restify-errors')
const Restify = require('restify').createServer()

const ADO = require('azure-devops-node-api')
const config = require('../config')
const orgUrl = config.JBH.ADO_BASE_URL
const token = config.JBH.ADO_PAT
const authHandler = ADO.getPersonalAccessTokenHandler(token)
const conn = new ADO.WebApi(orgUrl, authHandler)

// main().then(res => {
//   logger.info(res)
//   // process.exit(0)
// }).catch(console.error)

/**
 * The primary export function. Instantiates all of the endpoints available
 * under the /builds route.
 *
 * @param {Restify} server The Restify server object using this route.
 */
const main = (server, logger) => {
  server.post('/builds/new', (req, res, next) => {
    // Verify there was req.body provided via a URL query or the request body.
    if (req.body) {
      conn.getBuildApi().then(buildApi => {
        buildApi.createDefinition({
          queue: { name: req.body.queueName },
          name: req.body.pipelineName,
          triggers: [{
            branchFilters: [
              '+master'
            ],
            pathFilters: [],
            batchChanges: false,
            maxConcurrentBuildsPerBranch: 1,
            pollingInterval: 0,
            triggerType: 2
          }]
        }).catch(err => {
          logger.error(err)
          res.send(new Errors.InternalServerError(err))
          return next()
        })
      }).catch(err => {
        logger.error(err)
        res.send(new Errors.InternalServerError(err))
        return next()
      })
    } else {
      res.send(new Errors.BadRequestError('No data provided.'))
      return next()
    }
  })
}

module.exports = main
