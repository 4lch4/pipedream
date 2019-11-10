const ADO = require('azure-devops-node-api')
const config = require('../config')
const orgUrl = config.JBH.ADO_BASE_URL
const token = config.JBH.ADO_PAT
const authHandler = ADO.getPersonalAccessTokenHandler(token)
const conn = new ADO.WebApi(orgUrl, authHandler)

const getRepository = async repoName => {
  try {
    const gitApi = await conn.getGitApi()
    const repos = await gitApi.getRepositories('EngAndTech')

    for (const repo of repos) {
      if (repo.name === repoName) return repo
    }

    return undefined
  } catch (err) { return err }
}

const getPIDAuthor = () => {
  return {}
}

const generate = input => {
  const date = new Date()

  return {
    jobAuthorizationScope: 1,
    jobTimeoutInMinutes: 60,
    jobCancelTimeoutInMinutes: 5,
    process: {
      phases: [
        {
          steps: [
            {
              environment: {},
              enabled: true,
              continueOnError: true,
              alwaysRun: true,
              displayName: 'Task group: Standard Kubernetes Maven Build and Publish $(LowerCaseRepoName)',
              timeoutInMinutes: 0,
              condition: 'succeededOrFailed()',
              task: {
                id: 'd9a0cb57-a4c4-4a60-8f07-3d82633250cb',
                versionSpec: '1.*',
                definitionType: 'metaTask'
              },
              inputs: {
                LowerCaseRepoName: '$(LowerCaseRepoName)'
              }
            }
          ],
          name: 'Agent job',
          refName: 'Job_1',
          condition: 'succeeded()',
          target: {
            executionOptions: {
              type: 0
            },
            allowScriptsAuthAccessOption: false,
            type: 1
          },
          jobAuthorizationScope: 'projectCollection'
        }
      ],
      type: 1
    },
    repository: input.repository,
    authoredBy: input.author ? input.author : getPIDAuthor(),
    queue: input.queueName,
    name: input.pipelineName,
    path: input.folder ? input.folder : '\\',
    type: 2,
    createdDate: date
  }
}

module.exports = generate
