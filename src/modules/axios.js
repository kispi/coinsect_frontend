import axios from 'axios'
import helpers from '@/helpers'
import { store } from '@/store'

export let $http = {}

export const setHttpClient = o => $http = o

export const createHttpClient = () => {
  const httpClient = axios.create({
    baseURL: `${process.env.VUE_APP_API_DOMAIN}`,
    timeout: 10000,
  })

  httpClient.interceptors.request.use(req => {
    if (process.env.VUE_APP_SSR) req.headers['is-ssr'] = true

    if (req.headers['is-ssr'] && store.getters.axiosHeader) {
      Object.keys(store.getters.axiosHeader).forEach(key => req.headers[key] = store.getters.axiosHeader[key])
    }

    return req
  })

  httpClient.interceptors.response.use(
    res => res.data,
    err => {
      if (err.code === 'ECONNABORTED') {
        helpers.toast.error('서버로부터의 응답에 너무 오랜 시간이 걸리네요 😢<br>일시적 문제인 것 같으니 다시 시도해주세요!')
        throw { data: {} }
      }

      throw err.response || err
    },
  )

  return httpClient
}

// 다른 사이트들의 API를 호출할 때 사용할 클라이언트
export const $httpNoAuth = createHttpClient()

export const setRequestHeader = header => {
  if (header.token) $http.defaults.headers['Authorization'] = `Bearer ${header.token}`

  Object.keys(header).forEach(key => {
    if (!header[key]) return

    $http.defaults.headers[key] = header[key]
  })
}

export default {
  $http,
  $httpNoAuth,
  createHttpClient,
  setHttpClient,
  setRequestHeader,
}