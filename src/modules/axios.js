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

      if (!err.response) {
        throw err
      }

      if (err.response.status === 404) {
        helpers.modal.alert(`더이상 제공되지 않는 API를 호출하고 있으므로 재접속을 부탁드립니다.
          아마 최신 버전의 코인충 사이트를 이용중이시지 않은 것 같습니다.
          필수 업데이트이므로 60초 후 강제로 새로고침됩니다.

          재접속했는데도 계속 이 메시지가 보인다면 <a href="mailto:coinsect.io@gmail.com" class="text-underline f-700">운영자</a>에게 문의 부탁드립니다.`
        )
        setTimeout(() => location.reload(), 1000 * 60)
        return
      }

      throw err.response
    },
  )

  return httpClient
}

// 다른 사이트들의 API를 호출할 때 사용할 클라이언트
export let $httpNoAuth = (() => {
  const client = createHttpClient()
  client.defaults.headers.Authorization
  return client
})()

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
  $httpNoAuth,
  createHttpClient,
  setHttpClient,
  setRequestHeader,
  clearRequestHeader,
}