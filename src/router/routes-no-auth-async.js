import helpers from '@/helpers'

const andSoOn = [{
  path: '/',
  component: () => import(/* webpackChunkName: 'view-home' */ '@/components/views/ViewHome'),
}, {
  path: '/login',
  component: () => import(/* webpackChunkName: 'view-login' */ '@/components/views/ViewLogin'),
}, {
  path: '/indicators/:key',
  component: () => import(/* webpackChunkName: 'view-indicators' */ '@/components/views/indicators/ViewIndicators'),
}, {
  path: '/games',
  component: () => import(/* webpackChunkName: 'view-games' */ '@/components/views/ViewGames'),
}, {
  path: '/updates',
  component: () => import(/* webpackChunkName: 'view-updates' */ '@/components/views/ViewUpdates'),
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