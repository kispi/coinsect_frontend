import { createMemoryHistory, createWebHistory, createRouter, Router } from 'vue-router'
import { store } from '@/store'
import routesNoAuth from './routes-no-auth-async'
import routesAuth from './routes-auth-async'
import ViewNotFound from '@/components/views/ViewNotFound.vue'

const onFail = () => {
  const body = document.querySelector('body')
  if (!body) return

  body.style.visibility = 'visible'
  body.innerHTML = '사이트가 업데이트된 것 같습니다... 잠시 후 재접속합니다...'
  setTimeout(() => location.reload(), 5000)
}

const routes = [
  ...routesNoAuth,
  ...routesAuth,
  {
    path: '/:pathMatch(.*)*',
    component: ViewNotFound,
  },
]

routes.forEach((route: any) => {
  if (typeof route.component === 'function') {
    const importPromise = route.component
    route.component = async () => {
      try {
        return await importPromise()
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
    scrollBehavior: () => {
      return { top: 0 }
    },
    routes,
  })

  r.beforeEach((to, from, next) => {
    const modals = store.getters.modals.filter((m: any) => m)
    if (modals.length === 0) return next()

    const latestModal = modals[modals.length - 1]
    store.commit('removeModal', latestModal)
    next(false)
  })

  return r
}

export let router = {} as Router

export const setRouter = (o: Router) => router = o

export default {
  router,
  newRouter,
  setRouter,
}