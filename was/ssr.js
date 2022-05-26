const fs = require('fs')
const path = require('path')
const useRoutes = require('./routes')
const logger = require('./logger')
const env = `.env.${process.env.NODE_ENV}`
const { useStaticServing, useRequestStartTime, useInternalErrorHandler } = require('./middleware')
require('dotenv').config({ path: env }) // 이거 빼먹으면 .env안의 VUE_APP 등등 안읽힘.

fs.readFile(
  path.join(__dirname, `../.env.${process.env.NODE_ENV}`),
  (err, html) => {
    if (err) {
      console.error(`no env file [${env}]. make sure you have proper env file corresponding NODE_ENV.`)
      process.exit()
    }
  },
)

const useSSR = server => {
  server.set('trust proxy', true)
  server.disable('x-powered-by')
  server.use(useRequestStartTime)
  useStaticServing(server)
  useRoutes(server)
  server.use(useInternalErrorHandler)
  server.use(logger)
}

module.exports = useSSR
