const express = require('express')
const fs = require('fs')
const path = require('path')
const useRoutes = require('./routes')
const { handleErrorByRedirection, logger } = require('./middleware')
const { outputDir } = require('./helpers')
const env = `.env.${process.env.NODE_ENV}`
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

const useStaticServing = server => {
  server.use('/img', express.static(path.join(__dirname, `../${outputDir}/client`, 'img')))
  server.use('/js', express.static(path.join(__dirname, `../${outputDir}/client`, 'js')))
  server.use('/css', express.static(path.join(__dirname, `../${outputDir}/client`, 'css')))
  server.use('/font-awesome', express.static(path.join(__dirname, `../${outputDir}/client`, 'font-awesome')))
  server.use('/favicon', express.static(path.join(__dirname, `../${outputDir}/client`, 'favicon')))
  const rootFiles = ['gtm.js', 'ads.txt', 'robots.txt', 'sitemap.xml', 'naver048dfb4862180b4025eb9bd6e296c6ec.html']
  rootFiles.forEach(file => server.use(`/${file}`, express.static(path.join(__dirname, `../${outputDir}/client`, file))))
}

const useSSR = server => {
  useStaticServing(server)
  useRoutes(server)
  server.use(handleErrorByRedirection)
  server.use(logger)
}

module.exports = useSSR