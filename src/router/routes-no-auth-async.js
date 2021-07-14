import helpers from '@/helpers'

const andSoOn = [{
  path: '/',
  component: () => import(/* webpackChunkName: 'view-home' */ '@/components/views/ViewHome'),
}, {
  path: '/login',
  component: () => import(/* webpackChunkName: 'view-login' */ '@/components/views/ViewLogin'),
}]

const routesNoAuth = [
  ...andSoOn,
].map(o => {
  o.beforeEnter = (to, from) => {
    if ((from || {}).fullPath && (to || {}).fullPath === '/login') {
      helpers.localStorage.setMeta('prevFullPath', from.fullPath)
    }
  }
  return o
})

export default routesNoAuth