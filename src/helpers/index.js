import $store from '@/store'
import animate from './animate'
import dayjs from 'dayjs'
import dom from './dom'
import meta from './meta'
import modal from './modal'
import status from './status'
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
  const o = $store.state.app.lastApiCall
  const initLastApiCallTime = () => o[apiId] = dayjs()

  // If it's never called, can't skip API call.
  if (!o[apiId]) {
    initLastApiCallTime()
    return false
  }

  let diff = dayjs().diff(o[apiId], 'second')
  if (diff <= (cacheTimeout || 10)) return true

  initLastApiCallTime()
  return false
}

const helpers = {
  tooltip,
  modal,
  toast,
  dayjs,
  dom,
  meta,
  animate,
  status,
  canSkipApiCall,
  case: template.case,
  translate,
  paramsToQuery: params => Object.keys(params).map(key => `${key}=${params[key]}`).join('&'),
  shuffle: arr => {
    let j, x, i
    for (i = arr.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1))
      x = arr[i]
      arr[i] = arr[j]
      arr[j] = x
    }
    return arr
  },
  numArray: len => {
    let arr = []
    for (let i = 0; i < len; i++) arr.push(i)
    return arr
  },
  retrieveNumbersOnly: str => str.replace(/[^0-9]+/g, ''),
  retrieveLettersOnly: str => str.replace(/[^a-zA-Z]+/g, ''),
  retrieveInstagramIdFromUrlOnPaste: e => {
    const text = e.clipboardData.getData('text')
    if (!text.includes('instagram.com/')) return

    e.preventDefault()
    const splitted = text.split('instagram.com/')
    return splitted[splitted.length - 1].replace('/', '')
  },
  // Vue 2시절 filter로 사용하던, 템플릿에 주로 사용하는 기능들을 이곳에 모으기로 한다.
  template,
  hexToRgba: (hex, alpha = 1) => {
    const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16))
    return `rgba(${r},${g},${b},${alpha})`
  },
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
}

export default helpers