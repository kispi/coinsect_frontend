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
      binance: [],
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
    rawWebsocketInfo: {
      upbit: {},
      bithumb: {},
      binance: {},
    },
    symbols: {},
  }),
  getters: {
    usdKrw: state => state.indices ? state.indices.basePrice : 0,
    indices: state => state.indices,
    marketcaps: state => state.marketcaps,
    markets: state => state.markets,
    orderbooks: state => state.orderbooks,
    instruments: state => state.instruments,
    leaderboard: state => state.leaderboard,
    realTimeTickers: state => state.realTimeTickers,
    rawWebsocketInfo: state => state.rawWebsocketInfo,
    symbols: state => state.symbols,
  },
  mutations: {
    setIndices(state, indices) {
      state.indices = indices
    },
    setMarketcaps(state, marketcaps) {
      state.marketcaps = marketcaps
    },
    setMarkets(state, markets) {
      Object.keys(markets).forEach(key => state.markets[key] = markets[key])
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
    setRawWebsocketInfo(state, { exchange, market, json }) {
      state.rawWebsocketInfo[exchange][market] = json
    },
    setSymbols(state, symbols) {
      state.symbols = symbols
    },
    initRealTimeTickers(state) {
      state.realTimeTickers = {}
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
    async loadBaseMarkets({ commit, getters }) {
      const bEx = getters.settings.baseExchange
      if (helpers.canSkipApiCall(`loadBaseMarkets_${bEx}`)) return

      const endpoint = (() => {
        if (bEx === 'upbit') return 'https://api.upbit.com/v1/market/all'
        if (bEx === 'bithumb') return 'https://api.bithumb.com/public/ticker/all_krw'
      })()

      try {
        const data = await $http.get(endpoint)
        if (bEx === 'upbit') {
          const upbit = data.filter(o => o.market.startsWith('KRW-')).map(o => ({
            ...o,
            $$symbol: o.market.split('-')[1]
          }))
          commit('setMarkets', { upbit })
        }
        if (bEx === 'bithumb') {
          const bithumb = Object.keys(data['data']).filter(symbol => symbol !== 'date').map($$symbol => ({
            $$symbol,
            ...data['data'][$$symbol]
          }))
          commit('setMarkets', { bithumb })
        }
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async loadTargetMarkets({ commit }) {
      if (helpers.canSkipApiCall('loadTargetMarkets')) return

      try {
        const data = await $http.get('market_info/markets')
        commit('setMarkets', data)
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async loadSymbols({ commit }) {
      if (helpers.canSkipApiCall('loadSymbols')) return

      try {
        const symbols = await marketInfoService.symbols()
        commit('setSymbols', symbols)
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