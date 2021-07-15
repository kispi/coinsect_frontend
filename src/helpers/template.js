import { useRouter } from 'vue-router'
import $store from '@/store'

// Vue 2시절 filter로 사용하던, 템플릿에 주로 사용하는 기능들을 이곳에 모으기로 한다.
const template = {
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
  currency: currency => {
    const symbols = { 'usd': '$', 'gbp': '£', 'eur': '€', 'krw': '₩' }
    if (currency) return symbols[currency]

    if (!$store.getters.me) return '₩'

    return symbols[$store.getters.me.currency]
  },
  prettyPrice: ({ price, numFrac }) => {
    if (typeof price !== 'number') return 0

    return price.toLocaleString(
      undefined, {
        maximumFractionDigits: numFrac || 0,
        minimumFractionDigits: numFrac || 0,
    })
  },
  // pricify(5827145.2862) => '$5,827,145.28'
  pricify: function({ price, currency, numFrac }) {
    if (typeof price !== 'number') return

    return `${this.currency(currency)}${this.prettyPrice({ price, numFrac })}`
  },
  withLeadingZero: (value, numDigits) => {
    if (typeof value !== 'number' || !numDigits) return

    const numDigitsOfGivenValue = value.toString().length
    return `${'0'.repeat(numDigits - numDigitsOfGivenValue)}${value}`
  },
  koreanizedNumber: ({ price, numFrac, useBigPicture }) => {
    if (!price) return

    const units = [
      { key: '조', val: Math.pow(10, 12) },
      { key: '억', val: Math.pow(10, 8) },
      { key: '만', val: Math.pow(10, 4) },
      { key: '', val: Math.pow(10, 0) },
    ]

    const result = []
    let current = price
    units.forEach(unit => {
      const numbers = Math.floor(current / unit.val)
      if (numbers >= 1) {
        current -= numbers * unit.val
        result.push(`${template.prettyPrice({ price: numbers, numFrac })}${unit.key}`)
      }
    })

    return result.slice(0, useBigPicture ? 2 : 3).join(' ')
  },
  imageAlt: {
    default: '코인충 - 대한민국 No.1 암호자산 커뮤니티',
  },
}

export default template