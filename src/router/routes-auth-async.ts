import { RouteRecordRaw } from 'vue-router'
import authCheck from './auth-check'

const etc = [] as RouteRecordRaw[]

const routes = [
  ...etc,
]

export default [
  ...routes,
].map(o => {
  o.beforeEnter = authCheck

  return o
})