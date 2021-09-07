const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const app = express()

const isBot = userAgent => /bot|crawler|spider|crawling|yeti|daumoa/i.test(userAgent)

app.use('*', createProxyMiddleware({
  router: req => !isBot(req.headers['user-agent']) ?
    'https://d2a5mandnneijq.cloudfront.net' :
    'https://api.coinsect.io/seo'
  ,
  changeOrigin: true,
}))

app.listen(3000)