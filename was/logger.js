const dayjs = require('dayjs')

const createLogger = () => {
  return {
    info: (...args) => console.log(`[${dayjs().format()}]`, ...args),
    debug: (...args) => console.info(`[${dayjs().format()}]`, ...args),
    error: (...args) => console.error(`[${dayjs().format()}]`, ...args),
    warn: (...args) => console.warn(`[${dayjs().format()}]`, ...args),
  }
}

const logger = (req, res, next) => {
  const url = req.url

  const extensions = ['.js', '.css', '.png', '.gif', 'jpg', '.jpeg', '.svg', '.woff2', '.ico']

  if (extensions.some(ext => url.endsWith(ext))) {
    next()
    return
  }

  const currentDatetime = new Date()
  const method = req.method
  const ip = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress
  const country = req.headers['Cloudfront-Viewer-Country']
  const userAgent = req.headers['User-Agent'] || req.headers['user-agent']
  const status = res.statusCode
  const end = new Date()
  const duration = `${end.getTime() - req.$$start.getTime()}ms`

  log.info(JSON.stringify({
    env: process.env.NODE_ENV,
    method: method,
    path: url,
    status: status,
    country: country,
    user_agent: userAgent,
    remote_ip: ip,
    duration,
    time: currentDatetime.toISOString(),
  }))
  next()
}

const log = createLogger()

module.exports = {
  log,
  logger,
}