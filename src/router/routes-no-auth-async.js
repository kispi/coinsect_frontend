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
  meta: {
    description: '워뇨띠 포지션, 리더보드, 시가 총액 등...',
  },
}, {
  path: '/info/:a',
  component: () => import(/* webpackChunkName: 'view-info' */ '@/components/views/info/ViewInfo'),
}, {
  path: '/info/:a/:b',
  component: () => import(/* webpackChunkName: 'view-info' */ '@/components/views/info/ViewInfo'),
}, {
  path: '/community',
  component: () => import(/* webpackChunkName: 'view-community' */ '@/components/views/community/ViewCommunity'),
}, {
  path: '/community/write',
  component: () => import(/* webpackChunkName: 'view-post-write' */ '@/components/views/community/ViewPostWrite'),
}, {
  path: '/community/edit/:id',
  component: () => import(/* webpackChunkName: 'view-post-edit' */ '@/components/views/community/ViewPostEdit'),
}, {
  path: '/community/:id',
  component: () => import(/* webpackChunkName: 'view-post' */ '@/components/views/community/ViewPost'),
  name: 'ViewPost',
}, {
  path: '/games',
  component: () => import(/* webpackChunkName: 'view-games' */ '@/components/views/ViewGames'),
}, {
  path: '/portfolio',
  component: () => import(/* webpackChunkName: 'view-portfolio' */ '@/components/views/ViewPortfolio'),
}, {
  path: '/updates',
  component: () => import(/* webpackChunkName: 'view-updates' */ '@/components/views/ViewUpdates'),
}, {
  path: '/test',
  component: () => import(/* webpackChunkName: 'view-test' */ '@/components/views/ViewTest'),
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