import { store } from '@/store'
import { $http } from '@/modules/axios'
import animate from './animate'
import createBus from './bus'
import coin from './coin'
import dataSetter from './data-setter'
import dayjs from 'dayjs'
import dom from './dom'
import errorHandlers from './error-handlers'
import logic from './logic'
import meta from './meta'
import modal from './modal'
import number from './number'
import post from './post'
import querybuilder from './querybuilder'
import withCdn from './s3'
import snackbar from './snackbar'
import template from './template'
import toast from './toast'
import tooltip from './tooltip'
import translate from './translate'
import youtube from './youtube'

/**
 * API 콜을 하는 페이지들이 항상 다시 mount될때마다 API 콜을 할 필요는 없으므로, 일정 시간동안은 똑같은 요청을 하지 않게 해준다.
 * @param {string} apiId api 호출에 대한 고유값. 이를테면, GET /orders는 'orders', GET /orders/:id는 `orders/:id`
 * @param {number} cacheTimeout api를 다시 호출하지 않을 시간 길이. 지정해주지 않을 시 default 10초
 */
const canSkipApiCall = (apiId: string, cacheTimeout = 10) => {
  if (process.env.VUE_APP_SSR) return

  const o = store.state.app.lastApiCall
  const initLastApiCallTime = () => o[apiId] = helpers.dayjs()

  // If it's never called, can't skip API call.
  if (!o[apiId]) {
    initLastApiCallTime()
    return false
  }

  let diff = helpers.dayjs().diff(o[apiId], 'second')
  if (diff <= cacheTimeout) return true

  initLastApiCallTime()
  return false
}

const helpers = {
  animate,
  bus: createBus(),
  http: () => $http,
  coin,
  dataSetter,
  dayjs,
  dom,
  errorHandlers,
  logic,
  meta,
  modal,
  number,
  post,
  snackbar,
  toast,
  tooltip,
  template,
  youtube,
  forceRefresh: () => {
    helpers.snackbar.warning('필수 업데이트가 있어 10초 후 새로고침됩니다.')

    if (typeof location === 'undefined') return

    setTimeout(() => location.reload(), 1000 * 10)
  },
  withCdn,
  canSkipApiCall,
  qb: querybuilder,
  translate,
  paramsToQuery: (params: Record<string, string>) => Object.keys(params).map(key => `${key}=${params[key]}`).join('&'),
  numArray: (len: number) => {
    let arr = []
    for (let i = 0; i < len; i++) arr.push(i)
    return arr
  },
  currency: (currency: string) => {
    const symbols = { 'usd': '$', 'gbp': '£', 'eur': '€', 'krw': '₩' }
    if (currency) return symbols[currency as keyof typeof symbols]

    return symbols[store.getters.settings.currency as keyof typeof symbols] || symbols['usd']
  },
  isImageUrl: (url: string) => ['.jpg', '.jpeg', '.png'].some(ext => (url || '').endsWith(ext)), // AWS Rekognition에서 검사가능한 URL만 남김.
  isNil: (value: any) => [null, undefined].includes(value) || isNaN(value),
  localStorage: {
    setMeta: (key: string, value: any) => {
      const meta = JSON.parse((window.localStorage.getItem('meta') || '{}'))
      meta[key] = value
      window.localStorage.setItem('meta', JSON.stringify(meta))
    },
    getMeta: (key: string) => JSON.parse((window.localStorage.getItem('meta') || '{}'))[key],
  },
  debounce(fn: Function, delay: number) {
    let timeoutID: number

    return function() {
      clearTimeout(timeoutID)
      timeoutID = setTimeout(() => {
        // @ts-ignore
        fn.apply(this, arguments)
      }, delay)
    }
  },
  sleep: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
  useFaviconWithUnreads: (active: boolean) => {
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
    if (!favicon) return

    favicon.href = active ? '/favicon/logo-unreads.png' : '/favicon/logo.png'
  },
  onClickHTMLContent: (e: MouseEvent) => {
    e.preventDefault()
    const link = (e.target as HTMLImageElement).src || (e.target as HTMLLinkElement).href
    if (link) window.open(link, '_blank', 'noreferrer')
  },
  openLink: (url: string) => window.open(url, '_blank', 'noreferrer'),
}

export default helpers