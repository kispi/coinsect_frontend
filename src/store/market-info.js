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
      page,
      limit,
      sortBy,
      sortType,
      tagSlugs,
    }) {
      try {
        const params = {
          start: (page - 1) * limit + 1,
          limit,
          sortBy,
          sortType,
          convert: 'USD,BTC',
          cryptoType: 'all',
          tagType: 'all',
          tagSlugs,
          aux: 'ath,atl,high24h,low24h,num_market_pairs,cmc_rank,date_added,max_supply,circulating_supply,total_supply,volume_7d,volume_30d,self_reported_circulating_supply,self_reported_market_cap',
        }
        commit('setLoading', { global: true })
        const { data } = await marketInfoService.marketcaps(params)
        commit('setMarketcaps', {
          data: data.cryptoCurrencyList,
          total: parseInt(data.totalCount),
        })
      } catch (e) {
        return Promise.reject(e)
      } finally {
        commit('setLoading', { global: false })
      }
    },
    async loadBaseMarkets({ commit, getters }) {
      try {
        const data = await marketInfoService.base({
          baseExchange: getters.settings.baseExchange,
          baseExchangeMarket: getters.settings.baseExchangeMarket,
        })
        if (getters.settings.baseExchange === 'upbit') commit('setMarkets', { upbit: data })
        if (getters.settings.baseExchange === 'bithumb') commit('setMarkets', { bithumb: data })
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
        commit('setLoading', { global: true })
        const data = await marketInfoService.leaderboard()
        const aoa = data.find(row => row.name === 'aoa')
        if (aoa) aoa.name = 'aoa (워뇨띠)'
        commit('setLeaderboard', data)
      } catch (e) {
        return Promise.reject(e)
      } finally {
        commit('setLoading', { global: false })
      }
    },
  },
}

export default marketInfo