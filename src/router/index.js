import { createMemoryHistory, createWebHistory, createRouter } from 'vue-router'
import { store as $store } from '@/store'
import routesNoAuth from './routes-no-auth-async'
import routesAuth from './routes-auth-async'
import ViewNotFound from '@/components/views/ViewNotFound'

const routes = [
  ...routesNoAuth,
  ...routesAuth,
  {
    path: '/:pathMatch(.*)*',
    component: ViewNotFound,
  },
]

export const newRouter = () => {
  const r = createRouter({
    history: process.env.VUE_APP_SSR ? createMemoryHistory() : createWebHistory(),
    scrollBehavior: (to, from) => {
      return { top: 0 }
    },
    routes,
  })

  r.beforeEach((to, from, next) => {
    const modals = $store.getters.modals.filter(m => m)
    if (modals.length === 0) return next()

    const latestModal = modals[modals.length - 1]
    $store.commit('popModal', latestModal)
    next(false)
  })

  return r
}

export let router = {}

export const setRouter = o => router = o

export default {
  router,
  newRouter,
  setRouter,
}