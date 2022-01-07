import authCheck from './auth-check'

export default [].map(o => {
  o.beforeEnter = authCheck

  return o
})