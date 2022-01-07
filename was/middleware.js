const { useApp } = require('./helpers')
const useHtmlRenderer = require('./html-renderer')
const logger = require('./logger')

const asyncWrapper = promise => async (req, res, next) => {
  try {
    await promise(req, res, next)
    next()
  } catch (e) {
    console.error('Internal Server Error:', e.message)
    next(e)
  }
}

const errorHandler = async (error, req, res, next) => {
  const { app, store, router } = await useApp(req)
  await router.push('/not-found')
  await router.isReady()

  const html = await useHtmlRenderer({ app, store })
  res.status(500)
  res.setHeader('Content-Type', 'text/html')
  res.send(html)
  next()
}

module.exports = {
  asyncWrapper,
  errorHandler,
  logger,
}