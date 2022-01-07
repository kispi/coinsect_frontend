const express = require('express')
const useSSR = require('./ssr')
const server = express()

const PORT = process.env.PORT || 8080

useSSR(server)

server.listen(PORT, '0.0.0.0', () => console.log(`server listening at port ${PORT}`))