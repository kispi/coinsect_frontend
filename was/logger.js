const getActualRequestDurationInMilliseconds = start => {
  const NS_PER_SEC = 1e9 //  convert to nanoseconds
  const NS_TO_MS = 1e6 // convert to milliseconds
  const diff = process.hrtime(start)
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
}

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
  const userAgent = req.headers['User-Agent']
  const status = res.statusCode
  const start = process.hrtime()
  const durationInMilliseconds = getActualRequestDurationInMilliseconds(start)

  const log = {
    env: process.env.NODE_ENV,
    method: method,
    path: url,
    status: status,
    country: country,
    user_agent: userAgent,
    remote_ip: ip,
    duration: durationInMilliseconds,
    time: currentDatetime.toISOString(),
  }
  console.log(JSON.stringify(log))

  next()
}

module.exports = logger