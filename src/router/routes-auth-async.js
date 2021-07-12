import authCheck from './auth-check'

const myPages = [
  '/test',
].map(path => ({
  path,
  component: () => import(/* webpackChunkName: 'view-test' */ '@/components/views/ViewTest'),
  meta: { routeGroup: 'myPages' },
}))

export default [
  ...myPages,
].map(o => {
  o.beforeEnter = authCheck

  return o
})