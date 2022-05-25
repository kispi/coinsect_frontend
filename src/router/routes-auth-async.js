import authCheck from './auth-check'

const etc = [{
  path: '/account',
  component: () => import(/* webpackChunkName: 'view-account' */ '@/components/views/ViewAccount'),
}]

const routes = [
  ...etc,
]

export default [
  ...routes,
].map(o => {
  o.beforeEnter = authCheck

  return o
})