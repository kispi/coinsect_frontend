import { store } from '@/store'
import animate from './animate'
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
import template from './template'
import toast from './toast'
import tooltip from './tooltip'
import translate from './translate'

/**
 * API 콜을 하는 페이지들이 항상 다시 mount될때마다 API 콜을 할 필요는 없으므로, 일정 시간동안은 똑같은 요청을 하지 않게 해준다.
 * @param {string} apiId api 호출에 대한 고유값. 이를테면, GET /orders는 'orders', GET /orders/:id는 `orders/:id`
 * @param {number} cacheTimeout api를 다시 호출하지 않을 시간 길이. 지정해주지 않을 시 default 10초
 */
const canSkipApiCall = (apiId, cacheTimeout) => {
  if (process.env.VUE_APP_SSR) return

  const o = store.state.app.lastApiCall
  const initLastApiCallTime = () => o[apiId] = helpers.dayjs()

  // If it's never called, can't skip API call.
  if (!o[apiId]) {
    initLastApiCallTime()
    return false
  }

  let diff = helpers.dayjs().diff(o[apiId], 'second')
  if (diff <= (cacheTimeout || 10)) return true

  initLastApiCallTime()
  return false
}

const helpers = {
  animate,
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
  toast,
  tooltip,
  template,
  forceRefresh: () => {
    helpers.modal.alert(`
      더이상 제공되지 않는 API를 호출하고 있으므로 재접속을 부탁드립니다.
      아마 최신 버전의 코인충 사이트를 이용중이시지 않은 것 같습니다.
      필수 업데이트이므로 60초 후 강제로 새로고침됩니다.

      재접속했는데도 계속 이 메시지가 보인다면 <a href="mailto:coinsect.io@gmail.com" class="text-underline f-700">관리자</a>에게 문의 부탁드립니다.`
    )

    if (typeof location === 'undefined') return

    setTimeout(() => location.reload(), 1000 * 60)
  },
  withCdn,
  canSkipApiCall,
  qb: querybuilder,
  translate,
  paramsToQuery: params => Object.keys(params).map(key => `${key}=${params[key]}`).join('&'),
  numArray: len => {
    let arr = []
    for (let i = 0; i < len; i++) arr.push(i)
    return arr
  },
  currency: currency => {
    const symbols = { 'usd': '$', 'gbp': '£', 'eur': '€', 'krw': '₩' }
    if (currency) return symbols[currency]

    return symbols[store.getters.settings.currency]
  },
  isImageUrl: url => ['.jpg', '.jpeg', '.png'].some(ext => (url || '').endsWith(ext)), // AWS Rekognition에서 검사가능한 URL만 남김.
  localStorage: {
    setMeta: (key, value) => {
      const meta = JSON.parse((window.localStorage.getItem('meta') || '{}'))
      meta[key] = value
      window.localStorage.setItem('meta', JSON.stringify(meta))
    },
    getMeta: key => JSON.parse((window.localStorage.getItem('meta') || '{}'))[key],
  },
  debounce(fn, delay) {
    let timeoutID

    return function() {
      clearTimeout(timeoutID)
      timeoutID = setTimeout(() => {
        fn.apply(this, arguments)
      }, delay)
    }
  },
  sleep: ms => new Promise(resolve => setTimeout(resolve, ms)),
  useFaviconWithUnreads: active => {
    const favicon = document.querySelector('link[rel="icon"]')
    if (!favicon) return

    favicon.href = active ? '/favicon/logo-unreads.png' : '/favicon/logo.png'
  },
  onClickHTMLContent: e => {
    const link = e.target.src || e.target.href
    if (link) window.open(link, '_blank', 'noreferrer')
  },
}

export default helpers