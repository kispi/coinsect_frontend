import { store } from '@/store'
import dayjs from 'dayjs'
import helpers from '.'

// Vue 2시절 filter로 사용하던, 템플릿에 주로 사용하는 기능들을 이곳에 모으기로 한다.
const template = {
  ip: (ip, indices) => {
    if (!ip) return

    return ip.split('.').slice(0, indices || 2).join('.')
  },
  case: {
    toSnake: (str, delim) => (str || '').replace(/[A-Z]/g, letter => `${delim || '_'}${letter.toLowerCase()}`),
    toCamel: str => str.replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', '').replace('_', '')),
    toCapital: str => str.charAt(0).toUpperCase() + str.slice(1),
    toPascal: function(str) {
      return this.toCapital(this.toCamel(str))
    },
    toConst: function(str) {
      return this.toSnake(str).toUpperCase()
    },
    pluralize: str => {
      if (str.endsWith('day')) return `${str}s`
      if (str.endsWith('way')) return `${str}s`
      if (str.endsWith('y')) return `${str.slice(0, -1)}ies`
      if (str.endsWith('s') || str.endsWith('h')) return `${str}es`
  
      return `${str}s`
    },
    titlize: str => str.split(' ').map(word => `${word.charAt(0).toUpperCase()}${word.substring(1)}`).join(' '),
    // AND SO ON...
  },
  // EX:) pluralizeWithNumber('%s bundle', 3) === '3 bundles'
  pluralizeWithNumber: (format, number) => {
    if (!format) return ''

    const assigned = format.replace(/%s/, number)
    return number > 1 ? template.case.pluralize(assigned) : assigned
  },
  withLeadingZero: (value, numDigits) => {
    if (typeof value !== 'number' || !numDigits) return

    const numDigitsOfGivenValue = value.toString().length
    return `${'0'.repeat(numDigits - numDigitsOfGivenValue)}${value}`
  },
  // writing can be a post or a reply
  writer: writing => {
    return ((writing.user || {}).profile || {}).nickname || writing.nickname

    // return `${writing.nickname}${writing.ip ? ` (${template.ip(writing.ip)})` : ''}`
  },
  prettyTime: (timestamp, simple) => {
    if (simple) {
      const isToday = dayjs(timestamp).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
      return dayjs(timestamp).format(isToday ? 'HH:mm' : 'YYYY-MM-DD')
    }

    return dayjs(timestamp).format('YYYY-MM-DD HH:mm')
  },
  priceColor: value => {
    if (value > 0) return 'c-price-up'
    if (value < 0) return 'c-price-down'
    return ''
  },
  asBTC: sats => ((sats || 0) / 100000000).toLocaleString(undefined, {
    maximumFractionDigits: 4,
    minimumFractionDigits: 4,
  }),
  elapsedTime: timestamp => {
    const en = store.getters.settings.locale === 'en'
    const d = helpers.dayjs().diff(helpers.dayjs(timestamp), 'seconds')
    if (d > 60 * 60 * 24) return `${Math.floor(d / 86400)}${en ? 'd' : '일'}`

    if (d > 60 * 60) return `${Math.floor(d / 3600)}${en ? 'h' : '시'}`

    if (d > 60) return `${Math.floor(d / 60)}${en ? 'm' : '분'}`

    return `${d}${en ? 's' : '초'}`
  },
}

export default template