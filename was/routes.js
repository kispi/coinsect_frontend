const { asyncWrapper } = require('./middleware')
const { handleSSRRequest } = require('./controllers')

/* 항상 이걸로 생성된 router 인스턴스를 사용해서 라우트를 정의한다. (asyncWrapper 강제) */
const createRouter = server => {
  return {
    get: (path, handler) => server.get(path, asyncWrapper(handler)),
  }
}

const useRoutes = server => {
  const router = createRouter(server)
  router.get('*', handleSSRRequest)
}

module.exports = useRoutes