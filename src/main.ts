import { createApp, createSSRApp } from 'vue'
import { store, newStore, setStore } from './store'
import { router, newRouter, setRouter } from './router'
import { createHttpClient, setHttpClient } from '@/modules/axios'
import { Store } from 'vuex'
import { Router } from 'vue-router'
import App from './App.vue'
import useLazyLoads from './lazy-loads'
import useGlobalComponents from './global-components'

require('@/assets/styles/index.scss')

export default () => {
  const isSSR = process.env.VUE_APP_SSR

  setStore(newStore())
  setRouter(newRouter())
  setHttpClient(createHttpClient())

  const app = (isSSR ? createSSRApp : createApp)(App)
  app.use(store as Store<any>).use(router as Router)
  if (!isSSR) useLazyLoads().loadDefaults()
  useGlobalComponents(app)

  return {
    app,
    router,
    store,
  }
}