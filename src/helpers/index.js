import { store as $store } from '@/store'
import animate from './animate'
import coin from './coin'
import dataSetter from './data-setter'
import dayjs from 'dayjs'
import dom from './dom'
import errorHandlers from './error-handlers'
import math from './math'
import meta from './meta'
import modal from './modal'
import number from './number'
import querybuilder from './querybuilder'
import social from './social'
import useS3 from './s3'
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

  const o = $store.state.app.lastApiCall
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
  coin,
  dayjs,
  tooltip,
  modal,
  number,
  toast,
  dom,
  errorHandlers,
  math,
  meta,
  animate,
  dataSetter,
  social,
  passedTime: timestamp => {
    const d = helpers.dayjs().diff(helpers.dayjs(timestamp), 'seconds')
    if (d > 60 * 60 * 24) return `${Math.floor(d / 86400)}일 전`

    if (d > 60 * 60) return `${Math.floor(d / 3600)}시간 전`

    if (d > 60) return `${Math.floor(d / 60)}분 전`

    return `${d}초 전`
  },
  useS3,
  canSkipApiCall,
  qb: querybuilder,
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
  currency: currency => {
    const symbols = { 'usd': '$', 'gbp': '£', 'eur': '€', 'krw': '₩' }
    if (currency) return symbols[currency]

    return symbols[$store.getters.settings.currency]
  },
  retrieveUrlFromString: url => ((url || '').match(dom.regex.url) || [])[0],
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
  includesChosung: (partial, whole) => {
    const d = Hangul.disassemble
    if (d(partial, true).length !== d(partial).length) return

    if (!partial || !whole) return

    const arr = {
      partial: d(partial, true).map(group => group[0]),
      whole: d(whole, true).map(group => group[0]),
    }

    const foundIndices = arr.partial.map(val => arr.whole.indexOf(val))
    if (foundIndices.includes(-1)) return

    const orderedIndices = JSON.parse(JSON.stringify(foundIndices)).sort()
    return JSON.stringify(foundIndices) === JSON.stringify(orderedIndices)
  },
  canModify: postOrReply => {
    if (!postOrReply || postOrReply.deletedAt) return

    // 게시글 또는 댓글의 작성자가 나이거나, 둘 다 undefined인 경우.
    return (postOrReply.user || {}).id === ($store.getters.me || {}).id
  },
  mustToken: existingTokens => {
    const o = {}
    if (existingTokens) existingTokens.forEach(t => o[t] = true)
  
    let nonExistNewToken = ''
    for (let i = 0; i < 100; i++) {
      let token = [...Array(32)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
      if (o[token]) continue
  
      nonExistNewToken = token
      break
    }
  
    return nonExistNewToken
  },
  acceptableFileSize: (file, maxFileSize = 2) => {
    const fileSizeAsMB = file.size / 1000000
    if (fileSizeAsMB > maxFileSize) {
      toast.error(`${maxFileSize}MB 이하 용량의 이미지를 사용해주세요`)
      return
    }

    return true
  },
  retrieveImagesFromHTML: html => {
    const imgRex = /<img.*?src="(.*?)"[^>]+>/g
    const images = []
    let img
    while ((img = imgRex.exec(html))) images.push(img[1])

    return images
  },
}

export default helpers