const { useApp } = require('./helpers')
const { log } = require('./logger')
const useHtmlRenderer = require('./html-renderer')

// Google SEO가 어느정도 완료되기 전까지는 유지해준다.
const movedPermanently = [
  { before: '/indicators/real-time-positions', after: '/indicators/positions' },
]

/*
  클라이언트 라우트에 정의된 route들 중에 현재 SSR로 요청된 path와 매치되는 route를 찾음.
  사실 없어도 되긴 하는데, 이걸 사용해서 SSR 응답에 대해 302나 404등의 status 처리를 할 수 있음.
*/
const matchingRoute = (routes, currentPath) => {
  if (currentPath === '/index.html') return true // CF에서는 루트(/)를 때리면 디폴트로 index.html을 내려주는 세팅때문인듯?

  const fragCurrentPath = currentPath.split('/').slice(1)

  return routes.find(route => {
    const fragPath = route.path.split('/').slice(1)
    if (fragCurrentPath.every((_, idx) => {
      const existingPath = fragPath[idx] || ''
      return fragCurrentPath[idx] === existingPath ||
        (
          existingPath.startsWith(':') &&
          !existingPath.startsWith(':pathMatch(.*)*') // NOT FOUND 페이지의 REGEX는 제외
        )
    })) return true
  })
}

const handleSSRRequest = async (req, res) => {
  const { app, store, router } = await useApp(req)
  store.commit('setAxiosHeader', {
    'ssr-proxy-from': req.headers['x-forwarded-for'] ||  req.connection.remoteAddress,
    'user-agent': req.headers['user-agent'],
  })
  await router.push(req.url)
  await router.isReady()

  const isMovedPath = movedPermanently.find(route => route.before === req.path)
  if (isMovedPath) {
    log.info(`handleSSRRequest: request to the path that is moved permanently(${req.path})`)
    return res.redirect(301, isMovedPath.after)
  }

  const matched = matchingRoute(router.options.routes, req.path)
  if (!matched) res.status(404)

  const html = await useHtmlRenderer({ app, store })
  res.setHeader('Content-Type', 'text/html')
  res.send(html)
}

module.exports = {
  handleSSRRequest,
}