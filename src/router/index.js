import { createWebHistory, createRouter } from 'vue-router'
import routesNoAuth from './routes-no-auth-async'
import routesAuth from './routes-auth-async'
import ViewNotFound from '@/components/views/ViewNotFound'
import helpers from '@/helpers'

const routes = [
  ...routesNoAuth,
  ...routesAuth,
  {
    path: '/:pathMatch(.*)*',
    component: ViewNotFound,
  },
]

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: (to, from) => {
    if (to.path === from.path) return

    setTimeout(() => helpers.dom.scrollToTop())
  },
  routes,
})

router.afterEach(() => {
  document.title = '코인충 - 대한민국 No.1 암호자산 커뮤니티'
})

// 'from' referrer를 달고 이동하고 싶은 경우라면 router.push 대신 이 함수를 사용
router.pushWithFrom = path => {
  if (path.includes('from=')) {
    router.push(path)
    return
  }

  const from = `from=${router.currentRoute.value.path}`
  router.push(path + (path.includes('?') ? `&${from}` : `?${from}`))
}

export default router