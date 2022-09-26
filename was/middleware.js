const path = require('path')
const express = require('express')
const { outputDir } = require('./helpers')

const useStaticServing = server => {
  const folders = ['img', 'js', 'css', 'font-awesome', 'favicon', 'scripts']
  const files = [
    'ads.txt',
    'robots.txt',
    'sitemap.xml',
    'naver048dfb4862180b4025eb9bd6e296c6ec.html',
    'manifest.json',
  ]
  const targets = folders.concat(files)
  targets.forEach(target =>
    server.use(
      `/${target}`,
      express.static(
        path.join(__dirname, `../${outputDir}/client`, target),
        process.env.NODE_ENV === 'production' ? { maxAge: 3600 * 1000 } : null,
      ))
  )
}

const useRequestStartTime = (req, res, next) => {
  req.$$start = new Date()
  next()
}

const useInternalErrorHandler = (error, req, res, next) => {
  res.status(500)
  res.send('Internal Server Error During SSR')
  next()
}

module.exports = {
  useRequestStartTime,
  useInternalErrorHandler,
  useStaticServing,
}