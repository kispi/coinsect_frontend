import authCheck from './auth-check'

const etc = []

const routes = [
  ...etc,
]

export default [
  ...routes,
].map(o => {
  o.beforeEnter = authCheck

  return o
})