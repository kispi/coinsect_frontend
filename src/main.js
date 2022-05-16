import { createApp, createSSRApp } from 'vue'
import { store, newStore, setStore } from './store'
import { router, newRouter, setRouter } from './router'
import { createHttpClient, setHttpClient } from '@/modules/axios'
import plugins from './plugins'
import App from './App'
import useLazyLoads from './lazy-loads'
import useGlobalComponents from './global-components'

require('@/assets/styles/index.scss')

export default () => {
  const isSSR = process.env.VUE_APP_SSR

  setStore(newStore())
  setRouter(newRouter())
  setHttpClient(createHttpClient())

  const app = (isSSR ? createSSRApp : createApp)(App)
  app.use(store).use(router)
  Object.values(plugins).forEach(app.use)
  if (!isSSR) useLazyLoads()
  useGlobalComponents(app)

  return {
    app,
    router,
    store,
  }
}