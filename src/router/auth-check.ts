import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import helpers from '@/helpers'
import { store } from '@/store'

export default async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  if (typeof window === 'undefined') {
    next('/')
    return // SSR 환경에서는 auth-check 불필요
  }

  if ((to || {}).fullPath) {
    helpers.localStorage.setMeta('prevFullPath', to.fullPath)
  }

  const me = store.getters.me
  if (me) {
    next()
    return
  }

  try {
    await store.dispatch('loadAuthToken')
    next()
  } catch (e) {
    next('/')
  }
}