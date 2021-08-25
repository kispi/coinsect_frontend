import { createWebHistory, createRouter } from 'vue-router'
import routesNoAuth from './routes-no-auth-async'
import routesAuth from './routes-auth-async'
import ViewNotFound from '@/components/views/ViewNotFound'
import helpers from '@/helpers'
import $store from '@/store'

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

router.beforeEach((to, from, next) => {
  const modals = $store.getters.modals.filter(m => m)
  if (modals.length === 0) return next()

  const latestModal = modals[modals.length - 1]
  $store.commit('popModal', latestModal)
  next(false)
})

export default router