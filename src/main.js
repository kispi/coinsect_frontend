import { createApp } from 'vue'
import store from './store'
import plugins from './plugins'
import * as directives from '@/directives'
import router from './router'
import App from './App.vue'
import useGlobalComponents from './global-components'
import useLazyLoads from './lazy-loads'

require('@/assets/styles/index.scss')

const app = createApp(App)
app
  .use(store)
  .use(router)

// app.use(store) should precede since some plugins use it
Object.values(plugins).forEach(plugin => app.use(plugin))
Object.keys(directives).forEach(k => { app.directive(k, directives[k])})

useLazyLoads()
useGlobalComponents(app)
app.mount('#app')