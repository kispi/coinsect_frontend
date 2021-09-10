import $store from '@/store'

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
  currency: currency => {
    const symbols = { 'usd': '$', 'gbp': '£', 'eur': '€', 'krw': '₩' }
    if (currency) return symbols[currency]

    if (!$store.getters.me) return '₩'

    return symbols[$store.getters.me.currency]
  },
  withLeadingZero: (value, numDigits) => {
    if (typeof value !== 'number' || !numDigits) return

    const numDigitsOfGivenValue = value.toString().length
    return `${'0'.repeat(numDigits - numDigitsOfGivenValue)}${value}`
  },
  // writing can be a post or a reply
  writer: writing => {
    if (writing.user) return writing.user.nickname

    return `${writing.nickname}${writing.ip ? ` (${template.ip(writing.ip)})` : ''}`
  },
  prettyTime: (timestamp, simple) => {
    if (!dayjs) return

    if (simple) {
      const isToday = dayjs(timestamp).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
      return dayjs(timestamp).format(isToday ? 'HH:mm:ss' : 'YYYY-MM-DD')
    }

    return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
  },
  imageAlt: {
    default: '코인충 - 대한민국 No.1 암호자산 커뮤니티',
  },
  makeRecursiveReplies: replies => {
    if ((replies || []).length === 0) return []
  
    replies.forEach(item => {
      if (!item.parent) return
  
      const parent = replies.find(possibleParent => possibleParent.id === (item.parent || {}).id)
      if (!parent) return
  
      parent.replies ? parent.replies.push(item) : parent.replies = [item]
    })
  
    return replies.filter(f => !f.parent)
  },
}

export default template