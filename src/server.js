const path = require('path')
const fs = require('fs')
const serialize = require('serialize-javascript')
const express = require('express')
const { renderToString } = require('@vue/server-renderer')
const manifest = require('../dist/server/ssr-manifest.json')
const appPath = path.join(__dirname, '../dist', 'server', manifest['app.js'])
const App = require(appPath).default
const logger = require('./was-logger')
const server = express()

const PORT = process.env.PORT || 4000

server.use(logger)
server.use('/img', express.static(path.join(__dirname, '../dist/client', 'img')))
server.use('/js', express.static(path.join(__dirname, '../dist/client', 'js')))
server.use('/css', express.static(path.join(__dirname, '../dist/client', 'css')))
server.use('/font-awesome', express.static(path.join(__dirname, '../dist/client', 'font-awesome')))
server.use('/favicon', express.static(path.join(__dirname, '../dist/client', 'favicon')))
const rootFiles = ['gtm.js', 'robots.txt', 'sitemap.xml', 'naver048dfb4862180b4025eb9bd6e296c6ec.html']
rootFiles.forEach(file => server.use(`/${file}`, express.static(path.join(__dirname, '../dist/client', file))))

server.get('*', async (req, res) => {
  const { app, router, store } = await App(req)
  await router.push(req.url)
  await router.isReady()

  // ssr 요청에 대한 로그를 보고 싶다면 여기서 찍어보면 됨.
  let appContent = await renderToString(app)

  const renderState = `<script>window.INITIAL_DATA = ${serialize(store.state)}</script>`

  const metaXML = Object.keys(store.getters.metaTags).map(metaTagId => {
    const tag = store.getters.metaTags[metaTagId]
    return `<${tag.tag || 'meta'} ${Object.keys(tag).map(key => `${key}="${tag[key]}"`).join(' ')}>`
  }).join('\n')

  fs.readFile(
    path.join(__dirname, '../dist/client/index.html'),
    (err, html) => {
      if (err) {
        throw err
      }

      appContent = `<div id='app'>${appContent}</div>`

      html = html
        .toString()
        .replace('<div id="app"></div>', `${renderState}${appContent}`)
        .replace('<meta-ssr></meta-ssr>', metaXML)
      res.setHeader('Content-Type', 'text/html')
      res.send(html)
    }
  )
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`server listening at port ${PORT}`)
})