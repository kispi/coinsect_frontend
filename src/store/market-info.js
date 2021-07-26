import helpers from '@/helpers'
import marketInfoService from '@/services/market-info'
import * as $http from 'axios'

const marketInfo = {
  state: () => ({
    indices: null,
    marketcaps: null,
    markets: {
      upbit: null,
      bithumb: null,
    },
    orderbooks: {
      upbit: {},
      bithumb: {},
    },
    realTimeTickers: {},
    symbols: {},
  }),
  getters: {
    usdKrw: state => state.indices ? state.indices.upbitForex.basePrice : 0,
    indices: state => state.indices,
    marketcaps: state => state.marketcaps,
    markets: state => state.markets,
    orderbooks: state => state.orderbooks,
    realTimeTickers: state => state.realTimeTickers,
    symbols: state => state.symbols,
  },
  mutations: {
    setIndices(state, indices) {
      state.indices = indices
    },
    setMarketcaps(state, marketcaps) {
      state.marketcaps = marketcaps
    },
    setMarkets(state, { exchange, markets, symbols }) {
      state.markets[exchange] = markets
      state.symbols = symbols
    },
    setOrderbook(state, { exchange, market, orderbook }) {
      state.orderbooks[exchange][market] = orderbook
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
    async loadMarketcaps({ commit }, {
      category,
      perPage = 100,
      page = 1,
      priceChangePercentage,
      sort,
    }) {
      try {
        commit('setLoading', { marketcaps: true })
        const data = await marketInfoService.marketcaps({
          vs_currency: 'usd',
          category,
          per_page: perPage,
          page,
          order: `${sort.column}_${sort.direction}`,
          price_change_percentage: priceChangePercentage,
        })
        commit('setMarketcaps', data)
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