import withCdn from '@/helpers/s3'

const logo = key => withCdn(`images/exchanges/${(key || '').toUpperCase()}.png`)

export const exchanges = {
  bybit: {
    name: '바이빗',
    travelRule: ['upbit', 'bithumb', 'coinone', 'korbit'],
  },
  bitget: {
    name: '비트겟',
    travelRule: ['upbit', 'bithumb', 'coinone'],
  },
  bingx: {
    name: '빙엑스',
    travelRule: ['bithumb', 'coinone'],
  },
  upbit: {
    name: '업비트',
  },
  bithumb: {
    name: '빗썸',
  },
  coinone: {
    name: '코인원',
  },
  korbit: {
    name: '코빗',
  },
}

Object.keys(exchanges).forEach(key => {
  exchanges[key].src = logo(key)
  exchanges[key].key = key
})

export default exchanges