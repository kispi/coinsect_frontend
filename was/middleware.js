const logger = require('./logger')

const asyncWrapper = promise => async (...args) => {
  let error
  const next = args[args.length - 1]
  try {
    await promise(...args)
  } catch (e) {
    error = e
  }

  if (error) {
    console.error('Internal Server Error:', error)
  }

  next(error)
}

const handleErrorByRedirection = (error, req, res, next) => {
  res.redirect('/not-found')
  next()
}

module.exports = {
  asyncWrapper,
  handleErrorByRedirection,
  logger,
}