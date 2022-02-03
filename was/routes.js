const { asyncWrapper } = require('./middleware')
const { handleSSRRequest, routeError } = require('./controllers')

/* 항상 이걸로 생성된 router 인스턴스를 사용해서 라우트를 정의한다. (asyncWrapper 강제) */
const createRouter = server => {
  return {
    get: (path, handler) => server.get(path, asyncWrapper(handler)),
  }
}

const useRoutes = server => {
  const router = createRouter(server)
  router.get('/not-found', routeError)
  router.get('*', (req, res) => {
    const existingRoutePaths = server._router.stack.filter(r => r.route).map(r => r.route.path)
    if (existingRoutePaths.includes(req.url)) return

    return handleSSRRequest(req, res)
  })
}

module.exports = useRoutes