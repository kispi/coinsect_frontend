import { createApp } from 'vue'
import store from './store'
import plugins from './plugins'
import router from './router'
import App from './App'
import useLazyLoads from './lazy-loads'

require('@/assets/styles/index.scss')

const boot = async () => {
  const app = createApp(App)
  app
    .use(store)
    .use(router)

  // app.use(store) should precede since some plugins use it
  Object.values(plugins).forEach(plugin => app.use(plugin))

  // 런타임에 import하게 변경
  const result = await import('./global-components')
  result.default(app)
  await useLazyLoads()
  app.mount('#app')
}

boot()