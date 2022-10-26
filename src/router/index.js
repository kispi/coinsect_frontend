import { createMemoryHistory, createWebHistory, createRouter } from 'vue-router'
import { store as $store } from '@/store'
import routesNoAuth from './routes-no-auth-async'
// import routesAuth from './routes-auth-async'
import ViewNotFound from '@/components/views/ViewNotFound'

const onFail = () => {
  const body = document.querySelector('body')
  body.style.visibility = 'visible'
  body.innerHTML = 'Site has changed. Reload after 5 seconds...'
  setTimeout(() => location.reload(), 5000)
}

const routes = [
  ...routesNoAuth,
  // ...routesAuth,
  {
    path: '/:pathMatch(.*)*',
    component: ViewNotFound,
  },
]

routes.forEach(route => {
  if (typeof route.component === 'function') {
    const importPromise = route.component
    route.component = () => {
      try {
        return importPromise()
      } catch (e) {
        if (typeof document === 'undefined') return

        onFail()
      }
    }
  }
})

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