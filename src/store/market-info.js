import helpers from '@/helpers'
import marketInfoService from '@/services/market-info'
import * as $http from 'axios'

const marketInfo = {
  state: () => ({
    indices: null,
    marketcaps: null,
    markets: {
      upbit: [],
      bithumb: [],
      bybit: [],
    },
    orderbooks: {
      upbit: {},
      bybit: {},
      bithumb: {},
    },
    instruments: {
      bybit: {},
    },
    leaderboard: null,
    realTimeTickers: {},
    symbols: {},
  }),
  getters: {
    usdKrw: state => state.indices ? state.indices.upbitForex.basePrice : 0,
    indices: state => state.indices,
    marketcaps: state => state.marketcaps,
    markets: state => state.markets,
    orderbooks: state => state.orderbooks,
    instruments: state => state.instruments,
    leaderboard: state => state.leaderboard,
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
    setMarkets(state, { markets, symbols }) {
      state.markets = markets
      state.symbols = symbols
    },
    setOrderbook(state, { exchange, market, orderbook }) {
      state.orderbooks[exchange][market] = orderbook
    },
    setInstrument(state, { exchange, market, instrument }) {
      state.instruments[exchange][market] = instrument
    },
    setLeaderboard(state, leaderboard) {
      state.leaderboard = leaderboard
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
    async loadMarkets({ commit }) {
      if (helpers.canSkipApiCall('loadMarkets')) return

      try {
        const data = await $http.get('market_info/markets')
        const symbols = {}
        data.upbit = data.upbit.filter(o => o.market.startsWith('KRW-'))
        data.upbit.forEach(o => {
          const symbol = o.market.split('-')[1]
          o.$$symbol = symbol
          symbols[symbol] = { en: o.english_name, kr: o.korean_name }
        })

        commit('setMarkets', {
          markets: data,
          symbols,
        })
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async loadLeaderboard({ commit }) {
      if (helpers.canSkipApiCall('leaderboard')) return

      try {
        commit('setLoading', { leaderboard: true })
        const data = await marketInfoService.leaderboard()
        const aoa = data.find(row => row.name === 'aoa')
        if (aoa) aoa.name = 'aoa (워뇨띠)'
        commit('setLeaderboard', data)
      } catch (e) {
        return Promise.reject(e)
      } finally {
        commit('setLoading', { leaderboard: false })
      }
    },
  },
}

export default marketInfo