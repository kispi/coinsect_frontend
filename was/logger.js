const dayjs = require('dayjs')

const createLogger = () => {
  return {
    info: (...args) => console.log(`[${dayjs().format()}]`, ...args),
    debug: (...args) => console.info(`[${dayjs().format()}]`, ...args),
    error: (...args) => console.error(`[${dayjs().format()}]`, ...args),
    warn: (...args) => console.warn(`[${dayjs().format()}]`, ...args),
  }
}

const createHttpLog = (req, res) => {
  const end = new Date()
  const duration = `${end.getTime() - req.$$start.getTime()}ms`
  return {
    env: process.env.NODE_ENV,
    method: req.method,
    path: req.url,
    status: res.statusCode,
    country: req.headers['Cloudfront-Viewer-Country'],
    userAgent: req.headers['User-Agent'] || req.headers['user-agent'],
    ip: req.headers['x-forwarded-for'] ||  req.connection.remoteAddress,
    duration,
  }
}

const logger = (req, res, next) => {
  const extensions = ['.js', '.css', '.png', '.gif', 'jpg', '.jpeg', '.svg', '.woff2', '.ico']
  if (extensions.some(ext => req.url.endsWith(ext))) {
    next()
    return
  }

  log.info(JSON.stringify(createHttpLog(req, res)))
  next()
}

const log = createLogger()

module.exports = {
  log,
  logger,
  createHttpLog,
}