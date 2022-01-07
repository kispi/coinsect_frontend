const express = require('express')
const path = require('path')
const useRoutes = require('./routes')
const { errorHandler, logger } = require('./middleware')

const useStaticServing = server => {
  server.use('/img', express.static(path.join(__dirname, '../dist/client', 'img')))
  server.use('/js', express.static(path.join(__dirname, '../dist/client', 'js')))
  server.use('/css', express.static(path.join(__dirname, '../dist/client', 'css')))
  server.use('/font-awesome', express.static(path.join(__dirname, '../dist/client', 'font-awesome')))
  server.use('/favicon', express.static(path.join(__dirname, '../dist/client', 'favicon')))
  const rootFiles = ['gtm.js', 'robots.txt', 'sitemap.xml', 'naver048dfb4862180b4025eb9bd6e296c6ec.html']
  rootFiles.forEach(file => server.use(`/${file}`, express.static(path.join(__dirname, '../dist/client', file))))
}

const useSSR = server => {
  useStaticServing(server)
  useRoutes(server)
  server.use(errorHandler)
  server.use(logger)
}

module.exports = useSSR