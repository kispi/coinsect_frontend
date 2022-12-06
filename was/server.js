const express = require('express')
const useSSR = require('./ssr')
const server = express()
const { outputDir } = require('./helpers')
const { log } = require('./logger')

const PORT = process.env.PORT || 4000

useSSR(server)

server.listen(PORT, '0.0.0.0', () => log.info(`
  Server listening at port ${PORT}.
  NODE_ENV: ${process.env.NODE_ENV}.
  Static serving using /${outputDir}.
`))