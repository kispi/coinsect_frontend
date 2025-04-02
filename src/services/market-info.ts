import { BitmexLeaderboardItem } from '@/types'
import { $http, $httpNoAuth } from '@/modules/axios'
import helperService from './helper'

const cacheTime = 1000 * 60 * 30 // 이건 자주 바뀌는게 아니라 30분에 한번씩만 땡겨와도 됨.

const cached = {
  base: {
    'upbit_krw': null,
    'upbit_btc': null,
    'bithumb_krw': null,
  },
} as {
  base: Record<string, any>
}

type AvailableCacheKey = 'upbit_krw' | 'upbit_btc' | 'bithumb_krw'

const marketInfo = {
  indices: () => $http.get('market_info/indices'),
  leaderboard: () => $http.get('market_info/leaderboard') as Promise<BitmexLeaderboardItem[]>,
  crypto: (params: {
    start: number
    limit: number
    sortBy?: string
    sortType?: string
    tagSlugs?: string
    aux?: string
  }) => $http.get('market_info/crypto', { params }),
  nasdaq: () => $http.get('market_info/nasdaq'),
  kospi: (params?: any) => $http.get('market_info/kospi', { params }),
  assetsIncludingMetal: () => $http.get('market_info/assets_including_metal'),
  symbols: () => $http.get('market_info/symbols'),
  base: async ({ baseExchange, baseExchangeMarket }: { baseExchange: string, baseExchangeMarket: string }) => {
    const bEx = baseExchange
    const bExMarket = baseExchangeMarket
    const cacheKey = `${bEx}_${bExMarket}`
    const o = cached.base[cacheKey as AvailableCacheKey]
    if (o) return o

    try {
      if (bEx === 'upbit') {
        const data = await helperService.proxy('https://api.upbit.com/v1/market/all') as unknown as {
          market: string
          korean_name: string
          english_name: string
        }[]
        const upbit = data.filter(o => o.market.startsWith(`${bExMarket.toUpperCase()}-`)).map(o => ({
          ...o,
          $$symbol: o.market.split('-')[1],
        }))
        cached.base[cacheKey as AvailableCacheKey] = upbit
        setTimeout(() => delete cached.base[cacheKey as AvailableCacheKey], cacheTime)
        return cached.base[cacheKey as AvailableCacheKey]
      }
      if (bEx === 'bithumb') {
        const data = await $httpNoAuth.get('https://api.bithumb.com/public/ticker/all_krw') as {
          status: string
          data: Record<string, any>
        }
        const bithumb = Object.keys(data['data']).filter(symbol => symbol !== 'date').map($$symbol => ({
          $$symbol,
          ...data['data'][$$symbol],
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