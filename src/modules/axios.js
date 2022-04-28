import axios from 'axios'
import helpers from '@/helpers'
import { store } from '@/store'

export let $http = {}

export const setHttpClient = o => $http = o

export const createHttpClient = () => {
  const httpClient = axios.create({
    baseURL: `${process.env.VUE_APP_API_DOMAIN}`,
    timeout: 5000,
  })

  httpClient.interceptors.request.use(req => {
    if (process.env.VUE_APP_SSR) req.headers['is-ssr'] = true

    if (req.headers['is-ssr'] && store.state.axiosHeaderSSR) {
      Object.keys(store.state.axiosHeaderSSR).forEach(key => req.headers[key] = store.state.axiosHeaderSSR[key])
    }

    return req
  })

  httpClient.interceptors.response.use(
    res => res.data,
    err => {
      if (err.code === 'ECONNABORTED') {
        helpers.toast.error('서버로부터의 응답에 너무 오랜 시간이 걸리네요 ㅜ.ㅜ<br>일시적 문제인 것 같으니 다시 시도해주세요!')
        throw { data: {} }
      }

      if (!err.response) {
        throw err
      }
  
      throw err.response
    },
  )

  return httpClient
}

export const setRequestHeader = header => {
  if (header.token) $http.defaults.headers['Authorization'] = `Bearer ${header.token}`

  Object.keys(header).forEach(key => {
    if (!header[key]) return

    $http.defaults.headers[key] = header[key]
  })
}

const clearRequestHeader = () => Object.keys($http.defaults.headers).forEach(key => delete $http.defaults.headers[key])

export default {
  $http,
  createHttpClient,
  setHttpClient,
  setRequestHeader,
  clearRequestHeader,
}