const logger = (req, res, next) => {
  const url = req.url

  const extensions = ['.js', '.css', '.png', '.gif', 'jpg', './jpeg', '.svg', '.woff2', '.ico']

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

  const log = {
    env: process.env.NODE_ENV,
    method: method,
    path: url,
    status: status,
    country: country,
    user_agent: userAgent,
    remote_ip: ip,
    duration,
    time: currentDatetime.toISOString(),
  }
  console.log(JSON.stringify(log))
  next()
}

module.exports = logger