import helpers from '@/helpers'

const andSoOn = [{
  path: '/',
  component: () => import(/* webpackChunkName: 'view-main' */ '@/components/views/ViewMain'),
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