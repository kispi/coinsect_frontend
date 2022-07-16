import { $http, $httpNoAuth } from '@/modules/axios'

const cacheTime = 1000 * 60

const cached = {
  base: {
    'upbit_krw': null,
    'upbit_btc': null,
    'bithumb_krw': null,
  },
}

const marketInfo = {
  indices: () => $http.get('market_info/indices'),
  leaderboard: () => $http.get('market_info/leaderboard'),
  crypto: params => $http.get('market_info/crypto', { params }),
  nasdaq: () => $http.get('market_info/nasdaq'),
  longShort: params => $httpNoAuth.get('https://fapi.coinglass.com/api/futures/longShortRate', { params }),
  symbols: () => $http.get('market_info/symbols'),
  base: async ({ baseExchange, baseExchangeMarket }) => {
    const bEx = baseExchange
    const bExMarket = baseExchangeMarket
    const cacheKey = `${bEx}_${bExMarket}`
    const o = cached.base[cacheKey]
    if (o) return o

    const endpoint = (() => {
      if (bEx === 'upbit') return 'https://api.upbit.com/v1/market/all'
      if (bEx === 'bithumb') return 'https://api.bithumb.com/public/ticker/all_krw'
    })()

    try {
      const data = await $httpNoAuth.get(endpoint)
      if (bEx === 'upbit') {
        const upbit = data.filter(o => o.market.startsWith(`${bExMarket.toUpperCase()}-`)).map(o => ({
          ...o,
          $$symbol: o.market.split('-')[1]
        }))
        cached.base[cacheKey] = upbit
        setTimeout(() => delete cached.base[cacheKey], cacheTime)
        return cached.base[cacheKey]
      }
      if (bEx === 'bithumb') {
        const bithumb = Object.keys(data['data']).filter(symbol => symbol !== 'date').map($$symbol => ({
          $$symbol,
          ...data['data'][$$symbol]
        }))
        cached.base[cacheKey] = bithumb
        setTimeout(() => delete cached.base[cacheKey], cacheTime)
        return cached.base[cacheKey]
      }
    } catch (e) {
      return Promise.reject(e)
    }
  },
}

export default marketInfo