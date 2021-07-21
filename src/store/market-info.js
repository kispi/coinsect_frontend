import helpers from '@/helpers'
import marketInfoService from '@/services/market-info'
import * as $http from 'axios'

const transformIntoCustomRow = ({ original, source }) => {
  const result = []
  if (source === 'coinmarketcap') {
    original.forEach(row => {
      result.push({
        $$symbol: row.symbol,
        $$name: row.name,
        $$volume24H: row.quote.USD.volume_24h,
        $$price: row.quote.USD.price,
        $$circulatingSupply: row.circulating_supply,
        $$marketCap: row.quote.USD.market_cap,
      })
    })
  }

  if (source === 'upbit') {
    original.forEach(row => {
      result.push(row)
    })
  }

  return result
}

const marketInfo = {
  state: () => ({
    indices: null,
    marketcaps: {
      upbit: null,
      coinmarketcap: null,
    },
    markets: {
      upbit: null,
      bithumb: null,
    },
    realTimeTickers: {},
    symbols: {},
  }),
  getters: {
    usdKrw: state => state.indices ? state.indices.upbitForex.basePrice : 0,
    indices: state => state.indices,
    marketcaps: state => state.marketcaps,
    markets: state => state.markets,
    realTimeTickers: state => state.realTimeTickers,
    symbols: state => state.symbols,
  },
  mutations: {
    setIndices(state, indices) {
      state.indices = indices
    },
    setMarketcaps(state, { data, source }) {
      state.marketcaps[source] = data
    },
    setMarkets(state, { exchange, markets, symbols }) {
      state.markets[exchange] = markets
      state.symbols = symbols
    },
  },
  actions: {
    async loadIndices({ commit }) {
      try {
        commit('setIndices', await marketInfoService.indices())
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async loadMarketcaps({ commit }, source) {
      if (helpers.canSkipApiCall(`loadMarketcaps_${source}`)) return

      try {
        commit('setLoading', { marketcaps: true })
        commit('setMarketcaps', {
          data: transformIntoCustomRow({ original: await marketInfoService.marketcaps(source), source }),
          source,
        })
      } catch (e) {
        return Promise.reject(e)
      } finally {
        commit('setLoading', { marketcaps: false })
      }
    },
    async loadMarkets({ commit }, exchange) {
      if (helpers.canSkipApiCall(`loadMarkets_${exchange}`)) return

      let endpoint
      if (exchange === 'upbit') endpoint = 'https://api.upbit.com/v1/market/all'
      if (exchange === 'bithumb') endpoint = 'https://api.bithumb.com/public/ticker/all_krw'

      try {
        const data = await $http.get(endpoint)
        const symbols = {}
        data.forEach(o => {
          const symbol = o.market.split('-')[1]
          o.$$symbol = symbol
          symbols[symbol] = { en: o.english_name, kr: o.korean_name }
        })

        commit('setMarkets', {
          exchange,
          markets: data.filter(o => o.market.startsWith('KRW-')),
          symbols,
        })
      } catch (e) {
        return Promise.reject(e)
      }
    },
  },
}

export default marketInfo