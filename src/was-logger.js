const fs = require('fs')

const getActualRequestDurationInMilliseconds = start => {
  const NS_PER_SEC = 1e9 //  convert to nanoseconds
  const NS_TO_MS = 1e6 // convert to milliseconds
  const diff = process.hrtime(start)
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
}

let demoLogger = (req, res, next) => { //middleware function
  let current_datetime = new Date()
  let formatted_date =
    current_datetime.getFullYear() +
    '-' +
    (current_datetime.getMonth() + 1) +
    '-' +
    current_datetime.getDate() +
    ' ' +
    current_datetime.getHours() +
    ':' +
    current_datetime.getMinutes() +
    ':' +
    current_datetime.getSeconds()
  const method = req.method
  const url = req.url
  const ip = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress
  const status = res.statusCode
  const start = process.hrtime()
  const durationInMilliseconds = getActualRequestDurationInMilliseconds(start)
  if (['.js', ',css', '.png', '.svg', '.css', '.woff2'].some(ext => url.endsWith(ext))) {
    next()
    return
  }

  let log = `[${formatted_date}] ${method}:${url} ${status} ${durationInMilliseconds.toLocaleString()} ms / ${ip}`
  console.log(log)
  fs.appendFile('request_logs', log + '\n', err => {
    if (err) {
      console.log(err)
    }
  })
  next()
}

module.exports = demoLogger